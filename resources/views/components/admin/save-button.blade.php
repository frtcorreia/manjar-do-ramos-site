@props(['target' => 'save', 'label' => 'Guardar alterações'])
<div class="flex items-center gap-3"
     x-data="{ saved: false }"
     @admin-saved.window="saved = true; setTimeout(() => saved = false, 2500)">
    <span x-show="saved" x-cloak class="text-sm font-medium text-emerald-700">✓ Guardado</span>
    <button type="button" wire:click="{{ $target }}" wire:loading.attr="disabled"
            class="rounded-lg bg-wine px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-wine/90 disabled:opacity-60">
        <span wire:loading.remove wire:target="{{ $target }}">{{ $label }}</span>
        <span wire:loading wire:target="{{ $target }}">A guardar…</span>
    </button>
</div>
