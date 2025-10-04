# Quick Start Guide: PostgreSQL Migration

## ⚠️ IMPORTANT: Docker Desktop Required

Before proceeding, you MUST have Docker Desktop installed and running.

### Step 1: Install Docker Desktop (If Not Already Installed)

1. **Download Docker Desktop for Windows**:

   - Visit: https://www.docker.com/products/docker-desktop
   - Download "Docker Desktop for Windows"
   - System Requirements:
     - Windows 10 64-bit: Pro, Enterprise, or Education (Build 19044 or higher)
     - OR Windows 11 64-bit
     - WSL 2 feature enabled
     - 4GB+ RAM

2. **Install Docker Desktop**:

   - Run the downloaded installer
   - Follow the installation wizard
   - Accept the license agreement
   - Ensure "Use WSL 2 instead of Hyper-V" is checked
   - Complete installation
   - **Restart your computer**

3. **Start Docker Desktop**:

   - Open Docker Desktop from Start Menu
   - Wait for Docker to start (Docker icon in system tray should show "Docker Desktop is running")
   - You may need to accept WSL 2 kernel update prompts

4. **Verify Docker Installation**:

   ```powershell
   docker --version
   docker-compose --version
   ```

   Expected output:

   ```
   Docker version 24.x.x, build xxxxxxx
   Docker Compose version v2.x.x
   ```

---

## Step 2: Start PostgreSQL Container

Once Docker Desktop is running:

```powershell
cd C:\projects\Oops\Cab-Booking-System\backend
docker-compose up -d
```

This will:

- Download PostgreSQL 16 Alpine image (~80MB, first time only)
- Create container named `cab_booking_postgres`
- Create database `cab_booking_db`
- Start PostgreSQL on port 5432

**Verify PostgreSQL is running**:

```powershell
docker-compose ps
```

Expected output:

```
NAME                    STATUS         PORTS
cab_booking_postgres    Up (healthy)   0.0.0.0:5432->5432/tcp
```

---

## Step 3: Rebuild Backend with PostgreSQL

```powershell
cd C:\projects\Oops\Cab-Booking-System\backend
mvn clean install
```

This rebuilds the project with the PostgreSQL JDBC driver.

---

## Step 4: Run the Backend

**Option 1: Using JAR file**

```powershell
cd C:\projects\Oops\Cab-Booking-System\backend
java -jar target\cab-booking-system-1.0.0.jar
```

**Option 2: Using Maven**

```powershell
cd C:\projects\Oops\Cab-Booking-System\backend
mvn spring-boot:run
```

Backend will start on: **http://localhost:8080**

---

## Step 5: Run the Frontend

**Open a NEW PowerShell terminal** and run:

```powershell
cd C:\projects\Oops\Cab-Booking-System\frontend
npm install  # Only needed first time or after package.json changes
npm run dev
```

Frontend will start on: **http://localhost:3000**

---

## Database Connection Details

Your backend is now configured with:

```
Host:     localhost
Port:     5432
Database: cab_booking_db
Username: postgres
Password: postgres
JDBC URL: jdbc:postgresql://localhost:5432/cab_booking_db
```

---

## What Changed?

### 1. `backend/pom.xml`

- ❌ Removed: `mysql-connector-j`
- ✅ Added: `org.postgresql:postgresql` (PostgreSQL JDBC driver)

### 2. `backend/src/main/resources/application.properties`

- Changed database URL from MySQL to PostgreSQL
- Changed driver class to `org.postgresql.Driver`
- Changed Hibernate dialect to `PostgreSQLDialect`
- Updated credentials to `postgres/postgres`

### 3. `backend/docker-compose.yml` (NEW)

- PostgreSQL 16 Alpine container configuration
- Database: `cab_booking_db`
- Port mapping: `5432:5432`
- Persistent volume: `postgres_data`
- Health checks enabled

---

## Testing the Setup

### 1. Test Backend API

```powershell
# Register a new user
Invoke-RestMethod -Method POST -Uri "http://localhost:8080/api/auth/register" `
  -ContentType "application/json" `
  -Body '{"name":"Test User","email":"test@example.com","password":"password123","phoneNumber":"1234567890"}'

# Login
Invoke-RestMethod -Method POST -Uri "http://localhost:8080/api/auth/login" `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"password123"}'

# Get all cabs
Invoke-RestMethod -Method GET -Uri "http://localhost:8080/api/cabs"
```

### 2. Access PostgreSQL Database Directly

```powershell
docker exec -it cab_booking_postgres psql -U postgres -d cab_booking_db
```

Inside psql:

```sql
\dt              -- List all tables
SELECT * FROM users;
SELECT * FROM cabs;
SELECT * FROM bookings;
\q               -- Quit
```

---

## Troubleshooting

### ❌ Error: "unable to get image 'postgres:16-alpine'"

**Problem**: Docker Desktop is not running

**Solution**:

1. Open Docker Desktop application
2. Wait for it to fully start (check system tray icon)
3. Try `docker-compose up -d` again

---

### ❌ Error: "port 5432 already in use"

**Problem**: Another PostgreSQL instance is using port 5432

**Solution Option 1** - Stop local PostgreSQL:

```powershell
Get-Service postgresql* | Stop-Service
```

**Solution Option 2** - Change Docker port:

Edit `docker-compose.yml`:

```yaml
ports:
  - "5433:5432" # Change to 5433
```

Edit `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5433/cab_booking_db
```

Restart:

```powershell
docker-compose down
docker-compose up -d
```

---

### ❌ Error: "Connection refused" from Spring Boot

**Check Docker container status**:

```powershell
docker-compose ps
docker-compose logs postgres
```

**Ensure container is healthy**:

```powershell
docker exec -it cab_booking_postgres pg_isready -U postgres
```

---

## Useful Docker Commands

```powershell
# Stop PostgreSQL container
docker-compose down

# Stop and remove all data (⚠️ Deletes database)
docker-compose down -v

# View PostgreSQL logs
docker-compose logs -f postgres

# Restart container
docker-compose restart

# Check container status
docker-compose ps

# Remove all containers and start fresh
docker-compose down -v
docker-compose up -d
```

---

## Next Steps

1. ✅ Ensure Docker Desktop is installed and running
2. ✅ Start PostgreSQL: `docker-compose up -d`
3. ✅ Rebuild backend: `mvn clean install`
4. ✅ Start backend: `java -jar target\cab-booking-system-1.0.0.jar`
5. ✅ Start frontend: `npm run dev` (in frontend directory)
6. ✅ Test at: http://localhost:3000

---

## Complete Migration Summary

### Before (MySQL)

- Required local MySQL installation
- Manual database creation
- Configuration issues with passwords
- Connection errors

### After (PostgreSQL + Docker)

- No local PostgreSQL installation needed
- Automatic database creation
- Containerized and isolated
- Easy to reset/restart
- Portable across environments
- Simple setup with one command

---

## Need More Help?

See detailed documentation:

- **POSTGRESQL_DOCKER_SETUP.md** - Complete Docker and PostgreSQL guide
- **BACKEND_SETUP.md** - Backend setup instructions
- **API_DOCUMENTATION.md** - API endpoint reference
- **QUICK_START.md** - Overall project quick start

---

**Your backend is now configured for PostgreSQL with Docker! 🚀**
