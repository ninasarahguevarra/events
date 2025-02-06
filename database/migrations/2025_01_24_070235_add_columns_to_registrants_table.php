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
            $table->string('first_name')->after('title')->nullable();
            $table->string('last_name')->after('first_name')->nullable();
            $table->string('preferred_name')->after('name')->nullable()->comment('for name tag');
            $table->string('social_classification')->after('gender')->nullable();
            $table->string('province')->after('social_classification')->nullable();
            $table->string('municipality')->after('province')->nullable();
            $table->string('sector')->after('affiliation')->nullable();
            $table->string('industry')->after('sector')->nullable();
            $table->string('ict_council_name')->after('industry')->nullable();
            $table->boolean('is_ict_interested')->after('ict_council_name')->nullable();
            $table->boolean('is_ict_member')->after('is_ict_interested')->nullable();
            $table->string('attendance_qualification')->after('is_ict_member')->nullable();
            $table->uuid('registration_type_id')->after('attendance_qualification')->nullable();
            $table->string('shirt_size')->after('registration_type_id')->nullable();
            $table->string('social_media')->after('shirt_size')->nullable()->comment('for NICP Contakt Card');
            $table->string('website')->after('social_media')->nullable();
            $table->boolean('agree_to_be_contacted')->after('is_agree_privacy')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('registrants', function (Blueprint $table) {
            $table->dropColumn('first_name');
            $table->dropColumn('last_name');
            $table->dropColumn('preferred_name');
            $table->dropColumn('social_classification');
            $table->dropColumn('province');
            $table->dropColumn('municipality');
            $table->dropColumn('sector');
            $table->dropColumn('industry');
            $table->dropColumn('ict_council_name');
            $table->dropColumn('is_ict_interested');
            $table->dropColumn('is_ict_member');
            $table->dropColumn('attendance_qualification');
            $table->dropColumn('registration_type_id');
            $table->dropColumn('shirt_size');
            $table->dropColumn('social_media');
            $table->dropColumn('website');
            $table->dropColumn('agree_to_be_contacted');
        });
    }
};
