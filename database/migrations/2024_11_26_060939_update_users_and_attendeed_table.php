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
            $table->uuid('id')->change();
            $table->string('email')->change();
            $table->string('company')->nullable()->change();
            $table->string('company_address')->nullable()->after('company');
            $table->dropColumn(['birthdate']);
            $table->string('position')->nullable()->after('company_address');
            $table->string('affiliation')->nullable()->after('position');
            $table->string('contact_number')->after('affiliation');
            $table->integer('score')->nullable()->after('contact_number');
            $table->boolean('is_agree_privacy')->after('score');
        });

        Schema::table('attendees', function (Blueprint $table) {
            $table->uuid('user_id')->constrained('users')->onDelete('cascade')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $$table->id();
            $table->string('email')->unique()->change();
            $table->string('company')->nullable(false)->change();
            $table->dropColumn(['company_address']);
            $table->string('birthdate');
            $table->dropColumn(['position']);
            $table->dropColumn(['affiliation']);
            $table->dropColumn(['contact_number']);
            $table->dropColumn(['score']);
            $table->dropColumn(['is_agree_privacy']);
        });

        Schema::table('attendees', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->change();
        });
    }
};
