<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('google_reviews', function (Blueprint $table) {
            // ID atribuído pela Google Places API (ex.: "places/…/reviews/…")
            $table->string('id', 300)->primary();
            $table->string('author_name')->default('Anónimo');
            $table->unsignedTinyInteger('rating')->default(5);
            $table->text('text');
            $table->string('relative_time_description')->default('');
            $table->string('profile_photo_url', 500)->default('');
            $table->timestamp('publish_time')->nullable();
            $table->boolean('visible')->default(true);
            $table->timestamp('fetched_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('google_reviews');
    }
};
