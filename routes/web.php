<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PointController;

Route::get('/', function () {
    return Inertia::render('Map/GoogleMapComponent', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'isAuthorized' => auth()->check(),
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Map/GoogleMapComponent', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'isAuthorized' => auth()->check(),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// Route::get('/points', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Route::middleware('auth')->group(function () {
//     Route::post('/points', [PointController::class, 'store']);
//     Route::put('/points/{point}', [PointController::class, 'update']);
// });

require __DIR__.'/auth.php';
