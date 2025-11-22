# Netlify Deployment Guide

This guide will help you deploy your Amboseli Tree Tracker frontend to Netlify.

## Prerequisites

1. **Backend deployed** - Your backend server must be deployed first (see Backend Deployment section)
2. **GitHub/GitLab/Bitbucket account** - Netlify works best with Git repositories
3. **Netlify account** - Sign up at [netlify.com](https://www.netlify.com)

## Important Notes

⚠️ **Netlify only hosts static frontend files**. Your backend (Node.js/Express server) needs to be deployed separately on platforms like:
- **Render** (recommended - free tier available)
- **Railway**
- **Heroku**
- **DigitalOcean App Platform**
- **AWS/Google Cloud/Azure**

## Step 1: Deploy Backend First

Before deploying the frontend, you need to deploy your backend server. Here's a quick guide:

### Option A: Deploy to Render (Recommended)

1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `amboseli-tree-tracker-api`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: Leave empty (or set to `server` if deploying from root)
5. Add environment variables:
   ```
   PORT=5000
   DB_HOST=your_mysql_host
   DB_PORT=3306
   DB_NAME=amboseli_trees
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   JWT_SECRET=your-secret-key-change-this
   NODE_ENV=production
   ```
6. Click "Create Web Service"
7. Copy your backend URL (e.g., `https://amboseli-tree-tracker-api.onrender.com`)

### Option B: Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables in the Variables tab
5. Railway will auto-detect Node.js and deploy
6. Copy your backend URL

## Step 2: Prepare Frontend for Deployment

The frontend is already configured! Just make sure:

1. **Build the project locally** (optional, to test):
   ```bash
   cd client
   npm run build
   ```

2. **Set the API URL** - You'll set this in Netlify's environment variables

## Step 3: Deploy to Netlify

### Method 1: Deploy via Git (Recommended)

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Go to Netlify Dashboard**:
   - Visit [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub/GitLab/Bitbucket
   - Select your repository

3. **Configure Build Settings**:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
   - Click "Show advanced" and verify these settings

4. **Add Environment Variables**:
   - Click "Environment variables"
   - Add: `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com`
   - Replace with your actual backend URL from Step 1

5. **Deploy**:
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `https://your-site-name.netlify.app`

### Method 2: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Navigate to client directory**:
   ```bash
   cd client
   ```

4. **Build the project**:
   ```bash
   npm run build
   ```

5. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

6. **Set environment variable**:
   ```bash
   netlify env:set VITE_API_BASE_URL https://your-backend-url.onrender.com
   ```

## Step 4: Update Backend CORS (If Needed)

Make sure your backend allows requests from your Netlify domain:

In `server/index.js`, update CORS configuration:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-site-name.netlify.app'
  ],
  credentials: true
}));
```

Or allow all origins (for development):
```javascript
app.use(cors({
  origin: '*',
  credentials: true
}));
```

## Step 5: Test Your Deployment

1. Visit your Netlify URL
2. Try registering a new account
3. Test login functionality
4. Verify API calls are working (check browser console)

## Troubleshooting

### API calls failing (CORS errors)
- Check backend CORS configuration
- Verify `VITE_API_BASE_URL` is set correctly in Netlify
- Check browser console for exact error messages

### Build fails
- Check Netlify build logs
- Ensure all dependencies are in `package.json`
- Verify build command is correct

### Environment variables not working
- Make sure variable names start with `VITE_` (required for Vite)
- Redeploy after adding environment variables
- Check Netlify build logs to verify variables are loaded

### Database connection issues
- Verify backend environment variables are set correctly
- Check if your database allows connections from your hosting provider
- For cloud databases, whitelist your hosting provider's IP addresses

## Custom Domain (Optional)

1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Follow instructions to configure DNS

## Continuous Deployment

Once connected to Git, Netlify will automatically deploy when you push to your main branch!

## Need Help?

- Check Netlify docs: [docs.netlify.com](https://docs.netlify.com)
- Check Render docs: [render.com/docs](https://render.com/docs)
- Check your build logs in Netlify dashboard

