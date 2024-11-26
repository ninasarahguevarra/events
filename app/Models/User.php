<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Laravel\Passport\HasApiTokens;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

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
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
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
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public static array $rules = [
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
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
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
