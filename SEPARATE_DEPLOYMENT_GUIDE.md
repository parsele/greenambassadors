# Separate Deployment Guide

This guide explains how to deploy your **backend** and **frontend** separately to different platforms.

## Overview

- **Backend (Server)**: Deploy to Render, Railway, Heroku, or similar Node.js hosting
- **Frontend (Client)**: Deploy to Netlify, Vercel, or similar static hosting
- **Database**: Use cloud MySQL (AWS RDS, DigitalOcean, PlanetScale, etc.) or keep local MySQL if accessible

---

## Part 1: Deploy Backend (Server)

### Option A: Deploy to Render (Recommended - Free Tier)

#### Step 1: Prepare Your Backend

1. **Check your `server/package.json`** has a `start` script:
   ```json
   {
     "scripts": {
       "start": "node index.js",
       "dev": "nodemon index.js"
     }
   }
   ```

2. **Create `server/.gitignore`** (if not exists):
   ```
   node_modules/
   .env
   *.log
   ```

#### Step 2: Deploy to Render

1. **Sign up/Login**:
   - Go to [render.com](https://render.com)
   - Sign up with GitHub (recommended)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Service**:
   - **Name**: `amboseli-tree-tracker-api` (or your choice)
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `server` ⚠️ **Important!**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid if needed)

4. **Add Environment Variables**:
   Click "Environment" tab and add:
   ```
   PORT=5000
   NODE_ENV=production
   DB_HOST=your_mysql_host
   DB_PORT=3306
   DB_NAME=amboseli_trees
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   JWT_SECRET=your-very-long-random-secret-key-change-this
   ALLOWED_ORIGINS=https://your-frontend.netlify.app,http://localhost:3000
   ```
   
   **Important Notes**:
   - Replace database credentials with your actual cloud MySQL credentials
   - Generate a strong `JWT_SECRET` (random string, 32+ characters)
   - Add your frontend URL to `ALLOWED_ORIGINS` (you'll update this after deploying frontend)

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes first time)
   - Copy your service URL: `https://amboseli-tree-tracker-api.onrender.com`

#### Step 3: Test Your Backend

1. **Check Health Endpoint**:
   ```
   https://your-backend-url.onrender.com/api/health
   ```
   Should return: `{"status":"OK","message":"Server is running"}`

2. **Check Logs**:
   - In Render dashboard, click "Logs" tab
   - Look for "Connected to MySQL database"
   - Check for any errors

---

### Option B: Deploy to Railway

1. **Sign up**: Go to [railway.app](https://railway.app)
2. **New Project**: Click "New Project" → "Deploy from GitHub"
3. **Select Repository**: Choose your repo
4. **Configure**:
   - Railway auto-detects Node.js
   - Set **Root Directory** to `server`
   - Add environment variables (same as Render above)
5. **Deploy**: Railway will auto-deploy
6. **Get URL**: Copy your Railway URL

---

### Option C: Deploy to Heroku

1. **Install Heroku CLI**: [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)

2. **Login**:
   ```bash
   heroku login
   ```

3. **Create App**:
   ```bash
   cd server
   heroku create your-app-name
   ```

4. **Set Environment Variables**:
   ```bash
   heroku config:set PORT=5000
   heroku config:set NODE_ENV=production
   heroku config:set DB_HOST=your_mysql_host
   heroku config:set DB_PORT=3306
   heroku config:set DB_NAME=amboseli_trees
   heroku config:set DB_USER=your_db_user
   heroku config:set DB_PASSWORD=your_db_password
   heroku config:set JWT_SECRET=your-secret-key
   ```

5. **Deploy**:
   ```bash
   git subtree push --prefix server heroku main
   ```
   Or use Heroku Git:
   ```bash
   heroku git:remote -a your-app-name
   git push heroku main
   ```

---

## Part 2: Set Up Cloud Database

If you're using local MySQL, you need to migrate to a cloud database:

### Option A: AWS RDS (MySQL)

1. Go to AWS Console → RDS
2. Create MySQL database instance
3. Note: Host, Port, Username, Password
4. Update backend environment variables

### Option B: DigitalOcean Managed Database

1. Go to DigitalOcean → Databases
2. Create MySQL database
3. Copy connection details
4. Update backend environment variables

### Option C: PlanetScale (MySQL-compatible)

1. Go to [planetscale.com](https://planetscale.com)
2. Create database
3. Get connection string
4. Update backend environment variables

### Option D: Keep Local MySQL (Not Recommended)

- Only works if your computer is always on
- Requires port forwarding
- Security risks
- **Not recommended for production**

---

## Part 3: Deploy Frontend (Client) to Netlify

### Step 1: Prepare Frontend

Your frontend is already configured! Just verify:

1. **Check `client/package.json`** has build script:
   ```json
   {
     "scripts": {
       "build": "vite build"
     }
   }
   ```

2. **Verify `client/netlify.toml` exists** (already created)

### Step 2: Deploy via Git (Recommended)

1. **Push Code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Go to Netlify**:
   - Visit [app.netlify.com](https://app.netlify.com)
   - Sign up/Login with GitHub

3. **Import Project**:
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify
   - Select your repository

4. **Configure Build Settings**:
   - **Base directory**: `client` ⚠️ **Important!**
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
   - Click "Show advanced" to see these options

5. **Add Environment Variable**:
   - Click "Environment variables" → "Add variable"
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-url.onrender.com` (your actual backend URL from Part 1)
   - Click "Save"

6. **Deploy**:
   - Click "Deploy site"
   - Wait for build (2-5 minutes)
   - Your site will be live at: `https://random-name-12345.netlify.app`

### Step 3: Update Backend CORS

After deploying frontend, update your backend's `ALLOWED_ORIGINS`:

1. **In Render/Railway/Heroku dashboard**:
   - Go to Environment Variables
   - Update `ALLOWED_ORIGINS`:
     ```
     https://your-site-name.netlify.app,http://localhost:3000
     ```
   - Redeploy backend (or it will auto-redeploy)

2. **Or update `server/index.js`** and redeploy:
   ```javascript
   const allowedOrigins = [
     'http://localhost:3000',
     'https://your-site-name.netlify.app'
   ];
   ```

### Step 4: Test Your Deployment

1. **Visit your Netlify URL**
2. **Try to register/login**
3. **Check browser console** (F12) for any errors
4. **Test API calls** - they should go to your backend URL

---

## Part 4: Alternative Frontend Hosting

### Option A: Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Configure:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable: `VITE_API_BASE_URL`
5. Deploy

### Option B: GitHub Pages

1. Install gh-pages: `npm install -g gh-pages`
2. Add to `client/package.json`:
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```
3. Run: `npm run deploy`
4. Enable GitHub Pages in repo settings

---

## Troubleshooting

### Backend Issues

**"Cannot connect to database"**
- Check database credentials in environment variables
- Verify database allows connections from hosting provider
- Check database firewall/security groups
- Ensure database is running

**"Port already in use"**
- Render/Railway auto-assigns ports
- Use `process.env.PORT` (already configured)

**"Module not found"**
- Ensure `node_modules` is in `.gitignore`
- Verify `package.json` has all dependencies
- Check build logs

### Frontend Issues

**"API calls failing"**
- Verify `VITE_API_BASE_URL` is set correctly
- Check CORS settings in backend
- Look at browser console for exact errors
- Ensure backend URL is accessible

**"Build fails"**
- Check Netlify build logs
- Verify all dependencies in `package.json`
- Ensure build command is correct

**"404 on page refresh"**
- Netlify redirects are already configured in `netlify.toml`
- If using Vercel, add `vercel.json` with rewrites

---

## Quick Reference

### Backend URLs
- Render: `https://your-app.onrender.com`
- Railway: `https://your-app.up.railway.app`
- Heroku: `https://your-app.herokuapp.com`

### Frontend URLs
- Netlify: `https://your-site.netlify.app`
- Vercel: `https://your-site.vercel.app`

### Environment Variables Checklist

**Backend:**
- ✅ `PORT=5000`
- ✅ `NODE_ENV=production`
- ✅ `DB_HOST=...`
- ✅ `DB_PORT=3306`
- ✅ `DB_NAME=amboseli_trees`
- ✅ `DB_USER=...`
- ✅ `DB_PASSWORD=...`
- ✅ `JWT_SECRET=...`
- ✅ `ALLOWED_ORIGINS=...`

**Frontend:**
- ✅ `VITE_API_BASE_URL=https://your-backend-url.onrender.com`

---

## Summary

1. ✅ Deploy backend to Render/Railway/Heroku
2. ✅ Set up cloud MySQL database
3. ✅ Update backend environment variables
4. ✅ Deploy frontend to Netlify
5. ✅ Set `VITE_API_BASE_URL` in Netlify
6. ✅ Update backend CORS with frontend URL
7. ✅ Test everything!

Your app is now live on the internet! 🎉

