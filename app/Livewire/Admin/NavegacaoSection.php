<?php

namespace App\Livewire\Admin;

use App\Models\SiteSetting;

class NavegacaoSection extends AdminSection
{
    public array $navPages = [];
    public array $maintenance = [];
    public array $blocks = [];
    public array $menuPrices = [];

    public function mount(): void
    {
        $this->navPages = SiteSetting::get('navPages', []);
        $this->maintenance = SiteSetting::get('maintenance', ['enabled' => false, 'titulo' => '', 'mensagem' => '']);
        $this->blocks = SiteSetting::get('blocks', []);
        $this->menuPrices = SiteSetting::get('menuPrices', ['takeawayBox' => '0,50€', 'bag' => '0,20€']);
    }

    public function save(): void
    {
        SiteSetting::put('navPages', $this->navPages);
        SiteSetting::put('maintenance', $this->maintenance);
        SiteSetting::put('blocks', $this->blocks);
        SiteSetting::put('menuPrices', $this->menuPrices);
        $this->saved();
    }

    public function render()
    {
        return view('livewire.admin.navegacao-section');
    }
}
