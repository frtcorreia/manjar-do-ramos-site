<div>
    @if (! $unlocked)
        {{-- Ecrã de PIN --}}
        <div x-data="{
                pin: '',
                error: false,
                async add(d) {
                    if (this.error || this.pin.length >= 4) return;
                    this.pin += d;
                    if (this.pin.length < 4) return;
                    const ok = await $wire.checkPin(this.pin);
                    if (!ok) {
                        this.error = true;
                        setTimeout(() => { this.pin = ''; this.error = false; }, 600);
                    }
                },
                back() { this.pin = this.pin.slice(0, -1); },
            }"
             class="fixed inset-0 flex h-dvh w-screen flex-col items-center justify-center gap-10 bg-charcoal px-6 text-cream">
            <div class="text-center">
                <svg class="mx-auto h-9 w-9 text-gold/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 22h8M7 10h10M12 15v7M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/></svg>
                <h1 class="mt-4 font-serif text-2xl text-cream">Carta de Vinhos</h1>
                <p class="mt-1 text-sm text-cream/50">Introduza o PIN para continuar</p>
            </div>

            <div class="flex gap-4" :class="error && 'animate-shake'">
                <template x-for="i in 4">
                    <span class="h-3.5 w-3.5 rounded-full border transition-colors"
                          :class="error ? 'border-destructive bg-destructive' : (i <= pin.length ? 'border-gold bg-gold' : 'border-cream/30 bg-transparent')"></span>
                </template>
            </div>

            <div class="grid w-full max-w-xs grid-cols-3 gap-3">
                @foreach (['1', '2', '3', '4', '5', '6', '7', '8', '9'] as $digit)
                    <button type="button" @click="add('{{ $digit }}')"
                            class="rounded-2xl bg-white/10 py-4 text-xl font-medium text-cream backdrop-blur-md transition-colors hover:bg-white/20 active:bg-white/25">
                        {{ $digit }}
                    </button>
                @endforeach
                <div></div>
                <button type="button" @click="add('0')"
                        class="rounded-2xl bg-white/10 py-4 text-xl font-medium text-cream backdrop-blur-md transition-colors hover:bg-white/20 active:bg-white/25">
                    0
                </button>
                <button type="button" aria-label="Apagar" @click="back()"
                        class="flex items-center justify-center rounded-2xl bg-white/10 py-4 text-cream backdrop-blur-md transition-colors hover:bg-white/20 active:bg-white/25">
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>
                </button>
            </div>
        </div>
    @elseif ($categories->isEmpty())
        <div class="fixed inset-0 flex h-dvh w-screen items-center justify-center bg-charcoal px-8 text-center">
            <div class="flex flex-col items-center gap-4">
                <svg class="h-10 w-10 text-gold/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 22h8M7 10h10M12 15v7M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/></svg>
                <p class="text-cream/70">A carta de vinhos ainda não tem vinhos disponíveis.</p>
            </div>
        </div>
    @else
        {{-- Vitrine de vinhos --}}
        @php
            $data = $categories->map(fn ($cat) => [
                'id' => $cat->id,
                'name' => $cat->name,
                'wines' => $cat->wines->map(fn ($w) => [
                    'name' => $w->name,
                    'producer' => $w->producer,
                    'region' => $w->region,
                    'year' => $w->year,
                    'price' => $w->price,
                    'image' => $w->image,
                ])->values(),
            ])->values();
        @endphp
        <div x-data="{
                categories: @js($data),
                catIndex: 0,
                index: 0,
                get cat() { return this.categories[this.catIndex]; },
                get wines() { return this.cat.wines; },
                get wine() { return this.wines[this.index]; },
                selectCat(i) { if (i === this.catIndex) return; this.catIndex = i; this.index = 0; },
                prev() { if (this.index > 0) this.index--; },
                next() { if (this.index < this.wines.length - 1) this.index++; },
                get meta() {
                    return [this.wine.region, this.wine.year && this.wine.year !== 'NV' ? this.wine.year : null].filter(Boolean).join(' · ');
                },
            }"
             @keyup.left.window="prev()" @keyup.right.window="next()"
             class="fixed inset-0 h-dvh w-screen overflow-hidden bg-charcoal text-cream">

            {{-- Slide --}}
            <div class="absolute inset-0"
                 x-data="{ startX: 0 }"
                 @touchstart="startX = $event.touches[0].clientX"
                 @touchend="const dx = $event.changedTouches[0].clientX - startX; if (dx > 60) prev(); if (dx < -60) next();">
                <template x-if="wine.image">
                    <img :src="wine.image" :alt="wine.name" draggable="false" class="h-full w-full object-cover">
                </template>
                <template x-if="!wine.image">
                    <div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-espresso to-charcoal">
                        <svg class="h-16 w-16 text-cream/15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 22h8M7 10h10M12 15v7M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/></svg>
                    </div>
                </template>
            </div>

            {{-- Navegação de categorias --}}
            <div class="absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-black/80 to-transparent pb-10 pt-[max(1rem,env(safe-area-inset-top))]">
                <div class="scrollbar-none flex gap-2 overflow-x-auto px-5 md:px-10">
                    <template x-for="(c, i) in categories" :key="c.id">
                        <button @click="selectCat(i)"
                                class="shrink-0 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-md transition-all duration-200"
                                :class="i === catIndex ? 'bg-gold text-charcoal shadow-gold' : 'bg-white/10 text-cream/75 hover:bg-white/20 hover:text-cream'"
                                x-text="c.name"></button>
                    </template>
                </div>
            </div>

            {{-- Setas --}}
            <button type="button" aria-label="Vinho anterior" @click="prev()" x-show="index > 0" x-cloak
                    class="absolute left-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-cream backdrop-blur-md md:left-6">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button type="button" aria-label="Próximo vinho" @click="next()" x-show="index < wines.length - 1" x-cloak
                    class="absolute right-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-cream backdrop-blur-md md:right-6">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>

            {{-- Overlay de informação --}}
            <div class="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/55 to-transparent pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-28">
                <div class="flex items-end justify-between gap-4 px-6 md:px-12">
                    <div class="min-w-0">
                        <p x-show="meta" class="text-xs font-medium uppercase tracking-[0.2em] text-gold" x-text="meta"></p>
                        <h1 class="mt-1 font-serif text-3xl leading-tight text-cream md:text-5xl" x-text="wine.name"></h1>
                        <p x-show="wine.producer" class="mt-1 text-sm text-cream/60 md:text-base" x-text="wine.producer"></p>
                    </div>
                    <p class="shrink-0 font-serif text-2xl font-medium text-gold md:text-4xl" x-text="wine.price || '—'"></p>
                </div>

                <div x-show="wines.length > 1" class="mt-5 flex items-center justify-center gap-1.5 px-6">
                    <template x-for="(w, i) in wines" :key="i">
                        <span class="h-1.5 rounded-full transition-all duration-300"
                              :class="i === index ? 'w-5 bg-gold' : 'w-1.5 bg-cream/30'"></span>
                    </template>
                </div>
            </div>
        </div>
    @endif
</div>
