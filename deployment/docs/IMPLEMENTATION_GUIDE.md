# LaraClassifier Coolify + Docker Implementation Guide

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Phase 1: Server Setup](#phase-1-server-setup)
4. [Phase 2: Install Coolify](#phase-2-install-coolify)
5. [Phase 3: Configure Coolify](#phase-3-configure-coolify)
6. [Phase 4: Create Database and Redis](#phase-4-create-database-and-redis)
7. [Phase 5: Deploy Application](#phase-5-deploy-application)
8. [Phase 6: Configure Domain and SSL](#phase-6-configure-domain-and-ssl)
9. [Phase 7: Post-Deployment Setup](#phase-7-post-deployment-setup)
10. [Phase 8: Configure CI/CD](#phase-8-configure-cicd)
11. [Phase 9: Monitoring and Backups](#phase-9-monitoring-and-backups)
12. [Troubleshooting](#troubleshooting)

---

## Overview

This guide provides step-by-step instructions for deploying LaraClassifier using Coolify (a free, self-hosted PaaS) with Docker on Hetzner Cloud infrastructure.

### Why Coolify?

- **Free and Open Source**: No licensing costs
- **Docker-based**: Consistent deployments across environments
- **Automatic SSL**: Let's Encrypt integration
- **Built-in Database Management**: MySQL, PostgreSQL, Redis, MongoDB
- **Git Integration**: Automatic deployments from GitHub/GitLab
- **Webhook Support**: CI/CD pipeline integration
- **User-friendly Dashboard**: Easy management without CLI

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Internet                                 │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Hetzner Cloud Server                          │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────────┐│
│   │                    Coolify Dashboard                         ││
│   │                    (Port 80/443)                             ││
│   └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│              ┌───────────────┼───────────────┐                   │
│              ▼               ▼               ▼                   │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │   LaraClass  │  │   MariaDB    │  │    Redis     │          │
│   │   Container  │  │   Container  │  │   Container  │          │
│   │              │  │              │  │              │          │
│   │ - app        │  │ - MySQL      │  │ - Cache      │          │
│   │ - queue      │  │ - Port 3306  │  │ - Queue      │          │
│   │ - scheduler  │  │              │  │ - Sessions   │          │
│   └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────────┐│
│   │              Docker Network: coolify                         ││
│   └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### Required Tools

- [ ] Hetzner Cloud account
- [ ] Domain name with DNS access
- [ ] Git repository with LaraClassifier code
- [ ] SSH client

### Required Credentials

- [ ] Hetzner Cloud API token
- [ ] Domain registrar access
- [ ] SMTP credentials (Mailgun, SendGrid, etc.)
- [ ] Payment gateway credentials (Stripe, PayPal, etc.)

### Server Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 2 vCPUs | 4 vCPUs |
| RAM | 4 GB | 8 GB |
| Storage | 40 GB SSD | 80 GB SSD |
| OS | Ubuntu 22.04/24.04 | Ubuntu 24.04 |

### Recommended Hetzner Server Types

| Server Type | Specs | Monthly Cost | Use Case |
|-------------|-------|--------------|----------|
| CX31 | 4 vCPU, 8 GB RAM, 80 GB | ~€15 | Small production |
| CX41 | 8 vCPU, 16 GB RAM, 160 GB | ~€30 | Medium production |

---

## Phase 1: Server Setup

### Step 1.1: Create Hetzner Server

Using Hetzner Cloud Console:

1. Log in to [Hetzner Cloud Console](https://console.hetzner.cloud/)
2. Create a new project named "LaraClassifier"
3. Click "Add Server"
4. Configure:
   - Location: Falkenstein (fsn1) or Nuremberg (nbg1)
   - Image: Ubuntu 24.04
   - Type: CX31 (or larger)
   - Networking: Enable IPv4
   - SSH Key: Add your public key
5. Click "Create & Buy Now"

Using hcloud CLI:

```bash
# Configure hcloud
hcloud context create laraclassifier

# Create server
hcloud server create \
    --name coolify-server \
    --type cx31 \
    --image ubuntu-24.04 \
    --location fsn1 \
    --ssh-key YOUR_SSH_KEY_NAME
```

### Step 1.2: Configure DNS

Add DNS records for your domain:

```
Type    Name                Value               TTL
A       @                   SERVER_IP           300
A       www                 SERVER_IP           300
A       coolify             SERVER_IP           300
```

### Step 1.3: Initial Server Access

```bash
# SSH into server
ssh root@YOUR_SERVER_IP

# Update system
apt update && apt upgrade -y

# Install basic utilities
apt install -y curl wget git htop
```

---

## Phase 2: Install Coolify

### Step 2.1: Run Coolify Installer

```bash
# Run the official Coolify installation script
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

The installation takes about 5-10 minutes and includes:
- Docker and Docker Compose
- Coolify containers
- Automatic SSL configuration
- Database setup

### Step 2.2: Access Coolify Dashboard

1. Open browser and navigate to:
   - `http://YOUR_SERVER_IP:3000`
   - Or `http://coolify.your-domain.com` (if DNS configured)

2. Create admin account:
   - Set admin email
   - Set strong password
   - Save credentials securely

### Step 2.3: Configure Coolify Domain

1. Go to **Settings** → **Configuration**
2. Set **Instance Domain**: `coolify.your-domain.com`
3. Enable **HTTPS** for dashboard
4. Save changes

---

## Phase 3: Configure Coolify

### Step 3.1: Configure Email (Optional but Recommended)

1. Go to **Settings** → **Email**
2. Configure SMTP:
   ```
   Host: smtp.your-provider.com
   Port: 587
   Username: your-username
   Password: your-password
   From: noreply@your-domain.com
   ```
3. Test and save

### Step 3.2: Configure Backups

1. Go to **Settings** → **Backup**
2. Enable automatic backups
3. Set schedule: Daily at 2:00 AM
4. Configure storage (local or S3)
5. Save settings

### Step 3.3: Generate API Token

1. Go to **Settings** → **API Tokens**
2. Click **Generate New Token**
3. Name: "GitHub Actions"
4. Copy token (save for CI/CD setup)

---

## Phase 4: Create Database and Redis

### Step 4.1: Create MariaDB Database

1. Go to **Resources** → **Databases**
2. Click **+ New Database**
3. Select **MySQL/MariaDB**
4. Configure:
   ```
   Name: laraclassifier-db
   Version: 11.4
   Database Name: laraclassifier
   Username: laraclassifier
   Password: [auto-generate or custom]
   ```
5. Click **Deploy**
6. Note the connection details

### Step 4.2: Create Redis Instance

1. Go to **Resources** → **Databases**
2. Click **+ New Database**
3. Select **Redis**
4. Configure:
   ```
   Name: laraclassifier-redis
   Version: 7
   Password: [set strong password]
   Max Memory: 256MB
   ```
5. Click **Deploy**
6. Note the connection details

---

## Phase 5: Deploy Application

### Step 5.1: Create Application

1. Go to **Resources** → **Applications**
2. Click **+ New Application**
3. Select **Git Repository**
4. Configure:
   ```
   Name: laraclassifier
   Repository: https://github.com/your-repo/laraclassifier
   Branch: main
   Build Pack: Docker Compose
   Docker Compose Location: docker-compose.yml
   ```
   
   > **Note:** All Docker files are now located in the repository root for Coolify compatibility:
   > - `Dockerfile` - Multi-stage build configuration
   > - `docker-compose.yml` - Service orchestration
   > - `.dockerignore` - Build context exclusions
   > - `docker-entrypoint.sh` - Container startup script
   > - `nginx.default.conf` - Nginx configuration (if using separate Nginx container)
   > - `php.ini` - PHP production configuration
   > - `php-fpm.conf` - PHP-FPM pool configuration

### Step 5.2: Link Database and Redis

1. In application settings, go to **Linked Services**
2. Link `laraclassifier-db` database
3. Link `laraclassifier-redis` Redis
4. Coolify will inject connection variables automatically

### Step 5.3: Configure Environment Variables

1. Go to **Configuration** → **Environment Variables**
2. Add required variables (see `.env.coolify` template):

```env
APP_NAME="LaraClassifier"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY
APP_DEBUG=false
APP_URL=https://your-domain.com

# Database (injected by Coolify when linked)
DB_CONNECTION=mysql

# Redis (injected by Coolify when linked)
REDIS_CLIENT=predis

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.your-provider.com
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_FROM_ADDRESS="noreply@your-domain.com"

# Cache & Queue
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
```

### Step 5.4: Generate Application Key

Generate APP_KEY locally:

```bash
# Using Laravel
php artisan key:generate --show

# Or using OpenSSL
echo "base64:$(openssl rand -base64 32)"
```

Add the generated key to Coolify environment variables.

### Step 5.5: Deploy

1. Click **Deploy** in Coolify dashboard
2. Monitor deployment logs
3. Wait for successful deployment

---

## Phase 6: Configure Domain and SSL

### Step 6.1: Configure Domain

1. Go to **Configuration** → **Domains**
2. Add domains:
   - `your-domain.com`
   - `www.your-domain.com`
3. Set primary domain

### Step 6.2: Enable SSL

1. Go to **Configuration** → **SSL**
2. Enable **Let's Encrypt**
3. Set email for certificate notifications
4. Click **Request Certificate**
5. Enable **Force HTTPS**

### Step 6.3: Verify SSL

1. Visit `https://your-domain.com`
2. Verify certificate is valid
3. Test HTTPS redirect

---

## Phase 7: Post-Deployment Setup

### Step 7.1: Run Database Migrations

1. Go to **Application** → **Terminal**
2. Run:

```bash
php artisan migrate --force
```

### Step 7.2: Create Storage Link

```bash
php artisan storage:link
```

### Step 7.3: Optimize Application

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### Step 7.4: Create Admin User

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

### Step 7.5: Verify Services

Check all services are running:

```bash
# Check containers
docker ps

# Check logs
docker logs laraclassifier-app
docker logs laraclassifier-queue
docker logs laraclassifier-scheduler
```

---

## Phase 8: Configure CI/CD

### Step 8.1: Get Webhook URL

1. Go to **Application** → **Webhooks**
2. Copy the deployment webhook URL

### Step 8.2: Configure GitHub Secrets

In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

| Secret | Value |
|--------|-------|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub token |
| `COOLIFY_STAGING_WEBHOOK_URL` | Staging webhook URL |
| `COOLIFY_PRODUCTION_WEBHOOK_URL` | Production webhook URL |
| `COOLIFY_WEBHOOK_TOKEN` | Coolify API token |
| `SLACK_WEBHOOK_URL` | Slack webhook (optional) |

### Step 8.3: Copy GitHub Actions Workflow

Copy `deployment/ci-cd/github-actions.yml` to `.github/workflows/deploy.yml`

### Step 8.4: Test CI/CD

1. Make a small change
2. Push to main branch
3. Monitor GitHub Actions workflow
4. Verify automatic deployment

---

## Phase 9: Monitoring and Backups

### Step 9.1: Configure Monitoring

Coolify provides built-in monitoring:

1. Go to **Application** → **Monitoring**
2. Enable monitoring
3. Configure alerts:
   - CPU > 80%
   - Memory > 85%
   - Disk > 90%

### Step 9.2: Configure Database Backups

1. Go to **Database** → `laraclassifier-db` → **Backups**
2. Enable automatic backups
3. Set schedule: Daily at 2:00 AM
4. Set retention: 7 days
5. Configure S3 for off-site storage (optional)

### Step 9.3: Configure Application Backups

1. Go to **Application** → **Backups**
2. Enable volume backups
3. Set schedule: Daily at 3:00 AM
4. Include storage volume

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

## Quick Reference

### Coolify Dashboard URLs

- Dashboard: `https://coolify.your-domain.com`
- Application: `https://your-domain.com`
- Health Check: `https://your-domain.com/health`

### Useful Commands

```bash
# View all containers
docker ps

# View container logs
docker logs laraclassifier-app -f

# Execute command in container
docker exec laraclassifier-app php artisan migrate

# Restart all services
docker restart laraclassifier-app laraclassifier-queue laraclassifier-scheduler

# Check container resource usage
docker stats
```

### Laravel Artisan Commands

```bash
php artisan migrate --force      # Run migrations
php artisan optimize             # Cache all
php artisan optimize:clear       # Clear all cache
php artisan queue:work           # Process queue
php artisan schedule:run         # Run scheduler
php artisan down                 # Maintenance mode on
php artisan up                   # Maintenance mode off
```

---

## Support

For issues or questions:

1. Check the [Quick Reference](QUICK_REFERENCE.md)
2. Check the [Coolify Documentation](https://coolify.io/docs)
3. Review application logs
4. Contact system administrator

---

*Document Version: 2.0*
*Last Updated: 2026-02-24*
*Updated for Coolify + Docker deployment*
