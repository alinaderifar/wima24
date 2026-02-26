# ==============================================================================
# LaraClassifier Dockerfile - Simplified for Coolify
# ==============================================================================
# Using Debian-based PHP image to avoid Alpine build issues
# ==============================================================================

FROM php:8.2-fpm-bookworm AS base

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    wget \
    git \
    vim \
    zip \
    unzip \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libxml2-dev \
    libonig-dev \
    libicu-dev \
    libmemcached-dev \
    zlib1g-dev \
    libgmp-dev \
    libmagickwand-dev \
    imagemagick \
    default-mysql-client \
    libssl-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    mysqli \
    mbstring \
    exif \
    pcntl \
    bcmath \
    intl \
    zip \
    opcache \
    gd \
    && docker-php-ext-enable memcached \
    || true

# Install Redis extension
RUN pecl install redis-5.3.7 && docker-php-ext-enable redis \
    || true

# Install Imagick extension
RUN pecl install imagick && docker-php-ext-enable imagick \
    || true

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# ==============================================================================
# Production Stage
# ==============================================================================
FROM base AS production

WORKDIR /var/www

# Copy application code
COPY . .

# Create required directories
RUN mkdir -p /var/www/storage/logs \
    && mkdir -p /var/www/storage/framework/cache \
    && mkdir -p /var/www/storage/framework/sessions \
    && mkdir -p /var/www/storage/framework/views \
    && mkdir -p /var/www/storage/app/public \
    && chown -R www-data:www-data /var/www/storage \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache \
    || true

# Copy PHP configuration
COPY php.ini /usr/local/etc/php/conf.d/99-laraclassifier.ini \
    || true
COPY php-fpm.conf /usr/local/etc/php-fpm.d/zz-laraclassifier.conf \
    || true

# Copy entrypoint
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh \
    || true
RUN chmod +x /usr/local/bin/docker-entrypoint.sh \
    || true

# Expose port
EXPOSE 9000

# Environment
ENV APP_ENV=production
ENV APP_DEBUG=false

# Entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
