<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('public/Welcome', [
        'appName' => config('app.name', 'Laravel'),
    ]);
});

Route::get('/login', function () {
    return Inertia::render('public/Login');
})->name('login');

Route::get('/dashboard', function () {
    return Inertia::render('admin/dashboard/index', [
        'appName' => config('app.name', 'Laravel'),
    ]);
});
