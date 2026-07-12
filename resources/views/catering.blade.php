<x-layouts.app
    :title="$page->field('Título (SEO)', 'Catering · Manjar do Ramos · Eventos & Celebrações')"
    :description="$page->field('Descrição (SEO)')"
    :og-title="$page->field('OG Título')"
    :og-description="$page->field('OG Descrição')"
>
    <x-navbar />

    <main>
        {{-- Hero --}}
        <section class="relative flex h-[64svh] min-h-[440px] items-center justify-center overflow-hidden bg-charcoal">
            <img src="{{ $page->image('Hero — Imagem de fundo', '/images/dish-tabua.jpg') }}"
                 alt="Tábua de partilha do Manjar do Ramos para eventos"
                 class="absolute inset-0 h-full w-full object-cover opacity-60">
            <div class="absolute inset-0 bg-gradient-hero"></div>
            <div class="reveal relative z-10 px-5 text-center">
                <span class="eyebrow text-gold">{{ $page->field('Hero — Etiqueta', 'Catering & Eventos') }}</span>
                <h1 class="mt-5 font-serif text-5xl font-medium leading-tight text-cream md:text-7xl">
                    {{ $page->field('Hero — Título', 'A taberna vai até si') }}
                </h1>
                <p class="mx-auto mt-5 max-w-xl text-base text-cream/85 md:text-lg">
                    {{ $page->field('Hero — Subtítulo', 'Levamos a abundância, o convívio e os sabores do Manjar do Ramos ao seu evento.') }}
                </p>
                <a href="#pedido" class="mt-9 inline-block rounded-full bg-wine px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-cream shadow-soft transition-transform hover:scale-[1.03]">
                    {{ $page->field('Hero — Botão', 'Pedir Orçamento') }}
                </a>
            </div>
        </section>

        {{-- Intro --}}
        <section class="bg-background py-24 md:py-32">
            <div class="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:gap-16 md:px-10">
                <div class="reveal">
                    <div class="overflow-hidden rounded-2xl shadow-card">
                        <img src="{{ $page->image('Intro — Imagem', '/images/about-2.jpg') }}"
                             alt="Mesa farta de petiscos portugueses para partilhar" loading="lazy"
                             class="h-full w-full object-cover">
                    </div>
                </div>
                <div class="reveal" style="--reveal-delay: .15s">
                    <span class="eyebrow text-wine">{{ $page->field('Intro — Etiqueta', 'O Nosso Catering') }}</span>
                    <h2 class="mt-4 font-serif text-3xl text-espresso md:text-4xl">
                        {{ $page->field('Intro — Título', 'Mesas que reúnem, sabores que ficam') }}
                    </h2>
                    <p class="mt-5 text-lg leading-relaxed text-muted-foreground">
                        {{ $page->field('Intro — Parágrafo 1') }}
                    </p>
                    <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
                        {{ $page->field('Intro — Parágrafo 2') }}
                    </p>
                </div>
            </div>
        </section>

        {{-- Serviços --}}
        @php
            $services = [
                ['Festas Privadas', 'Aniversários, batizados e celebrações em família, com a abundância da taberna.', 'M5.8 11.3 2 22l10.7-3.79M4 3h.01M22 8h.01M15 2h.01M22 20h.01M22 2l-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10M22 13l-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17M11 2l.33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z'],
                ['Eventos de Empresa', 'Almoços, jantares e cocktails corporativos que ficam na memória da equipa.', 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z'],
                ['Casamentos', 'Mesas de partilha, carnes na brasa e doçaria portuguesa para o seu grande dia.', 'M8 22h8M7 10h10M12 15v7M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z'],
                ['Entrega & Montagem', 'Levamos tudo até si — montamos, servimos e tratamos de cada detalhe.', 'M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11M14 9h4l4 4v4c0 .6-.4 1-1 1h-2M7.5 18a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM17.5 18a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z'],
                ['Chef no Local', 'Show-cooking e brasa ao vivo para uma experiência gastronómica completa.', 'M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z M6 17h12'],
                ['Menus à Medida', 'Adaptamos a ementa ao seu evento, número de convidados e orçamento.', 'M16 2v20M11 2v6.5a2.5 2.5 0 0 1-5 0V2M6 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z'],
            ];
        @endphp
        <section class="bg-charcoal py-24 md:py-32">
            <div class="mx-auto max-w-7xl px-5 md:px-10">
                <div class="reveal mx-auto max-w-2xl text-center">
                    <span class="eyebrow text-gold">{{ $page->field('Serviços — Etiqueta', 'O Que Oferecemos') }}</span>
                    <h2 class="mt-5 font-serif text-4xl font-medium leading-tight text-cream md:text-5xl">
                        {{ $page->field('Serviços — Título', 'Um serviço pensado ao detalhe') }}
                    </h2>
                </div>
                <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    @foreach ($services as $i => [$title, $desc, $iconPath])
                        <div class="reveal" style="--reveal-delay: {{ ($i % 3) * 0.1 }}s">
                            <article class="h-full rounded-2xl border border-cream/10 bg-cream/[0.04] p-8 transition-colors hover:border-gold/50">
                                <svg class="h-8 w-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="{{ $iconPath }}"/></svg>
                                <h3 class="mt-5 font-serif text-2xl text-cream">{{ $title }}</h3>
                                <p class="mt-3 text-sm leading-relaxed text-cream/75">{{ $desc }}</p>
                            </article>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>

        {{-- Como Funciona --}}
        @php
            $steps = [
                ['01', 'Conte-nos a sua ideia', 'Data, número de convidados e tipo de evento.'],
                ['02', 'Desenhamos a ementa', 'Uma proposta à medida do seu gosto e orçamento.'],
                ['03', 'Tratamos de tudo', 'Logística, montagem e serviço no dia.'],
                ['04', 'Celebrem juntos', 'Vocês aproveitam, nós cuidamos da mesa.'],
            ];
        @endphp
        <section class="bg-background py-24 md:py-32">
            <div class="mx-auto max-w-7xl px-5 md:px-10">
                <div class="reveal mx-auto max-w-2xl text-center">
                    <span class="eyebrow text-wine">{{ $page->field('Como Funciona — Etiqueta', 'Como Funciona') }}</span>
                    <h2 class="mt-5 font-serif text-4xl font-medium leading-tight text-espresso md:text-5xl">
                        {{ $page->field('Como Funciona — Título', 'Simples, do primeiro contacto ao brinde') }}
                    </h2>
                </div>
                <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    @foreach ($steps as $i => [$n, $title, $desc])
                        <div class="reveal" style="--reveal-delay: {{ ($i % 4) * 0.1 }}s">
                            <span class="font-serif text-5xl text-gold">{{ $n }}</span>
                            <h3 class="mt-3 font-serif text-2xl text-espresso">{{ $title }}</h3>
                            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{{ $desc }}</p>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>

        {{-- CTA --}}
        @php($ctaEmail = $page->field('CTA — Email', 'eventos@manjardoramos.pt'))
        @php($ctaTelefone = $page->field('CTA — Telefone', '+351 210 000 000'))
        <section id="pedido" class="bg-secondary py-24 md:py-32">
            <div class="mx-auto max-w-2xl px-5 text-center md:px-10">
                <div class="reveal">
                    <span class="eyebrow text-wine">Pedir Orçamento</span>
                    <h2 class="mt-5 font-serif text-4xl font-medium leading-tight text-espresso md:text-5xl">
                        {{ $page->field('CTA — Título', 'Vamos planear o seu evento') }}
                    </h2>
                    <p class="mx-auto mt-5 max-w-md text-muted-foreground">
                        {{ $page->field('CTA — Subtítulo', 'Conte-nos os detalhes e enviamos-lhe uma proposta à medida. Resposta em até 48 horas.') }}
                    </p>
                    <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <a href="mailto:{{ $ctaEmail }}"
                           class="rounded-full bg-wine px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-cream shadow-soft transition-transform hover:scale-[1.03]">
                            {{ $ctaEmail }}
                        </a>
                        <a href="tel:{{ str_replace(' ', '', $ctaTelefone) }}"
                           class="rounded-full border border-wine/40 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-wine transition-colors hover:bg-wine hover:text-cream">
                            {{ $ctaTelefone }}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <x-footer />
</x-layouts.app>
