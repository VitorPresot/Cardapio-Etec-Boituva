<?php

use App\Http\Controllers\MealController;
use Illuminate\Support\Facades\Route;

Route::get('/', [MealController::class, 'index'])
    ->name('meals.index');