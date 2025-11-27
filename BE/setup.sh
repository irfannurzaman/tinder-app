#!/bin/bash

echo "🚀 Setting up Laravel Backend..."

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "📦 Installing PHP..."
    brew install php
else
    echo "✅ PHP already installed: $(php --version | head -n 1)"
fi

# Check if Composer is installed
if ! command -v composer &> /dev/null; then
    echo "📦 Installing Composer..."
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
    chmod +x /usr/local/bin/composer
else
    echo "✅ Composer already installed: $(composer --version)"
fi

# Install dependencies
echo "📦 Installing Laravel dependencies..."
composer install --no-interaction

# Copy .env if not exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env 2>/dev/null || echo "APP_NAME=Tinder
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=hello@example.com
MAIL_FROM_NAME=Tinder
MAIL_ADMIN_EMAIL=admin@example.com

L5_SWAGGER_CONST_HOST=http://localhost:8000" > .env
fi

# Generate app key
echo "🔑 Generating application key..."
php artisan key:generate 2>/dev/null || echo "Note: Run 'php artisan key:generate' after setup"

# Create database file for SQLite
if [ ! -f database/database.sqlite ]; then
    echo "📊 Creating SQLite database..."
    touch database/database.sqlite
fi

# Run migrations
echo "🗄️  Running migrations..."
php artisan migrate --force 2>/dev/null || echo "Note: Run 'php artisan migrate' after setup"

echo "✅ Setup complete!"
echo ""
echo "To start the server, run:"
echo "  php artisan serve"



