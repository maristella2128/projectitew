<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <script>
            window.page = {!! json_encode($page ?? ['props' => []]) !!};
            window.customization = {!! json_encode($page['props']['customization'] ?? []) !!};
        </script>
        <title inertia>{{ $page['props']['customization']['browserTabTitle'] ?? config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx'])
        <style>
            :root {
                --primary: {{ $page['props']['customization']['primary'] }};
                --secondary: {{ $page['props']['customization']['secondary'] }};
                --background: {{ $page['props']['customization']['background'] }};
                --surface: {{ $page['props']['customization']['surface'] }};
                --border: {{ $page['props']['customization']['border'] }};
                --text-primary: {{ $page['props']['customization']['textPrimary'] }};
                --text-secondary: {{ $page['props']['customization']['textMuted'] }};
                --text-muted: {{ $page['props']['customization']['textMuted'] }};
                
                --sidebar-width: {{ $page['props']['customization']['sidebarW'] }}px;
                --topbar-height: {{ $page['props']['customization']['topbarH'] }}px;
                --border-radius: {{ $page['props']['customization']['radius'] }}px;
                
                --sidebar-bg: {{ $page['props']['customization']['sidebar'] }};
                --topbar-bg: {{ $page['props']['customization']['topbar'] }};
 
                --display-font: {!! $page['props']['customization']['displayFont'] !!};
                --body-font: {!! $page['props']['customization']['bodyFont'] !!};
                --mono-font: {!! $page['props']['customization']['monoFont'] !!};
                --font-size: {{ $page['props']['customization']['fontSize'] }}px;
                --line-height: {{ $page['props']['customization']['lineHeight'] === 'tight' ? '1.2' : ($page['props']['customization']['lineHeight'] === 'relaxed' ? '1.64' : ($page['props']['customization']['lineHeight'] === 'loose' ? '2.0' : '1.45')) }};
            }

            html, body, #app {
                height: 100% !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
                background: var(--background) !important;
                color: var(--text-primary);
                font-family: var(--body-font), sans-serif;
                font-size: var(--font-size);
                line-height: var(--line-height);
            }
        </style>
    </head>
    <body class="font-sans antialiased">
        <div id="app"></div>
    </body>
</html>
