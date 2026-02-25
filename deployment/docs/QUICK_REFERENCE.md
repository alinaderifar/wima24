# LaraClassifier Deployment Quick Reference

## Coolify Dashboard

| URL | Purpose |
|-----|---------|
| `https://coolify.your-domain.com` | Coolify admin dashboard |
| `https://your-domain.com` | Application URL |
| `https://your-domain.com/health` | Health check endpoint |

---

## Docker Commands

### Container Management

```bash
# List all containers
docker ps -a

# List running containers
docker ps

# View container logs
docker logs laraclassifier-app
docker logs laraclassifier-app -f          # Follow logs
docker logs laraclassifier-app --tail 100  # Last 100 lines

# Execute command in container
docker exec laraclassifier-app php artisan migrate
docker exec -it laraclassifier-app bash   # Interactive shell

# Restart container
docker restart laraclassifier-app
docker restart laraclassifier-queue
docker restart laraclassifier-scheduler

# Restart all LaraClassifier containers
docker restart laraclassifier-app laraclassifier-queue laraclassifier-scheduler

# Stop container
docker stop laraclassifier-app

# Start container
docker start laraclassifier-app

# Remove container
docker rm -f laraclassifier-app
```

### Docker Compose Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up -d --build

# View logs
docker-compose logs -f
docker-compose logs -f app

# Execute command
docker-compose exec app php artisan migrate

# Scale queue workers
docker-compose up -d --scale queue=3

# Pull latest images
docker-compose pull

# Remove volumes
docker-compose down -v
```

### Docker System Commands

```bash
# View resource usage
docker stats

# View disk usage
docker system df

# Clean up unused resources
docker system prune

# Clean up everything (careful!)
docker system prune -a --volumes

# View images
docker images

# Remove image
docker rmi image_name

# View networks
docker network ls

# View volumes
docker volume ls
```

---

## Coolify CLI Commands

### Via Coolify Dashboard

| Action | Path |
|--------|------|
| Deploy application | Application → Deploy |
| View logs | Application → Logs |
| Terminal access | Application → Terminal |
| Environment variables | Application → Configuration → Environment |
| Webhooks | Application → Webhooks |
| Backups | Application → Backups |

### Via API

```bash
# Trigger deployment
curl -X POST "https://coolify.your-domain.com/api/v1/deploy?uuid=APP_UUID" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json"

# Check application status
curl -s "https://coolify.your-domain.com/api/v1/applications/APP_UUID" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

---

## Laravel Artisan Commands

### Application

```bash
# Clear all cache
php artisan optimize:clear

# Cache all (production)
php artisan optimize

# Clear application cache
php artisan cache:clear

# Clear config cache
php artisan config:clear

# Cache config
php artisan config:cache

# Clear route cache
php artisan route:clear

# Cache routes
php artisan route:cache

# Clear view cache
php artisan view:clear

# Cache views
php artisan view:cache
```

### Database

```bash
# Run migrations
php artisan migrate

# Run migrations (force in production)
php artisan migrate --force

# Rollback last migration
php artisan migrate:rollback

# Rollback specific steps
php artisan migrate:rollback --step=1

# Check migration status
php artisan migrate:status

# Seed database
php artisan db:seed
```

### Maintenance

```bash
# Enable maintenance mode
php artisan down

# Enable with message
php artisan down --message="Upgrading application..."

# Enable with retry header
php artisan down --retry=60

# Disable maintenance mode
php artisan up

# Create storage link
php artisan storage:link
```

### Queue

```bash
# Start queue worker
php artisan queue:work

# Process specific queue
php artisan queue:work --queue=high,default

# Process with timeout
php artisan queue:work --max-time=3600

# Process all pending and stop
php artisan queue:work --stop-when-empty

# Restart queue workers
php artisan queue:restart

# Retry failed job
php artisan queue:retry 5

# Retry all failed jobs
php artisan queue:retry all

# List failed jobs
php artisan queue:failed
```

### Scheduler

```bash
# Run scheduler manually
php artisan schedule:run

# List scheduled tasks
php artisan schedule:list

# Test scheduler
php artisan schedule:test
```

### Other

```bash
# Generate application key
php artisan key:generate

# List all routes
php artisan route:list

# Tinker (REPL)
php artisan tinker

# Show Laravel version
php artisan --version
```

---

## Service Management (Inside Container)

### PHP-FPM

```bash
# Check PHP version
php -v

# Check PHP modules
php -m

# Check PHP configuration
php -i

# Check OPcache status
php -r "print_r(opcache_get_status());"
```

### Nginx (if using separate container)

```bash
# Test configuration
nginx -t

# Reload configuration
nginx -s reload

# View access logs
tail -f /var/log/nginx/access.log

# View error logs
tail -f /var/log/nginx/error.log
```

---

## Database Commands

### MySQL/MariaDB

```bash
# Connect to database (from app container)
docker exec laraclassifier-app php artisan tinker
>>> DB::connection()->getPdo();

# Connect to database container
docker exec -it laraclassifier-db mysql -u root -p

# Backup database
docker exec laraclassifier-db mysqldump -u root -p laraclassifier > backup.sql

# Restore database
docker exec -i laraclassifier-db mysql -u root -p laraclassifier < backup.sql

# Check database size
docker exec laraclassifier-db mysql -u root -p -e "
SELECT table_schema AS 'Database',
       ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
GROUP BY table_schema;
"
```

### Redis

```bash
# Connect to Redis (from app container)
docker exec laraclassifier-app redis-cli -h laraclassifier-redis ping

# Connect to Redis container
docker exec -it laraclassifier-redis redis-cli

# Connect with password
docker exec -it laraclassifier-redis redis-cli -a YOUR_PASSWORD

# Get memory info
docker exec laraclassifier-redis redis-cli info memory

# Monitor commands
docker exec laraclassifier-redis redis-cli monitor

# Clear all data (DANGEROUS!)
docker exec laraclassifier-redis redis-cli FLUSHALL
```

---

## Monitoring Commands

### Container Health

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' laraclassifier-app

# View health check logs
docker inspect --format='{{json .State.Health}}' laraclassifier-app | jq

# Check all container statuses
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### Resource Monitoring

```bash
# Real-time resource usage
docker stats

# Specific container
docker stats laraclassifier-app

# Memory usage
docker exec laraclassifier-app free -h

# Disk usage
docker exec laraclassifier-app df -h

# CPU info
docker exec laraclassifier-app cat /proc/cpuinfo | grep processor | wc -l
```

### Log Monitoring

```bash
# Application logs
docker logs laraclassifier-app -f --tail 100

# Laravel logs
docker exec laraclassifier-app tail -f /var/www/storage/logs/laravel.log

# All container logs
docker-compose logs -f --tail 50

# Logs with timestamps
docker logs laraclassifier-app -f -t
```

---

## Deployment Commands

### Manual Deployment via Coolify

1. Go to Coolify dashboard
2. Select application
3. Click "Deploy"
4. Monitor logs

### Manual Deployment via CLI

```bash
# Pull latest code
git pull origin main

# Rebuild container
docker-compose build --no-cache

# Restart services
docker-compose up -d

# Run migrations
docker exec laraclassifier-app php artisan migrate --force

# Optimize
docker exec laraclassifier-app php artisan optimize
```

### Rollback

```bash
# List previous images
docker images | grep laraclassifier

# Tag previous image
docker tag laraclassifier:previous laraclassifier:rollback

# Update docker-compose to use rollback tag
# Restart services
docker-compose up -d

# Or via Coolify: Deploy specific image tag
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Container won't start | Check logs: `docker logs laraclassifier-app` |
| 502 Bad Gateway | Check PHP-FPM: `docker exec laraclassifier-app php-fpm -t` |
| Database connection failed | Verify DB container: `docker ps \| grep db` |
| Redis connection failed | Test connection: `docker exec ... redis-cli ping` |
| Permission denied | Fix permissions: `chmod -R 775 storage` |
| Out of memory | Check usage: `docker stats` |
| Queue not processing | Check queue container: `docker logs laraclassifier-queue` |

### Debug Commands

```bash
# Check container exit code
docker inspect laraclassifier-app --format='{{.State.ExitCode}}'

# Check container network
docker inspect laraclassifier-app --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'

# Check environment variables
docker inspect laraclassifier-app --format='{{range .Config.Env}}{{println .}}{{end}}'

# Check mounted volumes
docker inspect laraclassifier-app --format='{{range .Mounts}}{{.Source}} -> {{.Destination}}{{println}}{{end}}'

# Test database connection
docker exec laraclassifier-app php artisan tinker
>>> DB::connection()->getPdo();

# Test Redis connection
docker exec laraclassifier-app php artisan tinker
>>> Cache::put('test', 'value', 60);
>>> Cache::get('test');
```

### Health Check Script

```bash
#!/bin/bash
# Quick health check

echo "=== Container Status ==="
docker ps --format "table {{.Names}}\t{{.Status}}"

echo -e "\n=== Application Health ==="
curl -s https://your-domain.com/health || echo "FAILED"

echo -e "\n=== Database Connection ==="
docker exec laraclassifier-app php artisan tinker --execute="DB::connection()->getPdo(); echo 'OK';"

echo -e "\n=== Redis Connection ==="
docker exec laraclassifier-app php artisan tinker --execute="Cache::put('test', 'ok', 1); echo Cache::get('test');"

echo -e "\n=== Queue Status ==="
docker exec laraclassifier-app php artisan queue:failed

echo -e "\n=== Disk Usage ==="
docker exec laraclassifier-app df -h /var/www
```

---

## File Locations (Inside Container)

| Path | Description |
|------|-------------|
| `/var/www` | Application root |
| `/var/www/public` | Web root |
| `/var/www/storage` | Storage directory |
| `/var/www/storage/logs` | Application logs |
| `/var/www/.env` | Environment file |
| `/usr/local/etc/php/conf.d/` | PHP configuration |

---

## Coolify Webhook Integration

### Trigger Deployment

```bash
# Using curl
curl -X POST "https://coolify.your-domain.com/api/v1/deploy?uuid=APP_UUID" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"force": true}'
```

---

## Backup Commands

### Manual Backup

```bash
# Database backup
docker exec laraclassifier-db mysqldump -u root -pPASSWORD laraclassifier | gzip > backup_$(date +%Y%m%d).sql.gz

# Storage backup
docker cp laraclassifier-app:/var/www/storage ./storage_backup_$(date +%Y%m%d)

# Full backup
docker exec laraclassifier-db mysqldump -u root -pPASSWORD laraclassifier > db.sql
docker cp laraclassifier-app:/var/www/storage ./storage_backup
tar -czf backup_$(date +%Y%m%d).tar.gz db.sql storage_backup
```

### Restore

```bash
# Restore database
gunzip < backup.sql.gz | docker exec -i laraclassifier-db mysql -u root -pPASSWORD laraclassifier

# Restore storage
docker cp ./storage_backup laraclassifier-app:/var/www/storage
docker exec laraclassifier-app chown -R www-data:www-data /var/www/storage
```

---

## Security Commands

### SSL Certificates

```bash
# Check certificate (via Coolify container)
docker exec coolify certbot certificates

# Renew certificates
docker exec coolify certbot renew

# Test renewal
docker exec coolify certbot renew --dry-run
```

### Firewall (on host)

```bash
# Check status
ufw status

# Allow port
ufw allow 80/tcp
ufw allow 443/tcp

# Deny port
ufw deny 3306/tcp
```

---

## Emergency Contacts

| Role | Contact |
|------|---------|
| System Administrator | admin@your-domain.com |
| Developer | dev@your-domain.com |
| Coolify Documentation | https://coolify.io/docs |
| Docker Documentation | https://docs.docker.com |

---

*Document Version: 2.0*
*Last Updated: 2026-02-24*
*Updated for Coolify + Docker deployment*
