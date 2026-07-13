<div class="flex h-full flex-col px-4 py-6">
    <a href="{{ route('home') }}" class="px-2">
        <img src="{{ $logo }}" alt="Manjar do Ramos" class="h-12 max-w-[140px] object-contain">
    </a>
    <p class="mt-1 px-2 text-xs uppercase tracking-[0.3em] text-cream/40">Backoffice</p>

    <nav class="mt-8 flex flex-1 flex-col gap-1">
        @foreach ($sections as $id => $label)
            <button type="button" wire:click="select('{{ $id }}')"
                    class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors {{ $section === $id ? 'bg-gold font-semibold text-charcoal' : 'text-cream/75 hover:bg-cream/10 hover:text-cream' }}">
                {{ $label }}
            </button>
        @endforeach
    </nav>

    <div class="mt-4 flex flex-col gap-1 border-t border-cream/10 pt-4">
        <a href="{{ route('home') }}" target="_blank" rel="noreferrer"
           class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream/75 transition-colors hover:bg-cream/10 hover:text-cream">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Ver site
        </a>
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream/75 transition-colors hover:bg-cream/10 hover:text-cream">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sair
            </button>
        </form>
    </div>
</div>
