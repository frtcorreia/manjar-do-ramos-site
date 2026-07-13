<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wine_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('wines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wine_category_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('producer')->default('');
            $table->string('region', 100)->default('');
            $table->string('year', 10)->default('');
            $table->string('price', 30)->default('');
            $table->string('image', 500)->default('');
            $table->string('notes', 500)->default('');
            $table->boolean('visible')->default(true);
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wines');
        Schema::dropIfExists('wine_categories');
    }
};
