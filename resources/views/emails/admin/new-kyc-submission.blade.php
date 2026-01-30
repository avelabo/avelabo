<x-mail::message>
# New KYC Submission

A seller has submitted their KYC documents for review.

**Seller Details:**
- **Business Name:** {{ $seller->business_name }}
- **Owner:** {{ $seller->user->name }}
- **Email:** {{ $seller->user->email }}

**KYC Details:**
- **Status:** {{ ucfirst($kyc->status) }}
- **Submitted:** {{ $kyc->created_at->format('M d, Y H:i') }}

<x-mail::button :url="$url">
Review KYC Documents
</x-mail::button>

Please review the documents and approve or reject the verification.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
