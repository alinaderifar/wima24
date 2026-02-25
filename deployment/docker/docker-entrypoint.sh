#!/bin/bash
# ==============================================================================
# LaraClassifier Docker Entrypoint Script
# ==============================================================================
# Location: deployment/docker/docker-entrypoint.sh
#
# This script runs when the Docker container starts. It handles:
# - Waiting for dependent services (database, Redis)
# - Running database migrations
# - Optimizing Laravel for production
# - Starting the main process (PHP-FPM)
#
# ==============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ------------------------------------------------------------------------------
# Helper Functions
# ------------------------------------------------------------------------------

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Wait for a service to be ready
wait_for_service() {
    local host="$1"
    local port="$2"
    local service="$3"
    local max_attempts="${4:-30}"
    local attempt=1
    
    log_info "Waiting for $service at $host:$port..."
    
    while ! nc -z "$host" "$port" >/dev/null 2>&1; do
        if [ $attempt -ge $max_attempts ]; then
            log_error "Failed to connect to $service after $max_attempts attempts"
            return 1
        fi
        
        log_info "Waiting for $service... (attempt $attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log_success "$service is ready!"
    return 0
}

# Wait for MySQL/MariaDB to be ready
wait_for_database() {
    local host="${DB_HOST:-db}"
    local port="${DB_PORT:-3306}"
    local user="${DB_USERNAME:-laraclassifier}"
    local password="${DB_PASSWORD:-}"
    local database="${DB_DATABASE:-laraclassifier}"
    local max_attempts="${DB_WAIT_ATTEMPTS:-30}"
    local attempt=1
    
    log_info "Waiting for database connection..."
    
    while ! mysql -h"$host" -P"$port" -u"$user" -p"$password" -e "SELECT 1" >/dev/null 2>&1; do
        if [ $attempt -ge $max_attempts ]; then
            log_error "Failed to connect to database after $max_attempts attempts"
            return 1
        fi
        
        log_info "Waiting for database... (attempt $attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log_success "Database connection established!"
    return 0
}

# Wait for Redis to be ready
wait_for_redis() {
    local host="${REDIS_HOST:-redis}"
    local port="${REDIS_PORT:-6379}"
    local password="${REDIS_PASSWORD:-}"
    local max_attempts="${REDIS_WAIT_ATTEMPTS:-30}"
    local attempt=1
    
    log_info "Waiting for Redis connection..."
    
    while true; do
        if [ -n "$password" ]; then
            if redis-cli -h "$host" -p "$port" -a "$password" ping 2>/dev/null | grep -q "PONG"; then
                break
            fi
        else
            if redis-cli -h "$host" -p "$port" ping 2>/dev/null | grep -q "PONG"; then
                break
            fi
        fi
        
        if [ $attempt -ge $max_attempts ]; then
            log_error "Failed to connect to Redis after $max_attempts attempts"
            return 1
        fi
        
        log_info "Waiting for Redis... (attempt $attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log_success "Redis connection established!"
    return 0
}

# ------------------------------------------------------------------------------
# Initialization Functions
# ------------------------------------------------------------------------------

# Generate application key if not set
generate_app_key() {
    if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:" ]; then
        log_warning "APP_KEY is not set. Generating a new key..."
        php artisan key:generate --force
        log_success "Application key generated!"
    else
        log_info "Application key already set."
    fi
}

# Run database migrations
run_migrations() {
    if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
        log_info "Running database migrations..."
        
        if php artisan migrate --force --no-interaction; then
            log_success "Migrations completed successfully!"
        else
            log_warning "Migrations failed. This might be normal for initial deployment."
        fi
    else
        log_info "Skipping migrations (RUN_MIGRATIONS=false)"
    fi
}

# Create storage symlink
create_storage_link() {
    if [ ! -L "public/storage" ]; then
        log_info "Creating storage symlink..."
        php artisan storage:link --force || true
        log_success "Storage symlink created!"
    else
        log_info "Storage symlink already exists."
    fi
}

# Optimize Laravel for production
optimize_laravel() {
    if [ "${APP_ENV:-production}" = "production" ]; then
        log_info "Optimizing Laravel for production..."
        
        # Clear all cache first
        php artisan config:clear 2>/dev/null || true
        php artisan route:clear 2>/dev/null || true
        php artisan view:clear 2>/dev/null || true
        php artisan event:clear 2>/dev/null || true
        
        # Cache for production
        if [ "${CACHE_CONFIG:-true}" = "true" ]; then
            php artisan config:cache 2>/dev/null || true
        fi
        
        if [ "${CACHE_ROUTES:-true}" = "true" ]; then
            php artisan route:cache 2>/dev/null || true
        fi
        
        if [ "${CACHE_VIEWS:-true}" = "true" ]; then
            php artisan view:cache 2>/dev/null || true
        fi
        
        if [ "${CACHE_EVENTS:-true}" = "true" ]; then
            php artisan event:cache 2>/dev/null || true
        fi
        
        log_success "Laravel optimized for production!"
    else
        log_info "Skipping optimization (not production environment)"
    fi
}

# Set proper permissions
set_permissions() {
    log_info "Setting file permissions..."
    
    # Set ownership
    chown -R www-data:www-data /var/www/storage
    chown -R www-data:www-data /var/www/bootstrap/cache
    
    # Set permissions
    chmod -R 775 /var/www/storage
    chmod -R 775 /var/www/bootstrap/cache
    
    log_success "Permissions set!"
}

# Check application health
check_health() {
    log_info "Checking application health..."
    
    # Check if Laravel is up
    if php artisan up 2>/dev/null; then
        log_success "Application is healthy!"
    else
        log_warning "Application health check returned warning"
    fi
}

# ------------------------------------------------------------------------------
# Main Entrypoint
# ------------------------------------------------------------------------------

main() {
    log_info "=========================================="
    log_info "LaraClassifier Container Starting"
    log_info "=========================================="
    log_info "Environment: ${APP_ENV:-production}"
    log_info "PHP Version: $(php -v | head -n 1)"
    
    # Change to application directory
    cd /var/www
    
    # Wait for services if in production or if explicitly requested
    if [ "${WAIT_FOR_SERVICES:-true}" = "true" ]; then
        # Wait for database
        if [ "${DB_HOST:-}" != "" ]; then
            wait_for_database || log_warning "Database connection check skipped"
        fi
        
        # Wait for Redis
        if [ "${REDIS_HOST:-}" != "" ]; then
            wait_for_redis || log_warning "Redis connection check skipped"
        fi
    fi
    
    # Initialize application
    if [ "${SKIP_INIT:-false}" != "true" ]; then
        generate_app_key
        create_storage_link
        set_permissions
        run_migrations
        optimize_laravel
    else
        log_info "Skipping initialization (SKIP_INIT=true)"
    fi
    
    # Health check
    check_health
    
    log_success "=========================================="
    log_success "Initialization Complete!"
    log_success "=========================================="
    
    # Execute the main command
    log_info "Starting main process: $@"
    exec "$@"
}

# Run main function with all arguments
main "$@"
