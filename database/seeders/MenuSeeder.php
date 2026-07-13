<?php

namespace Database\Seeders;

use App\Models\MenuCategory;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        if (MenuCategory::exists()) {
            return;
        }

        foreach ($this->data() as $catIndex => [$categoryName, $items]) {
            $category = MenuCategory::create(['name' => $categoryName, 'position' => $catIndex]);

            foreach ($items as $itemIndex => [$name, $description, $price, $allergens]) {
                $category->items()->create([
                    'name' => $name,
                    'description' => $description,
                    'price' => $price,
                    'allergens' => $allergens,
                    'position' => $itemIndex,
                ]);
            }
        }
    }

    /**
     * Ementa inicial completa (portada do site anterior).
     *
     * @return array<int, array{0: string, 1: array<int, array{0:string,1:string,2:string,3:array<int,string>}>}>
     */
    protected function data(): array
    {
        return [
            ['Entradas', [
                ['Pão', '', '1,50€', ['gluten']],
                ['Pão Torrado', '', '2,50€', ['gluten']],
                ['Azeitonas Marinadas', '', '1,20€', ['sulphites']],
            ]],
            ['Da Terra', [
                ['Palitos Mozzarella', '', '5,20€', ['gluten', 'milk', 'eggs', 'soy', 'celery', 'molluscs', 'crustaceans', 'nuts', 'lupin', 'mustard']],
                ['Queijo Quente c/ Azeite e Orégãos', '', '4,80€', ['milk']],
                ['Queijo Quente de Cabra c/ Azeitonas', '', '5,20€', ['milk', 'sulphites']],
                ['Tábua de Queijo', 'Brie/Camembert e Argolas de Cebola', '10,00€', ['gluten', 'milk']],
                ['Queijo Fresco', '', '5,00€', ['milk']],
                ['Salada de Orelha', '', '6,50€', ['sulphites']],
                ['Orelha Quente', '', '7,00€', ['sulphites']],
                ['Moelas', '', '6,50€', ['gluten', 'eggs', 'soy', 'celery', 'sulphites']],
                ['Dobradinha', '', '7,00€', ['gluten', 'milk', 'eggs', 'soy', 'celery', 'sulphites', 'nuts']],
                ['Frango à Passarinho', '', '7,00€', []],
                ['Corações Galinha ao Alho', '', '7,50€', ['gluten', 'milk', 'sulphites']],
                ['Asas de Frango', '', '7,00€', []],
                ['Panados à Taberna', 'Frango panado c/ Molho de Mostarda e Mel', '12,50€', ['gluten', 'eggs', 'mustard', 'sulphites', 'milk']],
                ['Febras a Palitar', '', '8,50€', ['sulphites', 'celery']],
                ['Entremeada a Palitar', '', '8,50€', ['sulphites', 'celery']],
                ['Mista a Palitar', '', '9,50€', ['sulphites', 'celery']],
                ['Fígado à Matança', '', '6,50€', []],
                ['Rins à Matança', '', '6,50€', ['sulphites', 'celery']],
                ['Pica-Pau Vitela', '', '10,50€', ['sulphites', 'celery']],
                ['Febras Alguidar', '', '8,50€', ['sulphites', 'celery']],
                ['Febras Pica-Pau', '', '8,50€', ['sulphites', 'celery']],
                ['Picadinho de Secretos', '', '12,00€', ['gluten', 'sulphites', 'celery']],
                ['Secretos no Bolo do Caco', '', '13,00€', ['gluten', 'milk']],
                ['Tirinhas de Vitela', 'c/ Molho de Natas e Mostarda', '11,00€', ['milk', 'mustard', 'sulphites', 'celery']],
                ['Picado de Frango ou Porco', 'c/ Molho de Natas e Batata Frita', '14,00€', ['milk', 'mustard', 'sulphites', 'celery', 'gluten']],
                ['Pica-Pau de Lombinho de Porco', 'c/ Cogumelos, Presunto e Molho de Vinho Branco', '14,00€', ['sulphites', 'celery', 'gluten', 'milk']],
                ['Pica-Pau de Frango', 'c/ Camarão, Abacaxi e Molho de Mostarda e Mel', '16,00€', ['crustaceans', 'mustard', 'sulphites', 'milk']],
                ['Francesinha Escangalhada', 'Vitela, Salsicha Toscana, Linguiça, Bacon, Queijo Mozzarella no Bolo do Caco com Ovo Estrelado e Batata Frita', '18,00€', ['gluten', 'milk', 'eggs', 'sulphites', 'celery']],
            ]],
            ['Do Fumeiro', [
                ['Linguiça Frita', '', '7,00€', ['gluten', 'milk']],
                ['Chouriça Assada', '', '7,00€', ['milk']],
                ['Morcela Assada', '', '7,00€', ['sulphites']],
                ['Moura Assada', '', '7,00€', ['sulphites']],
                ['Alheira Frita', '', '8,00€', ['gluten']],
                ['Farinheira Frita', '', '7,50€', ['gluten', 'milk', 'eggs']],
                ['Chouriça Frita', '', '7,00€', ['milk']],
                ['Prova de Enchidos', '', '14,00€', ['gluten', 'milk']],
            ]],
            ['Da Água', [
                ['Salada de Pota', '', '7,00€', ['molluscs', 'sulphites']],
                ['Petinga com Molho Escabeche', '', '7,00€', ['fish', 'gluten', 'sulphites']],
                ['Jaquinzinhos com Molho Escabeche', '', '7,00€', ['fish', 'gluten', 'sulphites']],
                ['Gambão Frito', '', '11,00€', ['crustaceans']],
                ['Miolo de Camarão à Guilho', '', '16,50€', ['crustaceans', 'sulphites', 'milk']],
                ['Amêijoas à Bulhão Pato', '', '14,00€', ['molluscs', 'sulphites']],
                ['Choco Frito', '', '10,00€', ['molluscs', 'gluten']],
                ['Pitéu de Lulas', '', '10,00€', ['molluscs']],
                ['Jaquinzinhos Fritos', '', '8,00€', ['fish', 'gluten']],
                ['Petinga Frita', '', '8,00€', ['fish', 'gluten']],
                ['Barriga de Atum Grelhada', '', '11,00€', ['fish']],
                ['Cachaço de Bacalhau Frito', '', '12,00€', ['fish']],
                ['Peixe Rei Frito', '', '8,00€', ['fish']],
            ]],
            ['Do Cú da Galinha', [
                ['Ovos com Farinheira', '', '6,50€', ['eggs', 'gluten', 'milk']],
                ['Ovos com Alheira e Espargos', '', '7,00€', ['eggs', 'gluten', 'milk']],
                ['Ovos Rotos com Presunto', '', '7,50€', ['eggs', 'sulphites']],
                ['Ovos Rotos com Bacon', '', '8,00€', ['eggs', 'sulphites', 'milk']],
                ['Ovos Rotos Batata Doce Presunto', '', '9,50€', ['eggs', 'sulphites']],
                ['Ovos Rotos à Taberna', 'c/ Presunto, Azeitona Preta e Queijo Mozzarella', '10,00€', ['eggs', 'sulphites', 'milk', 'gluten']],
                ['Ovos Rotos de Farinheira', 'c/ Chips de Batata, Cogumelos e Espinafres', '12,50€', ['eggs', 'gluten', 'milk', 'sulphites', 'celery']],
                ['Ovos Rotos de Bacalhau', 'c/ Chips de Batata, Azeitona Preta, Cebola e Salsa', '15,50€', ['eggs', 'fish', 'gluten']],
                ['Ovos Rotos de Alheira', 'c/ Chips de Batata, Bacon, Cogumelos e Queijo Mozzarella', '14,00€', ['eggs', 'gluten', 'milk']],
                ['Ovos Rotos de Camarão e Bacon', 'c/ Chips de Batata, Miolo de Camarão à Guilho e Bacon', '19,00€', ['eggs', 'crustaceans', 'sulphites', 'milk', 'gluten']],
                ['Ovos Caóticos com Chouriço', 'c/ Ovos mexidos, Batata Frita, Cogumelos, Cebola e Queijo Mozzarella', '10,00€', ['eggs', 'milk', 'sulphites', 'celery']],
                ['Ovos Caóticos com Bacon ou Presunto', 'c/ Ovos mexidos, Batata Frita, Cogumelos, Cebola e Queijo Mozzarella', '10,50€', ['eggs', 'milk', 'sulphites']],
            ]],
            ['Ao Natural', [
                ['Tabuinha de Queijo', '', '5,00€', ['milk']],
                ['Tabuinha de Presunto', '', '4,50€', ['sulphites']],
                ['Banquinho 4 Queijos e Marmelada', '', '12,00€', ['milk']],
                ['Banquinho Fumado', '', '11,00€', ['milk']],
                ['Banquinho com Queijo e Enchido', '', '11,50€', ['milk', 'sulphites']],
            ]],
            ['Nem Carne Nem Peixe', [
                ['Ovos Rotos Vegetarianos', 'c/ Cogumelos, Feijão Vermelho, Broa e Couve', '12,50€', ['eggs', 'gluten']],
                ['Da Horta ao Tacho', 'c/ Cebola, Pimentos, Grão, Cogumelos, Espinafres, Tomate, Batata Doce e Ovo Cozido', '14,00€', ['eggs', 'sulphites']],
            ]],
            ['Para Acompanhar', [
                ['Arroz', '', '3,00€', []],
                ['Açorda', '', '3,00€', ['gluten', 'milk']],
                ['Salada Simples (Tomate ou Alface)', '', '4,20€', []],
                ['Salada Mista Tomate e Alface', '', '4,80€', []],
                ['Salada à Pátio', '', '6,00€', []],
                ['Pimentos Salteados', '', '4,80€', []],
                ['Pimentos Padron Grelhados', '', '8,50€', []],
                ['Couve com Broa', '', '4,50€', ['gluten']],
                ['Migas de Couve Rústica', '', '5,20€', ['gluten']],
                ['Cogumelos Salteados', '', '4,75€', []],
                ['Cogumelos à Bulhão Pato', 'c/ Ovo e Espinafres', '6,50€', ['eggs', 'sulphites']],
                ['Feijão Preto', '', '4,50€', ['celery', 'sulphites']],
                ['Legumes Salteados', '', '4,50€', ['milk']],
                ['Chips Batata Doce', '', '5,50€', []],
                ['Chips de Batata', '', '4,20€', []],
                ['Batata Frita', '', '4,20€', []],
                ['Esparregado', '', '4,50€', ['milk', 'sulphites']],
                ['Tempura de Legumes', '', '5,40€', ['gluten', 'eggs', 'soy']],
            ]],
            ['Do Mar ao Prato', [
                ['Filetes de Pescada', 'c/ Arroz de Tomate ou Salada Russa', '13,50€', ['fish', 'gluten', 'eggs']],
                ['Bacalhau à Taberna', 'Posta de Bacalhau frita c/ Cebolada, Batata à Racha e Ovo Cozido', '17,50€', ['fish', 'eggs', 'gluten']],
                ['Bacalhau Lascado com Broa', 'c/ Batata à Racha, Couve e Azeite de Alho', '17,00€', ['fish', 'gluten']],
                ['Polvo à Lagareiro', 'c/ Batata a Murro, Couve Salteada e Azeite de Alho', '21,00€', ['molluscs']],
                ['Polvo Frito com Migas', 'c/ Migas de Couve Rústica e Batata Frita', '21,00€', ['molluscs', 'gluten']],
                ['Choco Frito', 'c/ Arroz de Tomate e Batata Frita', '15,00€', ['molluscs', 'gluten']],
                ['Arroz de Marisco (Mín. 2 Pessoas)', '', '18,00€ p/p', ['crustaceans', 'molluscs', 'sulphites']],
                ['Feijoada de Marisco (Mín. 2 Pessoas)', '', '18,00€ p/p', ['crustaceans', 'molluscs', 'sulphites']],
            ]],
            ['Cortes de Carne', [
                ['Bitoque de Porco', 'Febras de Porco c/ Ovo Estrelado, Arroz e Batata Frita', '11,00€', ['eggs', 'sulphites', 'celery']],
                ['Bitoque de Vitela', 'Prego de Vitela c/ Ovo Estrelado, Arroz e Batata Frita', '14,50€', ['eggs', 'sulphites', 'celery']],
                ['Secretos de Porco Preto', 'c/ Arroz de Feijão, Batata Frita e Pimentos Padron', '16,50€', ['celery', 'sulphites']],
                ['Plumas de Porco Preto', 'c/ Migas de Couve, Batata Frita e Pimentos Padron', '17,50€', ['gluten']],
                ['Costeletão de Vitela (Aprox. 600gr)', 'c/ Batata à Racha, Arroz e Legumes Salteados', '24,00€', ['milk']],
                ['Naco de Vitela na Grelha', 'c/ Batata Frita, Arroz e Pimentos Salteados', '18,50€', []],
                ['Naco de Vitela com Molho de Três Pimentas', 'c/ Batata Frita e Arroz', '20,00€', ['milk', 'sulphites', 'celery']],
                ['Naco de Vitela com Molho de Cogumelos', 'c/ Batata Frita e Arroz', '20,00€', ['milk', 'sulphites', 'celery']],
                ['Costeletas de Borrego Grelhadas', 'c/ Batata Frita, Arroz e Legumes Salteados', '18,50€', ['milk']],
            ]],
            ['No Tacho e Forno', [
                ['Arroz de Pato à Antiga', 'Tostado no forno c/ Chouriço e Bacon', '15,00€', ['milk', 'sulphites', 'celery']],
                ['Arroz de Lingueirão (Mín. 2 Pessoas)', '', '17,50€ p/p', ['molluscs', 'sulphites']],
                ['Arroz de Polvo (Mín. 2 Pessoas)', '', '18,50€ p/p', ['molluscs', 'sulphites']],
                ['Arroz de Tamboril c/ Camarão (Mín. 2 Pessoas)', '', '19,50€ p/p', ['fish', 'crustaceans', 'sulphites']],
                ['Massada de Peixe c/ Camarão (Mín. 2 Pessoas)', '', '18,00€ p/p', ['fish', 'crustaceans', 'gluten', 'sulphites']],
                ['Massada de Polvo e Camarão (Mín. 2 Pessoas)', '', '19,50€ p/p', ['molluscs', 'crustaceans', 'gluten', 'sulphites']],
                ['Tomatada de Peixe c/ Ovos Escalfados (Mín. 2 Pessoas)', '', '18,00€ p/p', ['fish', 'eggs', 'sulphites']],
            ]],
            ['Menu Infantil', [
                ['Douradinhos de Pescada', 'c/ Arroz e Batata Frita', '7,50€', ['fish', 'gluten']],
                ['Nuggets de Frango', 'c/ Arroz e Batata Frita', '7,50€', ['gluten', 'soy', 'milk']],
                ['Salsicha com Ovo', 'c/ Arroz e Batata Frita', '7,50€', ['eggs', 'soy', 'milk']],
            ]],
            ['Saladas', [
                ['Salada de Atum', 'Alface, Tomate, Cenoura, Milho, Ovo Cozido, Atum, Cebola e Azeitonas', '12,50€', ['fish', 'eggs']],
                ['Salada de Frango Crisp', 'Alface, Tomate, Cenoura, Milho, Frango Panado, Queijo Parmesão e Molho de Iogurte', '14,00€', ['gluten', 'milk', 'eggs', 'mustard']],
                ['Salada de Camarão', 'Alface, Tomate, Cenoura, Milho, Abacaxi, Miolo de Camarão e Molho Cocktail', '16,50€', ['crustaceans', 'eggs', 'mustard', 'sulphites']],
                ['Salada de Queijo de Cabra', 'Alface, Rúcula, Tomate Seco, Nozes, Queijo de Cabra e Molho de Mel e Mostarda', '15,00€', ['milk', 'nuts', 'mustard', 'sulphites']],
            ]],
        ];
    }
}
