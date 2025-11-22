# Quick Start Guide

## ✅ Installation Complete!

All dependencies have been installed successfully. Here's what to do next:

## Step 1: Set Up MySQL Database

1. **Start MySQL** (if not already running)

2. **Create the database:**
   ```sql
   CREATE DATABASE amboseli_trees;
   ```

   Or use MySQL command line:
   ```bash
   mysql -u root -p
   CREATE DATABASE amboseli_trees;
   EXIT;
   ```

## Step 2: Configure Environment

Create `server/.env` file:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=amboseli_trees
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your-secret-key-change-in-production
```

**Important:** Replace `your_mysql_password` with your actual MySQL root password.

## Step 3: Start the Application

From the project root directory:

```bash
npm run dev
```

This will start:
- **Backend server** on http://localhost:5000
- **Frontend dev server** on http://localhost:3000

## Step 4: Create Admin Account

1. Open http://localhost:3000 in your browser
2. Click "Register"
3. Fill in your details
4. **Select "Admin" as the role**
5. Register and login

## Step 5: Start Adding Trees!

- **Manual Entry:** Go to Dashboard → Add Tree
- **Bulk Upload:** Download CSV template → Fill data → Upload CSV

## Troubleshooting

### MySQL Connection Error
- Make sure MySQL is running
- Check your password in `.env`
- Verify database exists: `SHOW DATABASES;`

### Port Already in Use
- Change `PORT` in `server/.env`
- Or stop the process using the port

### Tables Not Created
- The tables are auto-created on first server start
- Check server console for any errors
- Make sure database credentials are correct

## Notes

- ✅ Multer updated to 2.x (no vulnerabilities)
- ⚠️ Client has 2 moderate vulnerabilities in dev dependencies (Vite/esbuild)
  - These only affect the development server, not production
  - To fix: `cd client && npm audit fix --force` (may require breaking changes)

## Next Steps

- Customize map center coordinates in `client/src/pages/MapPage.jsx`
- Add your branding/styling
- Deploy to production when ready!

