<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('registrants', function (Blueprint $table) {
            if (!Schema::hasColumn('registrants', 'printed')) {
                $table->boolean('printed')->default(false)->after('is_attended');
            }
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('registrants', function (Blueprint $table) {
            if (Schema::hasColumn('registrants', 'printed')) {
                $table->dropColumn('printed');
            }
        });
    }
};
