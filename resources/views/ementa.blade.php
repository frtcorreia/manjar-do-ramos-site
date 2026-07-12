<x-layouts.app
    :title="$page->field('Título (SEO)', 'Ementa · Manjar do Ramos · Taberna Moderna Portuguesa')"
    :description="$page->field('Descrição (SEO)')"
    :og-title="$page->field('OG Título')"
    :og-description="$page->field('OG Descrição')"
>
    <x-navbar :force-scrolled="true" />

    {{-- Navegação de categorias fixa --}}
    <div data-category-nav class="fixed inset-x-0 top-[88px] z-40 bg-charcoal/95 shadow-soft backdrop-blur-md md:top-[96px]">
        <div class="scrollbar-none flex gap-1 overflow-x-auto px-5 py-3 md:px-10">
            @foreach ($categories as $category)
                <button type="button" data-target="{{ $category->slug() }}"
                        class="shrink-0 rounded-full px-4 py-1.5 text-sm font-medium text-cream/70 transition-all duration-200 hover:bg-white/10 hover:text-cream">
                    {{ $category->name }}
                </button>
            @endforeach
        </div>
    </div>

    <main class="pt-[140px] md:pt-[148px]">
        <section class="bg-background py-16 md:py-24">
            <div class="mx-auto max-w-4xl px-5 md:px-10">
                <div class="space-y-20">
                    @foreach ($categories as $category)
                        <div class="reveal">
                            <div id="{{ $category->slug() }}" class="mb-8 scroll-mt-36 text-center">
                                <h2 class="mt-3 font-serif text-3xl text-espresso md:text-4xl">{{ $category->name }}</h2>
                                <span class="mx-auto mt-5 block h-0.5 w-12 bg-gold"></span>
                            </div>
                            <ul class="space-y-6">
                                @foreach ($category->items->where('visible', true) as $item)
                                    <li class="flex items-baseline gap-4">
                                        <div class="flex-1">
                                            <div class="flex items-baseline gap-3">
                                                <h3 class="font-serif text-xl text-espresso">{{ $item->name }}</h3>
                                                <span class="h-px flex-1 translate-y-[-2px] border-b border-dashed border-border"></span>
                                                <span class="font-serif text-lg font-medium text-wine">{{ $item->price }}</span>
                                            </div>
                                            @if ($item->description)
                                                <p class="mt-1 text-sm leading-relaxed text-muted-foreground">{{ $item->description }}</p>
                                            @endif
                                            @if (count($item->allergens ?? []) > 0)
                                                <div class="mt-1.5 flex flex-wrap gap-1">
                                                    @foreach ($item->allergens as $allergen)
                                                        @if (isset(\App\Models\MenuItem::ALLERGENS[$allergen]))
                                                            <span title="{{ \App\Models\MenuItem::ALLERGENS[$allergen] }}" aria-label="{{ \App\Models\MenuItem::ALLERGENS[$allergen] }}" class="inline-flex">
                                                                <x-allergen-icon :id="$allergen" :size="20" />
                                                            </span>
                                                        @endif
                                                    @endforeach
                                                </div>
                                            @endif
                                        </div>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    @endforeach
                </div>

                <div class="reveal mt-16 space-y-1 text-center">
                    <p class="text-sm italic text-muted-foreground">Caso tenha alguma alergia informe o funcionário</p>
                    <p class="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                        Inclui I.V.A à taxa em vigor — {{ ($restaurante['nomeProprietario'] ?? '') ?: '—' }} — {{ ($restaurante['nif'] ?? '') ?: '—' }}
                    </p>
                    <p class="text-xs font-semibold uppercase tracking-wide text-foreground">
                        Caixa take-away {{ $menuPrices['takeawayBox'] ?? '0,50€' }} Saco {{ $menuPrices['bag'] ?? '0,20€' }}
                    </p>
                </div>

                <div class="reveal mt-10 rounded-2xl border border-border bg-secondary/50 p-8">
                    <p class="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Legenda de alergénicos</p>
                    <ul class="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        @foreach (\App\Models\MenuItem::ALLERGENS as $id => $label)
                            <li class="flex items-center gap-2 text-sm text-muted-foreground">
                                <x-allergen-icon :id="$id" :size="22" />
                                <span>{{ $label }}</span>
                            </li>
                        @endforeach
                    </ul>
                    <p class="mt-5 text-[11px] leading-relaxed text-muted-foreground/70">
                        Os alergénicos indicados são de carácter informativo. Em caso de alergias ou intolerâncias
                        alimentares graves, por favor informe o nosso pessoal antes de encomendar.
                    </p>
                </div>
            </div>
        </section>
    </main>

    <x-footer />
</x-layouts.app>
