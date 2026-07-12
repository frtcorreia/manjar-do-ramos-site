<div class="space-y-6">
    <header class="flex flex-wrap items-start justify-between gap-3">
        <div>
            <h1 class="font-serif text-3xl text-charcoal">Testemunhos</h1>
            <p class="mt-1 text-sm text-muted-foreground">Avaliações manuais mostradas na homepage.</p>
        </div>
        <div class="flex items-center gap-3">
            <button type="button" wire:click="add"
                    class="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary">
                + Testemunho
            </button>
            <x-admin.save-button />
        </div>
    </header>

    <div class="space-y-4">
        @foreach ($testimonials as $i => $t)
            <div class="rounded-2xl border border-border bg-card p-5" wire:key="testimonial-{{ $t['id'] }}">
                <x-admin.field label="Citação" model="testimonials.{{ $i }}.quote" :multiline="true" />
                <div class="mt-3 grid gap-3 sm:grid-cols-2">
                    <x-admin.field label="Nome" model="testimonials.{{ $i }}.name" />
                    <x-admin.field label="Contexto" model="testimonials.{{ $i }}.context" placeholder="Ex.: Jantar de grupo" />
                </div>
                <div class="mt-3 flex items-center justify-between">
                    <label class="flex items-center gap-2 text-sm">
                        <input type="checkbox" wire:model="testimonials.{{ $i }}.visible" class="h-4 w-4 rounded border-input accent-[oklch(0.4_0.125_18)]">
                        Visível no site
                    </label>
                    <button type="button" wire:click="delete({{ $t['id'] }})"
                            wire:confirm="Remover o testemunho de «{{ $t['name'] }}»?"
                            class="text-xs text-destructive hover:underline">
                        Remover
                    </button>
                </div>
            </div>
        @endforeach
    </div>

    <x-admin.save-button />
</div>
