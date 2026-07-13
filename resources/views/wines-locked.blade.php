<x-layouts.app
    title="Carta de Vinhos · Manjar do Ramos"
    description="Garrafeira do Manjar do Ramos: tintos, brancos e espumantes portugueses."
    robots="noindex, nofollow"
>
    <x-navbar :force-scrolled="true" />

    <main class="flex min-h-[70vh] items-center justify-center px-5 py-24 pt-32">
        <div class="max-w-md text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold">
                <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM21 14v.01M14 21v.01M17 17h.01M21 17v4h-4"/></svg>
            </div>
            <h1 class="mt-6 font-serif text-3xl text-espresso md:text-4xl">Carta de Vinhos</h1>
            <p class="mt-4 text-muted-foreground">
                A nossa carta de vinhos está disponível apenas para quem se senta à nossa mesa.
                Por favor leia o QR code disponível no restaurante para aceder.
            </p>
        </div>
    </main>

    <x-footer />
</x-layouts.app>
