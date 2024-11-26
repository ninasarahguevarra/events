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

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'gender',
        'birthdate',
        'street_address',
        'city',
        'zip_code',
        'country',
        'mobile',
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
            'name' => 'string',
            'email' => 'string',
            'gender' => 'string',
            'birthdate' => 'string',
            'street_address' => 'string',
            'city' => 'string',
            'zip_code' => 'string',
            'country' => 'string',
            'mobile' => 'string',
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public static array $rules = [
        'name' => 'required|string',
        'email' => 'required|string',
        'gender' => 'required|string',
        'birthdate' => 'required|string',
        'street_address' => 'nullable|string',
        'city' => 'nullable|string',
        'zip_code' => 'nullable|string',
        'country' => 'nullable|string',
        'mobile' => 'nullable|string',
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
