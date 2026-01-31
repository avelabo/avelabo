<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title inertia>{{ config('app.name', 'Avelabo') }}</title>

    @unless(isset($isErrorPage) || request()->is('coming-soon', 'maintenance'))
    <!-- SEO Meta Tags -->
    <meta name="description" content="Avelabo - Bringing global products to your doorstep in Malawi. Shop international brands with local payments including Mpamba and Airtel Money. Fast delivery, trusted service.">
    <meta name="keywords" content="Avelabo, global products Malawi, international shopping, Mpamba payments, Airtel Money, online shopping Malawi, doorstep delivery">
    <meta name="author" content="Avelabo">
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <link rel="canonical" href="{{ url()->current() }}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="{{ config('app.name', 'Avelabo') }} - Global Products, Local Payments">
    <meta property="og:description" content="Bringing global products to your doorstep in Malawi. Shop international brands with Mpamba and Airtel Money payments.">
    <meta property="og:image" content="{{ asset('images/og-image.jpg') }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Avelabo - Global Products to Malawi">
    <meta property="og:site_name" content="Avelabo">
    <meta property="og:locale" content="{{ str_replace('_', '-', app()->getLocale()) }}">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{{ url()->current() }}">
    <meta name="twitter:title" content="{{ config('app.name', 'Avelabo') }} - Global Products, Local Payments">
    <meta name="twitter:description" content="Bringing global products to your doorstep in Malawi. Shop international brands with Mpamba and Airtel Money payments.">
    <meta name="twitter:image" content="{{ asset('images/og-image.jpg') }}">
    <meta name="twitter:image:alt" content="Avelabo - Global Products to Malawi">

    <!-- Additional SEO -->
    <meta name="format-detection" content="telephone=no">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Avelabo">
    <meta name="application-name" content="Avelabo">
    <meta name="msapplication-TileColor" content="#d4a853">
    <meta name="msapplication-config" content="/images/favicon/browserconfig.xml">
    @endunless

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/images/favicon/favicon.svg">
    <link rel="icon" type="image/png" sizes="96x96" href="/images/favicon/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon/favicon-16x16.png">
    <link rel="shortcut icon" href="/images/favicon/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-touch-icon.png">
    <link rel="manifest" href="/images/favicon/site.webmanifest">
    <meta name="theme-color" content="#1a1a1a">

    <!-- Fonts -->
    {{-- <link rel="preconnect" href="https://fonts.bunny.net"> --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    {{-- <link href="https://fonts.bunny.net/css?family=quicksand:400,500,600,700,800|lato:400,700,900" rel="stylesheet"> --}}
    <link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,301,400,500,700,900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Round|Material+Icons+Outlined" rel="stylesheet">

    @unless(isset($isErrorPage) || request()->is('coming-soon', 'maintenance'))
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {!! json_encode([
        '@context' => 'https://schema.org',
        '@type' => 'WebSite',
        'name' => 'Avelabo',
        'alternateName' => 'Avelabo Malawi',
        'url' => config('app.url'),
        'description' => 'Bringing global products to your doorstep in Malawi. Shop international brands with local payments.',
        'potentialAction' => [
            '@type' => 'SearchAction',
            'target' => [
                '@type' => 'EntryPoint',
                'urlTemplate' => config('app.url') . '/shop?search={search_term_string}',
            ],
            'query-input' => 'required name=search_term_string',
        ],
    ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
    </script>
    <script type="application/ld+json">
    {!! json_encode([
        '@context' => 'https://schema.org',
        '@type' => 'Organization',
        'name' => 'Avelabo',
        'url' => config('app.url'),
        'logo' => asset('images/logo/logo-web-mid.png'),
        'description' => 'Bringing global products to your doorstep in Malawi with local payment options.',
        'address' => [
            '@type' => 'PostalAddress',
            'addressCountry' => 'MW',
        ],
        'sameAs' => [],
    ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
    </script>
    @endunless

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead

    @production
    <script defer src="https://cloud.umami.is/script.js" data-website-id="eb75f302-367c-4488-a8c5-a3a4562436d7"></script>
    @endproduction

    <!-- Cloudflare Turnstile -->
    <link rel="preconnect" href="https://challenges.cloudflare.com">
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</head>
<body class="bg-gray-50 antialiased font-lato">
    @inertia
</body>
</html>
