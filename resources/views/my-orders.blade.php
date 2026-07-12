<x-layouts.app title="As minhas encomendas · Manjar do Ramos" robots="noindex, nofollow">
    <x-navbar :force-scrolled="true" />

    <main class="pb-20 pt-32">
        <div class="mx-auto max-w-4xl px-5 md:px-10">
            <div class="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 class="font-serif text-4xl text-espresso md:text-5xl">As minhas encomendas</h1>
                    <p class="mt-2 text-muted-foreground">{{ auth()->user()->email }}</p>
                </div>
                @if (auth()->user()->isAdmin())
                    <a href="{{ route('admin') }}"
                       class="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                        Ir para backoffice
                    </a>
                @endif
            </div>

            @if ($orders->isEmpty())
                <div class="mt-10 rounded-2xl border border-border bg-card p-10 text-center">
                    <svg class="mx-auto h-10 w-10 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    <p class="mt-4 text-muted-foreground">Ainda não tem encomendas.</p>
                    <a href="{{ route('orders.menu') }}"
                       class="mt-6 inline-block rounded-lg bg-wine px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-wine/90">
                        Ver pratos disponíveis
                    </a>
                </div>
            @else
                @php
                    $statusColor = [
                        'pendente' => 'bg-amber-100 text-amber-900',
                        'em_preparacao' => 'bg-blue-100 text-blue-900',
                        'pronto' => 'bg-emerald-100 text-emerald-900',
                        'entregue' => 'bg-stone-200 text-stone-700',
                    ];
                @endphp
                <ul class="mt-10 space-y-5">
                    @foreach ($orders as $order)
                        <li class="rounded-2xl border border-border bg-card p-6 shadow-soft">
                            <div class="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p class="text-xs uppercase tracking-widest text-muted-foreground">
                                        {{ $order->reference() }} · {{ $order->created_at->format('d/m/Y H:i') }}
                                    </p>
                                    <p class="mt-1 font-serif text-xl text-espresso">{{ $order->customer_name }}</p>
                                    <p class="text-sm text-muted-foreground">{{ $order->address }}</p>
                                </div>
                                <div class="text-right">
                                    <span class="inline-block rounded-full px-3 py-1 text-xs font-semibold {{ $statusColor[$order->status] ?? 'bg-stone-200 text-stone-700' }}">
                                        {{ $order->statusLabel() }}
                                    </span>
                                    <p class="mt-2 font-serif text-2xl text-wine">{{ format_eur($order->total) }}</p>
                                </div>
                            </div>
                            <ul class="mt-4 divide-y divide-border border-t border-border pt-2 text-sm">
                                @foreach ($order->items as $item)
                                    <li class="flex justify-between py-2">
                                        <span>{{ $item->quantity }}× {{ $item->name }}</span>
                                        <span class="text-muted-foreground">{{ format_eur($item->price * $item->quantity) }}</span>
                                    </li>
                                @endforeach
                            </ul>
                        </li>
                    @endforeach
                </ul>
            @endif
        </div>
    </main>

    <x-footer />
</x-layouts.app>
