@props(['id', 'size' => 22])
@php
    $icons = [
        'sulphites' => '<path d="M12 4v2m0 0a2 2 0 012 2v1h1a1 1 0 011 1v1h-8v-1a1 1 0 011-1h1V8a2 2 0 012-2zm-3 8h6l-.5 6a2 2 0 01-2 2h-1a2 2 0 01-2-2L9 12z" stroke="white" stroke-width="1.2" fill="none"/>',
        'gluten' => '<g stroke="white" stroke-width="1.1" fill="none"><path d="M12 20V10"/><path d="M12 10c-1-2-3-3-4-6 2 .5 3.5 2.5 4 4"/><path d="M12 10c1-2 3-3 4-6-2 .5-3.5 2.5-4 4"/><path d="M12 13c-1-1.5-2.5-2-3.5-4.5 1.8.3 3 1.8 3.5 3"/><path d="M12 13c1-1.5 2.5-2 3.5-4.5-1.8.3-3 1.8-3.5 3"/></g>',
        'milk' => '<g stroke="white" stroke-width="1.2" fill="none"><rect x="8" y="6" width="8" height="13" rx="1"/><path d="M8 10h8"/><path d="M10 6V4h4v2"/></g>',
        'eggs' => '<ellipse cx="12" cy="13" rx="4.5" ry="5.5" stroke="white" stroke-width="1.2" fill="none"/>',
        'soy' => '<g stroke="white" stroke-width="1.2" fill="none"><ellipse cx="10" cy="11" rx="2.5" ry="4" transform="rotate(-20 10 11)"/><ellipse cx="14" cy="13" rx="2.5" ry="4" transform="rotate(20 14 13)"/></g>',
        'celery' => '<g stroke="white" stroke-width="1.2" fill="none"><path d="M12 20v-8"/><path d="M12 12c-2-3-5-4-5-7 2 1 4 3 5 5"/><path d="M12 12c2-3 5-4 5-7-2 1-4 3-5 5"/><path d="M12 15c-1.5-2-3-3-3-5 1.5.5 2.5 2 3 3.5"/><path d="M12 15c1.5-2 3-3 3-5-1.5.5-2.5 2-3 3.5"/></g>',
        'fish' => '<g stroke="white" stroke-width="1.2" fill="none"><path d="M4 12c3-4 7-5 11-3l-3 3 3 3c-4 2-8 1-11-3z"/><circle cx="14" cy="11" r=".8" fill="white"/><path d="M19 9c1 1 1 3 0 4" stroke-linecap="round"/></g>',
        'molluscs' => '<g stroke="white" stroke-width="1.2" fill="none"><path d="M6 16c0-5 3-10 6-10s6 5 6 10"/><path d="M6 16h12"/><path d="M9 11c1-1 2-1 3 0s2 1 3 0"/></g>',
        'crustaceans' => '<g stroke="white" stroke-width="1.2" fill="none"><ellipse cx="12" cy="13" rx="4" ry="3"/><path d="M8 13c-2-1-3-3-3-4l2 1"/><path d="M16 13c2-1 3-3 3-4l-2 1"/><path d="M10 10l-1-3"/><path d="M14 10l1-3"/><path d="M10 16l-1 2"/><path d="M12 16v2"/><path d="M14 16l1 2"/></g>',
        'nuts' => '<g stroke="white" stroke-width="1.2" fill="none"><ellipse cx="12" cy="14" rx="4" ry="3"/><path d="M8 14c0-4 1.5-7 4-8 2.5 1 4 4 4 8"/></g>',
        'peanuts' => '<g stroke="white" stroke-width="1.2" fill="none"><ellipse cx="12" cy="14" rx="4" ry="3"/><path d="M8 14c0-4 1.5-7 4-8 2.5 1 4 4 4 8"/></g>',
        'lupin' => '<g stroke="white" stroke-width="1.2" fill="none"><circle cx="10" cy="12" r="2.5"/><circle cx="14.5" cy="12" r="2.5"/><path d="M12 15v4"/></g>',
        'mustard' => '<g stroke="white" stroke-width="1.2" fill="none"><rect x="9" y="8" width="6" height="10" rx="1"/><path d="M10 8V6h4v2"/><path d="M12 5V4"/><path d="M9 12h6"/></g>',
        'sesame' => '<g stroke="white" stroke-width="1.2" fill="none"><ellipse cx="10" cy="12" rx="2" ry="3" transform="rotate(-15 10 12)"/><ellipse cx="14" cy="12" rx="2" ry="3" transform="rotate(15 14 12)"/></g>',
    ];
@endphp
<svg width="{{ $size }}" height="{{ $size }}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="11" fill="currentColor" class="text-foreground" />
    {!! $icons[$id] ?? '' !!}
</svg>
