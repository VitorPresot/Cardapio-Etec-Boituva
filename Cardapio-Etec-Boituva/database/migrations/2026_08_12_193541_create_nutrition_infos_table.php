<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nutrition_infos', function (Blueprint $table) {
            $table->id();

            $table->foreignId('week_id')
                ->constrained('weeks')
                ->cascadeOnDelete();

            $table->decimal('energy_kcal', 8, 2);
            $table->decimal('carbohydrates_g', 8, 2);
            $table->decimal('carbohydrates_vet_percent', 5, 2);

            $table->decimal('proteins_g', 8, 2);
            $table->decimal('proteins_vet_percent', 5, 2);

            $table->decimal('lipids_g', 8, 2);
            $table->decimal('lipids_vet_percent', 5, 2);

            $table->timestamps();

            $table->unique('week_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nutrition_infos');
    }
};