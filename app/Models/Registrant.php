<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class Registrant extends Model
{
    use HasFactory;

    protected $table = 'registrants';
    protected $keyType = 'string';
    public $incrementing = false;
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    protected $fillable = [
        'event_id',
        'title',
        'first_name',
        'last_name',
        'name',
        'preferred_name',
        'email',
        'gender',
        'social_classification',
        'province',
        'municipality',
        'company',
        'company_address',
        'position',
        'affiliation',
        'sector',
        'industry',
        'ict_council_name',
        'is_ict_interested',
        'is_ict_member',
        'attendance_qualification',
        'registration_type_id',
        'shirt_size',
        'social_media',
        'website',
        'contact_number',
        'score',
        'is_agree_privacy',
        'agree_to_be_contacted',
        'is_attended',
        'is_csv_uploaded',
    ];

    protected function casts(): array
    {
        return [
            'event_id' => 'integer',
            'title' => 'string',
            'first_name' => 'string',
            'last_name' => 'string',
            'name' => 'string',
            'preferred_name' => 'string',
            'email' => 'string',
            'gender' => 'string',
            'company' => 'string',
            'company_address' => 'string',
            'position' => 'string',
            'affiliation' => 'string',
            'sector' => 'string',
            'industry' => 'string',
            'ict_council_name' => 'string',
            'is_ict_interested' => 'string',
            'is_ict_member' => 'string',
            'attendance_qualification' => 'string',
            'registration_type_id' => 'string',
            'shirt_size' => 'string',
            'social_media' => 'string',
            'website' => 'string',
            'contact_number' => 'string',
            'score' => 'integer',
            'is_agree_privacy' => 'boolean',
            'agree_to_be_contacted' => 'boolean',
            'is_attended' => 'boolean',
            'is_csv_uploaded' => 'boolean',
        ];
    }

    public static array $rules = [
        'event_id' => 'nullable|integer',
        'title' => 'nullable|string',
        'first_name' => 'nullable|string',
        'last_name' => 'nullable|string',
        'name' => 'required|string',
        'preferred_name' => 'nullable|string',
        'email' => 'nullable|string',
        'gender' => 'nullable|string',
        'company' => 'nullable|string',
        'company_address' => 'nullable|string',
        'position' => 'nullable|string',
        'affiliation' => 'nullable|string',
        'sector' => 'nullable|string',
        'industry' => 'nullable|string',
        'ict_council_name' => 'nullable|string',
        'is_ict_interested' => 'nullable|boolean',
        'is_ict_member' => 'nullable|boolean',
        'attendance_qualification' => 'nullable|string',
        'registration_type_id' => 'nullable|string',
        'shirt_size' => 'nullable|string',
        'social_media' => 'nullable|string',
        'website' => 'nullable|string',
        'contact_number' => 'required|string',
        'score' => 'nullable|integer',
        'is_agree_privacy' => 'required|boolean',
        'agree_to_be_contacted' => 'boolean',
        'is_attended' => 'boolean',
        'is_csv_uploaded' => 'boolean'
    ];

    public static function validate(array $data)
    {
        $validator = Validator::make($data, self::$rules);

        if ($validator->fails()) {
            Log::error('Validation failed:', $validator->errors()->toArray());
            throw new ValidationException($validator);
        }

        return true;
    }

    public function event()
    {
        return $this->belongsTo(Registrant::class, 'event_id', 'id');
    }
}
