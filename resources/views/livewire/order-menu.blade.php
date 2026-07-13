<div>
    <x-navbar />

    <main>
        <section class="relative flex h-[55svh] min-h-[380px] items-center justify-center overflow-hidden bg-charcoal">
            <img src="/images/dish-petiscos.jpg" alt="Encomendas do Manjar do Ramos"
                 class="absolute inset-0 h-full w-full object-cover opacity-50">
            <div class="absolute inset-0 bg-gradient-hero"></div>
            <div class="reveal relative z-10 px-5 text-center">
                <span class="eyebrow text-gold">Delivery &amp; Take-away</span>
                <h1 class="mt-5 font-serif text-5xl font-medium leading-tight text-cream md:text-7xl">Encomendas</h1>
                <p class="mx-auto mt-5 max-w-xl text-base text-cream/85 md:text-lg">
                    Os sabores da taberna, agora entregues em sua casa.
                </p>
            </div>
        </section>

        <section class="bg-background py-20 md:py-28">
            <div class="mx-auto grid max-w-6xl gap-10 px-5 md:px-10 lg:grid-cols-[1fr_360px]">
                <div class="space-y-14">
                    @if ($categories->isEmpty())
                        <p class="text-center text-muted-foreground">Sem pratos disponíveis para entrega de momento.</p>
                    @endif
                    @foreach ($categories as $category)
                        <div>
                            <h2 class="font-serif text-3xl text-espresso md:text-4xl">{{ $category->name }}</h2>
                            <span class="mt-3 block h-0.5 w-12 bg-gold"></span>
                            <ul class="mt-8 space-y-5">
                                @foreach ($category->items as $item)
                                    @php($qty = $cart[$item->id] ?? 0)
                                    <li class="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft sm:flex-row sm:items-center" wire:key="item-{{ $item->id }}">
                                        @if ($item->image)
                                            <img src="{{ $item->image }}" alt="{{ $item->name }}"
                                                 class="h-28 w-full flex-shrink-0 rounded-lg object-cover sm:h-24 sm:w-24">
                                        @endif
                                        <div class="flex-1">
                                            <h3 class="font-serif text-xl text-espresso">{{ $item->name }}</h3>
                                            @if ($item->description)
                                                <p class="mt-1 text-sm text-muted-foreground">{{ $item->description }}</p>
                                            @endif
                                            <p class="mt-2 font-serif text-lg font-medium text-wine">{{ $item->price }}</p>
                                        </div>
                                        <div class="flex items-center gap-2 sm:flex-col sm:items-end">
                                            @if ($qty === 0)
                                                <button type="button" wire:click="add({{ $item->id }})"
                                                        class="inline-flex items-center gap-2 rounded-lg bg-wine px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-wine/90">
                                                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                                    Adicionar
                                                </button>
                                            @else
                                                <div class="flex items-center gap-1 rounded-full border border-border bg-background p-1">
                                                    <button type="button" wire:click="remove({{ $item->id }})" aria-label="Remover um"
                                                            class="flex h-8 w-8 items-center justify-center rounded-full text-charcoal hover:bg-secondary">
                                                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                                    </button>
                                                    <span class="w-6 text-center text-sm font-semibold text-charcoal">{{ $qty }}</span>
                                                    <button type="button" wire:click="add({{ $item->id }})" aria-label="Adicionar um"
                                                            class="flex h-8 w-8 items-center justify-center rounded-full bg-wine text-cream hover:bg-wine/90">
                                                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                                    </button>
                                                </div>
                                            @endif
                                        </div>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    @endforeach
                </div>

                <aside class="lg:sticky lg:top-28 lg:self-start">
                    <div class="rounded-2xl border border-border bg-card p-6 shadow-soft">
                        <div class="flex items-center gap-2 text-espresso">
                            <svg class="h-5 w-5 text-wine" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                            <h2 class="font-serif text-xl">A sua encomenda</h2>
                        </div>

                        @if (count($lines) === 0)
                            <p class="mt-4 text-sm text-muted-foreground">
                                O seu carrinho está vazio. Adicione pratos para começar.
                            </p>
                        @else
                            <ul class="mt-4 divide-y divide-border">
                                @foreach ($lines as $line)
                                    <li class="flex items-center gap-3 py-3 text-sm" wire:key="line-{{ $line['item']->id }}">
                                        <span class="w-6 text-center font-semibold text-wine">{{ $line['quantity'] }}×</span>
                                        <span class="flex-1 text-charcoal">{{ $line['item']->name }}</span>
                                        <span class="font-medium text-charcoal">{{ format_eur($line['subtotal']) }}</span>
                                    </li>
                                @endforeach
                            </ul>
                        @endif

                        <div class="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                            <span class="text-sm text-muted-foreground">Total</span>
                            <span class="font-serif text-2xl text-wine">{{ format_eur($total) }}</span>
                        </div>

                        <a href="{{ count($lines) ? route('checkout') : '#' }}"
                           class="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-wine px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-wine/90 {{ count($lines) === 0 ? 'pointer-events-none opacity-50' : '' }}">
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/><circle cx="7.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/></svg>
                            Ir para checkout
                        </a>

                        <p class="mt-3 text-center text-xs text-muted-foreground">Entrega na Grande Lisboa · 30 a 45 min</p>
                    </div>
                </aside>
            </div>
        </section>
    </main>

    <x-footer />
</div>
