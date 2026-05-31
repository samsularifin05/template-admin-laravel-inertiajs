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
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
        ->middleware(['request.signature', 'sql.injection.guard', 'xss.guard', 'throttle:5,1']);
});

Route::middleware('auth')->prefix('admin')->group(function () {

    // Upload endpoint (backend validation + audit)
    Route::post('/upload/image', [\App\Http\Controllers\UploadController::class, 'image'])
        ->middleware(['request.signature', 'sql.injection.guard', 'xss.guard', 'throttle:10,1'])
        ->name('upload.image');
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->middleware(['sql.injection.guard', 'xss.guard', 'throttle:20,1'])
        ->name('logout');

    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard/index', [
            'appName' => config('app.name', 'Laravel'),
        ]);
    })->name('dashboard');

    Route::get('/examples/components', function () {
        return Inertia::render('admin/examples/ComponentShowcase');
    })->name('examples.components');

    Route::middleware(['request.signature', 'sql.injection.guard', 'xss.guard', 'throttle:60,1'])->group(function () {
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
    });

    Route::get('/examples/subscriptions', function () {
        return Inertia::render('admin/examples/SubscriptionTableExample');
    })->name('examples.subscriptions');
});
