# Email & Notification System Architecture

This document describes how the email and notification system is wired up in Avelabo.

---

## Overview

The system handles 26 email types across 3 recipient groups:
- **14 Customer Notifications** (Laravel Notifications)
- **6 Seller Notifications** (Laravel Notifications)
- **6 Admin Alerts** (Laravel Mailables)

All emails flow through a centralized `NotificationService` that handles:
- Checking if notifications are enabled/disabled
- Queue vs sync delivery
- Error handling and logging
- Retry capability for failed notifications

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CONTROLLERS                                     │
│  (CheckoutController, PaymentController, OrderController, KycController)    │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NotificationService                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ • Checks EmailSetting::isEnabled() before sending                    │   │
│  │ • Checks NotificationPreference for user opt-outs                    │   │
│  │ • Creates NotificationLog entry                                      │   │
│  │ • Wraps send in try/catch                                           │   │
│  │ • Marks log as sent/failed                                          │   │
│  │ • Handles retry with serialized notification data                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│      Laravel Notifications     │   │      Laravel Mailables        │
│  ┌───────────────────────────┐│   │  ┌───────────────────────────┐│
│  │ ChecksNotificationSettings ││   │  │ ChecksMailableSettings    ││
│  │ • configureQueueConnection││   │  │ • configureQueueConnection││
│  │ • shouldQueue()           ││   │  │ • shouldQueue()           ││
│  └───────────────────────────┘│   │  └───────────────────────────┘│
│                               │   │                               │
│  Customer: 14 notifications   │   │  Admin: 6 mailables           │
│  Seller: 6 notifications      │   │                               │
└───────────────────────────────┘   └───────────────────────────────┘
                    │                           │
                    └─────────────┬─────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Mail Transport                                     │
│                    (SMTP, Mailgun, SES, etc.)                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Database Tables

### `email_settings`
Controls which email types are enabled/disabled per recipient group.

```php
Schema::create('email_settings', function (Blueprint $table) {
    $table->id();
    $table->string('email_type', 100)->unique();  // e.g., 'order_confirmation'
    $table->string('name');                        // Human-readable name
    $table->text('description')->nullable();
    $table->boolean('customer_enabled')->default(true);
    $table->boolean('seller_enabled')->default(true);
    $table->boolean('admin_enabled')->default(true);
    $table->boolean('sms_enabled')->default(false);
    $table->boolean('is_critical')->default(false);
    $table->timestamps();
});
```

### `notification_preferences`
Per-user opt-out preferences (customers can disable specific email types).

```php
Schema::create('notification_preferences', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('email_type', 100);
    $table->boolean('email_enabled')->default(true);
    $table->boolean('sms_enabled')->default(true);
    $table->timestamps();
    $table->unique(['user_id', 'email_type']);
});
```

### `notification_logs`
Tracks all sent/failed notifications for monitoring and retry.

```php
Schema::create('notification_logs', function (Blueprint $table) {
    $table->id();
    $table->string('email_type', 100)->index();
    $table->string('channel', 50)->default('mail');
    $table->string('recipient_type', 50);           // customer, seller, admin
    $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
    $table->string('recipient_email')->nullable();
    $table->string('recipient_phone')->nullable();
    $table->string('notification_class');           // Full class name for retry
    $table->json('notification_data')->nullable();  // Serialized constructor args
    $table->string('status', 20)->default('pending'); // pending, sent, failed
    $table->text('error_message')->nullable();
    $table->text('error_trace')->nullable();
    $table->unsignedTinyInteger('attempts')->default(0);
    $table->unsignedTinyInteger('max_attempts')->default(3);
    $table->timestamp('sent_at')->nullable();
    $table->timestamp('failed_at')->nullable();
    $table->timestamp('last_attempt_at')->nullable();
    $table->timestamps();
});
```

### `settings` (existing table)
Stores the global queue setting.

```php
// Key: 'email_queue_enabled'
// Value: true/false
```

---

## Core Components

### 1. NotificationService (`app/Services/NotificationService.php`)

The central hub for sending all notifications. Key methods:

```php
class NotificationService
{
    // Send to a specific user (customer/seller)
    public function sendToUser(User $user, Notification $notification, string $recipientType = 'customer'): bool

    // Send to all admin users
    public function sendToAdmins(Notification|Mailable $notification, string $emailType): bool

    // Send to an email address (no user account)
    public function sendToEmail(string $email, Notification|Mailable $notification, string $emailType): bool

    // Retry a failed notification
    public function retry(NotificationLog $log): bool

    // Check if notification type is enabled
    public function isNotificationEnabled(string $emailType, string $recipientType = 'customer'): bool

    // Check user's personal preference
    public function isUserNotificationEnabled(int $userId, string $emailType): bool
}
```

**Flow for `sendToUser()`:**
1. Get email type from notification (`getEmailType()` method)
2. Check if globally enabled via `EmailSetting::isEnabled()`
3. Check user's preference via `NotificationPreference::isEmailEnabledForUser()`
4. Create `NotificationLog` entry with status 'pending'
5. Try to send notification
6. On success: `$log->markAsSent()`
7. On failure: `$log->markAsFailed($message, $trace)`

### 2. ChecksNotificationSettings Trait (`app/Notifications/Concerns/ChecksNotificationSettings.php`)

Used by all 20 Notification classes:

```php
trait ChecksNotificationSettings
{
    protected function configureQueueConnection(): void
    {
        if (! $this->shouldQueue()) {
            $this->connection = 'sync';  // Send immediately, bypass queue
        }
    }

    protected function shouldQueue(): bool
    {
        return Setting::get('email_queue_enabled', false);
    }

    public function getEmailType(): string
    {
        // Returns snake_case class name, e.g., 'order_confirmation'
    }
}
```

### 3. ChecksMailableSettings Trait (`app/Mail/Concerns/ChecksMailableSettings.php`)

Used by all 6 Admin Mailable classes:

```php
trait ChecksMailableSettings
{
    protected function configureQueueConnection(): void
    {
        if (! $this->shouldQueue()) {
            $this->connection = 'sync';
        }
    }

    protected function shouldQueue(): bool
    {
        return Setting::get('email_queue_enabled', false);
    }
}
```

### 4. EmailSetting Model (`app/Models/EmailSetting.php`)

```php
class EmailSetting extends Model
{
    public static function isEnabled(string $emailType, string $recipientType = 'customer'): bool
    {
        $setting = static::where('email_type', $emailType)->first();

        if (! $setting) {
            return true; // Default to enabled if not configured
        }

        return match ($recipientType) {
            'customer' => $setting->customer_enabled,
            'seller' => $setting->seller_enabled,
            'admin' => $setting->admin_enabled,
            default => true,
        };
    }
}
```

### 5. NotificationLog Model (`app/Models/NotificationLog.php`)

```php
class NotificationLog extends Model
{
    // Scopes
    public function scopePending($query) { ... }
    public function scopeSent($query) { ... }
    public function scopeFailed($query) { ... }
    public function scopeRetryable($query) { ... }  // Failed + attempts < max_attempts

    // Methods
    public function canRetry(): bool { ... }
    public function markAsSent(): void { ... }
    public function markAsFailed(string $message, ?string $trace = null): void { ... }
    public function resetForRetry(): void { ... }
}
```

---

## Notification Classes

### Customer Notifications (`app/Notifications/Customer/`)

| Class | Email Type | Trigger |
|-------|------------|---------|
| `WelcomeNotification` | welcome | Quick checkout account creation |
| `OrderConfirmationNotification` | order_confirmation | Order placed |
| `PaymentSuccessfulNotification` | payment_successful | Payment confirmed |
| `PaymentFailedNotification` | payment_failed | Payment failed |
| `TanPaymentInstructionsNotification` | tan_payment_instructions | OneKhusa TAN generated |
| `OrderProcessingNotification` | order_processing | Order status → processing |
| `OrderShippedNotification` | order_shipped | Order/item shipped |
| `OrderDeliveredNotification` | order_delivered | Order/item delivered |
| `OrderCancelledNotification` | order_cancelled | Order cancelled |
| `RefundInitiatedNotification` | refund_initiated | Refund started |
| `RefundCompletedNotification` | refund_completed | Refund processed |
| `ContactFormConfirmationNotification` | contact_form_confirmation | Contact form submitted |

### Seller Notifications (`app/Notifications/Seller/`)

| Class | Email Type | Trigger |
|-------|------------|---------|
| `KycApprovedNotification` | kyc_approved | Admin approves KYC |
| `KycRejectedNotification` | kyc_rejected | Admin rejects KYC |
| `KycDocumentsRequestedNotification` | kyc_documents_requested | Admin requests more docs |
| `StatusChangedNotification` | seller_status_changed | Seller status changed |
| `NewOrderNotification` | seller_new_order | New order with seller's items |
| `OrderPaidNotification` | seller_order_paid | Payment confirmed for seller's items |

### Admin Mailables (`app/Mail/Admin/`)

| Class | Email Type | Trigger |
|-------|------------|---------|
| `NewSellerRegistrationMail` | admin_new_seller | New seller registers |
| `NewKycSubmissionMail` | admin_new_kyc | Seller submits KYC |
| `NewContactMessageMail` | admin_new_contact | Contact form submitted |
| `NewOrderAlertMail` | admin_new_order | New order placed |
| `PaymentFailureAlertMail` | admin_payment_failure | Payment fails |
| `RefundAlertMail` | admin_refund | Refund initiated |

---

## Notification Class Structure

All notification classes follow this pattern:

```php
class OrderConfirmationNotification extends Notification implements ShouldQueue
{
    use ChecksNotificationSettings;
    use Queueable;

    public function __construct(public Order $order)
    {
        $this->configureQueueConnection();  // Check queue setting
    }

    public function via(object $notifiable): array
    {
        return ['mail'];  // Can add 'sms' channel here
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Order Confirmed - #' . $this->order->order_number)
            ->markdown('emails.customer.order-confirmation', [
                'order' => $this->order,
                'user' => $notifiable,
            ]);
    }
}
```

---

## Controller Integration

### Example: CheckoutController

```php
class CheckoutController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService
    ) {}

    public function processCheckout(Request $request)
    {
        // ... create order logic ...

        // Send order confirmation to customer
        $this->notificationService->sendToUser(
            $order->user,
            new OrderConfirmationNotification($order),
            'customer'
        );

        // Alert admins of new order
        $this->notificationService->sendToAdmins(
            new NewOrderAlertMail($order),
            'admin_new_order'
        );

        // Notify seller of new order
        $this->notificationService->sendToUser(
            $seller->user,
            new NewOrderNotification($order),
            'seller'
        );
    }
}
```

---

## Retry System

### How Retry Works

1. **Serialization**: When a notification is created, `NotificationService` serializes constructor arguments:
   - Eloquent models → `{ _type: 'model', _class: 'App\Models\Order', _id: 123 }`
   - Collections → `{ _type: 'collection', _items: [...] }`
   - Scalars → stored as-is

2. **Reconstruction**: On retry, the service:
   - Reads the `notification_class` from the log
   - Reconstructs constructor arguments from `notification_data`
   - Re-fetches models from database by ID
   - Creates new instance: `new $class(...$args)`

3. **Retry Limits**: Default 3 attempts, configurable per log via `max_attempts`

### Admin Retry UI

Located at `/admin/notification-logs`:
- View all notification logs with filters
- See error messages and stack traces
- Retry individual failed notifications
- Bulk retry all failed notifications
- Clear old sent logs

---

## Admin UI Routes

```php
Route::prefix('notification-logs')->name('notification-logs.')->group(function () {
    Route::get('/', [NotificationLogController::class, 'index'])->name('index');
    Route::get('/{notificationLog}', [NotificationLogController::class, 'show'])->name('show');
    Route::post('/{notificationLog}/retry', [NotificationLogController::class, 'retry'])->name('retry');
    Route::post('/retry-all', [NotificationLogController::class, 'retryAll'])->name('retry-all');
    Route::delete('/{notificationLog}', [NotificationLogController::class, 'destroy'])->name('destroy');
    Route::post('/clear-old', [NotificationLogController::class, 'clearOld'])->name('clear-old');
});
```

---

## Email Templates

All email templates are in `resources/views/emails/`:

```
emails/
├── layout.blade.php              # Master template with Avelabo branding
├── customer/
│   ├── welcome.blade.php
│   ├── order-confirmation.blade.php
│   ├── payment-successful.blade.php
│   ├── payment-failed.blade.php
│   ├── tan-payment-instructions.blade.php
│   ├── order-processing.blade.php
│   ├── order-shipped.blade.php
│   ├── order-delivered.blade.php
│   ├── order-cancelled.blade.php
│   ├── refund-initiated.blade.php
│   ├── refund-completed.blade.php
│   └── contact-form-confirmation.blade.php
├── seller/
│   ├── kyc-approved.blade.php
│   ├── kyc-rejected.blade.php
│   ├── kyc-documents-requested.blade.php
│   ├── status-changed.blade.php
│   ├── new-order.blade.php
│   └── order-paid.blade.php
└── admin/
    ├── new-seller-registration.blade.php
    ├── new-kyc-submission.blade.php
    ├── new-contact-message.blade.php
    ├── new-order-alert.blade.php
    ├── payment-failure-alert.blade.php
    └── refund-alert.blade.php
```

---

## Settings Configuration

### Enable/Disable Notifications

Via Admin UI at `/admin/email-settings`:
- Toggle customer/seller/admin per email type
- Mark emails as critical (for SMS)
- Enable/disable SMS per email type

### Queue vs Sync

Via Admin UI at `/admin/settings`:
- Toggle `email_queue_enabled` setting
- When enabled: emails go to queue (requires queue worker)
- When disabled: emails send synchronously (blocking)

---

## SMS Channel (Future)

The system is prepared for SMS:
- `sms_enabled` column in `email_settings`
- `sms_enabled` column in `notification_preferences`
- `recipient_phone` column in `notification_logs`
- Notifications can add `'sms'` to `via()` method

SMS provider integration is pending. Interface at `app/Contracts/SmsProvider.php`.

---

## File Reference

```
app/
├── Contracts/
│   └── SmsProvider.php                    # SMS provider interface
├── Mail/
│   ├── Concerns/
│   │   └── ChecksMailableSettings.php     # Queue trait for mailables
│   └── Admin/
│       ├── NewSellerRegistrationMail.php
│       ├── NewKycSubmissionMail.php
│       ├── NewContactMessageMail.php
│       ├── NewOrderAlertMail.php
│       ├── PaymentFailureAlertMail.php
│       └── RefundAlertMail.php
├── Models/
│   ├── EmailSetting.php
│   ├── NotificationPreference.php
│   └── NotificationLog.php
├── Notifications/
│   ├── Concerns/
│   │   └── ChecksNotificationSettings.php # Queue trait for notifications
│   ├── Customer/
│   │   └── [14 notification classes]
│   └── Seller/
│       └── [6 notification classes]
├── Services/
│   ├── NotificationService.php            # Central sending service
│   └── Sms/
│       └── NullSmsProvider.php            # Placeholder SMS provider
└── Http/Controllers/Admin/
    ├── EmailSettingsController.php        # Email settings management
    └── NotificationLogController.php      # Log viewing and retry

database/migrations/
├── xxxx_create_email_settings_table.php
├── xxxx_create_notification_preferences_table.php
└── xxxx_create_notification_logs_table.php

database/seeders/
└── EmailSettingsSeeder.php               # Seeds all 26 email types

resources/js/Pages/Admin/
├── EmailSettings/
│   └── Index.jsx                         # Email settings UI
└── NotificationLogs/
    ├── Index.jsx                         # Log listing UI
    └── Show.jsx                          # Log detail UI
```

---

## Testing Notifications

### Via Tinker

```php
// Test a notification
$user = User::find(1);
$order = Order::find(1);

$service = app(NotificationService::class);
$service->sendToUser($user, new OrderConfirmationNotification($order), 'customer');

// Check logs
NotificationLog::latest()->first();
```

### Via Log Driver

Set `MAIL_MAILER=log` in `.env` to log emails instead of sending.

### Via Mailtrap

Set up Mailtrap credentials in `.env` for safe email testing.
