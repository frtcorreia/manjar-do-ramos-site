@props(['label', 'model', 'type' => 'text', 'multiline' => false, 'placeholder' => ''])
<div class="space-y-1.5">
    <label class="text-xs font-medium text-muted-foreground">{{ $label }}</label>
    @if ($multiline)
        <textarea wire:model="{{ $model }}" rows="3" placeholder="{{ $placeholder }}"
                  class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"></textarea>
    @else
        <input type="{{ $type }}" wire:model="{{ $model }}" placeholder="{{ $placeholder }}"
               class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
    @endif
</div>
