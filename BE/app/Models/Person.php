<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Person extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'people';

    protected $fillable = [
        'name',
        'age',
        'location',
        'latitude',
        'longitude',
        'bio',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function pictures(): HasMany
    {
        return $this->hasMany(Picture::class, 'people_id')->orderBy('order');
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class, 'people_id');
    }

    public function likeCount(): int
    {
        return $this->likes()->where('action', 'like')->count();
    }

    public function isLikedBy(string $deviceId): bool
    {
        return $this->likes()
            ->where('device_id', $deviceId)
            ->where('action', 'like')
            ->exists();
    }

    public function isDislikedBy(string $deviceId): bool
    {
        return $this->likes()
            ->where('device_id', $deviceId)
            ->where('action', 'dislike')
            ->exists();
    }
}



