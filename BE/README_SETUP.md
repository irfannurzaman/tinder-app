# Setup Backend Laravel

## Quick Start

### 1. Install PHP & Composer (jika belum ada)

```bash
# Install PHP
brew install php

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### 2. Setup Project

```bash
cd /Users/irfannzaman/Documents/Tinder/BE

# Install dependencies
composer install

# Copy .env
cp .env.example .env

# Generate app key
php artisan key:generate

# Create SQLite database (atau setup MySQL/PostgreSQL)
touch database/database.sqlite

# Run migrations
php artisan migrate
```

### 3. Start Server

```bash
php artisan serve
```

Server akan berjalan di: http://localhost:8000

## Atau gunakan setup script:

```bash
cd /Users/irfannzaman/Documents/Tinder/BE
./setup.sh
```

## API Endpoints

- `GET /api/people` - Get list of people
- `POST /api/people/{id}/like` - Like a person
- `POST /api/people/{id}/dislike` - Dislike a person
- `GET /api/people/liked` - Get liked people

## Swagger Documentation

Setelah server berjalan:

```bash
php artisan l5-swagger:generate
```

Akses di: http://localhost:8000/api/documentation


