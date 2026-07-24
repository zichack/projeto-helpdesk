<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@helpdesk.com',
            'password' => Hash::make('senha123'),
        ]);

        User::create([
            'name' => 'Suporte Técnico',
            'email' => 'suporte@helpdesk.com',
            'password' => Hash::make('senha123'),
        ]);

        User::create([
            'name' => 'Carlos Silva',
            'email' => 'carlos@helpdesk.com',
            'password' => Hash::make('senha123'),
        ]);
    }
}