<div class="space-y-5">
    <div>
        <h1 class="font-serif text-3xl text-espresso">Encomendas</h1>
        <p class="mt-1 text-sm text-muted-foreground">Acompanhe e atualize o estado das encomendas recebidas.</p>
    </div>

    @php
        $statusColor = [
            'pendente' => 'bg-amber-100 text-amber-900',
            'em_preparacao' => 'bg-blue-100 text-blue-900',
            'pronto' => 'bg-emerald-100 text-emerald-900',
            'entregue' => 'bg-stone-200 text-stone-700',
        ];
    @endphp

    @if ($orders->isEmpty())
        <p class="text-muted-foreground">Sem encomendas até ao momento.</p>
    @else
        <ul class="space-y-4">
            @foreach ($orders as $order)
                <li class="rounded-2xl border border-border bg-card p-5 shadow-soft" wire:key="order-{{ $order->id }}">
                    <div class="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p class="text-xs uppercase tracking-widest text-muted-foreground">
                                {{ $order->reference() }} · {{ $order->created_at->format('d/m/Y H:i') }}
                            </p>
                            <p class="mt-1 font-serif text-xl text-espresso">{{ $order->customer_name }}</p>
                            <p class="text-sm text-muted-foreground">{{ $order->phone }} · {{ $order->address }}</p>
                            @if ($order->nif)
                                <p class="text-sm text-muted-foreground">NIF: {{ $order->nif }}</p>
                            @endif
                            @if ($order->notes)
                                <p class="mt-2 text-sm italic text-muted-foreground">“{{ $order->notes }}”</p>
                            @endif
                        </div>
                        <div class="flex flex-col items-end gap-2">
                            <span class="inline-block rounded-full px-3 py-1 text-xs font-semibold {{ $statusColor[$order->status] ?? 'bg-stone-200 text-stone-700' }}">
                                {{ $order->statusLabel() }}
                            </span>
                            <p class="font-serif text-xl text-wine">{{ format_eur($order->total) }}</p>
                            <select wire:change="updateStatus({{ $order->id }}, $event.target.value)"
                                    class="w-[180px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                                @foreach ($statuses as $value => $label)
                                    <option value="{{ $value }}" @selected($order->status === $value)>{{ $label }}</option>
                                @endforeach
                            </select>
                            <button type="button" wire:click="deleteOrder({{ $order->id }})"
                                    wire:confirm="Remover a encomenda {{ $order->reference() }}? Esta ação não pode ser revertida."
                                    class="text-xs text-destructive hover:underline">
                                Remover
                            </button>
                        </div>
                    </div>
                    <ul class="mt-3 divide-y divide-border border-t border-border pt-2 text-sm">
                        @foreach ($order->items as $item)
                            <li class="flex justify-between py-1.5">
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
