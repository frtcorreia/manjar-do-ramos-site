@php($logoSrc = ($r['logo'] ?? '') ?: '/images/logo-cream.png')
@php($social = $r['social'] ?? [])
<footer class="bg-charcoal pt-20 text-cream/80">
    <div class="mx-auto max-w-7xl px-5 md:px-10">
        <div class="grid gap-12 md:grid-cols-4">
            <div class="md:col-span-1">
                <img src="{{ $logoSrc }}" alt="Manjar do Ramos" class="h-24 max-w-[240px] object-contain">
                <p class="mt-5 text-sm leading-relaxed">
                    Sabores portugueses com alma de taberna. Feitos para partilhar, saborear e voltar.
                </p>
                <div class="mt-5 flex gap-3">
                    @if ($social['instagram']['visible'] ?? false)
                        <a href="{{ $social['instagram']['url'] ?: '#' }}" target="_blank" rel="noreferrer" aria-label="Instagram"
                           class="rounded-full border border-cream/20 p-2.5 transition-colors hover:border-gold hover:text-gold">
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                        </a>
                    @endif
                    @if ($social['facebook']['visible'] ?? false)
                        <a href="{{ $social['facebook']['url'] ?: '#' }}" target="_blank" rel="noreferrer" aria-label="Facebook"
                           class="rounded-full border border-cream/20 p-2.5 transition-colors hover:border-gold hover:text-gold">
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        </a>
                    @endif
                    @if ($social['tripadvisor']['visible'] ?? false)
                        <a href="{{ $social['tripadvisor']['url'] ?: '#' }}" target="_blank" rel="noreferrer" aria-label="TripAdvisor"
                           class="rounded-full border border-cream/20 p-2.5 transition-colors hover:border-gold hover:text-gold">
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </a>
                    @endif
                </div>
                <ul class="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    @foreach ($links as $link)
                        <li><a href="{{ $link['href'] }}" class="transition-colors hover:text-gold">{{ $link['label'] }}</a></li>
                    @endforeach
                </ul>
            </div>

            <div>
                <h3 class="font-serif text-xl text-cream">Contactos</h3>
                <ul class="mt-4 space-y-3 text-sm">
                    <li class="flex items-center gap-3">
                        <svg class="h-4 w-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        <a href="tel:{{ str_replace(' ', '', $r['telefone'] ?? '') }}" class="transition-colors hover:text-gold">{{ $r['telefone'] ?? '' }}</a>
                    </li>
                    <li class="flex items-start gap-3">
                        <svg class="mt-0.5 h-4 w-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {{ $r['morada'] ?? '' }}
                    </li>
                </ul>
            </div>

            <div>
                <h3 class="font-serif text-xl text-cream">Horário</h3>
                <ul class="mt-4 space-y-3 text-sm">
                    <li class="flex items-start gap-3">
                        <svg class="mt-0.5 h-4 w-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <div>
                            <p class="font-medium text-cream">Restaurante</p>
                            <span>{{ ($r['horarioRestaurante'] ?? '') ?: ($r['horario'] ?? '') }}</span>
                        </div>
                    </li>
                    @if ($r['horarioPatio'] ?? false)
                        <li class="flex items-start gap-3">
                            <svg class="mt-0.5 h-4 w-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <div>
                                <p class="font-medium text-cream">Pátio</p>
                                <span>{{ $r['horarioPatio'] }}</span>
                            </div>
                        </li>
                    @endif
                </ul>
            </div>

            <div>
                <h3 class="font-serif text-xl text-cream">Localização</h3>
                @if ($r['googleMapsEmbed'] ?? false)
                    <div class="mt-4 overflow-hidden rounded-xl border border-cream/15">
                        <iframe src="{{ $r['googleMapsEmbed'] }}" class="h-32 w-full" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                @else
                    <a href="{{ ($r['googleMapsUrl'] ?? '') ?: '#' }}" target="_blank" rel="noreferrer" aria-label="Ver localização no mapa"
                       class="mt-4 block overflow-hidden rounded-xl border border-cream/15">
                        <div class="relative h-32 w-full bg-[radial-gradient(circle_at_30%_40%,oklch(0.3_0.04_50),oklch(0.19_0.012_60))]">
                            <div class="absolute inset-0 opacity-30 [background-image:linear-gradient(oklch(0.76_0.1_80/.4)_1px,transparent_1px),linear-gradient(90deg,oklch(0.76_0.1_80/.4)_1px,transparent_1px)] [background-size:22px_22px]"></div>
                            <svg class="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-gold drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        </div>
                    </a>
                @endif
            </div>
        </div>

        <div class="mt-16 flex flex-col items-center justify-between gap-3 border-t border-cream/10 py-6 text-xs text-cream/50 md:flex-row">
            <p>© {{ date('Y') }} Manjar do Ramos. Todos os direitos reservados.</p>
            <p>Feito com alma em Portugal.</p>
        </div>
    </div>
</footer>
