<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * @OA\Info(
 *     title="Tinder API",
 *     version="1.0.0",
 *     description="API documentation for Tinder-like application",
 *     @OA\Contact(
 *         email="admin@example.com"
 *     )
 * )
 * @OA\Server(
 *     url=L5_SWAGGER_CONST_HOST,
 *     description="API Server"
 * )
 * @OA\Schema(
 *     schema="Person",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="John Doe"),
 *     @OA\Property(property="age", type="integer", example=28),
 *     @OA\Property(property="bio", type="string", example="Love traveling and photography"),
 *     @OA\Property(property="location", type="string", example="New York"),
 *     @OA\Property(property="distance", type="number", format="float", example=5.2),
 *     @OA\Property(
 *         property="photos",
 *         type="array",
 *         @OA\Items(
 *             type="object",
 *             @OA\Property(property="id", type="integer"),
 *             @OA\Property(property="url", type="string"),
 *             @OA\Property(property="order", type="integer")
 *         )
 *     )
 * )
 */
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}



