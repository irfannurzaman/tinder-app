<?php

use App\Http\Controllers\PeopleController;
use Illuminate\Support\Facades\Route;

Route::prefix('people')->group(function () {
    Route::get('/', [PeopleController::class, 'index']);
    Route::post('/{id}/like', [PeopleController::class, 'like']);
    Route::post('/{id}/dislike', [PeopleController::class, 'dislike']);
    Route::get('/liked', [PeopleController::class, 'liked']);
});



