<?php

use App\Http\Controllers\AttendeeController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\RegistrantController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

Route::prefix('registrants')->group(function () {
    Route::post('/save', [RegistrantController::class, 'saveRegistrant']);
    Route::post('/upload/{eventId}', [RegistrantController::class, 'uploadBulkRegistration']);
});

//mobile app scanning
Route::prefix('events')->group(function () {
    Route::post('/set-attendee', [EventController::class, 'setEventAttendees']);
    Route::get('/show/{id}', [EventController::class, 'showEvent']);
});

//mobile app fetching
Route::get('/event-attendees', [RegistrantController::class, 'attendees']);

Route::middleware('auth:api')->group(function () {
    Route::prefix('users')->group(function () {
        Route::post('/logout', [UserController::class, 'logout']);
        Route::get('/info', [UserController::class, 'userInfo']);
    });
        
    Route::prefix('registrants')->group(function () {
        Route::get('/', [RegistrantController::class, 'index']);
        Route::get('/by-gender', [RegistrantController::class, 'fetchRegistrantByGender']);
    });
    
    Route::prefix('events')->group(function () {
        Route::get('/', [EventController::class, 'index']);
        Route::post('/save', [EventController::class, 'saveEvent']);
        Route::post('/update/{id}', [EventController::class, 'updateEvent']);
        // Route::get('/show/{id}', [EventController::class, 'showEvent']);
        Route::delete('/destroy/{id}', [EventController::class, 'destroy']);
        Route::get('/current-event', [EventController::class, 'showCurrentEvent']);
        Route::get('/show-top-companies', [EventController::class, 'showTopCompanies']);
        Route::get('/download-csv', [EventController::class, 'downloadCsvTemplate']);
    });
    
    Route::prefix('attendees')->group(function () {
        Route::get('/', [AttendeeController::class, 'index']);
    });
});