<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Chave secreta por local (restaurante/esplanada) que dá acesso à carta de vinhos
        Schema::create('qr_settings', function (Blueprint $table) {
            $table->string('location', 20)->primary();
            $table->string('secret_key', 64)->index();
            $table->unsignedInteger('duration_minutes')->default(120);
            $table->timestamps();
        });

        Schema::create('qr_readings', function (Blueprint $table) {
            $table->id();
            $table->string('location', 20)->default('restaurante');
            $table->timestamp('created_at')->useCurrent();
            $table->index(['location', 'created_at']);
        });

        // Visitas à página da ementa (uma por sessão)
        Schema::create('ementa_readings', function (Blueprint $table) {
            $table->id();
            $table->timestamp('created_at')->useCurrent()->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ementa_readings');
        Schema::dropIfExists('qr_readings');
        Schema::dropIfExists('qr_settings');
    }
};
