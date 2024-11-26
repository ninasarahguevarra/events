<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class Attendee extends Model
{
    protected $fillable = ['event_id', 'user_id'];

    protected $casts = [
        'event_id' => 'integer',
        'user_id' => 'string',
    ];

    public static array $rules = [
        'event_id' => 'required|integer',
        'user_id' => 'required|string',
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
        return $this->belongsTo(Event::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
