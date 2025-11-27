<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PersonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $deviceId = $request->header('X-Device-ID', '');
        $distance = null;

        if ($request->has('user_latitude') && $request->has('user_longitude')) {
            $distance = $this->calculateDistance(
                (float) $request->input('user_latitude'),
                (float) $request->input('user_longitude'),
                (float) $this->latitude,
                (float) $this->longitude
            );
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'age' => $this->age,
            'bio' => $this->bio,
            'location' => $this->location,
            'distance' => $distance ? round($distance, 1) : null,
            'photos' => PictureResource::collection($this->whenLoaded('pictures')),
        ];
    }

    private function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371; // km

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}



