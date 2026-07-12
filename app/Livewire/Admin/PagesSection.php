<?php

namespace App\Livewire\Admin;

class PagesSection extends ContentSection
{
    protected string $prefix = 'page_';

    public function render()
    {
        return view('livewire.admin.content-section', [
            'title' => 'Páginas',
            'subtitle' => 'SEO e conteúdos das páginas Início, Ementa e Catering.',
            'showBackground' => false,
        ]);
    }
}
