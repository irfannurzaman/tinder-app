<?php

namespace App\Http\Controllers;

use App\Http\Resources\PersonResource;
use App\Services\PersonService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * @OA\Tag(
 *     name="People",
 *     description="People management endpoints"
 * )
 */
class PeopleController extends Controller
{
    public function __construct(
        private PersonService $personService
    ) {
    }

    /**
     * @OA\Get(
     *     path="/api/people",
     *     summary="Get list of people",
     *     tags={"People"},
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Page number",
     *         required=false,
     *         @OA\Schema(type="integer", default=1)
     *     ),
     *     @OA\Parameter(
     *         name="limit",
     *         in="query",
     *         description="Items per page",
     *         required=false,
     *         @OA\Schema(type="integer", default=10)
     *     ),
     *     @OA\Parameter(
     *         name="user_latitude",
     *         in="query",
     *         description="User latitude for distance calculation",
     *         required=false,
     *         @OA\Schema(type="number", format="float")
     *     ),
     *     @OA\Parameter(
     *         name="user_longitude",
     *         in="query",
     *         description="User longitude for distance calculation",
     *         required=false,
     *         @OA\Schema(type="number", format="float")
     *     ),
     *     @OA\Header(
     *         header="X-Device-ID",
     *         description="Device identifier",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful response",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Person")),
     *             @OA\Property(property="current_page", type="integer"),
     *             @OA\Property(property="per_page", type="integer"),
     *             @OA\Property(property="total", type="integer"),
     *             @OA\Property(property="last_page", type="integer"),
     *             @OA\Property(property="has_more", type="boolean")
     *         )
     *     )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $page = (int) $request->query('page', 1);
        $limit = (int) $request->query('limit', 10);
        $deviceId = $request->header('X-Device-ID');

        $people = $this->personService->getPeople($page, $limit, $deviceId);

        return response()->json([
            'data' => PersonResource::collection($people->items()),
            'page' => $people->currentPage(),
            'limit' => $people->perPage(),
            'total' => $people->total(),
            'hasMore' => $people->hasMorePages(),
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/people/{id}/like",
     *     summary="Like a person",
     *     tags={"People"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Person ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Header(
     *         header="X-Device-ID",
     *         description="Device identifier",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successfully liked",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="match", type="boolean"),
     *             @OA\Property(property="like_count", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Person not found"
     *     )
     * )
     */
    public function like(Request $request, int $id): JsonResponse
    {
        $deviceId = $request->header('X-Device-ID');

        if (!$deviceId) {
            return response()->json([
                'success' => false,
                'message' => 'Device ID is required',
            ], 400);
        }

        $result = $this->personService->likePerson($id, $deviceId);

        if (!$result['success']) {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }

    /**
     * @OA\Post(
     *     path="/api/people/{id}/dislike",
     *     summary="Dislike a person",
     *     tags={"People"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Person ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Header(
     *         header="X-Device-ID",
     *         description="Device identifier",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successfully disliked",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Person not found"
     *     )
     * )
     */
    public function dislike(Request $request, int $id): JsonResponse
    {
        $deviceId = $request->header('X-Device-ID');

        if (!$deviceId) {
            return response()->json([
                'success' => false,
                'message' => 'Device ID is required',
            ], 400);
        }

        $result = $this->personService->dislikePerson($id, $deviceId);

        if (!$result['success']) {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }

    /**
     * @OA\Get(
     *     path="/api/people/liked",
     *     summary="Get liked people",
     *     tags={"People"},
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Page number",
     *         required=false,
     *         @OA\Schema(type="integer", default=1)
     *     ),
     *     @OA\Parameter(
     *         name="limit",
     *         in="query",
     *         description="Items per page",
     *         required=false,
     *         @OA\Schema(type="integer", default=10)
     *     ),
     *     @OA\Header(
     *         header="X-Device-ID",
     *         description="Device identifier",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful response",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Person")),
     *             @OA\Property(property="current_page", type="integer"),
     *             @OA\Property(property="per_page", type="integer"),
     *             @OA\Property(property="total", type="integer")
     *         )
     *     )
     * )
     */
    public function liked(Request $request): JsonResponse
    {
        $deviceId = $request->header('X-Device-ID');

        if (!$deviceId) {
            return response()->json([
                'success' => false,
                'message' => 'Device ID is required',
            ], 400);
        }

        $page = (int) $request->query('page', 1);
        $limit = (int) $request->query('limit', 10);

        $people = $this->personService->getLikedPeople($deviceId, $page, $limit);

        return response()->json([
            'data' => PersonResource::collection($people->items()),
            'page' => $people->currentPage(),
            'limit' => $people->perPage(),
            'total' => $people->total(),
            'hasMore' => $people->hasMorePages(),
        ]);
    }
}



