<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meals', function (Blueprint $table) {
            $table->id();

            $table->foreignId('week_id')
                ->constrained('weeks')
                ->cascadeOnDelete();

            $table->string('day_of_week', 20);

            $table->date('date');

            $table->text('main_dish');

            $table->string('salad')->nullable();

            $table->string('fruit')->nullable();

            $table->timestamps();

            $table->unique('date');
            $table->index('week_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meals');
    }
};