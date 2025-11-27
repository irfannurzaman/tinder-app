# Tinder Backend API

Laravel 11 backend API for Tinder-like application.

## Setup

1. Install dependencies:

```bash
composer install
```

2. Copy environment file:

```bash
cp .env.example .env
```

3. Generate application key:

```bash
php artisan key:generate
```

4. Configure database in `.env`

5. Run migrations:

```bash
php artisan migrate
```

6. Generate Swagger documentation:

```bash
php artisan l5-swagger:generate
```

7. Start server:

```bash
php artisan serve
```

## API Documentation

Access Swagger UI at: `http://localhost:8000/api/documentation`

## Endpoints

- `GET /api/people` - Get list of people (pagination)
- `POST /api/people/{id}/like` - Like a person
- `POST /api/people/{id}/dislike` - Dislike a person
- `GET /api/people/liked` - Get liked people

## Headers

All requests require:

- `X-Device-ID`: Device identifier

## Cronjob

The scheduler runs daily at 9:00 AM to check for people with 50+ likes and sends email to admin.

Add to crontab:

```
* * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1
```


