<div class="space-y-8">
    <header class="flex flex-wrap items-start justify-between gap-3">
        <div>
            <h1 class="font-serif text-3xl text-charcoal">Restaurante</h1>
            <p class="mt-1 text-sm text-muted-foreground">Dados gerais, contactos, horários e redes sociais.</p>
        </div>
        <x-admin.save-button />
    </header>

    <section class="space-y-5 rounded-2xl border border-border bg-card p-6">
        <h2 class="font-serif text-xl text-espresso">Identidade</h2>

        <div class="flex flex-wrap items-center gap-5">
            <div class="flex h-24 w-40 items-center justify-center rounded-xl bg-charcoal p-3">
                <img src="{{ ($r['logo'] ?? '') ?: '/images/logo-cream.png' }}" alt="Logo" class="max-h-full max-w-full object-contain">
            </div>
            <div class="space-y-2">
                <label class="block">
                    <span class="cursor-pointer rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary">Carregar logo</span>
                    <input type="file" wire:model="logoUpload" accept="image/*" class="hidden">
                </label>
                @if ($r['logo'] ?? '')
                    <button type="button" wire:click="removeLogo" class="block text-xs text-destructive hover:underline">Remover logo</button>
                @endif
                <p class="text-xs text-muted-foreground" wire:loading wire:target="logoUpload">A carregar…</p>
                @error('logoUpload') <p class="text-xs text-destructive">{{ $message }}</p> @enderror
            </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
            <x-admin.field label="Nome do proprietário" model="r.nomeProprietario" />
            <x-admin.field label="NIF" model="r.nif" />
            <x-admin.field label="Morada" model="r.morada" />
            <x-admin.field label="Telefone" model="r.telefone" />
            <x-admin.field label="Email" model="r.email" type="email" />
        </div>
    </section>

    <section class="space-y-5 rounded-2xl border border-border bg-card p-6">
        <h2 class="font-serif text-xl text-espresso">Horários</h2>
        <div class="grid gap-4 sm:grid-cols-2">
            <x-admin.field label="Horário (geral)" model="r.horario" />
            <x-admin.field label="Horário — Restaurante" model="r.horarioRestaurante" />
            <x-admin.field label="Horário — Pátio" model="r.horarioPatio" />
        </div>
    </section>

    <section class="space-y-5 rounded-2xl border border-border bg-card p-6">
        <h2 class="font-serif text-xl text-espresso">Google Maps</h2>
        <div class="grid gap-4">
            <x-admin.field label="URL do Google Maps" model="r.googleMapsUrl" />
            <x-admin.field label="URL de embed (iframe)" model="r.googleMapsEmbed" />
            <x-admin.field label="Google Place ID (reviews)" model="r.googlePlaceId" />
        </div>
    </section>

    <section class="space-y-5 rounded-2xl border border-border bg-card p-6">
        <h2 class="font-serif text-xl text-espresso">Redes sociais</h2>
        @foreach (['instagram' => 'Instagram', 'facebook' => 'Facebook', 'tripadvisor' => 'TripAdvisor'] as $key => $label)
            <div class="flex flex-wrap items-end gap-3">
                <div class="min-w-0 flex-1">
                    <x-admin.field :label="$label" :model="'r.social.'.$key.'.url'" />
                </div>
                <label class="flex items-center gap-2 pb-2 text-sm">
                    <input type="checkbox" wire:model="r.social.{{ $key }}.visible" class="h-4 w-4 rounded border-input accent-[oklch(0.4_0.125_18)]">
                    Visível
                </label>
            </div>
        @endforeach
    </section>

    <x-admin.save-button />
</div>
