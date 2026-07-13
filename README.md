# Manjar do Ramos · Site

Site e backoffice do restaurante **Manjar do Ramos**, construído em **Laravel 13 + Livewire 3 + MySQL + Tailwind CSS 4**.

> Reescrita completa do site anterior (React/TanStack Start + Supabase) para a stack Laravel.

## Funcionalidades

**Site público**
- Homepage com blocos editáveis (hero, conceito, especialidades, espaço, testemunhos, reservas)
- Ementa completa com categorias, alergénios e navegação scrollspy (regista estatísticas de visitas)
- Carta de vinhos protegida por QR code com chave secreta e acesso temporário
- Carta de vinhos em modo tablet (vitrine com PIN, para uso no restaurante)
- Página de catering
- Encomendas online com carrinho (sessão), checkout e histórico de encomendas
- Login/registo de clientes
- Modo de manutenção gerido no backoffice

**Backoffice** (`/admin`)
- Restaurante: dados, contactos, horários, redes sociais, logo, Google Maps
- Navegação & Site: menu de navegação, blocos da homepage, preços take-away, modo de manutenção
- Páginas: SEO e conteúdos de Início, Ementa e Catering
- Ementa: categorias, pratos, preços, alergénios, disponibilidade (delivery/take-away/restaurante)
- Carta de Vinhos: categorias e vinhos, com imagens
- Leituras QR: estatísticas de acessos, QR codes para download, regeneração de chaves e duração dos tokens
- Encomendas: gestão de estado (pendente → em preparação → pronto → entregue)
- Testemunhos e Google Reviews (sincronização via Places API)
- Conteúdo & Imagens: textos e imagens de todos os blocos, com upload

## Requisitos

- PHP ≥ 8.2 (com `intl`, `pdo_mysql`)
- Composer
- MySQL ≥ 8.0
- Node.js ≥ 20

## Instalação

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Configure a base de dados MySQL no `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=manjar_do_ramos
DB_USERNAME=root
DB_PASSWORD=...
```

Defina também a conta de administrador (usada pelo seeder):

```env
ADMIN_EMAIL=admin@manjardoramos.pt
ADMIN_PASSWORD=escolha-uma-password-forte
```

Depois:

```bash
php artisan migrate --seed   # cria o esquema + conteúdo inicial (ementa completa, vinhos, textos)
php artisan storage:link     # necessário para uploads de imagens no backoffice
npm install && npm run build # compila CSS/JS
php artisan serve
```

O backoffice fica em `/admin` com a conta definida no `.env`.
Se `ADMIN_PASSWORD` não estiver definido, o seeder gera uma password aleatória e mostra-a no terminal.

## Configuração opcional

| Variável | Descrição |
| --- | --- |
| `GOOGLE_PLACES_API_KEY` | Chave da Google Places API para sincronizar reviews no backoffice |
| `WINE_TABLET_PIN` | PIN da carta de vinhos em modo tablet (predefinição: `2929`) |

## Testes

```bash
php artisan test
```

## Notas de arquitetura

- **Conteúdo estruturado** (ementa, vinhos, testemunhos, encomendas) vive em tabelas relacionais.
- **Conteúdo CMS livre** (textos/imagens de blocos e páginas) vive em `site_contents`/`site_settings` como JSON, editável no backoffice.
- O carrinho de encomendas é guardado na **sessão** do servidor.
- O acesso à carta de vinhos troca a chave do QR (`?key=…`) por um acesso temporário em sessão, registando a leitura para estatísticas.
- Os QR codes são gerados em PHP (SVG, sem dependências de sistema) via `bacon/bacon-qr-code`.
