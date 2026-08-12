<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NutritionInfo extends Model
{
    protected $fillable = [
        'week_id',
        'energy_kcal',
        'carbohydrates_g',
        'carbohydrates_vet_percent',
        'proteins_g',
        'proteins_vet_percent',
        'lipids_g',
        'lipids_vet_percent',
    ];

    protected $casts = [
        'energy_kcal' => 'decimal:2',
        'carbohydrates_g' => 'decimal:2',
        'carbohydrates_vet_percent' => 'decimal:2',
        'proteins_g' => 'decimal:2',
        'proteins_vet_percent' => 'decimal:2',
        'lipids_g' => 'decimal:2',
        'lipids_vet_percent' => 'decimal:2',
    ];

    public function week(): BelongsTo
    {
        return $this->belongsTo(Week::class);
    }
}