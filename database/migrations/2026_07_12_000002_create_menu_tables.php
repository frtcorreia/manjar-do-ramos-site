<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_category_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('description', 500)->default('');
            // Preço em texto livre, tal como aparece na ementa (ex.: "18,00€ p/p")
            $table->string('price', 30)->default('');
            $table->string('image', 500)->default('');
            $table->boolean('delivery')->default(true);
            $table->boolean('takeaway')->default(true);
            $table->boolean('restaurant')->default(true);
            $table->boolean('visible')->default(true);
            $table->json('allergens');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_items');
        Schema::dropIfExists('menu_categories');
    }
};
