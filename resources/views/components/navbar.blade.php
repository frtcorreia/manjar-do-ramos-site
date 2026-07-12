@php($logoSrc = ($restaurante['logo'] ?? '') ?: '/images/logo-cream.png')
<header
    x-data="{ scrolled: @js($forceScrolled), open: false }"
    @unless($forceScrolled) @scroll.window="scrolled = window.scrollY > 40" @endunless
    class="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
    :class="scrolled || open ? 'bg-charcoal/95 backdrop-blur-md shadow-soft' : 'bg-transparent'"
>
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10 md:py-5">
        <a href="{{ route('home') }}" class="flex items-center gap-3 leading-none text-cream">
            <img src="{{ $logoSrc }}" alt="Manjar do Ramos" class="h-14 max-w-[180px] object-contain md:h-16">
            <span class="sr-only">Manjar do Ramos · Taberna Portuguesa</span>
        </a>

        <div class="hidden items-center gap-8 md:flex">
            @foreach ($links as $link)
                <a href="{{ $link['href'] }}" class="text-sm font-medium text-cream/85 transition-colors hover:text-gold">
                    {{ $link['label'] }}
                </a>
            @endforeach

            @auth
                @if ($showMinhaConta)
                    <div class="flex items-center gap-3">
                        <a href="{{ route('orders.mine') }}" class="inline-flex items-center gap-1.5 text-sm font-medium text-cream/85 transition-colors hover:text-gold">
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            A minha conta
                        </a>
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button type="submit" class="text-cream/60 transition-colors hover:text-gold" aria-label="Sair">
                                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                            </button>
                        </form>
                    </div>
                @endif
            @else
                @if ($showAuth)
                    <a href="{{ route('auth') }}" class="inline-flex items-center gap-1.5 text-sm font-medium text-cream/85 transition-colors hover:text-gold">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        Entrar
                    </a>
                @endif
            @endauth

            <a href="{{ route('home') }}#reservar" class="rounded-full border border-gold/70 px-5 py-2 text-sm font-semibold text-gold transition-all hover:bg-gold hover:text-charcoal">
                Reservar Mesa
            </a>
        </div>

        <button @click="open = !open" class="flex flex-col gap-1.5 md:hidden" aria-label="Menu">
            <span class="h-0.5 w-6 bg-cream transition-transform" :class="open && 'translate-y-2 rotate-45'"></span>
            <span class="h-0.5 w-6 bg-cream transition-opacity" :class="open && 'opacity-0'"></span>
            <span class="h-0.5 w-6 bg-cream transition-transform" :class="open && '-translate-y-2 -rotate-45'"></span>
        </button>
    </nav>

    <div x-show="open" x-collapse x-cloak class="overflow-hidden bg-charcoal/98 px-5 pb-6 md:hidden">
        <div class="flex flex-col gap-4 pt-2">
            @foreach ($links as $link)
                <a href="{{ $link['href'] }}" @click="open = false" class="text-base font-medium text-cream/90">{{ $link['label'] }}</a>
            @endforeach
            @auth
                @if ($showMinhaConta)
                    <a href="{{ route('orders.mine') }}" class="text-base font-medium text-cream/90">A minha conta</a>
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="text-left text-base font-medium text-cream/70">Sair</button>
                    </form>
                @endif
            @else
                @if ($showAuth)
                    <a href="{{ route('auth') }}" class="text-base font-medium text-cream/90">Entrar / Criar conta</a>
                @endif
            @endauth
            <a href="{{ route('home') }}#reservar" @click="open = false" class="text-base font-medium text-gold">Reservar Mesa</a>
        </div>
    </div>
</header>
