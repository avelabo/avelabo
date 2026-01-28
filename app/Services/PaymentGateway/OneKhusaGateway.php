<?php

namespace App\Services\PaymentGateway;

use App\Models\Order;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class OneKhusaGateway implements PaymentGatewayInterface
{
    private string $apiKey;

    private string $apiSecret;

    private string $organisationId;

    private int $merchantAccountNumber;

    private string $baseUrl;

    private ?string $accessToken = null;

    public function __construct()
    {
        $this->apiKey = config('services.onekhusa.api_key');
        $this->apiSecret = config('services.onekhusa.api_secret');
        $this->organisationId = config('services.onekhusa.organization_id');
        $this->merchantAccountNumber = (int) config('services.onekhusa.merchant_account_no');
        $this->baseUrl = rtrim(config('services.onekhusa.base_url', 'https://api.onekhusa.com'), '/');
    }

    /**
     * Initialize a Request to Pay — returns a Timed Account Number (TAN)
     * that the customer pays to within the expiry window.
     */
    public function initializePayment(Order $order, array $options = []): PaymentResponse
    {
        try {
            $this->authenticate();

            // Generate a unique alphanumeric reference (5-25 chars)
            $referenceNumber = strtoupper(Str::random(12));

            // The capturedBy email should be a user under the merchant account
            $capturedBy = $options['captured_by'] ?? config('services.onekhusa.captured_by_email', '');

            $payload = [
                'merchantAccountNumber' => $this->merchantAccountNumber,
                'transactionAmount' => number_format($order->total, 2, '.', ''),
                'transactionDescription' => 'Payment for Order #'.$order->order_number,
                'referenceNumber' => $referenceNumber,
                'capturedBy' => 'haranoble@gmail.com',
            ];

            $response = $this->makeRequest('POST', '/collections/requestToPay/initiate', $payload, [
                'X-Idempotency-Key' => (string) Str::uuid(),
            ]);

            // OneKhusa returns timedAccountNumber on success
            if (isset($response['timedAccountNumber'])) {
                return new PaymentResponse(
                    success: true,
                    message: 'Payment initialized — pay to the timed account number',
                    transactionId: $referenceNumber,
                    redirectUrl: null,
                    data: [
                        'timed_account_number' => $response['timedAccountNumber'],
                        'expiry_date' => $response['expiryDate'] ?? null,
                        'expiry_in_minutes' => $response['expiryInMinutes'] ?? 15,
                        'merchant_account_number' => $response['merchantAccountNumber'] ?? $this->merchantAccountNumber,
                        'reference_number' => $referenceNumber,
                        'order_number' => $order->order_number,
                        'amount' => $order->total,
                    ]
                );
            }

            return new PaymentResponse(
                success: false,
                message: $response['message'] ?? 'Failed to initialize payment with OneKhusa',
                errors: $response['errors'] ?? []
            );

        } catch (\Exception $e) {
            Log::error('OneKhusa initialization error: '.$e->getMessage());

            return new PaymentResponse(
                success: false,
                message: 'Payment initialization failed. Please try again.',
                errors: ['exception' => $e->getMessage()]
            );
        }
    }

    /**
     * Process payment — not used in TAN flow (customer pays externally).
     */
    public function processPayment(string $transactionReference, array $data): PaymentResponse
    {
        return $this->verifyPayment($transactionReference);
    }

    /**
     * Verify payment by fetching the transaction status from OneKhusa.
     */
    public function verifyPayment(string $transactionReference): PaymentResponse
    {
        try {
            $this->authenticate();
            Log::info('Verifying payment: ', [
                'url' => '/collections/getTransaction',
                'payload' => [
                    'merchantAccountNumber' => $this->merchantAccountNumber,
                    'transactionReferenceNumber' => $transactionReference,
                ],
            ]);
            $response = $this->makeRequest('POST', '/collections/getTransaction', [
                'merchantAccountNumber' => $this->merchantAccountNumber,
                'transactionReferenceNumber' => $transactionReference,
            ]);

            $statusCode = $response['transactionStatusCode'] ?? null;
            $statusName = $response['transactionStatusName'] ?? 'Unknown';

            if ($statusCode === 'S') {
                return new PaymentResponse(
                    success: true,
                    message: 'Payment verified successfully',
                    transactionId: $response['transactionReferenceNumber'] ?? $transactionReference,
                    data: $response
                );
            }

            return new PaymentResponse(
                success: false,
                message: "Payment status: {$statusName}",
                transactionId: $response['transactionReferenceNumber'] ?? $transactionReference,
                data: $response
            );

        } catch (\Exception $e) {
            Log::error('OneKhusa verification error: '.$e->getMessage());

            return new PaymentResponse(
                success: false,
                message: 'Payment verification error',
                errors: ['exception' => $e->getMessage()]
            );
        }
    }

    /**
     * Handle incoming webhook from OneKhusa.
     * Verifies signature via OneKhusa API, then maps the payload.
     */
    public function handleWebhook(array $payload): PaymentResponse
    {
        try {
            // Verify webhook authenticity via OneKhusa API
            if (! $this->verifyWebhookViaApi()) {
                Log::warning('OneKhusa: Invalid webhook signature');

                return new PaymentResponse(
                    success: false,
                    message: 'Invalid webhook signature'
                );
            }

            // Map OneKhusa webhook field names (PascalCase in docs, camelCase in examples)
            $reference = $payload['transactionReferenceNumber']
                ?? $payload['TransactionReferenceNumber']
                ?? null;
            $statusCode = $payload['transactionStatusCode']
                ?? $payload['TransactionStatusCode']
                ?? null;

            if (! $reference) {
                return new PaymentResponse(
                    success: false,
                    message: 'No transaction reference in webhook'
                );
            }

            // S = Successful
            if ($statusCode === 'S') {
                return new PaymentResponse(
                    success: true,
                    message: 'Payment confirmed via webhook',
                    transactionId: $reference,
                    data: $payload
                );
            }

            // R = Reversed, F = Failed
            return new PaymentResponse(
                success: false,
                message: "Payment status code: {$statusCode}",
                transactionId: $reference,
                data: $payload
            );

        } catch (\Exception $e) {
            Log::error('OneKhusa webhook error: '.$e->getMessage());

            return new PaymentResponse(
                success: false,
                message: 'Webhook processing error',
                errors: ['exception' => $e->getMessage()]
            );
        }
    }

    /**
     * Refund is not supported via OneKhusa collections API.
     */
    public function refundPayment(string $transactionReference, float $amount): PaymentResponse
    {
        return new PaymentResponse(
            success: false,
            message: 'Refunds are not supported via OneKhusa. Please process refunds manually through the OneKhusa portal.'
        );
    }

    /**
     * Simulate a payment in sandbox/test mode.
     * Triggers the addFakeTransaction endpoint so the TAN gets "paid".
     */
    public function simulatePayment(string $timedAccountNumber, float $amount, string $capturedBy): PaymentResponse
    {
        try {
            $this->authenticate();
            Log::info('Simulating payment: ', [
                'url' => '/collections/requestToPay/addFakeTransaction',
                'payload' => [
                    'merchantAccountNumber' => $this->merchantAccountNumber,
                    'transactionAmount' => number_format($amount, 2, '.', ''),
                    'connectorId' => 112400,
                    'timedAccountNumber' => $timedAccountNumber,
                    'currencyCode' => 'MWK',
                    'capturedBy' => $capturedBy,
                ],
            ]);

            $response = $this->makeRequest('POST', '/collections/requestToPay/addFakeTransaction', [
                'merchantAccountNumber' => $this->merchantAccountNumber,
                'transactionAmount' => number_format($amount, 2, '.', ''),
                'connectorId' => 112400,
                'timedAccountNumber' => $timedAccountNumber,
                'currencyCode' => 'MWK',
                'capturedBy' => $capturedBy,
            ], [
                'X-Idempotency-Key' => (string) Str::uuid(),
            ]);

            // The API returns a plain text success string, but makeRequest parses JSON.
            // A successful call won't have 'success' => false.
            if (isset($response['success']) && $response['success'] === false) {
                return new PaymentResponse(
                    success: false,
                    message: $response['message'] ?? 'Failed to simulate payment',
                    errors: $response['errors'] ?? []
                );
            }
            Log::info(['message' => $response]);

            return new PaymentResponse(
                success: true,
                message: 'Fake payment simulated successfully',
                data: ['message' => $response] // The response comes back as string so we need to convert to array
            );

        } catch (\Exception $e) {
            Log::error('OneKhusa simulate payment error: '.$e->getMessage());

            return new PaymentResponse(
                success: false,
                message: 'Failed to simulate payment',
                errors: ['exception' => $e->getMessage()]
            );
        }
    }

    public function getAvailablePaymentMethods(): array
    {
        return [
            [
                'id' => 'mobile_money',
                'name' => 'Mobile Money',
                'description' => 'Pay with Airtel Money or TNM Mpamba',
            ],
            [
                'id' => 'bank',
                'name' => 'Bank Transfer',
                'description' => 'Pay via bank transfer',
            ],
        ];
    }

    /**
     * Authenticate with OneKhusa API to get a JWT access token.
     * Tokens expire in 5 minutes; we cache for 4 minutes.
     */
    private function authenticate(): void
    {
        $cacheKey = 'onekhusa_access_token';

        if (Cache::has($cacheKey)) {
            $this->accessToken = Cache::get($cacheKey);

            return;
        }

        try {
            $url = $this->baseUrl.'/account/getAccessToken';
            $payload = [
                'apiKey' => $this->apiKey,
                'apiSecret' => $this->apiSecret,
                'organisationId' => $this->organisationId,
                'merchantAccountNumber' => $this->merchantAccountNumber,
            ];

            Log::info('OneKhusa authentication request', [
                'url' => $url,
                'payload' => $payload,
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Accept-Language' => 'en',
            ])->post($url, $payload);

            if ($response->successful()) {
                $data = $response->json();
                $this->accessToken = $data['accessToken'] ?? null;

                if ($this->accessToken) {
                    Cache::put($cacheKey, $this->accessToken, now()->addMinutes(4));
                }
            } else {
                Log::error('OneKhusa authentication failed', [
                    'status' => $response->status(),
                    'body' => $response->json() ?? $response->body(),
                ]);

                throw new \Exception('Failed to authenticate with OneKhusa');
            }
        } catch (\Illuminate\Http\Client\RequestException $e) {
            Log::error('OneKhusa authentication error: '.$e->getMessage());
            throw new \Exception('Failed to connect to OneKhusa API');
        }
    }

    /**
     * Make an authenticated API request to OneKhusa.
     */
    private function makeRequest(string $method, string $endpoint, array $data = [], array $extraHeaders = []): mixed
    {
        $url = $this->baseUrl.$endpoint;

        try {
            $headers = array_merge([
                'Authorization' => 'Bearer '.$this->accessToken,
                'Content-Type' => 'application/json',
                'Accept-Language' => 'en',
            ], $extraHeaders);

            $request = Http::withHeaders($headers);

            $response = match (strtoupper($method)) {
                'POST' => $request->post($url, $data),
                'GET' => $request->get($url, $data),
                'PUT' => $request->put($url, $data),
                default => throw new \Exception("Unsupported HTTP method: {$method}")
            };

            if ($response->successful()) {
                return $response->json() ?: [];
            }

            $errorData = $response->json() ?: [];
            Log::error('OneKhusa API Error', [
                'status' => $response->status(),
                'response' => $errorData,
                'url' => $url,
            ]);

            return [
                'success' => false,
                'message' => $errorData['message'] ?? 'OneKhusa API error',
                'errors' => $errorData['errors'] ?? [],
            ];

        } catch (\Illuminate\Http\Client\RequestException $e) {
            Log::error('OneKhusa HTTP Error', ['message' => $e->getMessage(), 'url' => $url]);
            throw new \Exception('Failed to connect to OneKhusa API');
        }
    }

    /**
     * Verify webhook signature via OneKhusa's dedicated verification endpoint.
     * Do NOT compute HMAC locally — pass the signature as-is for API comparison.
     */
    private function verifyWebhookViaApi(): bool
    {
        try {
            $eventCode = request()->header('X-OneKhusa-Webhook-Event', '');
            $signature = request()->header('X-OneKhusa-Webhook-Signature', '');

            if (empty($eventCode) || empty($signature)) {
                return false;
            }

            $this->authenticate();

            $response = $this->makeRequest('POST', '/merchants/webhooks/verify', [
                'merchantAccountNumber' => $this->merchantAccountNumber,
                'eventCode' => $eventCode,
                'webhookSignature' => $signature,
            ]);

            return ($response['isSignatureValid'] ?? false) === true;

        } catch (\Exception $e) {
            Log::error('OneKhusa webhook verification error: '.$e->getMessage());

            return false;
        }
    }
}
