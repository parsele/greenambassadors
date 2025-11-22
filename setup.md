# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm run install-all
```

This will install dependencies for:
- Root project
- Server (backend)
- Client (frontend)

## Step 2: Set Up MySQL

### Option A: Local MySQL
1. Install MySQL on your system (or use XAMPP/WAMP)
2. Start MySQL service
3. Create a database:
   ```sql
   CREATE DATABASE amboseli_trees;
   ```

### Option B: Cloud MySQL (AWS RDS, DigitalOcean, etc.)
1. Create a MySQL database instance
2. Get your connection details (host, port, username, password)
3. Update `.env` file with your connection details

## Step 3: Configure Environment

Create `server/.env` file:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=amboseli_trees
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your-secret-key-change-in-production-use-random-string
```

**Important**: Change `JWT_SECRET` to a random secure string in production!

## Step 4: Run the Application

**Note:** The database tables will be created automatically when you first run the server.

```bash
npm run dev
```

This starts:
- Backend server on http://localhost:5000
- Frontend dev server on http://localhost:3000

## Step 5: Create Admin Account

1. Open http://localhost:3000
2. Click "Register"
3. Fill in your details
4. Select "Admin" role
5. Register and login

## Troubleshooting

### MySQL Connection Error
- Make sure MySQL is running
- Check your database credentials in `.env`
- Verify the database exists: `SHOW DATABASES;`
- Check MySQL user permissions
- For cloud MySQL: Ensure your IP is whitelisted

### Port Already in Use
- Change `PORT` in `server/.env`
- Update `vite.config.js` proxy target if needed

### Module Not Found
- Run `npm run install-all` again
- Delete `node_modules` and reinstall

## Next Steps

- Add trees manually via Dashboard
- Download CSV template for bulk upload
- Customize map center coordinates in `MapPage.jsx`
- Add your own styling/branding

