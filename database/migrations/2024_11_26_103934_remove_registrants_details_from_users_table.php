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
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('id');
            $table->id();
            $table->dropColumn('title');
            $table->dropColumn('gender');
            $table->dropColumn('company');
            $table->dropColumn('company_address');
            $table->dropColumn('position');
            $table->dropColumn('affiliation');
            $table->dropColumn('contact_number');
            $table->dropColumn('score');
            $table->dropColumn('is_agree_privacy');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('id');
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('gender');
            $table->string('company')->nullable();
            $table->string('company_address')->nullable();
            $table->string('position')->nullable();
            $table->string('affiliation')->nullable();
            $table->string('contact_number');
            $table->integer('score')->nullable();
            $table->boolean('is_agree_privacy')->default(false);
        });
    }
};


