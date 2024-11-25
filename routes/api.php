<?php

use App\Http\Controllers\AttendeeController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:api')->group(function () {

    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
    });

    Route::prefix('events')->group(function () {
        Route::get('/', [EventController::class, 'index']);
        Route::delete('/update/{id}', [EventController::class, 'update']);
        Route::delete('/destroy/{id}', [EventController::class, 'destroy']);
    });
    
    Route::prefix('attendees')->group(function () {
        Route::get('/', [AttendeeController::class, 'index']);
    });
});