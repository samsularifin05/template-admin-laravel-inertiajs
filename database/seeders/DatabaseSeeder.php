<?php

namespace Database\Seeders;

use App\Models\User;
use App\Services\EncryptService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $encrypt = new EncryptService();
        User::factory()->create([
            'name' => 'Test User',
            'username' => 'testuser',
            'password' => bcrypt('password'),
            'email' => $encrypt->doEncrypt('test@example.com'),
            'no_hp' => $encrypt->doEncrypt('08123456789'),
            'role' => 'admin',
        ]);
    }
}
