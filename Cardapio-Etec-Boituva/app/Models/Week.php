<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Week extends Model
{
    protected $fillable = [
        'week_number',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function meals(): HasMany
    {
        return $this->hasMany(Meal::class);
    }

    public function nutritionInfo(): HasOne
    {
        return $this->hasOne(NutritionInfo::class);
    }
}