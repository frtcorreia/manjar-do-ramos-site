<?php

namespace Database\Seeders;

use App\Models\QrSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedAdmin();
        $this->seedQrSettings();

        $this->call([
            SiteSettingSeeder::class,
            SiteContentSeeder::class,
            MenuSeeder::class,
            WineSeeder::class,
            TestimonialSeeder::class,
        ]);
    }

    protected function seedAdmin(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@manjardoramos.pt');

        if (User::where('email', $email)->exists()) {
            return;
        }

        $password = env('ADMIN_PASSWORD');

        if (! $password) {
            $password = Str::random(16);
            $this->command?->warn("ADMIN_PASSWORD não definido no .env — password gerada: {$password}");
        }

        User::create([
            'name' => env('ADMIN_NAME', 'Administrador'),
            'email' => $email,
            'password' => $password,
            'role' => User::ROLE_ADMIN,
        ]);

        $this->command?->info("Conta de administrador criada: {$email}");
    }

    protected function seedQrSettings(): void
    {
        foreach (array_keys(QrSetting::LOCATIONS) as $location) {
            QrSetting::firstOrCreate(
                ['location' => $location],
                ['secret_key' => QrSetting::generateKey(), 'duration_minutes' => 120],
            );
        }
    }
}
