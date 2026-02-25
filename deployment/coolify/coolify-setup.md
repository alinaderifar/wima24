# Coolify Installation and Setup Guide

## Table of Contents

1. [Overview](#overview)
2. [Server Requirements](#server-requirements)
3. [Installing Coolify](#installing-coolify)
4. [Initial Configuration](#initial-configuration)
5. [Setting Up Services](#setting-up-services)
6. [Security Configuration](#security-configuration)
7. [Troubleshooting](#troubleshooting)

---

## Overview

Coolify is an open-source, self-hostable PaaS (Platform as a Service) that simplifies application deployment. It provides:

- **One-click deployments** for various applications
- **Automatic SSL certificates** via Let's Encrypt
- **Docker-based deployments** for isolation and scalability
- **Built-in database management** (MySQL, PostgreSQL, Redis, MongoDB)
- **Git integration** for automatic deployments
- **Webhook support** for CI/CD pipelines
- **Free and open-source** alternative to Heroku/Vercel

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
│   │                    (Port 3000/80/443)                        ││
│   └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│              ┌───────────────┼───────────────┐                   │
│              ▼               ▼               ▼                   │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │   LaraClass  │  │   MariaDB    │  │    Redis     │          │
│   │   Container  │  │   Container  │  │   Container  │          │
│   └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────────┐│
│   │              Docker Network (coolify)                        ││
│   └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Server Requirements

### Minimum Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 2 vCPUs | 4 vCPUs |
| RAM | 4 GB | 8 GB |
| Storage | 40 GB SSD | 80 GB SSD |
| OS | Ubuntu 20.04/22.04/24.04 | Ubuntu 24.04 |

### Recommended Hetzner Server Types

| Server Type | Specs | Use Case |
|-------------|-------|----------|
| CX31 | 4 vCPU, 8 GB RAM, 80 GB Disk | Small production |
| CX41 | 8 vCPU, 16 GB RAM, 160 GB Disk | Medium production |
| CPX31 | 4 vCPU, 8 GB RAM, 80 GB Disk | Development/Staging |

### Required Ports

| Port | Purpose |
|------|---------|
| 22 | SSH |
| 80 | HTTP |
| 443 | HTTPS |
| 3000 | Coolify Dashboard (if not using 80/443) |

---

## Installing Coolify

### Step 1: Create Hetzner Server

```bash
# Using hcloud CLI
hcloud server create \
    --name coolify-server \
    --type cx31 \
    --image ubuntu-24.04 \
    --location fsn1 \
    --ssh-key YOUR_SSH_KEY_NAME
```

### Step 2: Initial Server Setup

```bash
# SSH into server
ssh root@YOUR_SERVER_IP

# Update system
apt update && apt upgrade -y

# Install required packages
apt install -y curl wget git

# Configure firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw --force enable
```

### Step 3: Install Coolify

Coolify provides an automatic installation script:

```bash
# Run the official Coolify installation script
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

The script will:
1. Install Docker and Docker Compose
2. Set up Coolify containers
3. Configure automatic SSL
4. Start the Coolify dashboard

### Step 4: Access Coolify Dashboard

1. Open your browser and navigate to:
   - `http://YOUR_SERVER_IP:3000` or
   - `http://coolify.your-domain.com` (if DNS configured)

2. On first access, you'll be prompted to:
   - Create an admin account
   - Set up your domain
   - Configure SSL settings

---

## Initial Configuration

### Step 1: Configure Domain

1. Go to **Settings** → **Configuration**
2. Set your **Instance Domain** (e.g., `coolify.your-domain.com`)
3. Enable **HTTPS** for the dashboard
4. Save changes

### Step 2: Configure DNS

Add DNS records for your domains:

```
Type    Name                Value               TTL
A       coolify             SERVER_IP           300
A       app                 SERVER_IP           300
A       www                 SERVER_IP           300
```

### Step 3: Configure Email (Optional but Recommended)

1. Go to **Settings** → **Email**
2. Configure SMTP settings:
   ```
   Host: smtp.your-email-provider.com
   Port: 587
   Username: your-username
   Password: your-password
   From: noreply@your-domain.com
   ```
3. Test email delivery
4. Save settings

### Step 4: Configure Backup

1. Go to **Settings** → **Backup**
2. Configure backup settings:
   - Enable automatic backups
   - Set backup schedule (daily recommended)
   - Configure S3/SFTP storage for off-site backups
3. Save settings

---

## Setting Up Services

### Create Database (MariaDB/MySQL)

1. Go to **Databases** → **New Database**
2. Select **MySQL/MariaDB**
3. Configure:
   ```
   Name: laraclassifier-db
   Version: 11.4 (or latest)
   Root Password: [auto-generated or custom]
   ```
4. Click **Deploy**
5. Note the connection details:
   ```
   Host: laraclassifier-db
   Port: 3306
   Database: laraclassifier (created automatically)
   Username: laraclassifier
   Password: [generated password]
   ```

### Create Redis Instance

1. Go to **Databases** → **New Database**
2. Select **Redis**
3. Configure:
   ```
   Name: laraclassifier-redis
   Version: 7 (or latest)
   Password: [set a strong password]
   Max Memory: 256MB
   ```
4. Click **Deploy**
5. Note the connection details:
   ```
   Host: laraclassifier-redis
   Port: 6379
   Password: [your password]
   ```

### Create Application

1. Go to **Applications** → **New Application**
2. Select deployment type:
   - **Git Repository**: Connect to GitHub/GitLab
   - **Docker Compose**: Use docker-compose.coolify.yml
   - **Public Repository**: Clone from public repo

3. Configure application:
   ```
   Name: laraclassifier
   Domain: your-domain.com
   Repository: https://github.com/your-repo/laraclassifier
   Branch: main
   ```
4. Set build configuration:
   ```
   Dockerfile Location: deployment/docker/Dockerfile
   Build Target: production
   ```

5. Configure environment variables (see next section)

6. Click **Deploy**

---

## Security Configuration

### Step 1: Configure SSL

1. Go to **Settings** → **SSL**
2. Enable **Let's Encrypt**
3. Configure:
   ```
   Email: your-email@domain.com
   Auto-renewal: Enabled
   ```
4. For each application, enable **Force HTTPS**

### Step 2: Configure Firewall

Coolify manages its own firewall rules, but you can add custom rules:

```bash
# SSH access (already configured)
ufw allow 22/tcp

# HTTP/HTTPS (Coolify manages these)
ufw allow 80/tcp
ufw allow 443/tcp

# Coolify dashboard (if needed)
ufw allow 3000/tcp

# Enable firewall
ufw --force enable
```

### Step 3: Secure Coolify Dashboard

1. Go to **Settings** → **Security**
2. Enable **Two-Factor Authentication**
3. Configure **IP Whitelist** (optional)
4. Set **Session Timeout** (recommended: 1 hour)

### Step 4: Configure OAuth (Optional)

1. Go to **Settings** → **Authentication**
2. Configure OAuth providers:
   - GitHub
   - GitLab
   - Google
3. This allows team members to log in with their accounts

---

## Troubleshooting

### Common Issues

#### Coolify Dashboard Not Accessible

```bash
# Check Coolify status
docker ps | grep coolify

# Check Coolify logs
docker logs coolify

# Restart Coolify
docker restart coolify
```

#### SSL Certificate Issues

```bash
# Check certificate status
docker exec coolify certbot certificates

# Force certificate renewal
docker exec coolify certbot renew --force-renewal
```

#### Container Won't Start

```bash
# Check container logs
docker logs laraclassifier-app

# Check Docker network
docker network ls
docker network inspect coolify

# Rebuild container
docker-compose -f /data/coolify/apps/laraclassifier/docker-compose.yml up -d --build
```

#### Database Connection Issues

```bash
# Check database container
docker ps | grep mysql
docker logs laraclassifier-db

# Test connection
docker exec -it laraclassifier-db mysql -u root -p
```

### Useful Commands

```bash
# View all containers
docker ps -a

# View Coolify services
docker-compose -f /data/coolify/docker-compose.yml ps

# Restart all Coolify services
docker-compose -f /data/coolify/docker-compose.yml restart

# View Coolify logs
tail -f /var/log/coolify/coolify.log

# Check disk usage
df -h
docker system df

# Clean up unused resources
docker system prune -a
```

---

## Next Steps

After completing Coolify setup:

1. [Deploy LaraClassifier Application](app-deployment.md)
2. [Configure CI/CD Pipeline](../ci-cd/coolify-webhook.md)
3. [Set Up Monitoring](../monitoring/health-check.sh)

---

## Additional Resources

- [Coolify Documentation](https://coolify.io/docs)
- [Coolify GitHub](https://github.com/coollabsio/coolify)
- [Coolify Discord](https://discord.gg/coolify)
- [Docker Documentation](https://docs.docker.com/)

---

*Document Version: 1.0*
*Last Updated: 2026-02-24*
