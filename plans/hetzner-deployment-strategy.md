# Hetzner Cloud Deployment Strategy for LaraClassifier

## Executive Summary

This document outlines the deployment strategy for hosting LaraClassifier on Hetzner VPS infrastructure using Docker with Coolify control panel. The architecture is designed for reliability, security, scalability, and cost-effectiveness.

**Approach: Docker-based deployment with Coolify control panel**

This strategy provides:
- **Zero software costs** - All components are free and open-source
- **Web UI management** - Easy server and application management
- **Git-based deployments** - Push-to-deploy workflow
- **Automatic SSL** - Let's Encrypt integration
- **Built-in monitoring** - Server and application health tracking
- **Database backups** - Automated backup to S3-compatible storage
- **No vendor lock-in** - Standard Docker containers

---

## 1. Architecture Overview

### 1.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              INTERNET                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Hetzner VPS (CX31/CPX31)                             │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         Coolify Control Panel                          │  │
│  │                    Port 3000 (Management Interface)                    │  │
│  │                                                                        │  │
│  │   - Git Integration        - SSL Management      - Monitoring         │  │
│  │   - Database Management    - Backup Scheduling   - User Management    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│  ┌─────────────────────────────────┴─────────────────────────────────────┐  │
│  │                        Docker Network (bridge)                         │  │
│  │                                                                        │  │
│  │   ┌──────────────────┐    ┌──────────────────┐    ┌─────────────────┐ │  │
│  │   │   Nginx Proxy    │    │   LaraClassifier │    │    MariaDB      │ │  │
│  │   │   Container      │    │   PHP-FPM 8.2    │    │    Container    │ │  │
│  │   │   Port 80/443    │    │   Container      │    │    Port 3306    │ │  │
│  │   │                  │───►│                  │───►│                 │ │  │
│  │   │  - SSL Termination   │  - Laravel App    │    │  - Database     │ │  │
│  │   │  - Reverse Proxy     │  - Queue Worker   │    │  - Persistence  │ │  │
│  │   │  - Static Files      │  - Scheduler      │    │                 │ │  │
│  │   └──────────────────┘    └──────────────────┘    └─────────────────┘ │  │
│  │           │                                                │         │  │
│  │           │         ┌──────────────────┐                   │         │  │
│  │           │         │     Redis        │                   │         │  │
│  │           └────────►│    Container     │◄──────────────────┘         │  │
│  │                     │    Port 6379     │                            │  │
│  │                     │                  │                            │  │
│  │                     │  - Cache         │                            │  │
│  │                     │  - Sessions      │                            │  │
│  │                     │  - Queues        │                            │  │
│  │                     └──────────────────┘                            │  │
│  │                                                                       │  │
│  │   ┌──────────────────────────────────────────────────────────────┐  │  │
│  │   │                    Docker Volumes                             │  │  │
│  │   │                                                               │  │  │
│  │   │  - app-storage (user uploads, pictures)                      │  │  │
│  │   │  - mysql-data (database files)                               │  │  │
│  │   │  - redis-data (cache persistence)                            │  │  │
│  │   │  - letsencrypt (SSL certificates)                            │  │  │
│  │   └──────────────────────────────────────────────────────────────┘  │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    Hetzner Storage Box (Optional)                      │  │
│  │                    BX11 - 100GB (Backups via SFTP)                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Server Infrastructure

### 2.1 Recommended Server Types

#### Production Environment (Recommended)

| Component | Server Type | vCPU | RAM | Storage | Monthly Cost |
|-----------|-------------|------|-----|---------|--------------|
| **Single Server** | CX31 | 2 | 8 GB | 80 GB SSD | ~€8.40 |
| **Storage Box (Backups)** | BX11 | - | - | 100 GB | ~€3.81 |
| **Total** | | | | | **~€12.21/month** |

#### High-Traffic Production (Scalable)

| Component | Server Type | vCPU | RAM | Storage | Monthly Cost |
|-----------|-------------|------|-----|---------|--------------|
| **Load Balancer** | LB11 | - | - | - | ~€5.44 |
| **Web Server 1** | CPX31 | 4 | 8 GB | 80 GB NVMe | ~€10.90 |
| **Web Server 2** | CPX31 | 4 | 8 GB | 80 GB NVMe | ~€10.90 |
| **Database Server** | CCX23 | 4 | 16 GB | 160 GB NVMe | ~€25.46 |
| **Redis Server** | CX31 | 2 | 8 GB | 80 GB SSD | ~€8.40 |
| **Storage Box** | BX21 | - | - | 250 GB | ~€7.26 |
| **Total** | | | | | **~€68.36/month** |

### 2.2 Resource Allocation for Single Server

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Hetzner CX31 (8 GB RAM, 2 vCPU)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     Docker Resource Allocation                       │   │
│  │                                                                      │   │
│  │  Coolify (Control Panel)          ~512 MB RAM                       │   │
│  │  LaraClassifier App Container     ~1.5 GB RAM                       │   │
│  │  Nginx Container                  ~128 MB RAM                       │   │
│  │  MariaDB Container                ~2 GB RAM                         │   │
│  │  Redis Container                  ~512 MB RAM                       │   │
│  │  Queue Worker Container           ~512 MB RAM                       │   │
│  │  Scheduler Container              ~256 MB RAM                       │   │
│  │  ─────────────────────────────────────────                          │   │
│  │  Total Docker Usage               ~5.5 GB RAM                       │   │
│  │  OS & System Reserved             ~1.5 GB RAM                       │   │
│  │  Available for Scaling            ~1 GB RAM                         │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Storage Allocation (80 GB SSD):                                            │
│  ├── OS & Docker: ~10 GB                                                    │
│  ├── Application Code: ~500 MB                                              │
│  ├── Database: ~20 GB (growable)                                            │
│  ├── User Uploads: ~40 GB (growable)                                        │
│  └── Available: ~10 GB                                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Coolify Installation

### 3.1 Install Coolify

```bash
# SSH into your Hetzner VPS
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Coolify (automated installation)
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

The installation script will:
- Install Docker and Docker Compose
- Set up Coolify containers
- Configure the firewall
- Generate SSL certificates for the control panel

### 3.2 Access Coolify Dashboard

1. Open your browser and navigate to: `http://your-server-ip:3000`
2. Create your admin account
3. Register your server (localhost will be auto-detected)

---

## 4. Docker Configuration

### 4.1 Docker Compose

The `deployment/docker/docker-compose.yml` file contains all service definitions:

- **app** - Laravel PHP-FPM application
- **nginx** - Web server and reverse proxy
- **db** - MariaDB database
- **redis** - Cache and queue backend
- **queue** - Queue worker
- **scheduler** - Laravel scheduler

### 4.2 Dockerfile

The `deployment/docker/Dockerfile` is optimized for Laravel:
- PHP 8.2 FPM Alpine base
- Required PHP extensions
- OPcache optimization
- Composer installation

### 4.3 Nginx Configuration

The `deployment/docker/nginx/default.conf` provides:
- SSL termination
- Reverse proxy to PHP-FPM
- Static file caching
- Security headers

---

## 5. Deployment Workflow

### 5.1 Coolify Deployment Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Git Provider   │     │    Coolify       │     │   Hetzner VPS    │
│                  │     │   Control Panel  │     │                  │
│  ┌────────────┐  │     │  ┌────────────┐  │     │  ┌────────────┐  │
│  │  GitHub    │  │     │  │  Webhook   │  │     │  │  Docker    │  │
│  │  GitLab    │──┼────►│  │  Receiver  │──┼────►│  │  Engine    │  │
│  │  Bitbucket │  │     │  │            │  │     │  │            │  │
│  └────────────┘  │     │  └────────────┘  │     │  └────────────┘  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

### 5.2 Deployment Steps

1. **Create Project in Coolify**
   - Navigate to Projects → New Project
   - Name: "LaraClassifier"

2. **Add Application**
   - Type: Git Repository
   - Connect GitHub/GitLab
   - Select repository and branch

3. **Configure Build**
   - Build Pack: Docker Compose
   - Docker Compose Location: `deployment/docker/docker-compose.yml`

4. **Link Databases**
   - Link MariaDB database
   - Link Redis instance

5. **Configure Domain & SSL**
   - Add domain
   - Enable Let's Encrypt SSL

6. **Deploy**
   - Click Deploy
   - Monitor logs

---

## 6. CI/CD Pipeline

### 6.1 GitHub Actions Workflow

The `deployment/ci-cd/github-actions.yml` provides:

1. **Test Stage**
   - PHPStan analysis
   - Laravel Pint formatting
   - PHPUnit tests

2. **Build Stage**
   - npm build
   - Asset compilation

3. **Deploy Stage**
   - Trigger Coolify webhook
   - Run migrations
   - Clear cache

### 6.2 Webhook Configuration

```bash
# Trigger deployment via webhook
curl -X POST "https://coolify.your-domain.com/api/v1/deploy?uuid=APP_UUID" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"force": true}'
```

---

## 7. Backup Strategy

### 7.1 Coolify Built-in Backups

Configure in Coolify dashboard:
1. Go to Database → Backups
2. Enable automatic backups
3. Set schedule: Daily at 2:00 AM
4. Set retention: 7-30 days
5. Configure S3 storage (optional)

### 7.2 Manual Backup Commands

```bash
# Database backup
docker exec laraclassifier-db mysqldump -u root -p laraclassifier > backup.sql

# Storage backup
docker cp laraclassifier-app:/var/www/storage ./storage_backup
```

---

## 8. Monitoring

### 8.1 Coolify Built-in Monitoring

- Server resource monitoring (CPU, RAM, Disk)
- Container status tracking
- Deployment logs
- Configurable alerts

### 8.2 Health Checks

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' laraclassifier-app

# View all container statuses
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

---

## 9. Cost Estimation

### 9.1 Monthly Cost Breakdown

| Component | Specification | Monthly Cost (EUR) |
|-----------|---------------|-------------------|
| **VPS Server** | CX31 (2 vCPU, 8 GB RAM, 80 GB SSD) | €8.40 |
| **Storage Box** | BX11 (100 GB) - Backups | €3.81 |
| **Traffic** | Included (20 TB) | €0.00 |
| **Coolify** | Open Source | €0.00 |
| **Docker** | Open Source | €0.00 |
| **SSL Certificates** | Let's Encrypt | €0.00 |
| **Total** | | **€12.21/month** |

### 9.2 Annual Cost

| Item | Cost |
|------|------|
| Server Infrastructure | €100.92/year |
| Storage Box | €45.72/year |
| Domain | ~€15/year |
| **Total** | **~€161.64/year** |

---

## 10. Implementation Checklist

### Phase 1: Infrastructure Setup

- [ ] Create Hetzner Cloud account
- [ ] Provision VPS server (CX31) with Ubuntu 24.04
- [ ] Configure server hostname
- [ ] Update system
- [ ] Order Storage Box (BX11) for backups

### Phase 2: Coolify Installation

- [ ] Run Coolify installation script
- [ ] Access Coolify dashboard at port 3000
- [ ] Create admin account
- [ ] Register localhost server

### Phase 3: Database Setup

- [ ] Create MariaDB database in Coolify
- [ ] Create Redis instance in Coolify
- [ ] Note connection details

### Phase 4: Application Deployment

- [ ] Create new Project in Coolify
- [ ] Connect Git repository
- [ ] Configure build settings
- [ ] Set environment variables
- [ ] Link databases
- [ ] Deploy application

### Phase 5: Domain & SSL

- [ ] Configure domain in Coolify
- [ ] Enable Let's Encrypt SSL
- [ ] Verify HTTPS redirect

### Phase 6: Post-Deployment

- [ ] Run database migrations
- [ ] Create storage link
- [ ] Optimize application (cache)
- [ ] Create admin user

### Phase 7: CI/CD Setup

- [ ] Configure GitHub Actions workflow
- [ ] Set up Coolify API token
- [ ] Configure deployment secrets
- [ ] Test deployment pipeline

### Phase 8: Backup & Monitoring

- [ ] Configure database backups
- [ ] Set up monitoring alerts
- [ ] Test backup restore

---

## 11. Quick Reference

### Docker Commands

```bash
# List containers
docker ps -a

# View logs
docker logs laraclassifier-app -f

# Execute command
docker exec laraclassifier-app php artisan migrate

# Restart services
docker restart laraclassifier-app laraclassifier-queue
```

### Laravel Commands

```bash
php artisan migrate --force    # Run migrations
php artisan optimize           # Cache all
php artisan optimize:clear     # Clear all cache
php artisan queue:work         # Process queue
php artisan schedule:run       # Run scheduler
```

---

## Document Information

| Property | Value |
|----------|-------|
| Version | 3.0 |
| Created | 2026-02-24 |
| Updated | 2026-02-25 |
| Author | Architecture Team |
| Status | Final |
| Deployment Type | Docker + Coolify |

---

## Summary

This deployment strategy uses **Coolify** as the control panel for managing a Docker-based LaraClassifier deployment on Hetzner VPS.

### Key Recommendations

1. **Control Panel**: Coolify (free, open-source, Docker-native)
2. **Server**: Single Hetzner CX31 (2 vCPU, 8 GB RAM, 80 GB SSD)
3. **Monthly Cost**: ~€12.21 (server + storage box)
4. **Deployment**: Git-based push-to-deploy via Coolify
5. **SSL**: Free Let's Encrypt certificates (auto-managed)
6. **Backups**: Automated daily backups to Hetzner Storage Box
7. **Monitoring**: Built-in via Coolify dashboard

### Next Steps

1. Provision Hetzner CX31 server with Ubuntu 24.04
2. Install Coolify using the installation script
3. Configure databases (MariaDB + Redis) in Coolify
4. Connect Git repository and deploy application
5. Configure domain and SSL
6. Set up backups and monitoring

---

*This deployment strategy document provides a comprehensive guide for hosting LaraClassifier on Hetzner VPS using Docker and Coolify.*
