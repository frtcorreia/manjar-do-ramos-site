<div class="space-y-6">
    <header class="flex flex-wrap items-start justify-between gap-3">
        <div>
            <h1 class="font-serif text-3xl text-charcoal">{{ $title }}</h1>
            <p class="mt-1 text-sm text-muted-foreground">{{ $subtitle }}</p>
        </div>
        <x-admin.save-button />
    </header>

    <div class="flex flex-wrap gap-2">
        @foreach ($entries as $entry)
            <button type="button" wire:click="$set('active', '{{ $entry['key'] }}')"
                    class="rounded-full border px-4 py-1.5 text-sm font-medium transition-colors {{ $active === $entry['key'] ? 'border-wine bg-wine text-cream' : 'border-border bg-card text-muted-foreground hover:border-wine/50' }}">
                {{ $entry['label'] }}
            </button>
        @endforeach
    </div>

    @if ($active && $data)
        <section class="space-y-4 rounded-2xl border border-border bg-card p-6">
            <h2 class="font-serif text-xl text-espresso">Textos</h2>
            <div class="grid gap-4">
                @foreach ($data['fields'] ?? [] as $i => $field)
                    <x-admin.field :label="$field['label']" model="data.fields.{{ $i }}.value" :multiline="(bool) ($field['multiline'] ?? false)" />
                @endforeach
            </div>
        </section>

        @if (count($data['images'] ?? []))
            <section class="space-y-4 rounded-2xl border border-border bg-card p-6">
                <h2 class="font-serif text-xl text-espresso">Imagens</h2>
                <div class="grid gap-4 sm:grid-cols-2">
                    @foreach ($data['images'] ?? [] as $i => $image)
                        <div class="rounded-xl border border-border bg-background p-4" wire:key="img-{{ $active }}-{{ $i }}">
                            <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{{ $image['label'] }}</p>
                            @if ($image['url'] ?? '')
                                <img src="{{ $image['url'] }}" alt="{{ $image['label'] }}" class="mt-2 h-32 w-full rounded-lg object-cover">
                            @endif
                            <div class="mt-3 space-y-3">
                                <x-admin.field label="URL" model="data.images.{{ $i }}.url" />
                                <label>
                                    <span class="cursor-pointer rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-secondary">Carregar imagem</span>
                                    <input type="file" accept="image/*" class="hidden"
                                           wire:click="uploadImageFor({{ $i }})"
                                           wire:model="imageUpload">
                                </label>
                                @if (array_key_exists('title', $image))
                                    <x-admin.field label="Título" model="data.images.{{ $i }}.title" />
                                @endif
                                @if (array_key_exists('description', $image))
                                    <x-admin.field label="Descrição" model="data.images.{{ $i }}.description" :multiline="true" />
                                @endif
                            </div>
                        </div>
                    @endforeach
                </div>
                @error('imageUpload') <p class="text-xs text-destructive">{{ $message }}</p> @enderror
            </section>
        @endif

        @if ($showBackground)
            <section class="space-y-3 rounded-2xl border border-border bg-card p-6">
                <h2 class="font-serif text-xl text-espresso">Cor de fundo (opcional)</h2>
                <p class="text-sm text-muted-foreground">Substitui a cor de fundo padrão do bloco. Deixe vazio para usar a cor original.</p>
                <div class="flex items-center gap-3">
                    <input type="color" wire:model="data.backgroundColor" class="h-10 w-14 cursor-pointer rounded border border-input bg-background">
                    <div class="w-40">
                        <x-admin.field label="Valor (hex)" model="data.backgroundColor" placeholder="#faf6ee" />
                    </div>
                    <button type="button" wire:click="$set('data.backgroundColor', '')"
                            class="text-xs text-muted-foreground hover:text-destructive hover:underline">
                        Limpar
                    </button>
                </div>
            </section>
        @endif

        <x-admin.save-button />
    @endif
</div>
