<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Map\PointController;

// Route::middleware('auth')->group(function () {
    Route::get('/', [PointController::class, 'index']);
    Route::post('/points', [PointController::class, 'store']);
    Route::put('/points/{point}', [PointController::class, 'update']);
    Route::delete('/points/{point}', [PointController::class, 'delete']);
// });