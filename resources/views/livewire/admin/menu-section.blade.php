<div class="space-y-6">
    <header class="flex flex-wrap items-start justify-between gap-3">
        <div>
            <h1 class="font-serif text-3xl text-charcoal">Ementa</h1>
            <p class="mt-1 text-sm text-muted-foreground">Categorias, pratos, preços, alergénios e disponibilidade.</p>
        </div>
        <div class="flex items-center gap-3">
            <button type="button" wire:click="addCategory"
                    class="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary">
                + Categoria
            </button>
            <x-admin.save-button />
        </div>
    </header>

    <div class="space-y-4">
        @foreach ($categories as $catIndex => $category)
            <section class="rounded-2xl border border-border bg-card" wire:key="cat-{{ $category['id'] }}">
                <div class="flex flex-wrap items-center gap-2 p-4">
                    <button type="button"
                            wire:click="$set('openCategory', {{ $openCategory === $category['id'] ? 'null' : $category['id'] }})"
                            class="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary"
                            aria-label="Expandir">
                        <svg class="h-4 w-4 transition-transform {{ $openCategory === $category['id'] ? 'rotate-90' : '' }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                    <input type="text" wire:model="categories.{{ $catIndex }}.name"
                           class="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1.5 font-serif text-xl text-espresso focus:border-input focus:bg-background focus:outline-none">
                    <span class="text-xs text-muted-foreground">{{ count($category['items']) }} pratos</span>
                    <div class="flex items-center gap-1">
                        <button type="button" wire:click="moveCategory({{ $catIndex }}, -1)" class="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary" aria-label="Subir">↑</button>
                        <button type="button" wire:click="moveCategory({{ $catIndex }}, 1)" class="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary" aria-label="Descer">↓</button>
                        <button type="button" wire:click="deleteCategory({{ $category['id'] }})"
                                wire:confirm="Remover a categoria «{{ $category['name'] }}» e todos os seus pratos?"
                                class="rounded-lg p-1.5 text-destructive hover:bg-destructive/10" aria-label="Remover categoria">
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </div>

                @if ($openCategory === $category['id'])
                    <div class="space-y-4 border-t border-border p-4">
                        @foreach ($category['items'] as $itemIndex => $item)
                            <div class="rounded-xl border border-border bg-background p-4" wire:key="item-{{ $item['id'] }}">
                                <div class="grid gap-3 md:grid-cols-[1fr_1fr_120px]">
                                    <x-admin.field label="Nome" model="categories.{{ $catIndex }}.items.{{ $itemIndex }}.name" />
                                    <x-admin.field label="Descrição" model="categories.{{ $catIndex }}.items.{{ $itemIndex }}.description" />
                                    <x-admin.field label="Preço" model="categories.{{ $catIndex }}.items.{{ $itemIndex }}.price" />
                                </div>

                                <div class="mt-3 flex flex-wrap items-center gap-4 text-sm">
                                    @foreach (['visible' => 'Visível', 'delivery' => 'Delivery', 'takeaway' => 'Take-away', 'restaurant' => 'Restaurante'] as $flag => $flagLabel)
                                        <label class="flex items-center gap-1.5">
                                            <input type="checkbox" wire:model="categories.{{ $catIndex }}.items.{{ $itemIndex }}.{{ $flag }}"
                                                   class="h-4 w-4 rounded border-input accent-[oklch(0.4_0.125_18)]">
                                            {{ $flagLabel }}
                                        </label>
                                    @endforeach

                                    <div class="ml-auto flex items-center gap-1">
                                        <button type="button" wire:click="moveItem({{ $catIndex }}, {{ $itemIndex }}, -1)" class="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary" aria-label="Subir">↑</button>
                                        <button type="button" wire:click="moveItem({{ $catIndex }}, {{ $itemIndex }}, 1)" class="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary" aria-label="Descer">↓</button>
                                        <button type="button" wire:click="deleteItem({{ $item['id'] }})"
                                                wire:confirm="Remover o prato «{{ $item['name'] }}»?"
                                                class="rounded-lg p-1.5 text-destructive hover:bg-destructive/10" aria-label="Remover prato">
                                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                        </button>
                                    </div>
                                </div>

                                <details class="mt-3">
                                    <summary class="cursor-pointer text-xs font-medium text-muted-foreground">
                                        Alergénios ({{ count($item['allergens'] ?? []) }}) e imagem
                                    </summary>
                                    <div class="mt-3 flex flex-wrap gap-2">
                                        @foreach ($allergenOptions as $allergenId => $allergenLabel)
                                            <button type="button" wire:click="toggleAllergen({{ $catIndex }}, {{ $itemIndex }}, '{{ $allergenId }}')"
                                                    class="rounded-full border px-3 py-1 text-xs transition-colors {{ in_array($allergenId, $item['allergens'] ?? [], true) ? 'border-wine bg-wine text-cream' : 'border-border bg-card text-muted-foreground hover:border-wine/50' }}">
                                                {{ $allergenLabel }}
                                            </button>
                                        @endforeach
                                    </div>
                                    <div class="mt-3 flex flex-wrap items-center gap-3">
                                        @if ($item['image'])
                                            <img src="{{ $item['image'] }}" alt="" class="h-14 w-14 rounded-lg object-cover">
                                        @endif
                                        <div class="min-w-0 flex-1">
                                            <x-admin.field label="URL da imagem" model="categories.{{ $catIndex }}.items.{{ $itemIndex }}.image" />
                                        </div>
                                        <label>
                                            <span class="cursor-pointer rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-secondary">Carregar</span>
                                            <input type="file" accept="image/*" class="hidden"
                                                   wire:click="uploadImageFor('{{ $catIndex }}.{{ $itemIndex }}')"
                                                   wire:model="imageUpload">
                                        </label>
                                    </div>
                                </details>
                            </div>
                        @endforeach

                        <button type="button" wire:click="addItem({{ $catIndex }})"
                                class="w-full rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-wine/50 hover:text-wine">
                            + Adicionar prato
                        </button>
                    </div>
                @endif
            </section>
        @endforeach
    </div>

    <x-admin.save-button />
</div>
