<x-mail::message>
# New Contact Message

A new message has been received through the contact form.

**From:** {{ $contactMessage->name }} ({{ $contactMessage->email }})

**Subject:** {{ $contactMessage->subject }}

**Message:**

> {{ $contactMessage->message }}

**Received:** {{ $contactMessage->created_at->format('M d, Y H:i') }}

<x-mail::button :url="$url">
View Message
</x-mail::button>

Please respond to this inquiry promptly.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
