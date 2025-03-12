<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::controller(UserController::class)->prefix('users')->name('users.')->group(function () {
    Route::get('/', 'index')->name('index');
    Route::get('/get-list', 'get_users_list')->name('get_list');
    Route::get('/create', 'create')->name('create');
    Route::post('/store', 'store')->name('store');
});

Route::get('/test', function () {

    return inertia('tasks/tasks-table');
    dd('sdadsd');
})->name('test');
Route::get('projects/get-list', [ProjectController::class, 'get_projects_list'])->name('projects.get_list');
Route::resource('projects', ProjectController::class);
Route::resource('tasks', TaskController::class);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
