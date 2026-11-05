# MySQL Backend Setup Guide

## Prerequisites
- PHP 7.4+ with PDO extension
- MySQL 5.7+ or MariaDB 10.3+
- Web server (Apache/Nginx) with PHP support

## Setup Steps

### 1. Create Database
```sql
CREATE DATABASE bernard_portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Import Schema
```bash
mysql -u root -p bernard_portfolio < database/schema.sql
```

### 3. Configure Database Connection
Edit `backend/config.php` and update:
- DB_HOST (usually 'localhost')
- DB_NAME ('bernard_portfolio')
- DB_USER (your MySQL username)
- DB_PASS (your MySQL password)

### 4. Deploy Backend
Upload the `backend/` folder to your PHP hosting server. The backend should be accessible at:
- https://your-domain.com/backend/login.php
- https://your-domain.com/backend/register.php
- https://your-domain.com/backend/create-admin.php
- https://your-domain.com/backend/logout.php

### 5. Update Frontend
Update the auth pages to point to your backend URL. In `auth/login.html` and `auth/register.html`, replace the localStorage logic with fetch() calls to your backend.

### 6. Create First Admin
Since public registration only creates 'user' role accounts, you need to create the first admin manually:
```sql
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin', 'admin@bernard-portfolio.com', '$2y$10$hashedpassword', 'admin');
```
Or use PHP's password_hash() function to generate the password hash.

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /backend/login.php | POST | Login with email & password |
| /backend/register.php | POST | Register new user (role: user) |
| /backend/create-admin.php | POST | Create admin (requires admin token) |
| /backend/logout.php | POST | Logout (invalidate session) |

### Request/Response Examples

**Register:**
```json
POST /backend/register.php
{ "name": "John", "email": "john@example.com", "password": "password123" }

Response: { "success": true, "message": "Account created successfully", "user": {...} }
```

**Login:**
```json
POST /backend/login.php
{ "email": "john@example.com", "password": "password123" }

Response: { "success": true, "token": "abc123...", "user": {...} }
```

**Create Admin (requires Bearer token):**
```json
POST /backend/create-admin.php
Authorization: Bearer <admin_token>
{ "name": "Admin", "email": "admin@example.com", "password": "adminpass123" }

Response: { "success": true, "message": "Admin account created successfully", "user": {...} }
```

### Security Notes
- Passwords are hashed using bcrypt (PASSWORD_BCRYPT)
- Sessions expire after 24 hours
- Admin-only endpoints require Bearer token authentication
- Public registration is restricted to 'user' role only
- CORS headers are configured for cross-origin requests