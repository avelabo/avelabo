<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>@yield('title') - {{ config('app.name') }}</title>
    <style>
        /* Reset */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }
        table {
            border-spacing: 0;
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }
        a {
            text-decoration: none;
        }

        /* Main styles */
        .email-wrapper {
            width: 100%;
            background-color: #f5f5f5;
            padding: 40px 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .email-header {
            background-color: #1a1a2e;
            padding: 24px 32px;
            text-align: center;
        }
        .email-header img {
            height: 40px;
            width: auto;
        }
        .email-body {
            padding: 40px 32px;
        }
        .email-footer {
            background-color: #f8f9fa;
            padding: 24px 32px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }

        /* Typography */
        h1 {
            color: #1a1a2e;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 24px;
            font-weight: 600;
            line-height: 1.3;
            margin: 0 0 16px;
        }
        h2 {
            color: #1a1a2e;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 20px;
            font-weight: 600;
            line-height: 1.3;
            margin: 0 0 12px;
        }
        p {
            color: #4a5568;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 16px;
        }
        .text-muted {
            color: #718096;
            font-size: 14px;
        }
        .text-small {
            font-size: 14px;
        }

        /* Buttons */
        .btn {
            display: inline-block;
            padding: 14px 32px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            border-radius: 6px;
            margin: 8px 0;
        }
        .btn-primary {
            background-color: #e53e3e;
            color: #ffffff !important;
        }
        .btn-secondary {
            background-color: #1a1a2e;
            color: #ffffff !important;
        }

        /* Cards */
        .card {
            background-color: #f8f9fa;
            border-radius: 6px;
            padding: 20px;
            margin: 16px 0;
        }
        .card-highlight {
            background-color: #fff5f5;
            border-left: 4px solid #e53e3e;
        }

        /* Order table */
        .order-table {
            width: 100%;
            margin: 16px 0;
        }
        .order-table th {
            background-color: #f8f9fa;
            color: #4a5568;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 12px;
            text-align: left;
            border-bottom: 2px solid #e2e8f0;
        }
        .order-table td {
            color: #4a5568;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
        }
        .order-total {
            font-weight: 600;
            color: #1a1a2e;
        }

        /* Status badges */
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            font-size: 12px;
            font-weight: 600;
            border-radius: 20px;
            text-transform: uppercase;
        }
        .status-pending { background-color: #fef3c7; color: #92400e; }
        .status-processing { background-color: #dbeafe; color: #1e40af; }
        .status-shipped { background-color: #d1fae5; color: #065f46; }
        .status-delivered { background-color: #d1fae5; color: #065f46; }
        .status-cancelled { background-color: #fee2e2; color: #991b1b; }

        /* Divider */
        .divider {
            height: 1px;
            background-color: #e2e8f0;
            margin: 24px 0;
        }

        /* Social links */
        .social-links {
            margin-top: 16px;
        }
        .social-links a {
            display: inline-block;
            margin: 0 8px;
        }
        .social-links img {
            width: 24px;
            height: 24px;
        }

        /* Responsive */
        @media screen and (max-width: 600px) {
            .email-wrapper {
                padding: 20px 10px;
            }
            .email-body {
                padding: 24px 20px;
            }
            .email-header, .email-footer {
                padding: 20px;
            }
            h1 {
                font-size: 22px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <table class="email-container" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <!-- Header -->
            <tr>
                <td class="email-header">
                    <a href="{{ config('app.url') }}">
                        <img src="{{ config('app.url') }}/images/logo/logo-light-web-small.png" alt="{{ config('app.name') }}" style="height: 40px;">
                    </a>
                </td>
            </tr>

            <!-- Body -->
            <tr>
                <td class="email-body">
                    @yield('content')
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td class="email-footer">
                    <p class="text-muted" style="margin-bottom: 8px;">
                        &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                    </p>
                    <p class="text-muted text-small" style="margin-bottom: 0;">
                        This email was sent from <a href="{{ config('app.url') }}" style="color: #e53e3e;">{{ config('app.name') }}</a>
                    </p>
                    @hasSection('unsubscribe')
                        <p class="text-muted text-small" style="margin-top: 16px;">
                            @yield('unsubscribe')
                        </p>
                    @endif
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
