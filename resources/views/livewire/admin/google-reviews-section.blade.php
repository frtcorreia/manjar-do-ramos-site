<div class="space-y-6">
    <header class="flex flex-wrap items-start justify-between gap-3">
        <div>
            <h1 class="font-serif text-3xl text-charcoal">Google Reviews</h1>
            <p class="mt-1 text-sm text-muted-foreground">Sincronize as avaliações do Google e escolha quais aparecem no site.</p>
        </div>
        <button type="button" wire:click="sync" wire:loading.attr="disabled"
                class="rounded-lg bg-wine px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-wine/90 disabled:opacity-60">
            <span wire:loading.remove wire:target="sync">Sincronizar agora</span>
            <span wire:loading wire:target="sync">A sincronizar…</span>
        </button>
    </header>

    @if ($feedback)
        <p class="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{{ $feedback }}</p>
    @endif
    @if ($error)
        <p class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{{ $error }}</p>
    @endif

    <section class="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 class="font-serif text-xl text-espresso">Place ID</h2>
        <div class="flex flex-wrap items-end gap-3">
            <div class="min-w-0 flex-1">
                <x-admin.field label="Google Place ID" model="placeId" placeholder="ChIJ…" />
            </div>
            <button type="button" wire:click="savePlaceId"
                    class="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary">
                Guardar
            </button>
        </div>

        <div class="border-t border-border pt-4">
            <p class="text-sm text-muted-foreground">Não sabe o Place ID? Pesquise pelo nome do restaurante:</p>
            <div class="mt-2 flex flex-wrap items-center gap-3">
                <input type="text" wire:model="searchQuery" wire:keydown.enter="search"
                       placeholder="Ex.: Manjar do Ramos Lisboa"
                       class="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <button type="button" wire:click="search" wire:loading.attr="disabled"
                        class="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-60">
                    Pesquisar
                </button>
            </div>
            @if (count($searchResults))
                <ul class="mt-3 divide-y divide-border rounded-lg border border-border">
                    @foreach ($searchResults as $result)
                        <li class="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                            <div>
                                <p class="font-medium">{{ $result['name'] }}</p>
                                <p class="text-xs text-muted-foreground">{{ $result['address'] }}</p>
                            </div>
                            <button type="button" wire:click="usePlaceId('{{ $result['placeId'] }}')"
                                    class="rounded-lg bg-wine px-3 py-1.5 text-xs font-semibold text-cream hover:bg-wine/90">
                                Usar este
                            </button>
                        </li>
                    @endforeach
                </ul>
            @endif
        </div>
    </section>

    <section class="space-y-4">
        <h2 class="font-serif text-xl text-espresso">Reviews importadas ({{ $reviews->count() }})</h2>
        @if ($reviews->isEmpty())
            <p class="text-sm text-muted-foreground">
                Ainda não há reviews importadas. Defina o Place ID e clique em «Sincronizar agora».
            </p>
        @else
            <ul class="space-y-3">
                @foreach ($reviews as $review)
                    <li class="rounded-2xl border border-border bg-card p-5 {{ $review->visible ? '' : 'opacity-60' }}" wire:key="review-{{ md5($review->id) }}">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center gap-2">
                                    <p class="font-semibold">{{ $review->author_name }}</p>
                                    <span class="text-gold">{{ str_repeat('★', $review->rating) }}</span>
                                    <span class="text-xs text-muted-foreground">{{ $review->relative_time_description }}</span>
                                </div>
                                <p class="mt-2 text-sm text-muted-foreground">{{ $review->text }}</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <button type="button" wire:click="toggleVisible('{{ $review->id }}')"
                                        class="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary">
                                    {{ $review->visible ? 'Ocultar' : 'Mostrar' }}
                                </button>
                                <button type="button" wire:click="delete('{{ $review->id }}')"
                                        wire:confirm="Remover esta review importada?"
                                        class="rounded-lg px-2 py-1.5 text-xs text-destructive hover:bg-destructive/10">
                                    Remover
                                </button>
                            </div>
                        </div>
                    </li>
                @endforeach
            </ul>
        @endif
    </section>
</div>
