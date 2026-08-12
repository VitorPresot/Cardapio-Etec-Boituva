<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Meal extends Model
{
    protected $fillable = [
        'week_id',
        'day_of_week',
        'date',
        'main_dish',
        'salad',
        'fruit',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function week(): BelongsTo
    {
        return $this->belongsTo(Week::class);
    }
}