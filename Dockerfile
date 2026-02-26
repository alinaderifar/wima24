# LaraClassifier Dockerfile - Simplified for Coolify
FROM php:8.2-fpm-bookworm

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl wget git vim zip unzip \
    libzip-dev libpng-dev libjpeg-dev libfreetype6-dev \
    libxml2-dev libonig-dev libicu-dev \
    libmemcached-dev zlib1g-dev libgmp-dev \
    libmagickwand-dev imagemagick \
    default-mysql-client libssl-dev ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install -j$(nproc) \
    pdo_mysql mysqli mbstring exif pcntl bcmath intl zip opcache gd

# Install optional extensions (continue if fails)
RUN pecl install redis-5.3.7 && docker-php-ext-enable redis || true
RUN pecl install imagick && docker-php-ext-enable imagick || true

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy application
COPY . .

# Create storage directories
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions \
    storage/framework/views storage/app/public \
    && chown -R www-data:www-data . \
    && chmod -R 775 storage bootstrap/cache

# Copy PHP config if exists
COPY php.ini /usr/local/etc/php/conf.d/99-laraclassifier.ini 2>/dev/null || true
COPY php-fpm.conf /usr/local/etc/php-fpm.d/zz-laraclassifier.conf 2>/dev/null || true
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh 2>/dev/null || true
RUN chmod +x /usr/local/bin/docker-entrypoint.sh 2>/dev/null || true

EXPOSE 9000
ENV APP_ENV=production
ENV APP_DEBUG=false
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
