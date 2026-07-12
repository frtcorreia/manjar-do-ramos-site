<?php

namespace Tests\Feature;

use App\Models\EmentaReading;
use App\Models\SiteSetting;
use Database\Seeders\MenuSeeder;
use Database\Seeders\SiteContentSeeder;
use Database\Seeders\SiteSettingSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([SiteSettingSeeder::class, SiteContentSeeder::class, MenuSeeder::class]);
    }

    public function test_home_renders_seeded_content(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee('Manjar do Ramos')
            ->assertSee('Especialidades da Casa')
            ->assertSee('Reservar Mesa');
    }

    public function test_ementa_lists_menu_and_records_reading(): void
    {
        $this->get('/ementa')
            ->assertOk()
            ->assertSee('Bacalhau à Taberna')
            ->assertSee('Legenda de alergénicos');

        $this->assertSame(1, EmentaReading::count());

        // Segunda visita na mesma sessão não regista de novo
        $this->get('/ementa')->assertOk();
        $this->assertSame(1, EmentaReading::count());
    }

    public function test_catering_page_renders(): void
    {
        $this->get('/catering')
            ->assertOk()
            ->assertSee('A taberna vai até si');
    }

    public function test_maintenance_mode_blocks_public_pages(): void
    {
        SiteSetting::put('maintenance', [
            'enabled' => true,
            'titulo' => 'Em manutenção',
            'mensagem' => 'Voltamos já.',
        ]);

        $this->get('/')->assertServiceUnavailable()->assertSee('Em manutenção');
        $this->get('/admin')->assertOk();
    }
}
