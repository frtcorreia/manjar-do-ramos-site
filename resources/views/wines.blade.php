<x-layouts.app
    title="Carta de Vinhos · Manjar do Ramos"
    description="Garrafeira do Manjar do Ramos: tintos, brancos e espumantes portugueses."
    robots="noindex, nofollow"
>
    <x-navbar :force-scrolled="true" />

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

    <main>
        <section class="bg-background pb-24 pt-32 md:pb-32 md:pt-40">
            <div class="mx-auto max-w-4xl px-5 md:px-10">
                <div class="space-y-16">
                    @foreach ($categories as $category)
                        <div class="reveal">
                            <div id="{{ $category->slug() }}" class="mb-8 scroll-mt-36 text-center">
                                <h2 class="font-serif text-3xl text-espresso md:text-4xl">{{ $category->name }}</h2>
                                <span class="mx-auto mt-4 block h-0.5 w-12 bg-gold"></span>
                            </div>
                            <ul class="divide-y divide-border">
                                @foreach ($category->wines->where('visible', true) as $wine)
                                    <li class="flex flex-col gap-4 py-5 md:flex-row md:items-start md:gap-6">
                                        @if ($wine->image)
                                            <img src="{{ $wine->image }}" alt="{{ $wine->name }}"
                                                 class="h-24 w-24 flex-shrink-0 rounded-md object-cover">
                                        @endif
                                        <div class="flex-1">
                                            <h3 class="font-serif text-xl text-espresso">
                                                {{ $wine->name }}
                                                @if ($wine->year && $wine->year !== 'NV')
                                                    <span class="ml-2 font-sans text-sm font-normal text-muted-foreground">· {{ $wine->year }}</span>
                                                @endif
                                            </h3>
                                            <p class="mt-1 text-sm text-muted-foreground">
                                                {{ collect([$wine->producer, $wine->region])->filter()->join(' — ') }}
                                            </p>
                                            @if ($wine->notes)
                                                <p class="mt-1 text-sm italic text-muted-foreground/85">{{ $wine->notes }}</p>
                                            @endif
                                        </div>
                                        <span class="w-24 text-left font-serif text-lg font-medium text-wine md:text-right">
                                            {{ $wine->price ?: '—' }}
                                        </span>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>
    </main>

    <x-footer />
</x-layouts.app>
