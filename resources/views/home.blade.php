<x-layouts.app
    :title="$page->field('Título (SEO)', 'Manjar do Ramos · Taberna Moderna Portuguesa em Lisboa')"
    :description="$page->field('Descrição (SEO)')"
    :og-title="$page->field('OG Título')"
    :og-description="$page->field('OG Descrição')"
>
    <x-navbar />

    <main>
        {{-- Hero --}}
        @if ($isVisible('hero'))
            <section id="top" class="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-charcoal"
                     @if ($hero->backgroundColor()) style="background-color: {{ $hero->backgroundColor() }}" @endif>
                <img src="{{ $hero->image('Imagem de fundo', '/images/hero.jpg') }}"
                     alt="Mesa de taberna portuguesa"
                     width="1920" height="1280" fetchpriority="high" decoding="async"
                     class="animate-kenburns absolute inset-0 h-full w-full object-cover">
                <div class="absolute inset-0 bg-gradient-hero"></div>

                <div class="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-5 text-center">
                    <span class="eyebrow reveal text-gold">{{ $hero->field('Etiqueta', 'Taberna Moderna Portuguesa') }}</span>
                    <h1 class="reveal mt-6 max-w-4xl font-serif text-5xl font-medium leading-[1.05] text-cream md:text-7xl lg:text-[5.5rem]" style="--reveal-delay: .15s">
                        {{ $hero->field('Título', 'Sabores portugueses com alma de taberna.') }}
                    </h1>
                    <p class="reveal mt-6 max-w-xl text-base text-cream/85 md:text-lg" style="--reveal-delay: .3s">
                        {{ $hero->field('Subtítulo', 'Uma experiência gastronómica feita para partilhar, saborear e voltar.') }}
                    </p>
                    <div class="reveal mt-10 flex flex-col gap-4 sm:flex-row" style="--reveal-delay: .45s">
                        <a href="#reservar" class="rounded-full bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-charcoal shadow-soft transition-transform hover:scale-[1.03]">
                            {{ $hero->field('Botão principal', 'Reservar Mesa') }}
                        </a>
                        <a href="{{ route('ementa') }}" class="rounded-full border border-cream/40 bg-cream/5 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-cream backdrop-blur-sm transition-colors hover:border-gold hover:text-gold">
                            {{ $hero->field('Botão secundário', 'Ver Ementa') }}
                        </a>
                    </div>
                </div>

                <div class="absolute bottom-7 left-1/2 z-10 -translate-x-1/2">
                    <div class="flex h-10 w-6 items-start justify-center rounded-full border border-cream/40 p-1.5">
                        <span class="h-2 w-1 animate-bounce rounded-full bg-gold"></span>
                    </div>
                </div>
            </section>
        @endif

        {{-- Conceito --}}
        @if ($isVisible('about'))
            <section id="conceito" class="bg-background py-24 md:py-32"
                     @if ($about->backgroundColor()) style="background-color: {{ $about->backgroundColor() }}" @endif>
                <div class="mx-auto max-w-7xl px-5 md:px-10">
                    <div class="reveal mx-auto max-w-2xl text-center">
                        <span class="eyebrow text-wine">{{ $about->field('Etiqueta', 'O Nosso Conceito') }}</span>
                        <h2 class="mt-5 font-serif text-4xl font-medium leading-tight text-espresso md:text-5xl">
                            {{ $about->field('Título', 'Uma taberna com alma portuguesa') }}
                        </h2>
                    </div>

                    <div class="mt-20 grid items-center gap-12 md:grid-cols-2 md:gap-16">
                        <div class="reveal">
                            <div class="overflow-hidden rounded-2xl shadow-card">
                                <img src="{{ $about->image('Imagem 1', '/images/about-1.jpg') }}"
                                     alt="Interior acolhedor da taberna" width="1200" height="1400" loading="lazy"
                                     class="h-full w-full object-cover transition-transform duration-700 hover:scale-105">
                            </div>
                        </div>
                        <div class="reveal" style="--reveal-delay: .15s">
                            <span class="eyebrow text-gold">Acolhedor</span>
                            <h3 class="mt-4 font-serif text-3xl text-espresso md:text-4xl">
                                {{ $about->field('Parágrafo 1', 'Uma casa feita de madeira, vinho e boa conversa') }}
                            </h3>
                            <p class="mt-5 text-lg leading-relaxed text-muted-foreground">
                                {{ $about->field('Parágrafo 2', 'No Manjar do Ramos, cada noite começa com o aroma da grelha e termina com risos à volta de uma mesa cheia.') }}
                            </p>
                        </div>
                    </div>

                    <div class="mt-16 grid items-center gap-12 md:mt-24 md:grid-cols-2 md:gap-16">
                        <div class="reveal md:order-2" style="--reveal-delay: .15s">
                            <div class="overflow-hidden rounded-2xl shadow-card">
                                <img src="{{ $about->image('Imagem 2', '/images/about-2.jpg') }}"
                                     alt="Tábuas de partilha com petiscos portugueses" width="1200" height="1400" loading="lazy"
                                     class="h-full w-full object-cover transition-transform duration-700 hover:scale-105">
                            </div>
                        </div>
                        <div class="reveal md:order-1">
                            <span class="eyebrow text-gold">{{ $about->field('Etiqueta 2', 'Abundância') }}</span>
                            <h3 class="mt-4 font-serif text-3xl text-espresso md:text-4xl">
                                {{ $about->field('Título 2', 'Pratos generosos, pensados para partilhar') }}
                            </h3>
                            <p class="mt-5 text-lg leading-relaxed text-muted-foreground">
                                {{ $about->field('Parágrafo 3', 'Produtos honestos, fogo lento e receitas que atravessam gerações.') }}
                            </p>
                            <div class="mt-8 flex gap-10">
                                <div>
                                    <p class="font-serif text-4xl text-wine">{{ $about->field('Stat 1 Valor', '+40') }}</p>
                                    <p class="mt-1 text-sm text-muted-foreground">{{ $about->field('Stat 1 Label', 'Petiscos & pratos') }}</p>
                                </div>
                                <div>
                                    <p class="font-serif text-4xl text-wine">{{ $about->field('Stat 2 Valor', '120') }}</p>
                                    <p class="mt-1 text-sm text-muted-foreground">{{ $about->field('Stat 2 Label', 'Referências de vinho') }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        @endif

        {{-- Especialidades --}}
        @if ($isVisible('specialties'))
            <section id="especialidades" class="bg-charcoal py-24 md:py-32"
                     @if ($specialties->backgroundColor()) style="background-color: {{ $specialties->backgroundColor() }}" @endif>
                <div class="mx-auto max-w-7xl px-5 md:px-10">
                    <div class="reveal mx-auto max-w-2xl text-center">
                        <span class="eyebrow text-gold">{{ $specialties->field('Etiqueta', 'Especialidades da Casa') }}</span>
                        <h2 class="mt-5 font-serif text-4xl font-medium leading-tight text-cream md:text-5xl">
                            {{ $specialties->field('Título', 'Cada prato, uma razão para voltar') }}
                        </h2>
                    </div>

                    <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        @foreach ($specialties->images() as $i => $dish)
                            <div class="reveal" style="--reveal-delay: {{ ($i % 3) * 0.1 }}s">
                                <article class="group relative h-[24rem] overflow-hidden rounded-2xl shadow-card">
                                    <img src="{{ $dish['url'] }}" alt="{{ $dish['title'] ?? '' }}" width="1100" height="1100" loading="lazy"
                                         class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110">
                                    <div class="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent"></div>
                                    <div class="absolute inset-x-0 bottom-0 p-6">
                                        <h3 class="font-serif text-2xl text-cream">{{ $dish['title'] ?? '' }}</h3>
                                        <p class="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-cream/80 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                                            {{ $dish['description'] ?? '' }}
                                        </p>
                                        <span class="mt-3 inline-block h-0.5 w-10 origin-left bg-gold transition-all duration-500 group-hover:w-16"></span>
                                    </div>
                                </article>
                            </div>
                        @endforeach
                    </div>
                </div>
            </section>
        @endif

        {{-- Espaço --}}
        @if ($isVisible('gallery'))
            <section id="espaco" class="bg-background py-24 md:py-32"
                     @if ($gallery->backgroundColor()) style="background-color: {{ $gallery->backgroundColor() }}" @endif>
                <div class="mx-auto max-w-7xl px-5 md:px-10">
                    <div class="reveal mx-auto max-w-2xl text-center">
                        <span class="eyebrow text-wine">{{ $gallery->field('Etiqueta', 'A Experiência do Espaço') }}</span>
                        <h2 class="mt-5 font-serif text-4xl font-medium leading-tight text-espresso md:text-5xl">
                            {{ $gallery->field('Título', 'Madeira, luz quente e mesas cheias') }}
                        </h2>
                        <p class="mt-5 text-lg text-muted-foreground">
                            {{ $gallery->field('Subtítulo', 'Um ambiente rústico e contemporâneo, onde cada detalhe convida a ficar.') }}
                        </p>
                    </div>

                    <div class="mt-14 grid auto-rows-[170px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-4 md:gap-5">
                        <div class="reveal col-span-1 row-span-2">
                            <img src="{{ $gallery->image('Imagem 1', '/images/gallery-1.jpg') }}" alt="Canto íntimo da taberna" width="1000" height="1400" loading="lazy"
                                 class="h-full w-full rounded-2xl object-cover shadow-soft transition-transform duration-700 hover:scale-[1.03]">
                        </div>
                        <div class="reveal col-span-1 md:col-span-2" style="--reveal-delay: .1s">
                            <img src="{{ $gallery->image('Imagem 2', '/images/gallery-2.jpg') }}" alt="Brinde com vinho tinto" width="1300" height="900" loading="lazy"
                                 class="h-full w-full rounded-2xl object-cover shadow-soft transition-transform duration-700 hover:scale-[1.03]">
                        </div>
                        <div class="reveal col-span-1 row-span-2" style="--reveal-delay: .2s">
                            <img src="{{ $gallery->image('Imagem 4', '/images/gallery-4.jpg') }}" alt="Chefe a grelhar carne" width="1000" height="1400" loading="lazy"
                                 class="h-full w-full rounded-2xl object-cover shadow-soft transition-transform duration-700 hover:scale-[1.03]">
                        </div>
                        <div class="reveal col-span-2 md:col-span-2" style="--reveal-delay: .15s">
                            <img src="{{ $gallery->image('Imagem 3', '/images/gallery-3.jpg') }}" alt="Garrafeira de pedra e madeira" width="1300" height="900" loading="lazy"
                                 class="h-full w-full rounded-2xl object-cover shadow-soft transition-transform duration-700 hover:scale-[1.03]">
                        </div>
                    </div>
                </div>
            </section>
        @endif

        {{-- Testemunhos --}}
        @if ($isVisible('testimonials'))
            @php
                $allReviews = $googleReviews->map(fn ($r) => [
                    'quote' => $r->text,
                    'name' => $r->author_name,
                    'context' => $r->relative_time_description,
                    'rating' => $r->rating,
                    'isGoogle' => true,
                ])->concat($testimonials->map(fn ($t) => [
                    'quote' => $t->quote,
                    'name' => $t->name,
                    'context' => $t->context,
                    'rating' => 5,
                    'isGoogle' => false,
                ]))->values();
            @endphp
            <section id="testemunhos" class="bg-gold py-24 md:py-32"
                     @if ($testimonialsBlock->backgroundColor()) style="background-color: {{ $testimonialsBlock->backgroundColor() }}" @endif>
                <div class="mx-auto max-w-7xl px-5 md:px-10">
                    <div class="reveal mx-auto max-w-2xl text-center">
                        <span class="eyebrow text-charcoal">{{ $testimonialsBlock->field('Etiqueta', 'Quem Já Se Sentou À Mesa') }}</span>
                        <h2 class="mt-5 font-serif text-4xl font-medium leading-tight text-charcoal md:text-5xl">
                            {{ $testimonialsBlock->field('Título', 'Histórias que se contam ao jantar') }}
                        </h2>
                    </div>

                    <div class="relative mt-16" x-data="{ active: 0, count: {{ $allReviews->count() }},
                        go(i) {
                            const el = $refs.track;
                            const child = el.children[i];
                            if (!child) return;
                            el.scrollTo({ left: child.offsetLeft - (el.offsetWidth - child.offsetWidth) / 2, behavior: 'smooth' });
                        },
                        sync() {
                            const el = $refs.track;
                            const center = el.scrollLeft + el.offsetWidth / 2;
                            let best = 0, min = Infinity;
                            [...el.children].forEach((c, i) => {
                                const d = Math.abs(center - (c.offsetLeft + c.offsetWidth / 2));
                                if (d < min) { min = d; best = i; }
                            });
                            this.active = best;
                        } }">
                        <div x-ref="track" @scroll.debounce.100ms="sync()"
                             class="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4">
                            @foreach ($allReviews as $review)
                                <div class="w-[85%] flex-shrink-0 snap-center sm:w-[45%] lg:w-[calc(33.333%-1rem)]">
                                    <figure class="flex h-full flex-col rounded-2xl bg-charcoal/8 p-8 ring-1 ring-charcoal/15 backdrop-blur-sm">
                                        <div class="flex items-center justify-between">
                                            <div class="flex gap-1 text-gold" aria-label="{{ $review['rating'] }} estrelas">
                                                @for ($s = 0; $s < 5; $s++)
                                                    <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current {{ $s < $review['rating'] ? '' : 'opacity-20' }}"><path d="M12 2l2.9 6.2 6.8.8-5 4.7 1.3 6.8L12 17.8 5.9 21l1.3-6.8-5-4.7 6.8-.8z"/></svg>
                                                @endfor
                                            </div>
                                            @if ($review['isGoogle'])
                                                <span class="inline-flex items-center gap-1 rounded-full bg-charcoal/10 px-2 py-0.5 text-[10px] font-medium text-charcoal">Google</span>
                                            @endif
                                        </div>
                                        <blockquote class="mt-5 flex-1 font-serif text-xl italic leading-relaxed text-charcoal">
                                            “{{ $review['quote'] }}”
                                        </blockquote>
                                        <figcaption class="mt-6 border-t border-charcoal/15 pt-4">
                                            <p class="font-semibold text-charcoal">{{ $review['name'] }}</p>
                                            <p class="text-sm text-charcoal">{{ $review['context'] }}</p>
                                        </figcaption>
                                    </figure>
                                </div>
                            @endforeach
                        </div>

                        @if ($allReviews->count() > 1)
                            <button @click="go(active - 1)" :disabled="active === 0" aria-label="Anterior"
                                    class="absolute -left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-charcoal text-cream shadow-lg transition hover:bg-charcoal/90 disabled:opacity-0 md:-left-5">
                                <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                            </button>
                            <button @click="go(active + 1)" :disabled="active >= count - 1" aria-label="Próximo"
                                    class="absolute -right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-charcoal text-cream shadow-lg transition hover:bg-charcoal/90 disabled:opacity-0 md:-right-5">
                                <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                            </button>

                            <div class="mt-6 flex justify-center gap-2">
                                @foreach ($allReviews as $i => $review)
                                    <button @click="go({{ $i }})" aria-label="Ir para testemunho {{ $i + 1 }}"
                                            class="h-2 rounded-full transition-all"
                                            :class="active === {{ $i }} ? 'w-6 bg-charcoal' : 'w-2 bg-charcoal/30'"></button>
                                @endforeach
                            </div>
                        @endif
                    </div>
                </div>
            </section>
        @endif

        {{-- Reservas --}}
        @if ($isVisible('reservation'))
            @php($telefone = $reservation->field('Telefone', '+351 210 000 000'))
            <section id="reservar" class="relative bg-espresso py-24 md:py-32"
                     @if ($reservation->backgroundColor()) style="background-color: {{ $reservation->backgroundColor() }}" @endif>
                <div class="mx-auto max-w-3xl px-5 md:px-10">
                    <div class="reveal text-center">
                        <span class="eyebrow text-gold">{{ $reservation->field('Etiqueta', 'Reservas') }}</span>
                        <h2 class="mt-5 font-serif text-4xl font-medium leading-tight text-cream md:text-5xl">
                            {{ $reservation->field('Título', 'Reserve a sua mesa e viva a experiência') }}
                        </h2>
                        <p class="mt-5 text-lg text-cream/75">
                            {{ $reservation->field('Subtítulo', 'Para jantares a dois ou grandes mesas de convívio.') }}
                        </p>
                    </div>

                    <div class="reveal mt-12 flex flex-col items-center gap-3" style="--reveal-delay: .15s">
                        <a href="tel:{{ str_replace(' ', '', $telefone) }}"
                           class="inline-flex items-center gap-4 rounded-2xl bg-cream/[0.04] px-10 py-8 ring-1 ring-cream/15 backdrop-blur-sm transition-colors hover:bg-cream/10">
                            <span class="flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 ring-1 ring-gold/40">
                                <svg class="h-6 w-6 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            </span>
                            <span class="font-serif text-3xl font-medium tracking-wide text-cream md:text-4xl">{{ $telefone }}</span>
                        </a>
                        @if ($reservation->field('Label Telefone'))
                            <p class="text-xs text-cream/50">{{ $reservation->field('Label Telefone') }}</p>
                        @endif
                    </div>
                </div>
            </section>
        @endif
    </main>

    <x-footer />
</x-layouts.app>
