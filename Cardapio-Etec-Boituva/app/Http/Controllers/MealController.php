<?php

namespace App\Http\Controllers;

use App\Models\Week;

class MealController extends Controller
{
    public function index()
    {
        $weeks = Week::with([
            'meals',
            'nutritionInfo'
        ])
        ->orderBy('week_number')
        ->get();

        return view('meals.index', compact('weeks'));
    }
}