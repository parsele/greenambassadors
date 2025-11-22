# Simple Deployment Steps

## 🎯 Quick Overview

```
Your Computer                    Internet
     │                              │
     ├─ Backend (server/)  ────────► Render/Railway (Backend API)
     │                              │
     ├─ Frontend (client/) ────────► Netlify (Frontend Website)
     │                              │
     └─ Database (MySQL)   ────────► Cloud MySQL (AWS/DigitalOcean/etc.)
```

---

## 📋 Step-by-Step Checklist

### ✅ Step 1: Deploy Backend (Do This First!)

**Choose a platform:**
- [ ] **Render** (easiest, free tier) - [render.com](https://render.com)
- [ ] **Railway** (also easy) - [railway.app](https://railway.app)
- [ ] **Heroku** (requires credit card) - [heroku.com](https://heroku.com)

**On your chosen platform:**

1. [ ] Sign up / Login
2. [ ] Create new Web Service / Project
3. [ ] Connect your GitHub repository
4. [ ] Set **Root Directory** to: `server`
5. [ ] Set **Build Command**: `npm install`
6. [ ] Set **Start Command**: `npm start`
7. [ ] Add these environment variables:
   - [ ] `PORT=5000`
   - [ ] `NODE_ENV=production`
   - [ ] `DB_HOST=your_mysql_host`
   - [ ] `DB_PORT=3306`
   - [ ] `DB_NAME=amboseli_trees`
   - [ ] `DB_USER=your_db_user`
   - [ ] `DB_PASSWORD=your_db_password`
   - [ ] `JWT_SECRET=random-secret-key-32-chars-minimum`
8. [ ] Deploy and wait (5-10 minutes)
9. [ ] Copy your backend URL: `https://your-app.onrender.com`
10. [ ] Test: Visit `https://your-app.onrender.com/api/health`

---

### ✅ Step 2: Set Up Cloud Database

**If you're using local MySQL, you need cloud MySQL:**

Choose one:
- [ ] **AWS RDS** - [aws.amazon.com/rds](https://aws.amazon.com/rds)
- [ ] **DigitalOcean** - [digitalocean.com/products/managed-databases](https://www.digitalocean.com/products/managed-databases)
- [ ] **PlanetScale** - [planetscale.com](https://planetscale.com)
- [ ] **Keep local MySQL** (not recommended - only for testing)

**After creating database:**
1. [ ] Copy database connection details
2. [ ] Update backend environment variables (Step 1, #7)
3. [ ] Redeploy backend

---

### ✅ Step 3: Deploy Frontend

**On Netlify:**

1. [ ] Go to [netlify.com](https://netlify.com) and sign up
2. [ ] Click "Add new site" → "Import an existing project"
3. [ ] Connect to GitHub
4. [ ] Select your repository
5. [ ] Configure build settings:
   - [ ] **Base directory**: `client`
   - [ ] **Build command**: `npm run build`
   - [ ] **Publish directory**: `client/dist`
6. [ ] Add environment variable:
   - [ ] **Key**: `VITE_API_BASE_URL`
   - [ ] **Value**: `https://your-backend-url.onrender.com` (from Step 1)
7. [ ] Click "Deploy site"
8. [ ] Wait for build (2-5 minutes)
9. [ ] Copy your frontend URL: `https://your-site.netlify.app`

---

### ✅ Step 4: Connect Frontend to Backend

**Update Backend CORS:**

1. [ ] Go back to your backend hosting (Render/Railway)
2. [ ] Update environment variable:
   - [ ] **Key**: `ALLOWED_ORIGINS`
   - [ ] **Value**: `https://your-site.netlify.app,http://localhost:3000`
3. [ ] Backend will auto-redeploy

**OR update code:**

1. [ ] Edit `server/index.js`
2. [ ] Add your Netlify URL to allowed origins
3. [ ] Commit and push to GitHub
4. [ ] Backend will auto-redeploy

---

### ✅ Step 5: Test Everything

1. [ ] Visit your Netlify URL
2. [ ] Open browser console (F12)
3. [ ] Try to register a new account
4. [ ] Check console for errors
5. [ ] Try to login
6. [ ] Test adding a tree (if admin)
7. [ ] Verify everything works!

---

## 🔧 Common Issues & Fixes

### ❌ "Cannot connect to database"
- ✅ Check database credentials are correct
- ✅ Verify database allows external connections
- ✅ Check database firewall settings
- ✅ Ensure database is running

### ❌ "CORS error" in browser
- ✅ Update `ALLOWED_ORIGINS` in backend
- ✅ Verify frontend URL is correct
- ✅ Check backend CORS configuration

### ❌ "API calls failing"
- ✅ Check `VITE_API_BASE_URL` is set in Netlify
- ✅ Verify backend URL is accessible
- ✅ Check browser console for exact error

### ❌ "Build fails"
- ✅ Check build logs
- ✅ Verify all dependencies in `package.json`
- ✅ Ensure build commands are correct

---

## 📝 Quick Reference

### Backend URLs
- Render: `https://your-app.onrender.com`
- Railway: `https://your-app.up.railway.app`
- Heroku: `https://your-app.herokuapp.com`

### Frontend URLs
- Netlify: `https://your-site.netlify.app`
- Vercel: `https://your-site.vercel.app`

### Required Environment Variables

**Backend:**
```
PORT=5000
NODE_ENV=production
DB_HOST=your_mysql_host
DB_PORT=3306
DB_NAME=amboseli_trees
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your-secret-key
ALLOWED_ORIGINS=https://your-site.netlify.app,http://localhost:3000
```

**Frontend:**
```
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

---

## 🎉 You're Done!

Once all steps are complete:
- ✅ Backend is live on Render/Railway
- ✅ Frontend is live on Netlify
- ✅ Database is in the cloud
- ✅ Everything is connected and working!

**Need more details?** See `SEPARATE_DEPLOYMENT_GUIDE.md` for comprehensive instructions.

