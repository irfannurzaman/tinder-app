<?php

namespace App\Services;

use App\Models\Person;
use App\Models\Like;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PersonService
{
    public function getPeople(int $page = 1, int $limit = 10, ?string $deviceId = null): LengthAwarePaginator
    {
        $query = Person::with('pictures');

        // Jika ada deviceId, sembunyikan orang yang SUDAH pernah di-like / dislike oleh device tersebut
        if ($deviceId) {
            $query->whereDoesntHave('likes', function ($q) use ($deviceId) {
                $q->where('device_id', $deviceId)
                  ->whereIn('action', ['like', 'dislike']);
            });
        }

        return $query->paginate($limit, ['*'], 'page', $page);
    }

    public function likePerson(int $personId, string $deviceId): array
    {
        return DB::transaction(function () use ($personId, $deviceId) {
            $person = Person::findOrFail($personId);

            // Check if already liked/disliked
            $existingLike = Like::where('people_id', $personId)
                ->where('device_id', $deviceId)
                ->first();

            if ($existingLike) {
                if ($existingLike->action === 'like') {
                    return [
                        'success' => false,
                        'message' => 'Already liked this person',
                    ];
                }
                $existingLike->update(['action' => 'like']);
            } else {
                Like::create([
                    'people_id' => $personId,
                    'device_id' => $deviceId,
                    'action' => 'like',
                ]);
            }

            // Check for match (if this person also liked the device_id)
            // Note: This is simplified - in real app, you'd need to track which device_id belongs to which person
            $match = false; // Match logic would require person-to-device mapping

            $likeCount = $person->likeCount();

            return [
                'success' => true,
                'message' => 'Person liked successfully',
                'match' => $match,
                'like_count' => $likeCount,
            ];
        });
    }

    public function dislikePerson(int $personId, string $deviceId): array
    {
        return DB::transaction(function () use ($personId, $deviceId) {
            $person = Person::findOrFail($personId);

            $existingLike = Like::where('people_id', $personId)
                ->where('device_id', $deviceId)
                ->first();

            if ($existingLike) {
                if ($existingLike->action === 'dislike') {
                    return [
                        'success' => false,
                        'message' => 'Already disliked this person',
                    ];
                }
                $existingLike->update(['action' => 'dislike']);
            } else {
                Like::create([
                    'people_id' => $personId,
                    'device_id' => $deviceId,
                    'action' => 'dislike',
                ]);
            }

            return [
                'success' => true,
                'message' => 'Person disliked successfully',
            ];
        });
    }

    public function getLikedPeople(string $deviceId, int $page = 1, int $limit = 10): LengthAwarePaginator
    {
        $personIds = Like::where('device_id', $deviceId)
            ->where('action', 'like')
            ->pluck('people_id');

        return Person::with('pictures')
            ->whereIn('id', $personIds)
            ->paginate($limit, ['*'], 'page', $page);
    }

    public function getPeopleWithHighLikes(int $threshold = 50): \Illuminate\Database\Eloquent\Collection
    {
        return Person::withCount(['likes as like_count' => function ($query) {
            $query->where('action', 'like');
        }])
            ->having('like_count', '>=', $threshold)
            ->get();
    }
}

