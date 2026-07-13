<div class="space-y-8">
    <header>
        <h1 class="font-serif text-3xl text-charcoal">Leituras QR</h1>
        <p class="mt-1 text-sm text-muted-foreground">Gestão de QR codes e estatísticas de acesso.</p>
    </header>

    {{-- Tabs --}}
    <div class="flex w-fit gap-1 rounded-lg border border-border bg-muted p-1">
        <button type="button" wire:click="$set('tab', 'ementa')"
                class="rounded-md px-4 py-2 text-sm font-medium transition-all {{ $tab === 'ementa' ? 'bg-background text-charcoal shadow-sm' : 'text-muted-foreground hover:text-charcoal' }}">
            Ementa
        </button>
        <button type="button" wire:click="$set('tab', 'vinhos')"
                class="rounded-md px-4 py-2 text-sm font-medium transition-all {{ $tab === 'vinhos' ? 'bg-background text-charcoal shadow-sm' : 'text-muted-foreground hover:text-charcoal' }}">
            Carta de Vinhos
        </button>
    </div>

    @if ($tab === 'ementa')
        <section class="space-y-4">
            <p class="text-sm text-muted-foreground">
                A ementa está sempre acessível a qualquer pessoa com este URL. Não é necessário token nem autenticação.
            </p>

            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                @foreach (['Hoje' => $ementaStats['today'], 'Esta semana' => $ementaStats['week'], 'Este mês' => $ementaStats['month'], 'Total' => $ementaStats['total']] as $label => $value)
                    <div class="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
                        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/15 text-gold">
                            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM21 14v.01M14 21v.01M17 17h.01M21 17v4h-4"/></svg>
                        </div>
                        <div>
                            <p class="font-serif text-2xl text-charcoal">{{ $value }}</p>
                            <p class="text-sm text-muted-foreground">{{ $label }}</p>
                        </div>
                    </div>
                @endforeach
            </div>

            <div class="grid gap-6 rounded-xl border border-border bg-card p-5 lg:grid-cols-[1fr_auto]">
                <div class="space-y-4">
                    <div>
                        <label class="text-xs font-medium text-muted-foreground">URL da Ementa</label>
                        <input value="{{ $ementaUrl }}" readonly
                               class="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-xs">
                    </div>
                    <a href="{{ $ementaQrDownload }}" download="qr-ementa.svg"
                       class="inline-flex items-center gap-2 rounded-lg bg-wine px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-wine/90">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Descarregar QR
                    </a>
                </div>
                <div class="flex items-center justify-center">
                    <div class="w-[200px] rounded-lg border border-border bg-white p-3 [&>svg]:h-auto [&>svg]:w-full">
                        {!! $ementaQr !!}
                    </div>
                </div>
            </div>
        </section>
    @else
        @foreach ($locations as $loc)
            <section class="space-y-4" wire:key="loc-{{ $loc['location'] }}">
                <h2 class="font-serif text-2xl text-charcoal">{{ $loc['label'] }}</h2>

                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    @foreach (['Hoje' => $loc['stats']['today'], 'Esta semana' => $loc['stats']['week'], 'Este mês' => $loc['stats']['month'], 'Total' => $loc['stats']['total']] as $label => $value)
                        <div class="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
                            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/15 text-gold">
                                <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM21 14v.01M14 21v.01M17 17h.01M21 17v4h-4"/></svg>
                            </div>
                            <div>
                                <p class="font-serif text-2xl text-charcoal">{{ $value }}</p>
                                <p class="text-sm text-muted-foreground">{{ $label }}</p>
                            </div>
                        </div>
                    @endforeach
                </div>

                <div class="grid gap-6 rounded-xl border border-border bg-card p-5 lg:grid-cols-[1fr_auto]">
                    <div class="space-y-4">
                        <div>
                            <label class="text-xs font-medium text-muted-foreground">Duração do token (minutos)</label>
                            <div class="mt-1 flex items-center gap-2">
                                <input type="number" min="1" max="1440" wire:model="durations.{{ $loc['location'] }}"
                                       class="w-[140px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                                <button type="button" wire:click="saveDuration('{{ $loc['location'] }}')"
                                        class="rounded-lg bg-wine px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-wine/90">
                                    Guardar
                                </button>
                            </div>
                            @error('durations.'.$loc['location']) <p class="mt-1 text-xs text-destructive">{{ $message }}</p> @enderror
                            <p class="mt-1 text-xs text-muted-foreground">
                                Tempo durante o qual a carta fica acessível após ler este QR.
                            </p>
                        </div>

                        <div>
                            <label class="text-xs font-medium text-muted-foreground">URL do QR</label>
                            <div class="mt-1 flex items-center gap-2">
                                <input readonly
                                       value="{{ ($showKey[$loc['location']] ?? false) ? $loc['url'] : preg_replace('/key=.+$/', 'key=••••••••', $loc['url']) }}"
                                       class="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-xs">
                                <button type="button" wire:click="toggleKey('{{ $loc['location'] }}')"
                                        class="rounded-lg border border-border bg-background p-2 text-muted-foreground hover:bg-secondary"
                                        title="{{ ($showKey[$loc['location']] ?? false) ? 'Ocultar chave' : 'Mostrar chave' }}">
                                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-2">
                            <a href="{{ $loc['qrDownload'] }}" download="qr-carta-vinhos-{{ $loc['location'] }}.svg"
                               class="inline-flex items-center gap-2 rounded-lg bg-wine px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-wine/90">
                                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                Descarregar QR
                            </a>
                            <div x-data="{ confirmText: '' }" class="flex flex-wrap items-center gap-2">
                                <input type="text" x-model="confirmText" placeholder="Escreva: Sim confirmo" autocomplete="off"
                                       class="w-44 rounded-lg border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring">
                                <button type="button" :disabled="confirmText !== 'Sim confirmo'"
                                        wire:click="regenerate('{{ $loc['location'] }}')"
                                        @click="confirmText = ''"
                                        class="inline-flex items-center gap-2 rounded-lg border border-destructive/40 px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-40">
                                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                                    Regenerar chave
                                </button>
                            </div>
                        </div>
                        <p class="text-xs text-muted-foreground">
                            Ao regenerar, todos os QR codes impressos deste local deixam de funcionar.
                        </p>
                    </div>

                    <div class="flex items-center justify-center">
                        <div class="w-[200px] rounded-lg border border-border bg-white p-3 [&>svg]:h-auto [&>svg]:w-full">
                            {!! $loc['qr'] !!}
                        </div>
                    </div>
                </div>
            </section>
        @endforeach
    @endif
</div>
