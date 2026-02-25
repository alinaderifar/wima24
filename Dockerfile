# ==============================================================================
# LaraClassifier Dockerfile - Coolify-Optimized Multi-stage Build
# ==============================================================================
# Location: Dockerfile (repository root)
#
# This Dockerfile creates a production-ready Laravel application container
# optimized for Coolify deployment on Hetzner Cloud.
#
# Build Arguments:
#   - APP_ENV: Application environment (production/staging)
#   - APP_KEY: Laravel application key
#   - APP_URL: Application URL
#
# Build:
#   docker build -t laraclassifier:latest .
#
# Run:
#   docker run -p 9000:9000 laraclassifier:latest
#
# Coolify Integration:
#   Coolify will automatically inject environment variables and manage
#   the container lifecycle. This Dockerfile is optimized for that workflow.
#
# ==============================================================================

# ------------------------------------------------------------------------------
# Build Arguments for Coolify
# ------------------------------------------------------------------------------
ARG PHP_VERSION=8.2
ARG NODE_VERSION=20
ARG ALPINE_VERSION=3.19

# ------------------------------------------------------------------------------
# Stage 1: Base PHP Image with Extensions
# ------------------------------------------------------------------------------
FROM php:${PHP_VERSION}-fpm-alpine${ALPINE_VERSION} AS base

# Install system dependencies required by LaraClassifier
# These extensions are required for:
# - Image processing (gd, imagick)
# - Database (pdo_mysql, mysqli)
# - Cache (redis)
# - XML/SOAP APIs (xml, soap)
# - Internationalization (intl)
# - Archive handling (zip)
# - Performance (opcache)
RUN apk add --no-cache \
    curl \
    wget \
    git \
    vim \
    zip \
    unzip \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libxml2-dev \
    oniguruma-dev \
    icu-dev \
    libmemcached-dev \
    zlib-dev \
    cyrus-sasl-dev \
    libssh2-dev \
    openssl-dev \
    gmp-dev \
    imagemagick-dev \
    imagemagick \
    mysql-client \
    redis \
    $PHPIZE_DEPS

# Install system dependencies required by PHP extensions
RUN apk update && apk add --no-cache --virtual .build-deps \
    curl \
    wget \
    git \
    vim \
    zip \
    unzip \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libxml2-dev \
    oniguruma-dev \
    icu-dev \
    libmemcached-dev \
    zlib-dev \
    gmp-dev \
    imagemagick-dev \
    imagemagick \
    mysql-client \
    openssl \
    ca-certificates \
    $PHPIZE_DEPS

# Install PHP extensions one by one for better error handling
# Start with essential extensions
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
    sockets

# GD without freetype (simpler configuration)
RUN docker-php-ext-configure gd --disable-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd

# Optional: gmp and soap (may fail on some systems)
RUN docker-php-ext-install -j$(nproc) gmp soap || true

# Enable extensions
RUN docker-php-ext-enable memcached 2>/dev/null || true \
    && docker-php-ext-enable redis 2>/dev/null || true \
    && docker-php-ext-enable imagick 2>/dev/null || true \
    && apk del .build-deps 2>/dev/null || true

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# ------------------------------------------------------------------------------
# Stage 2: Build Frontend Assets (SKIPPED - assets pre-built)
# ------------------------------------------------------------------------------
# NOTE: Frontend assets are already built in the repository
# If you need to rebuild, uncomment the following stage
# FROM node:${NODE_VERSION}-alpine AS frontend-builder
# WORKDIR /var/www
# COPY package*.json ./
# RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund
# COPY webpack.mix.js ./
# COPY resources/ ./resources/
# COPY public/ ./public/
# RUN npm run build

# ------------------------------------------------------------------------------
# Stage 3: Application Builder
# ------------------------------------------------------------------------------
FROM base AS builder

WORKDIR /var/www

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install PHP dependencies (production only)
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-progress \
    --no-scripts \
    --ignore-platform-reqs

# Copy application code
COPY . .

# Skip copying built assets from frontend stage (already in public/)
# If you enabled frontend-builder stage, uncomment these:
# COPY --from=frontend-builder /var/www/public/build ./public/build
# COPY --from=frontend-builder /var/www/public/css ./public/css
# COPY --from=frontend-builder /var/www/public/js ./public/js
# COPY --from=frontend-builder /var/www/public/mix-manifest.json ./public/mix-manifest.json

# Clear Laravel caches
RUN php artisan config:clear \
    && php artisan route:clear \
    && php artisan view:clear

# Set proper permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

# ------------------------------------------------------------------------------
# Stage 4: Production Image (Coolify Target)
# ------------------------------------------------------------------------------
FROM base AS production

# Build arguments for Coolify
ARG APP_ENV=production
ARG APP_KEY
ARG APP_URL

# Labels for Coolify service discovery
LABEL maintainer="LaraClassifier Team"
LABEL org.opencontainers.image.title="LaraClassifier"
LABEL org.opencontainers.image.description="LaraClassifier - Classified Ads Web Application"
LABEL org.opencontainers.image.version="1.0.0"
LABEL coolify.managed="true"

WORKDIR /var/www

# Copy application from builder
COPY --from=builder --chown=www-data:www-data /var/www /var/www

# Create required directories with proper permissions
RUN mkdir -p /var/www/storage/logs \
    && mkdir -p /var/www/storage/framework/cache \
    && mkdir -p /var/www/storage/framework/sessions \
    && mkdir -p /var/www/storage/framework/views \
    && mkdir -p /var/www/storage/app/public \
    && chown -R www-data:www-data /var/www/storage \
    && chmod -R 775 /var/www/storage

# Copy PHP production configuration
COPY php.ini /usr/local/etc/php/conf.d/99-laraclassifier.ini
COPY php-fpm.conf /usr/local/etc/php-fpm.d/zz-laraclassifier.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Health check for Coolify
# Coolify uses this to determine container health
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD php artisan up || exit 1

# Expose PHP-FPM port
EXPOSE 9000

# Set environment variables for production
ENV APP_ENV=${APP_ENV}
ENV APP_DEBUG=false
ENV PHP_OPCACHE_ENABLE=1
ENV PHP_OPCACHE_VALIDATE_TIMESTAMPS=0

# Set entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Default command
CMD ["php-fpm"]

# ------------------------------------------------------------------------------
# Stage 5: Development Image
# ------------------------------------------------------------------------------
FROM base AS development

WORKDIR /var/www

# Install Xdebug for development
RUN pecl install xdebug && docker-php-ext-enable xdebug

# Copy composer files
COPY composer.json composer.lock ./

# Install PHP dependencies (with dev)
RUN composer install \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-progress \
    --no-scripts

# Copy application code
COPY . .

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

# Expose port
EXPOSE 9000

# Development environment
ENV APP_ENV=local
ENV APP_DEBUG=true

# Default command
CMD ["php-fpm"]

# ==============================================================================
# Notes
# ==============================================================================
#
# Build for Coolify production:
#   docker build --target production -t laraclassifier:prod \
#     --build-arg APP_ENV=production \
#     --build-arg APP_KEY=base64:... \
#     --build-arg APP_URL=https://your-domain.com .
#
# Build for development:
#   docker build --target development -t laraclassifier:dev .
#
# Run container:
#   docker run -d \
#     --name laraclassifier-app \
#     -p 9000:9000 \
#     -v $(pwd)/storage:/var/www/storage \
#     -e APP_ENV=production \
#     laraclassifier:prod
#
# Coolify will automatically:
#   - Build this Dockerfile
#   - Inject environment variables
#   - Set up networking with databases
#   - Configure SSL certificates
#   - Manage container lifecycle
#
# ==============================================================================
