<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Definições globais do site: restaurante, navPages, maintenance, blocks, menuPrices, wines_meta
        Schema::create('site_settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->json('value');
            $table->timestamps();
        });

        // Conteúdo editável de blocos da homepage e páginas (fields + images)
        Schema::create('site_contents', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->json('value');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_contents');
        Schema::dropIfExists('site_settings');
    }
};
