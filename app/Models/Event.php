<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 
        'description', 
        'location', 
        'date',
        'status',
        'deleted_at'
    ];

    protected $casts = [
        'name' => 'string', 
        'description' => 'string', 
        'location' => 'string',  
        'date' => 'datetime', 
        'status' => 'string', 
        'deleted_at' => 'date', 
    ];

    public static array $rules = [
        'name' => 'required|string', 
        'description' => 'nullable|string',
        'location' => 'nullable|string',
        'date' => 'required|date',
        'status' => 'required|string',
        'deleted_at' => 'nullable|date',
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

    public function attendees()
    {
        return $this->hasMany(Attendee::class);
    }

    public function registrant()
    {
        return $this->hasMany(Registrant::class);
    }
}
