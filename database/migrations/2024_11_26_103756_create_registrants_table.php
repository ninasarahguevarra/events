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
        Schema::create('registrants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->string('title');
            $table->string('name');
            $table->string('email');
            $table->string('gender');
            $table->string('company')->nullable();
            $table->string('company_address')->nullable();
            $table->string('position')->nullable();
            $table->string('affiliation')->nullable();
            $table->string('contact_number');
            $table->integer('score')->nullable();
            $table->boolean('is_agree_privacy')->default(false);
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registrants');
    }
};
