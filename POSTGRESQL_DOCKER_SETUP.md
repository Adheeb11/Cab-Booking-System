# PostgreSQL with Docker Setup Guide

This guide will help you set up PostgreSQL using Docker for the Cab Booking System backend.

## Prerequisites

### 1. Install Docker Desktop for Windows

1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop
2. Run the installer and follow the installation wizard
3. After installation, restart your computer
4. Open Docker Desktop and ensure it's running (look for the Docker icon in system tray)
5. Verify installation:
   ```powershell
   docker --version
   docker-compose --version
   ```

## Setup Steps

### Step 1: Navigate to Backend Directory

```powershell
cd C:\projects\Oops\Cab-Booking-System\backend
```

### Step 2: Start PostgreSQL Container

```powershell
docker-compose up -d
```

This command will:

- Download the PostgreSQL 16 Alpine image (first time only)
- Create a container named `cab_booking_postgres`
- Create a database named `cab_booking_db`
- Set up user `postgres` with password `postgres`
- Expose PostgreSQL on port `5432`
- Create a persistent volume for data storage

### Step 3: Verify PostgreSQL is Running

```powershell
docker-compose ps
```

You should see:

```
NAME                    IMAGE                COMMAND                  SERVICE    CREATED         STATUS                   PORTS
cab_booking_postgres    postgres:16-alpine   "docker-entrypoint.s…"   postgres   X seconds ago   Up X seconds (healthy)   0.0.0.0:5432->5432/tcp
```

### Step 4: Rebuild Maven Project

```powershell
mvn clean install
```

This rebuilds the project with the PostgreSQL driver.

### Step 5: Run the Backend

```powershell
java -jar target\cab-booking-system-1.0.0.jar
```

Or using Maven:

```powershell
mvn spring-boot:run
```

## Database Connection Details

- **Host**: localhost
- **Port**: 5432
- **Database**: cab_booking_db
- **Username**: postgres
- **Password**: postgres
- **JDBC URL**: jdbc:postgresql://localhost:5432/cab_booking_db

## Docker Commands Reference

### Start PostgreSQL Container

```powershell
docker-compose up -d
```

### Stop PostgreSQL Container

```powershell
docker-compose down
```

### Stop and Remove Data (⚠️ Deletes all data)

```powershell
docker-compose down -v
```

### View Container Logs

```powershell
docker-compose logs -f postgres
```

### Access PostgreSQL CLI (psql)

```powershell
docker exec -it cab_booking_postgres psql -U postgres -d cab_booking_db
```

Common psql commands:

- `\dt` - List all tables
- `\d table_name` - Describe table structure
- `\l` - List all databases
- `\q` - Quit psql
- `SELECT * FROM users;` - Query users table

### Restart Container

```powershell
docker-compose restart
```

### Check Container Status

```powershell
docker-compose ps
```

## Troubleshooting

### Issue: Port 5432 Already in Use

If you have a local PostgreSQL installation running:

**Option 1: Stop Local PostgreSQL**

```powershell
Stop-Service postgresql-x64-14  # Adjust version number
```

**Option 2: Change Docker Port**

Edit `docker-compose.yml`:

```yaml
ports:
  - "5433:5432" # Use port 5433 instead
```

Then update `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5433/cab_booking_db
```

### Issue: Docker Desktop Not Starting

1. Ensure Windows features are enabled:

   - Open PowerShell as Administrator
   - Run: `Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All`
   - Restart computer

2. Check WSL 2:
   - Open PowerShell as Administrator
   - Run: `wsl --install`
   - Restart computer

### Issue: Container Keeps Restarting

Check logs:

```powershell
docker-compose logs postgres
```

Common fixes:

- Ensure no other service is using port 5432
- Verify Docker Desktop has sufficient resources (Settings > Resources)
- Check disk space

### Issue: Connection Refused from Spring Boot

1. Verify container is running:

   ```powershell
   docker-compose ps
   ```

2. Check container health:

   ```powershell
   docker inspect cab_booking_postgres | Select-String -Pattern "Health"
   ```

3. Test connection manually:

   ```powershell
   docker exec -it cab_booking_postgres psql -U postgres -c "SELECT 1"
   ```

4. Ensure application.properties has correct settings:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/cab_booking_db
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   spring.datasource.driver-class-name=org.postgresql.Driver
   ```

### Issue: Data Persistence

PostgreSQL data is stored in a Docker volume named `postgres_data`. This persists even when the container is stopped.

To view volume:

```powershell
docker volume ls
```

To backup data:

```powershell
docker exec -t cab_booking_postgres pg_dumpall -c -U postgres > backup.sql
```

To restore data:

```powershell
cat backup.sql | docker exec -i cab_booking_postgres psql -U postgres
```

## Database Schema

On first run, Spring Boot will automatically create these tables:

- `users` - User accounts
- `drivers` - Driver profiles
- `cabs` - Cab/vehicle information
- `bookings` - Ride bookings
- `payments` - Payment records

The `DataInitializer` component will also populate sample data.

## Changing Database Credentials

To use different credentials:

1. Edit `docker-compose.yml`:

   ```yaml
   environment:
     POSTGRES_DB: your_database_name
     POSTGRES_USER: your_username
     POSTGRES_PASSWORD: your_password
   ```

2. Update `application.properties`:

   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/your_database_name
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. Restart containers:
   ```powershell
   docker-compose down -v  # ⚠️ Removes existing data
   docker-compose up -d
   ```

## Production Considerations

For production deployments:

1. **Use Strong Passwords**: Replace default `postgres/postgres` credentials
2. **Environment Variables**: Use `.env` file for sensitive data
3. **SSL Connections**: Enable SSL in PostgreSQL configuration
4. **Regular Backups**: Set up automated backup schedules
5. **Resource Limits**: Configure memory and CPU limits in docker-compose.yml
6. **Networking**: Use Docker networks to isolate database access
7. **Monitoring**: Add health check endpoints and monitoring tools

## Next Steps

1. Start Docker Desktop
2. Run `docker-compose up -d` in the backend directory
3. Run `mvn clean install` to rebuild with PostgreSQL
4. Start the backend: `java -jar target\cab-booking-system-1.0.0.jar`
5. Test API endpoints at `http://localhost:8080`
6. Start the frontend and test the complete application

## Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Spring Boot with PostgreSQL](https://spring.io/guides/gs/accessing-data-jpa/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
