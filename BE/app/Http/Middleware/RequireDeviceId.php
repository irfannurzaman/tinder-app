<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireDeviceId
{
    public function handle(Request $request, Closure $next): Response
    {
        $deviceId = $request->header('X-Device-ID');

        if (!$deviceId) {
            return response()->json([
                'success' => false,
                'message' => 'X-Device-ID header is required',
            ], 400);
        }

        return $next($request);
    }
}



