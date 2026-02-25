# LaraClassifier Application Deployment in Coolify

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Create Database](#step-1-create-database)
4. [Step 2: Create Redis Instance](#step-2-create-redis-instance)
5. [Step 3: Create Application](#step-3-create-application)
6. [Step 4: Configure Environment Variables](#step-4-configure-environment-variables)
7. [Step 5: Configure Domain and SSL](#step-5-configure-domain-and-ssl)
8. [Step 6: Deploy Application](#step-6-deploy-application)
9. [Step 7: Post-Deployment Setup](#step-7-post-deployment-setup)
10. [Step 8: Configure Webhooks](#step-8-configure-webhooks)
11. [Troubleshooting](#troubleshooting)

---

## Overview

This guide walks you through deploying LaraClassifier on a Coolify-managed server. Coolify handles:

- Docker container orchestration
- Database and Redis management
- SSL certificate provisioning
- Domain configuration
- Automatic deployments via webhooks

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Coolify Server                           │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────────┐│
│   │                    Coolify Dashboard                         ││
│   └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│   ┌──────────────────────────┼──────────────────────────┐        │
│   │                          │                          │        │
│   ▼                          ▼                          ▼        │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │   LaraClass  │  │   MariaDB    │  │    Redis     │          │
│   │   App        │  │   Database   │  │    Cache     │          │
│   │              │  │              │  │              │          │
│   │ - app        │  │ - MySQL      │  │ - Redis      │          │
│   │ - queue      │  │ - Port 3306  │  │ - Port 6379  │          │
│   │ - scheduler  │  │              │  │              │          │
│   └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────────┐│
│   │              Docker Network: coolify                         ││
│   └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

Before deploying, ensure you have:

- [ ] Coolify server set up (see [coolify-setup.md](coolify-setup.md))
- [ ] Domain name configured with DNS pointing to server
- [ ] Git repository with LaraClassifier code
- [ ] SMTP credentials for email
- [ ] Payment gateway credentials (Stripe, PayPal, etc.)
- [ ] Storage credentials (AWS S3, etc.) if using cloud storage

---

## Step 1: Create Database

### 1.1 Navigate to Databases

1. Open Coolify dashboard
2. Go to **Resources** → **Databases**
3. Click **+ New Database**

### 1.2 Configure MariaDB

Select **MySQL/MariaDB** and configure:

| Setting | Value |
|---------|-------|
| Name | `laraclassifier-db` |
| Version | `11.4` (or latest) |
| Database Name | `laraclassifier` |
| Username | `laraclassifier` |
| Password | [Auto-generate or set custom] |
| Root Password | [Auto-generate or set custom] |

### 1.3 Deploy Database

1. Click **Deploy**
2. Wait for the database to be ready (usually 30-60 seconds)
3. Note the connection details for later use

### 1.4 Note Database Credentials

After deployment, you'll see:

```
Host: laraclassifier-db (Docker network name)
Port: 3306
Database: laraclassifier
Username: laraclassifier
Password: [your-password]
```

---

## Step 2: Create Redis Instance

### 2.1 Navigate to Databases

1. Go to **Resources** → **Databases**
2. Click **+ New Database**

### 2.2 Configure Redis

Select **Redis** and configure:

| Setting | Value |
|---------|-------|
| Name | `laraclassifier-redis` |
| Version | `7` (or latest) |
| Password | [Set a strong password] |
| Max Memory | `256MB` |

### 2.3 Deploy Redis

1. Click **Deploy**
2. Wait for Redis to be ready

### 2.4 Note Redis Credentials

```
Host: laraclassifier-redis (Docker network name)
Port: 6379
Password: [your-password]
```

---

## Step 3: Create Application

### 3.1 Navigate to Applications

1. Go to **Resources** → **Applications**
2. Click **+ New Application**

### 3.2 Select Deployment Type

Choose one of the following:

#### Option A: Git Repository (Recommended)

1. Select **Git Repository**
2. Configure:
   | Setting | Value |
   |---------|-------|
   | Name | `laraclassifier` |
   | Repository URL | `https://github.com/your-repo/laraclassifier` |
   | Branch | `main` |
   | Build Pack | `Docker` |

3. Configure Docker settings:
   | Setting | Value |
   |---------|-------|
   | Dockerfile Location | `deployment/docker/Dockerfile` |
   | Build Target | `production` |
   | Docker Compose Location | `deployment/docker/docker-compose.coolify.yml` |

#### Option B: Docker Compose

1. Select **Docker Compose**
2. Paste the contents of `docker-compose.coolify.yml`
3. Configure application name: `laraclassifier`

#### Option C: Public Repository

1. Select **Public Git Repository**
2. Enter repository URL
3. Configure as in Option A

### 3.3 Configure Resource Limits

Set appropriate resource limits:

| Service | CPU Limit | Memory Limit |
|---------|-----------|--------------|
| app | 1 CPU | 512MB |
| queue | 0.5 CPU | 256MB |
| scheduler | 0.25 CPU | 128MB |

---

## Step 4: Configure Environment Variables

### 4.1 Navigate to Environment Variables

1. Open the application in Coolify
2. Go to **Configuration** → **Environment Variables**

### 4.2 Add Required Variables

Add the following environment variables:

#### Application Settings

```env
APP_NAME=LaraClassifier
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY_HERE
APP_DEBUG=false
APP_URL=https://your-domain.com
```

#### Database Settings (Link from Coolify Database)

Coolify can automatically inject database variables. Click **Link Database** and select `laraclassifier-db`.

Or manually add:

```env
DB_CONNECTION=mysql
DB_HOST=laraclassifier-db
DB_PORT=3306
DB_DATABASE=laraclassifier
DB_USERNAME=laraclassifier
DB_PASSWORD=your-db-password
```

#### Redis Settings (Link from Coolify Redis)

Click **Link Redis** and select `laraclassifier-redis`.

Or manually add:

```env
REDIS_HOST=laraclassifier-redis
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
```

#### Mail Settings

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.your-provider.com
MAIL_PORT=587
MAIL_USERNAME=your-smtp-username
MAIL_PASSWORD=your-smtp-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@your-domain.com
MAIL_FROM_NAME="${APP_NAME}"
```

#### Payment Gateway Settings

```env
# Stripe
STRIPE_KEY=your-stripe-publishable-key
STRIPE_SECRET=your-stripe-secret-key

# PayPal
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_MODE=live
```

#### Storage Settings (if using AWS S3)

```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your-bucket-name
AWS_USE_PATH_STYLE_ENDPOINT=false
```

#### Other Settings

```env
# Recaptcha
RECAPTCHA_PUBLIC_KEY=your-recaptcha-public
RECAPTCHA_PRIVATE_KEY=your-recaptcha-private

# Sentry (optional)
SENTRY_LARAVEL_DSN=your-sentry-dsn

# Timezone
APP_TIMEZONE=UTC
```

### 4.3 Generate Application Key

If you need to generate a new APP_KEY:

```bash
# Run locally or in a container
php artisan key:generate --show

# Or generate manually
echo "base64:$(openssl rand -base64 32)"
```

---

## Step 5: Configure Domain and SSL

### 5.1 Configure Domain

1. Go to **Configuration** → **Domains**
2. Add your domains:
   - `your-domain.com`
   - `www.your-domain.com`
3. Set the primary domain

### 5.2 Configure DNS

Add DNS records pointing to your Coolify server:

```
Type    Name                Value               TTL
A       @                   COOLIFY_SERVER_IP   300
A       www                 COOLIFY_SERVER_IP   300
```

### 5.3 Enable SSL

1. Go to **Configuration** → **SSL**
2. Enable **Let's Encrypt**
3. Configure:
   | Setting | Value |
   |---------|-------|
   | Email | your-email@domain.com |
   | Auto-renew | Enabled |
4. Click **Request Certificate**
5. Enable **Force HTTPS**

---

## Step 6: Deploy Application

### 6.1 Initial Deployment

1. Go to **Deployments**
2. Click **Deploy Now**
3. Monitor the deployment logs

### 6.2 Monitor Deployment

Watch for these stages in the logs:

1. **Building Image**: Docker builds the application
2. **Starting Containers**: Containers are created
3. **Health Checks**: Coolify verifies container health
4. **SSL Configuration**: Certificates are configured

### 6.3 Verify Deployment

After successful deployment:

1. Visit your domain: `https://your-domain.com`
2. Check the health endpoint: `https://your-domain.com/health`
3. Verify SSL certificate is valid

---

## Step 7: Post-Deployment Setup

### 7.1 Run Database Migrations

1. Go to **Application** → **Terminal**
2. Run:

```bash
php artisan migrate --force
```

### 7.2 Create Storage Link

```bash
php artisan storage:link
```

### 7.3 Optimize Application

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### 7.4 Create Admin User (if needed)

```bash
php artisan tinker
```

```php
\App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@your-domain.com',
    'password' => bcrypt('your-secure-password'),
    'email_verified_at' => now(),
]);
```

### 7.5 Verify Queue Workers

1. Go to **Containers**
2. Verify `laraclassifier-queue` is running
3. Check queue logs:

```bash
docker logs laraclassifier-queue
```

### 7.6 Verify Scheduler

1. Check scheduler logs:

```bash
docker logs laraclassifier-scheduler
```

2. Verify scheduled tasks:

```bash
php artisan schedule:list
```

---

## Step 8: Configure Webhooks

### 8.1 Get Webhook URL

1. Go to **Configuration** → **Webhooks**
2. Copy the webhook URL

### 8.2 Configure GitHub Webhook

1. Go to your GitHub repository
2. Navigate to **Settings** → **Webhooks**
3. Click **Add webhook**
4. Configure:
   | Setting | Value |
   |---------|-------|
   | Payload URL | [Coolify webhook URL] |
   | Content type | `application/json` |
   | Secret | [optional] |
   | Events | Just the push event |
5. Click **Add webhook**

### 8.3 Test Webhook

1. Make a small change to your repository
2. Push to the main branch
3. Check Coolify deployments for automatic deployment

---

## Troubleshooting

### Container Won't Start

```bash
# Check container logs
docker logs laraclassifier-app

# Check container status
docker ps -a | grep laraclassifier

# Restart container
docker restart laraclassifier-app
```

### Database Connection Issues

```bash
# Verify database is running
docker ps | grep mysql

# Test connection from app container
docker exec laraclassifier-app php artisan tinker
>>> DB::connection()->getPdo();
```

### Permission Issues

```bash
# Fix storage permissions
docker exec laraclassifier-app chmod -R 775 /var/www/storage
docker exec laraclassifier-app chown -R www-data:www-data /var/www/storage
```

### Queue Not Processing

```bash
# Check queue container
docker logs laraclassifier-queue

# Restart queue worker
docker restart laraclassifier-queue

# Check Redis connection
docker exec laraclassifier-app redis-cli -h laraclassifier-redis ping
```

### SSL Certificate Issues

```bash
# Check certificate status
docker exec coolify certbot certificates

# Force renewal
docker exec coolify certbot renew --force-renewal
```

### Memory Issues

```bash
# Check memory usage
docker stats

# Increase memory limit in Coolify settings
# Configuration → Resources → Memory Limit
```

---

## Maintenance

### Updating Application

1. Push changes to your Git repository
2. Coolify will automatically deploy (if webhook configured)
3. Or manually trigger deployment from Coolify dashboard

### Database Backups

Coolify provides automatic database backups:

1. Go to **Database** → `laraclassifier-db` → **Backups**
2. Configure backup schedule
3. Set retention policy
4. Configure S3/SFTP for off-site storage

### Monitoring

1. Use Coolify's built-in monitoring
2. Configure alerts for:
   - Container health
   - Memory usage
   - CPU usage
   - Disk usage

---

## Next Steps

- [Configure CI/CD Pipeline](../ci-cd/coolify-webhook.md)
- [Set Up Monitoring](../monitoring/health-check.sh)
- [Configure Backups](../scripts/backup.sh)

---

*Document Version: 1.0*
*Last Updated: 2026-02-24*
