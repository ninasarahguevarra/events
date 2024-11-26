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
        'name',
        'email',
        'gender',
        'company',
        'company_address',
        'position',
        'affiliation',
        'contact_number',
        'score',
        'is_agree_privacy',
        'is_attended',
    ];

    protected function casts(): array
    {
        return [
            'event_id' => 'integer',
            'title' => 'string',
            'name' => 'string',
            'email' => 'string',
            'gender' => 'string',
            'company' => 'string',
            'company_address' => 'string',
            'position' => 'string',
            'affiliation' => 'string',
            'contact_number' => 'string',
            'score' => 'integer',
            'is_agree_privacy' => 'boolean',
            'is_attended' => 'boolean',
        ];
    }

    public static array $rules = [
        'event_id' => 'nullable|integer',
        'title' => 'required|string',
        'name' => 'required|string',
        'email' => 'required|string',
        'gender' => 'required|string',
        'company' => 'nullable|string',
        'company_address' => 'nullable|string',
        'position' => 'nullable|string',
        'affiliation' => 'nullable|string',
        'contact_number' => 'required|string',
        'score' => 'nullable|integer',
        'is_agree_privacy' => 'required|boolean',
        'is_attended' => 'required|boolean',
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
}
