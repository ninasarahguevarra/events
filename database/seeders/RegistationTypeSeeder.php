<?php

namespace Database\Seeders;

use App\Models\RegistrationType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RegistationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'description' => "Registration fee with 2 days of meals - ₱3,500.00"
            ],
            [
                'description' => "Registration fee with 2 days of meals and an event kit - ₱5,000.00 (The event kit includes a tote bag, T-shirt and NICP Contact Card (RFID Card for NICP Events)."
            ],
            [
                'description' => "Not applicable – For speakers, moderators, and guests only, or an NICP member. Note: Only one representative from each ICT council is free. Any additional participants (delegates) must pay the registration fee."
            ],
        ];

        foreach ($data as $item) {
            RegistrationType::firstOrCreate(
                ['description' => $item['description']],
                $item
            );
        }
    }
}
