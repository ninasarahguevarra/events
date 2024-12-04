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
            $table->dropForeign(['event_id']);
        
            $table->unsignedBigInteger('event_id')->nullable()->change();
        
            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('registrants', function (Blueprint $table) {
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');

        });
    }
};
