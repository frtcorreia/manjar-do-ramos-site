<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->blocks() as $block) {
            SiteContent::firstOrCreate(['key' => 'block_'.$block['key']], ['value' => $block]);
        }

        foreach ($this->pages() as $page) {
            SiteContent::firstOrCreate(['key' => 'page_'.$page['key']], ['value' => $page]);
        }
    }

    protected function field(string $label, string $value, bool $multiline = false): array
    {
        $field = ['id' => Str::random(8), 'label' => $label, 'value' => $value];
        if ($multiline) {
            $field['multiline'] = true;
        }

        return $field;
    }

    protected function image(string $label, string $url, ?string $title = null, ?string $description = null): array
    {
        $image = ['id' => Str::random(8), 'label' => $label, 'url' => $url];
        if ($title !== null) {
            $image['title'] = $title;
        }
        if ($description !== null) {
            $image['description'] = $description;
        }

        return $image;
    }

    protected function blocks(): array
    {
        return [
            [
                'key' => 'hero',
                'label' => 'Hero',
                'fields' => [
                    $this->field('Etiqueta', 'Taberna Moderna Portuguesa'),
                    $this->field('Título', 'Manjar do Ramos', true),
                    $this->field('Subtítulo', 'Comida de alma, mesa cheia e o calor de uma taberna portuguesa contemporânea.', true),
                    $this->field('Botão principal', 'Reservar Mesa'),
                    $this->field('Botão secundário', 'Ver Ementa'),
                ],
                'images' => [$this->image('Imagem de fundo', '/images/hero.jpg')],
            ],
            [
                'key' => 'about',
                'label' => 'Conceito',
                'fields' => [
                    $this->field('Etiqueta', 'O Nosso Conceito'),
                    $this->field('Título', 'Uma taberna com alma portuguesa', true),
                    $this->field('Parágrafo 1', 'Nascemos do desejo de juntar pessoas à volta de boa comida.', true),
                    $this->field('Parágrafo 2', 'Sabores tradicionais reinterpretados, num ambiente rústico e acolhedor.', true),
                    $this->field('Etiqueta 2', 'Abundância'),
                    $this->field('Título 2', 'Pratos generosos, pensados para partilhar', true),
                    $this->field('Parágrafo 3', 'Produtos honestos, fogo lento e receitas que atravessam gerações. Das carnes maturadas ao bacalhau, das tábuas aos petiscos — tudo chega à mesa para ser dividido, provado e celebrado.', true),
                    $this->field('Stat 1 Valor', '+40'),
                    $this->field('Stat 1 Label', 'Petiscos & pratos'),
                    $this->field('Stat 2 Valor', '120'),
                    $this->field('Stat 2 Label', 'Referências de vinho'),
                ],
                'images' => [
                    $this->image('Imagem 1', '/images/about-1.jpg'),
                    $this->image('Imagem 2', '/images/about-2.jpg'),
                ],
            ],
            [
                'key' => 'specialties',
                'label' => 'Especialidades',
                'fields' => [
                    $this->field('Etiqueta', 'Especialidades da Casa'),
                    $this->field('Título', 'Cada prato, uma razão para voltar', true),
                ],
                'images' => [
                    $this->image('Prato 1', '/images/dish-carne.jpg', 'Carnes Maturadas', 'Cortes nobres na brasa, crosta estaladiça e o ponto certo de sal grosso.'),
                    $this->image('Prato 2', '/images/dish-bacalhau.jpg', 'Bacalhau à Lagareiro', 'Lombo alourado, batata a murro e o azeite a perfumar a mesa.'),
                    $this->image('Prato 3', '/images/dish-petiscos.jpg', 'Petiscos Portugueses', 'Gambas, chouriço e croquetes — para começar e nunca mais parar.'),
                    $this->image('Prato 4', '/images/dish-tabua.jpg', 'Tábuas de Partilha', 'Enchidos, queijos regionais e mel, servidos para toda a mesa.'),
                    $this->image('Prato 5', '/images/dish-sobremesa.jpg', 'Sobremesas de Sempre', 'Doçaria tradicional reinterpretada, com canela e açúcar caramelizado.'),
                    $this->image('Prato 6', '/images/dish-cocktails.jpg', 'Cocktails & Sangrias', 'Sangrias de fruta e criações de autor para acompanhar a noite.'),
                ],
            ],
            [
                'key' => 'gallery',
                'label' => 'Espaço',
                'fields' => [
                    $this->field('Etiqueta', 'A Experiência do Espaço'),
                    $this->field('Título', 'Madeira, luz quente e mesas cheias', true),
                    $this->field('Subtítulo', 'Um ambiente rústico e contemporâneo, onde cada detalhe convida a ficar.', true),
                ],
                'images' => [
                    $this->image('Imagem 1', '/images/gallery-1.jpg'),
                    $this->image('Imagem 2', '/images/gallery-2.jpg'),
                    $this->image('Imagem 3', '/images/gallery-3.jpg'),
                    $this->image('Imagem 4', '/images/gallery-4.jpg'),
                ],
            ],
            [
                'key' => 'testimonials',
                'label' => 'Testemunhos',
                'fields' => [
                    $this->field('Etiqueta', 'Quem Já Se Sentou À Mesa'),
                    $this->field('Título', 'Histórias que se contam ao jantar', true),
                ],
                'images' => [],
            ],
            [
                'key' => 'reservation',
                'label' => 'Reservas',
                'fields' => [
                    $this->field('Etiqueta', 'Reserve a Sua Mesa'),
                    $this->field('Título', 'Venha sentar-se à nossa mesa', true),
                    $this->field('Subtítulo', 'Reserve já e garanta o seu lugar numa noite memorável.', true),
                    $this->field('Telefone', '+351 210 000 000'),
                    $this->field('Label Telefone', 'Chamada para a rede móvel nacional'),
                ],
                'images' => [],
            ],
        ];
    }

    protected function pages(): array
    {
        return [
            [
                'key' => 'index',
                'label' => 'Início',
                'fields' => [
                    $this->field('Título (SEO)', 'Manjar do Ramos · Taberna Moderna Portuguesa em Lisboa'),
                    $this->field('Descrição (SEO)', 'Sabores portugueses com alma de taberna. Carnes maturadas, petiscos e tábuas de partilha num ambiente acolhedor. Reserve a sua mesa.', true),
                    $this->field('OG Título', 'Manjar do Ramos · Taberna Moderna Portuguesa'),
                    $this->field('OG Descrição', 'Uma experiência gastronómica feita para partilhar, saborear e voltar. Reserve a sua mesa no Manjar do Ramos.', true),
                ],
                'images' => [],
            ],
            [
                'key' => 'ementa',
                'label' => 'Ementa',
                'fields' => [
                    $this->field('Título (SEO)', 'Ementa · Manjar do Ramos · Taberna Moderna Portuguesa'),
                    $this->field('Descrição (SEO)', 'Descubra a ementa do Manjar do Ramos: petiscos, carnes maturadas, bacalhau, tábuas de partilha, sobremesas e cocktails. Sabores portugueses para partilhar.', true),
                    $this->field('OG Título', 'Ementa · Manjar do Ramos'),
                    $this->field('OG Descrição', 'Petiscos, carnes maturadas, bacalhau e tábuas de partilha numa taberna portuguesa contemporânea.', true),
                    $this->field('Hero — Etiqueta', 'Ementa da Casa'),
                    $this->field('Hero — Título', 'A nossa ementa', true),
                    $this->field('Hero — Subtítulo', 'Sabores portugueses pensados para partilhar à volta da mesa.', true),
                ],
                'images' => [$this->image('Hero — Imagem de fundo', '/images/dish-carne.jpg')],
            ],
            [
                'key' => 'catering',
                'label' => 'Catering',
                'fields' => [
                    $this->field('Título (SEO)', 'Catering · Manjar do Ramos · Eventos & Celebrações'),
                    $this->field('Descrição (SEO)', 'Serviço de catering do Manjar do Ramos para casamentos, eventos de empresa e festas privadas. Sabores portugueses de taberna levados até si.', true),
                    $this->field('OG Título', 'Catering · Manjar do Ramos'),
                    $this->field('OG Descrição', 'Leve a alma da taberna ao seu evento: petiscos, tábuas, carnes na brasa e doçaria portuguesa.', true),
                    $this->field('Hero — Etiqueta', 'Catering & Eventos'),
                    $this->field('Hero — Título', 'A taberna vai até si', true),
                    $this->field('Hero — Subtítulo', 'Levamos a abundância, o convívio e os sabores do Manjar do Ramos ao seu evento.', true),
                    $this->field('Hero — Botão', 'Pedir Orçamento'),
                    $this->field('Intro — Etiqueta', 'O Nosso Catering'),
                    $this->field('Intro — Título', 'Mesas que reúnem, sabores que ficam', true),
                    $this->field('Intro — Parágrafo 1', 'Quer seja um jantar íntimo ou uma grande celebração, levamos a alma da taberna portuguesa onde quiser. Petiscos generosos, carnes na brasa, tábuas de partilha e doçaria de sempre — servidos com o calor e o cuidado que nos definem.', true),
                    $this->field('Intro — Parágrafo 2', 'Cada evento é único, por isso desenhamos cada ementa a pensar em si e nos seus convidados.', true),
                    $this->field('Serviços — Etiqueta', 'O Que Oferecemos'),
                    $this->field('Serviços — Título', 'Um serviço pensado ao detalhe', true),
                    $this->field('Como Funciona — Etiqueta', 'Como Funciona'),
                    $this->field('Como Funciona — Título', 'Simples, do primeiro contacto ao brinde', true),
                    $this->field('CTA — Título', 'Vamos planear o seu evento', true),
                    $this->field('CTA — Subtítulo', 'Conte-nos os detalhes e enviamos-lhe uma proposta à medida. Resposta em até 48 horas.', true),
                    $this->field('CTA — Email', 'eventos@manjardoramos.pt'),
                    $this->field('CTA — Telefone', '+351 210 000 000'),
                ],
                'images' => [
                    $this->image('Hero — Imagem de fundo', '/images/dish-tabua.jpg'),
                    $this->image('Intro — Imagem', '/images/about-2.jpg'),
                ],
            ],
        ];
    }
}
