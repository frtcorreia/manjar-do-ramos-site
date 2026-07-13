<div>
    @guest
        {{-- Login do backoffice --}}
        <div class="flex min-h-screen items-center justify-center bg-charcoal px-5">
            <div class="w-full max-w-sm">
                <div class="mb-8 text-center">
                    <img src="/images/logo-cream.png" alt="Manjar do Ramos" class="mx-auto h-16 w-auto">
                    <p class="mt-3 text-xs uppercase tracking-[0.3em] text-cream/40">Backoffice</p>
                </div>
                <form wire:submit="login" class="space-y-4">
                    <div class="space-y-2">
                        <label for="admin-email" class="text-sm text-cream/80">Email</label>
                        <input id="admin-email" type="email" wire:model="email" autocomplete="email" required
                               class="w-full rounded-lg border border-cream/20 bg-cream/5 px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:ring-2 focus:ring-gold">
                        @error('email') <p class="text-xs text-red-400">{{ $message }}</p> @enderror
                    </div>
                    <div class="space-y-2">
                        <label for="admin-password" class="text-sm text-cream/80">Palavra-passe</label>
                        <input id="admin-password" type="password" wire:model="password" autocomplete="current-password" required
                               class="w-full rounded-lg border border-cream/20 bg-cream/5 px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:ring-2 focus:ring-gold">
                        @error('password') <p class="text-xs text-red-400">{{ $message }}</p> @enderror
                    </div>
                    <button type="submit" wire:loading.attr="disabled"
                            class="w-full rounded-lg bg-gold px-4 py-2.5 font-semibold text-charcoal transition-colors hover:bg-gold/90 disabled:opacity-60">
                        <span wire:loading.remove wire:target="login">Entrar</span>
                        <span wire:loading wire:target="login">A entrar…</span>
                    </button>
                </form>
            </div>
        </div>
    @else
        @if (! auth()->user()->isAdmin())
            <div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-charcoal text-cream">
                <img src="/images/logo-cream.png" alt="Manjar do Ramos" class="h-14 w-auto">
                <p class="text-sm text-cream/60">Sem permissões de acesso.</p>
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit" class="text-xs text-gold underline">Sair</button>
                </form>
            </div>
        @else
            <div class="flex min-h-screen w-full bg-background" x-data="{ mobileOpen: false }">
                {{-- Sidebar (desktop) --}}
                <aside class="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto bg-charcoal md:block">
                    @include('livewire.partials.admin-nav', ['sections' => $sections, 'logo' => $logo])
                </aside>

                <div class="flex min-w-0 flex-1 flex-col">
                    {{-- Barra superior (mobile) --}}
                    <div class="sticky top-0 z-20 flex items-center gap-3 bg-charcoal px-4 py-3 md:hidden">
                        <button @click="mobileOpen = true" class="flex h-9 w-9 items-center justify-center rounded-lg text-cream hover:bg-cream/10" aria-label="Abrir menu">
                            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
                        </button>
                        <span class="font-serif text-lg text-cream">{{ $sections[$section] ?? '' }}</span>
                    </div>

                    {{-- Drawer (mobile) --}}
                    <div x-show="mobileOpen" x-cloak class="fixed inset-0 z-40 md:hidden">
                        <div class="absolute inset-0 bg-black/50" @click="mobileOpen = false"></div>
                        <div class="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-charcoal" @click="if ($event.target.closest('button')) mobileOpen = false">
                            @include('livewire.partials.admin-nav', ['sections' => $sections, 'logo' => $logo])
                        </div>
                    </div>

                    <main class="mx-auto w-full max-w-5xl flex-1 px-5 py-8 md:px-10">
                        @switch($section)
                            @case('restaurante') <livewire:admin.restaurante-section :key="'restaurante'" /> @break
                            @case('navegacao') <livewire:admin.navegacao-section :key="'navegacao'" /> @break
                            @case('pages') <livewire:admin.pages-section :key="'pages'" /> @break
                            @case('menu') <livewire:admin.menu-section :key="'menu'" /> @break
                            @case('wines') <livewire:admin.wines-section :key="'wines'" /> @break
                            @case('qr') <livewire:admin.qr-section :key="'qr'" /> @break
                            @case('orders') <livewire:admin.orders-section :key="'orders'" /> @break
                            @case('testimonials') <livewire:admin.testimonials-section :key="'testimonials'" /> @break
                            @case('google-reviews') <livewire:admin.google-reviews-section :key="'google-reviews'" /> @break
                            @case('content') <livewire:admin.content-section :key="'content'" /> @break
                        @endswitch
                    </main>
                </div>
            </div>
        @endif
    @endguest
</div>
