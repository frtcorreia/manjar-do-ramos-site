/*
 * Helpers de interação do site público.
 * O Alpine.js é injetado pelo Livewire (@livewireScripts) e trata dos menus;
 * aqui fica apenas o que é vanilla: reveal-on-scroll e scrollspy das categorias.
 */

function initReveals(root = document) {
    const els = root.querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
        els.forEach((el) => el.classList.add('is-visible'));
        return;
    }
    const io = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            }
        },
        { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
}

/*
 * Scrollspy da navegação de categorias (ementa / carta de vinhos).
 * Marca o botão da categoria mais visível e faz scroll suave ao clicar.
 */
function initCategoryNav() {
    const nav = document.querySelector('[data-category-nav]');
    if (!nav) return;

    const buttons = [...nav.querySelectorAll('[data-target]')];
    const sections = buttons
        .map((b) => document.getElementById(b.dataset.target))
        .filter(Boolean);

    const setActive = (id) => {
        for (const b of buttons) {
            const active = b.dataset.target === id;
            b.classList.toggle('bg-gold', active);
            b.classList.toggle('text-charcoal', active);
            b.classList.toggle('text-cream/70', !active);
            if (active) b.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    };

    for (const b of buttons) {
        b.addEventListener('click', () => {
            const el = document.getElementById(b.dataset.target);
            if (!el) return;
            const top = el.getBoundingClientRect().top + window.scrollY - 140;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    }

    if (sections.length === 0) return;
    const ratios = {};
    const io = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) ratios[entry.target.id] = entry.intersectionRatio;
            const best = Object.entries(ratios).sort((a, b) => b[1] - a[1])[0];
            if (best && best[1] > 0) setActive(best[0]);
        },
        {
            threshold: Array.from({ length: 21 }, (_, i) => i / 20),
            rootMargin: '-120px 0px -40% 0px',
        },
    );
    sections.forEach((s) => io.observe(s));
    setActive(sections[0].id);
}

function boot() {
    initReveals();
    initCategoryNav();
}

document.addEventListener('DOMContentLoaded', boot);
document.addEventListener('livewire:navigated', boot);
// Conteúdo trocado por Livewire (morphs) pode trazer novos .reveal
document.addEventListener('livewire:init', () => {
    Livewire.hook('morphed', () => initReveals());
});
