<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('public/Welcome', [
        'appName' => config('app.name', 'Laravel'),
    ]);
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->prefix('admin')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard/index', [
            'appName' => config('app.name', 'Laravel'),
        ]);
    })->name('dashboard');

    Route::get('/examples/components', function () {
        return Inertia::render('admin/examples/ComponentShowcase');
    })->name('examples.components');

    Route::get('/examples/async-options', function () {
        $search = strtolower((string) request('search', ''));

        $items = collect([
            ['id' => 1, 'name' => 'John Doe', 'role' => 'Admin'],
            ['id' => 2, 'name' => 'Jane Smith', 'role' => 'Manager'],
            ['id' => 3, 'name' => 'Michael Johnson', 'role' => 'Editor'],
            ['id' => 4, 'name' => 'Sarah Wilson', 'role' => 'Staff'],
            ['id' => 5, 'name' => 'David Brown', 'role' => 'User'],
        ])->filter(function ($item) use ($search) {
            if ($search === '') {
                return true;
            }

            return str_contains(strtolower($item['name']), $search)
                || str_contains(strtolower($item['role']), $search);
        })->values();

        return response()->json($items);
    })->name('examples.async-options');

    Route::get('/examples/subscriptions', function () {
        return Inertia::render('admin/examples/SubscriptionTableExample');
    })->name('examples.subscriptions');
});
