<x-mail::message>
# New Seller Registration

A new seller has registered on the platform.

**Business Details:**
- **Business Name:** {{ $seller->business_name }}
- **Owner:** {{ $seller->user->name }}
- **Email:** {{ $seller->user->email }}
- **Phone:** {{ $seller->phone ?? 'Not provided' }}
- **Registered:** {{ $seller->created_at->format('M d, Y H:i') }}

<x-mail::button :url="$url">
Review Seller
</x-mail::button>

This seller will need to complete KYC verification before they can start selling.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
