<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            'restaurante' => [
                'logo' => '',
                'nomeProprietario' => 'Elsa Maria Dias da Silva Ramos',
                'nif' => '207373/28',
                'morada' => 'Rua da Taberna 12, Lisboa',
                'telefone' => '+351 210 000 000',
                'email' => 'geral@manjardoramos.pt',
                'horario' => 'Terça a Domingo · 12h00–15h00 · 19h00–23h30',
                'horarioRestaurante' => 'Terça a Domingo · 12h00–15h00 · 19h00–23h30',
                'horarioPatio' => '',
                'googleMapsUrl' => '#',
                'googleMapsEmbed' => '',
                'googlePlaceId' => '',
                'social' => [
                    'instagram' => ['url' => 'https://instagram.com/manjardoramos', 'visible' => true],
                    'facebook' => ['url' => 'https://facebook.com/manjardoramos', 'visible' => true],
                    'tripadvisor' => ['url' => '', 'visible' => false],
                ],
            ],
            'navPages' => [
                ['key' => 'conceito', 'label' => 'Conceito', 'href' => '/#conceito', 'route' => false, 'visible' => true],
                ['key' => 'ementa', 'label' => 'Ementa', 'href' => '/ementa', 'route' => true, 'visible' => true],
                ['key' => 'encomendas', 'label' => 'Encomendas', 'href' => '/encomendas', 'route' => true, 'visible' => true],
                ['key' => 'catering', 'label' => 'Catering', 'href' => '/catering', 'route' => true, 'visible' => true],
                ['key' => 'espaco', 'label' => 'Espaço', 'href' => '/#espaco', 'route' => false, 'visible' => true],
                ['key' => 'testemunhos', 'label' => 'Testemunhos', 'href' => '/#testemunhos', 'route' => false, 'visible' => true],
                ['key' => 'carta-de-vinhos', 'label' => 'Carta de Vinhos', 'href' => '/carta-de-vinhos', 'route' => true, 'visible' => false],
                ['key' => 'a-minha-conta', 'label' => 'A minha conta', 'href' => '/minhas-encomendas', 'route' => true, 'visible' => true],
                ['key' => 'auth', 'label' => 'Login / Registo', 'href' => '/auth', 'route' => true, 'visible' => true],
            ],
            'maintenance' => [
                'enabled' => false,
                'titulo' => 'Em manutenção',
                'mensagem' => 'Estamos a preparar algo especial. Voltamos em breve.',
            ],
            'blocks' => [
                ['key' => 'hero', 'label' => 'Hero', 'description' => 'Imagem principal e chamada de ação.', 'visible' => true],
                ['key' => 'about', 'label' => 'Conceito', 'description' => 'Secção sobre a taberna.', 'visible' => true],
                ['key' => 'specialties', 'label' => 'Especialidades', 'description' => 'Cards dos pratos da casa.', 'visible' => true],
                ['key' => 'gallery', 'label' => 'Espaço', 'description' => 'Galeria do ambiente.', 'visible' => true],
                ['key' => 'testimonials', 'label' => 'Testemunhos', 'description' => 'Avaliações de clientes.', 'visible' => true],
                ['key' => 'reservation', 'label' => 'Reservas', 'description' => 'Formulário de reserva de mesa.', 'visible' => true],
            ],
            'menuPrices' => ['takeawayBox' => '0,50€', 'bag' => '0,20€'],
            'winesMeta' => [
                'eyebrow' => 'Garrafeira da Casa',
                'title' => 'Carta de Vinhos',
                'subtitle' => 'Uma seleção rotativa de produtores portugueses, escolhidos a dedo para acompanhar a mesa.',
            ],
        ];

        foreach ($defaults as $key => $value) {
            SiteSetting::firstOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
