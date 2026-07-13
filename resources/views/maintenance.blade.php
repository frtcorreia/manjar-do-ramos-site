@php($logo = (\App\Models\SiteSetting::get('restaurante', [])['logo'] ?? '') ?: '/images/logo-cream.png')
<x-layouts.app :title="($maintenance['titulo'] ?? 'Em manutenção').' · Manjar do Ramos'" robots="noindex, nofollow" body-class="bg-charcoal">
    <div class="flex min-h-screen flex-col items-center justify-center gap-6 px-5 text-center">
        <img src="{{ $logo }}" alt="Manjar do Ramos" class="h-20 w-auto opacity-80">
        <h1 class="font-serif text-4xl font-medium text-cream md:text-5xl">{{ $maintenance['titulo'] ?? 'Em manutenção' }}</h1>
        <p class="max-w-md text-lg text-cream/70">{{ $maintenance['mensagem'] ?? 'Voltamos em breve.' }}</p>
        <span class="mt-4 h-0.5 w-16 bg-gold"></span>
    </div>
</x-layouts.app>
