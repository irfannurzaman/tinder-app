<?php

return [
    'defaults' => [
        'routes' => [
            'api' => 'api/documentation',
        ],
        'paths' => [
            'use_absolute_path' => env('L5_SWAGGER_USE_ABSOLUTE_PATH', false),
            'docs_json' => 'api-docs.json',
            'docs_yaml' => 'api-docs.yaml',
            'format_to_use' => env('L5_SWAGGER_FORMAT', 'json'),
            'annotations' => [
                base_path('app'),
            ],
        ],
        'swagger_version' => env('SWAGGER_VERSION', '3.0'),
        'api_version' => env('API_VERSION', '1.0.0'),
        'title' => env('SWAGGER_TITLE', 'Tinder API Documentation'),
        'description' => env('SWAGGER_DESCRIPTION', 'API documentation for Tinder-like application'),
        'terms_of_service' => '',
        'contact' => [
            'email' => env('SWAGGER_CONTACT_EMAIL', 'admin@example.com'),
        ],
        'license' => [
            'name' => 'MIT',
        ],
    ],

    'paths' => [
        'use_absolute_path' => env('L5_SWAGGER_USE_ABSOLUTE_PATH', false),
        'annotations' => [
            base_path('app'),
        ],
        'base' => env('L5_SWAGGER_BASE_PATH', null),
        'host' => env('L5_SWAGGER_HOST', null),
        'schemes' => env('L5_SWAGGER_SCHEMES', ['http', 'https']),
        'consumes' => ['application/json'],
        'produces' => ['application/json'],
    ],

    'security' => [
        'securityDefinitions' => [
            'bearerAuth' => [
                'type' => 'apiKey',
                'name' => 'Authorization',
                'in' => 'header',
            ],
        ],
    ],

    'swagger' => [
        'host' => env('SWAGGER_HOST', 'localhost:8000'),
        'basePath' => env('SWAGGER_BASE_PATH', '/api'),
        'schemes' => env('SWAGGER_SCHEMES', ['http', 'https']),
    ],
];

