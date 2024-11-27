<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AuthUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            'name' => "Event Admin",
            "email" => "info@qlsceventshub.com",
            "password" => "qlsceventshub"
        ];
        User::firstOrCreate(
            ['email' => $data['email']],
            $data
        );
    }
}
