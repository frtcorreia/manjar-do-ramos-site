<div>
    <x-navbar :force-scrolled="true" />

    <main class="pb-20 pt-32">
        <div class="mx-auto max-w-6xl px-5 md:px-10">
            <h1 class="font-serif text-4xl text-espresso md:text-5xl">Checkout</h1>
            <p class="mt-2 text-muted-foreground">Confirme os dados para finalizar a encomenda.</p>

            @if (count($lines) === 0)
                <div class="mt-10 rounded-2xl border border-border bg-card p-10 text-center">
                    <svg class="mx-auto h-10 w-10 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    <p class="mt-4 text-muted-foreground">O seu carrinho está vazio.</p>
                    <a href="{{ route('orders.menu') }}"
                       class="mt-6 inline-block rounded-lg bg-wine px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-wine/90">
                        Ver pratos
                    </a>
                </div>
            @elseif (! auth()->check())
                <div class="mt-10 rounded-2xl border border-border bg-card p-8 text-center">
                    <h2 class="font-serif text-2xl text-espresso">É necessário ter conta</h2>
                    <p class="mt-2 text-muted-foreground">Crie conta ou inicie sessão para finalizar a encomenda.</p>
                    <a href="{{ route('auth', ['redirect' => 'checkout']) }}"
                       class="mt-5 inline-block rounded-lg bg-wine px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-wine/90">
                        Entrar / Criar conta
                    </a>
                </div>
            @else
                <div class="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
                    <form wire:submit="submit" class="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft">
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="space-y-2">
                                <label for="co-name" class="text-sm font-medium">Nome</label>
                                <input id="co-name" type="text" wire:model="customer_name" required
                                       class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                                @error('customer_name') <p class="text-xs text-destructive">{{ $message }}</p> @enderror
                            </div>
                            <div class="space-y-2">
                                <label for="co-phone" class="text-sm font-medium">Telefone</label>
                                <input id="co-phone" type="tel" wire:model="phone" required
                                       class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                                @error('phone') <p class="text-xs text-destructive">{{ $message }}</p> @enderror
                            </div>
                        </div>
                        <div class="space-y-2">
                            <label for="co-address" class="text-sm font-medium">Morada de entrega</label>
                            <input id="co-address" type="text" wire:model="address" required
                                   class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                            @error('address') <p class="text-xs text-destructive">{{ $message }}</p> @enderror
                        </div>
                        <div class="space-y-2">
                            <label for="co-nif" class="text-sm font-medium">NIF (opcional)</label>
                            <input id="co-nif" type="text" wire:model="nif"
                                   class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                            @error('nif') <p class="text-xs text-destructive">{{ $message }}</p> @enderror
                        </div>
                        <div class="space-y-2">
                            <label for="co-notes" class="text-sm font-medium">Observações (opcional)</label>
                            <textarea id="co-notes" wire:model="notes" rows="4"
                                      placeholder="Ex.: campainha avariada, sem coentros, etc."
                                      class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"></textarea>
                            @error('notes') <p class="text-xs text-destructive">{{ $message }}</p> @enderror
                        </div>
                        <button type="submit" wire:loading.attr="disabled"
                                class="flex w-full items-center justify-center gap-2 rounded-lg bg-wine px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-wine/90 disabled:opacity-60">
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/><circle cx="7.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/></svg>
                            <span wire:loading.remove wire:target="submit">Confirmar encomenda · {{ format_eur($total) }}</span>
                            <span wire:loading wire:target="submit">A enviar…</span>
                        </button>
                    </form>

                    <aside class="lg:sticky lg:top-28 lg:self-start">
                        <div class="rounded-2xl border border-border bg-card p-6 shadow-soft">
                            <h2 class="font-serif text-xl text-espresso">Resumo</h2>
                            <ul class="mt-4 divide-y divide-border">
                                @foreach ($lines as $line)
                                    <li class="flex items-center gap-3 py-3 text-sm">
                                        <span class="w-6 text-center font-semibold text-wine">{{ $line['quantity'] }}×</span>
                                        <span class="flex-1 text-charcoal">{{ $line['item']->name }}</span>
                                        <span class="font-medium text-charcoal">{{ format_eur($line['subtotal']) }}</span>
                                    </li>
                                @endforeach
                            </ul>
                            <div class="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                                <span class="text-sm text-muted-foreground">Total</span>
                                <span class="font-serif text-2xl text-wine">{{ format_eur($total) }}</span>
                            </div>
                        </div>
                    </aside>
                </div>
            @endif
        </div>
    </main>

    <x-footer />
</div>
