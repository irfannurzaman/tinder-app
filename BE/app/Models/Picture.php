<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Picture extends Model
{
    use HasFactory;

    protected $fillable = [
        'people_id',
        'url',
        'order',
    ];

    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class, 'people_id');
    }
}



