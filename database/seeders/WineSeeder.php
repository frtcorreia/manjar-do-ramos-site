<?php

namespace Database\Seeders;

use App\Models\WineCategory;
use Illuminate\Database\Seeder;

class WineSeeder extends Seeder
{
    public function run(): void
    {
        if (WineCategory::exists()) {
            return;
        }

        $data = [
            ['Tintos', [
                ['Quinta do Crasto Reserva', 'Quinta do Crasto', 'Douro', '2019', '38,00€', 'Encorpado, taninos firmes, notas de frutos pretos e especiarias.'],
                ['Mouchão', 'Herdade do Mouchão', 'Alentejo', '2017', '62,00€', 'Clássico alentejano, complexo, com madeira bem integrada.'],
            ]],
            ['Brancos', [
                ['Soalheiro Alvarinho', 'Soalheiro', 'Vinho Verde', '2022', '32,00€', 'Fresco, mineral, com notas cítricas e final persistente.'],
                ['Quinta dos Roques Encruzado', 'Quinta dos Roques', 'Dão', '2021', '34,00€', 'Elegante, com volume de boca e ligeira madeira.'],
            ]],
            ['Espumantes & Champanhes', [
                ['Murganheira Bruto', 'Caves da Murganheira', 'Távora-Varosa', 'NV', '28,00€', 'Bolha fina, fresco, ideal para começar a refeição.'],
            ]],
        ];

        foreach ($data as $catIndex => [$categoryName, $wines]) {
            $category = WineCategory::create(['name' => $categoryName, 'position' => $catIndex]);

            foreach ($wines as $wineIndex => [$name, $producer, $region, $year, $price, $notes]) {
                $category->wines()->create([
                    'name' => $name,
                    'producer' => $producer,
                    'region' => $region,
                    'year' => $year,
                    'price' => $price,
                    'notes' => $notes,
                    'image' => '/images/dish-cocktails.jpg',
                    'position' => $wineIndex,
                ]);
            }
        }
    }
}
