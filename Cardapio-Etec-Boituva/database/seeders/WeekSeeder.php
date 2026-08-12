<?php

namespace Database\Seeders;

use App\Models\Meal;
use App\Models\NutritionInfo;
use App\Models\Week;
use Illuminate\Database\Seeder;

class WeekSeeder extends Seeder
{
    public function run(): void
    {
        $week1 = Week::create([
            'week_number' => 1,
            'start_date' => '2026-08-03',
            'end_date' => '2026-08-07',
        ]);

        $week1->meals()->createMany([
            [
                'day_of_week' => '2ª feira',
                'date' => '2026-08-03',
                'main_dish' => 'Arroz, feijão, carne moída c/ mandioquinha e chuchu.',
                'salad' => 'repolho bicolor',
                'fruit' => 'melão',
            ],
            [
                'day_of_week' => '3ª feira',
                'date' => '2026-08-04',
                'main_dish' => 'Arroz, feijão, lombo c/ batata.',
                'salad' => 'acelga',
                'fruit' => 'maçã',
            ],
            [
                'day_of_week' => '4ª feira',
                'date' => '2026-08-05',
                'main_dish' => 'Arroz com frango, feijão.',
                'salad' => 'beterraba',
                'fruit' => 'banana',
            ],
            [
                'day_of_week' => '5ª feira',
                'date' => '2026-08-06',
                'main_dish' => 'Arroz, feijão, cubos c/ abóbora.',
                'salad' => 'alface',
                'fruit' => 'abacaxi',
            ],
            [
                'day_of_week' => '6ª feira',
                'date' => '2026-08-07',
                'main_dish' => 'Macarrão c/ carne moída.',
                'salad' => 'tomate',
                'fruit' => 'melancia',
            ],
        ]);

        $week1->nutritionInfo()->create([
            'energy_kcal' => 335,
            'carbohydrates_g' => 50,
            'carbohydrates_vet_percent' => 62,
            'proteins_g' => 11,
            'proteins_vet_percent' => 13,
            'lipids_g' => 11,
            'lipids_vet_percent' => 22,
        ]);

        $week2 = Week::create([
            'week_number' => 2,
            'start_date' => '2026-08-10',
            'end_date' => '2026-08-14',
        ]);

        $week2->meals()->createMany([
            [
                'day_of_week' => '2ª feira',
                'date' => '2026-08-10',
                'main_dish' => 'Arroz, estrogonofe de frango, batata palha.',
                'salad' => null,
                'fruit' => 'abacaxi',
            ],
            [
                'day_of_week' => '3ª feira',
                'date' => '2026-08-11',
                'main_dish' => 'Arroz, feijão, carne moída c/ mandioquinha e chuchu.',
                'salad' => 'repolho colorido',
                'fruit' => 'maçã',
            ],
            [
                'day_of_week' => '4ª feira',
                'date' => '2026-08-12',
                'main_dish' => 'Arroz, feijão, cubos c/ mandioca.',
                'salad' => 'alface',
                'fruit' => 'banana',
            ],
            [
                'day_of_week' => '5ª feira',
                'date' => '2026-08-13',
                'main_dish' => 'Arroz, feijão, lombo c/ batata doce.',
                'salad' => 'couve',
                'fruit' => 'melão',
            ],
            [
                'day_of_week' => '6ª feira',
                'date' => '2026-08-14',
                'main_dish' => 'Macarrão c/ carne moída.',
                'salad' => 'acelga',
                'fruit' => 'melancia',
            ],
        ]);

        $week2->nutritionInfo()->create([
            'energy_kcal' => 329,
            'carbohydrates_g' => 47,
            'carbohydrates_vet_percent' => 59,
            'proteins_g' => 10,
            'proteins_vet_percent' => 12,
            'lipids_g' => 11,
            'lipids_vet_percent' => 22,
        ]);
    }
}