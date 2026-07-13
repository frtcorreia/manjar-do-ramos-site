<div class="space-y-8">
    <header class="flex flex-wrap items-start justify-between gap-3">
        <div>
            <h1 class="font-serif text-3xl text-charcoal">Navegação &amp; Site</h1>
            <p class="mt-1 text-sm text-muted-foreground">Menu de navegação, blocos da homepage e modo de manutenção.</p>
        </div>
        <x-admin.save-button />
    </header>

    <section class="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 class="font-serif text-xl text-espresso">Menu de navegação</h2>
        <p class="text-sm text-muted-foreground">Controle o texto e a visibilidade de cada entrada do menu.</p>
        <div class="space-y-3">
            @foreach ($navPages as $i => $page)
                <div class="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-background p-3" wire:key="nav-{{ $page['key'] }}">
                    <div class="w-40">
                        <label class="text-xs font-medium text-muted-foreground">Texto</label>
                        <input type="text" wire:model="navPages.{{ $i }}.label"
                               class="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    </div>
                    <div class="min-w-0 flex-1">
                        <label class="text-xs font-medium text-muted-foreground">Ligação</label>
                        <input type="text" wire:model="navPages.{{ $i }}.href"
                               class="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-ring">
                    </div>
                    <label class="flex items-center gap-2 pb-2.5 text-sm">
                        <input type="checkbox" wire:model="navPages.{{ $i }}.visible" class="h-4 w-4 rounded border-input accent-[oklch(0.4_0.125_18)]">
                        Visível
                    </label>
                </div>
            @endforeach
        </div>
    </section>

    <section class="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 class="font-serif text-xl text-espresso">Blocos da homepage</h2>
        <div class="grid gap-3 sm:grid-cols-2">
            @foreach ($blocks as $i => $block)
                <label class="flex items-start gap-3 rounded-xl border border-border bg-background p-3 text-sm" wire:key="block-{{ $block['key'] }}">
                    <input type="checkbox" wire:model="blocks.{{ $i }}.visible" class="mt-0.5 h-4 w-4 rounded border-input accent-[oklch(0.4_0.125_18)]">
                    <span>
                        <span class="font-medium">{{ $block['label'] }}</span>
                        <span class="block text-xs text-muted-foreground">{{ $block['description'] ?? '' }}</span>
                    </span>
                </label>
            @endforeach
        </div>
    </section>

    <section class="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 class="font-serif text-xl text-espresso">Preços de take-away</h2>
        <div class="grid gap-4 sm:grid-cols-2">
            <x-admin.field label="Caixa take-away" model="menuPrices.takeawayBox" />
            <x-admin.field label="Saco" model="menuPrices.bag" />
        </div>
    </section>

    <section class="space-y-4 rounded-2xl border {{ ($maintenance['enabled'] ?? false) ? 'border-destructive' : 'border-border' }} bg-card p-6">
        <div class="flex items-center justify-between">
            <h2 class="font-serif text-xl text-espresso">Modo de manutenção</h2>
            <label class="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" wire:model.live="maintenance.enabled" class="h-4 w-4 rounded border-input accent-[oklch(0.577_0.245_27)]">
                {{ ($maintenance['enabled'] ?? false) ? 'Ativo' : 'Inativo' }}
            </label>
        </div>
        <p class="text-sm text-muted-foreground">
            Com o modo ativo, os visitantes veem apenas a página de manutenção. Administradores continuam a ver o site.
        </p>
        <div class="grid gap-4">
            <x-admin.field label="Título" model="maintenance.titulo" />
            <x-admin.field label="Mensagem" model="maintenance.mensagem" :multiline="true" />
        </div>
    </section>

    <x-admin.save-button />
</div>
