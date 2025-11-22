# 🌳 Amboseli Tree Tracker

A modern web application for tracking and visualizing trees planted in the Amboseli region. Built with React, Node.js, Express, and MongoDB.

## Features

- 🗺️ **Interactive Map**: View all trees on an interactive map centered on Amboseli
- 📍 **Tree Markers**: Click markers to see detailed information about each tree
- 👤 **User Authentication**: Secure login and registration system
- 🔐 **Admin Dashboard**: Full CRUD operations for tree management
- 📊 **Statistics**: Real-time statistics about planted trees
- 📤 **Bulk Upload**: Upload multiple trees via CSV file
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- React 18
- React Router
- Leaflet (OpenStreetMap)
- React Hot Toast
- Axios
- Vite

### Backend
- Node.js
- Express.js
- MySQL with Sequelize
- JWT Authentication
- Multer (file uploads)
- CSV Parser

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v5.7 or higher, or MariaDB)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project21
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up MySQL database**
   
   Create a MySQL database:
   ```sql
   CREATE DATABASE amboseli_trees;
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=amboseli_trees
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   JWT_SECRET=your-secret-key-change-in-production
   ```

5. **Start MySQL**
   
   Make sure MySQL is running on your system.

6. **Run the application**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend dev server (port 3000).

## Usage

### Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Creating an Admin Account

1. Navigate to the Register page
2. Fill in your details
3. Select "Admin" as the role
4. Register and login

### Adding Trees

**Manual Entry:**
1. Login as admin
2. Go to Dashboard
3. Click "Add Tree"
4. Fill in the form and submit

**Bulk Upload:**
1. Login as admin
2. Go to Dashboard
3. Click "Download Template" to get the CSV format
4. Fill in your tree data
5. Click "Upload CSV" and select your file

### CSV Format

The CSV file should have the following columns:
```
species,latitude,longitude,planterName,planterEmail,datePlanted,status,notes,photoUrl
```

Example:
```
Acacia tortilis,-2.6531,37.2531,John Doe,john@example.com,2024-01-15,planted,Healthy tree,
Balanites aegyptiaca,-2.6541,37.2541,Jane Smith,jane@example.com,2024-01-16,growing,Good growth,
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Trees
- `GET /api/trees` - Get all trees (public)
- `GET /api/trees/:id` - Get single tree
- `POST /api/trees` - Create tree (requires auth)
- `PUT /api/trees/:id` - Update tree (requires auth)
- `DELETE /api/trees/:id` - Delete tree (requires admin)
- `GET /api/trees/stats/summary` - Get statistics

### Upload
- `POST /api/upload/csv` - Upload CSV file (requires admin)
- `GET /api/upload/csv-template` - Download CSV template

## Project Structure

```
project21/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   └── App.jsx         # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   └── index.js            # Server entry point
└── package.json            # Root package.json
```

## Environment Variables

### Server (.env)
- `PORT` - Server port (default: 5000)
- `DB_HOST` - MySQL host (default: localhost)
- `DB_PORT` - MySQL port (default: 3306)
- `DB_NAME` - MySQL database name
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `JWT_SECRET` - Secret key for JWT tokens

## Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `cd client && npm run build`
2. Deploy the `client/dist` folder

### Backend (Heroku/Railway/AWS)
1. Set environment variables
2. Deploy the `server` folder
3. Update frontend API URL to point to production backend

## Development

- Frontend dev server: `npm run client`
- Backend dev server: `npm run server`
- Both: `npm run dev`

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

