<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        if (Testimonial::exists()) {
            return;
        }

        Testimonial::create([
            'quote' => 'Fomos jantar a dois e saímos a planear a próxima visita. A carne na brasa é das melhores que provei em Lisboa.',
            'name' => 'Inês Carvalho',
            'context' => 'Jantar romântico',
            'position' => 0,
        ]);

        Testimonial::create([
            'quote' => 'Levei o grupo todo do trabalho. As tábuas de partilha foram um sucesso e o ambiente é acolhedor.',
            'name' => 'Tiago Mendes',
            'context' => 'Jantar de grupo',
            'position' => 1,
        ]);
    }
}
