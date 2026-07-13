@props([
    'title' => 'Manjar do Ramos — Taberna Moderna Portuguesa',
    'description' => 'Sabores portugueses com alma de taberna. Carnes maturadas, petiscos e tábuas de partilha num ambiente acolhedor. Reserve a sua mesa.',
    'robots' => null,
    'ogTitle' => null,
    'ogDescription' => null,
    'bodyClass' => 'bg-background',
])
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>{{ $title }}</title>
    <meta name="description" content="{{ $description }}">
    @if ($robots)
        <meta name="robots" content="{{ $robots }}">
    @endif
    <meta property="og:title" content="{{ $ogTitle ?? $title }}">
    <meta property="og:description" content="{{ $ogDescription ?? $description }}">
    <meta property="og:type" content="website">
    <link rel="icon" href="/favicon.ico">
    <link rel="canonical" href="{{ url()->current() }}">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @livewireStyles
    {{ $head ?? '' }}
</head>
<body class="{{ $bodyClass }} min-h-screen antialiased">
    {{ $slot }}

    @if (session('status'))
        <div x-data="{ show: true }" x-show="show" x-init="setTimeout(() => show = false, 4000)"
             class="fixed left-1/2 top-6 z-[100] -translate-x-1/2 rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-cream shadow-soft">
            {{ session('status') }}
        </div>
    @endif

    @livewireScripts
</body>
</html>
