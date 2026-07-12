<?php

namespace Tests\Feature;

use App\Models\QrReading;
use App\Models\QrSetting;
use App\Models\WineCategory;
use Database\Seeders\WineSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WineAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(WineSeeder::class);

        QrSetting::create([
            'location' => 'restaurante',
            'secret_key' => 'chave-secreta-teste',
            'duration_minutes' => 120,
        ]);
    }

    public function test_wine_list_is_locked_without_key(): void
    {
        $this->get('/carta-de-vinhos')
            ->assertOk()
            ->assertSee('QR code disponível no restaurante')
            ->assertDontSee('Quinta do Crasto');
    }

    public function test_valid_key_grants_access_and_records_reading(): void
    {
        $this->get('/carta-de-vinhos?key=chave-secreta-teste')
            ->assertRedirect(route('wines'));

        $this->assertSame(1, QrReading::where('location', 'restaurante')->count());

        $this->get('/carta-de-vinhos')
            ->assertOk()
            ->assertSee('Quinta do Crasto');
    }

    public function test_invalid_key_does_not_grant_access(): void
    {
        $this->get('/carta-de-vinhos?key=errada')->assertRedirect(route('wines'));

        $this->assertSame(0, QrReading::count());

        $this->get('/carta-de-vinhos')->assertSee('QR code disponível no restaurante');
    }

    public function test_access_expires_after_duration(): void
    {
        $this->get('/carta-de-vinhos?key=chave-secreta-teste');
        $this->get('/carta-de-vinhos')->assertSee('Quinta do Crasto');

        $this->travel(121)->minutes();

        $this->get('/carta-de-vinhos')->assertSee('QR code disponível no restaurante');
    }

    public function test_hidden_wines_and_empty_categories_are_not_listed(): void
    {
        WineCategory::first()->wines()->update(['visible' => false]);

        $this->get('/carta-de-vinhos?key=chave-secreta-teste');
        $this->get('/carta-de-vinhos')
            ->assertOk()
            ->assertDontSee('Quinta do Crasto');
    }
}
