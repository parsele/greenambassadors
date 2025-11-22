# Quick Deployment Checklist

## ✅ Frontend is Ready for Netlify!

Your frontend has been configured for Netlify deployment. Here's what was done:

1. ✅ Created axios configuration with environment variable support
2. ✅ Updated all API calls to use the configured base URL
3. ✅ Created `netlify.toml` configuration file
4. ✅ Frontend will work with your deployed backend

## 🚀 Quick Steps to Deploy

### 1. Deploy Backend First (Required!)

**Option A: Render (Free tier available)**
- Go to [render.com](https://render.com)
- Create new Web Service
- Connect your GitHub repo
- Set root directory to `server`
- Add environment variables from `server/.env`
- Deploy and copy the URL

**Option B: Railway**
- Go to [railway.app](https://railway.app)
- Deploy from GitHub
- Add environment variables
- Copy the URL

### 2. Deploy Frontend to Netlify

1. **Push code to GitHub** (if not already done)
2. **Go to [netlify.com](https://netlify.com)**
3. **Import project from Git**
4. **Configure build settings:**
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
5. **Add environment variable:**
   - Name: `VITE_API_BASE_URL`
   - Value: `https://your-backend-url.onrender.com` (your actual backend URL)
6. **Deploy!**

### 3. Update Backend CORS

In `server/index.js`, update CORS to allow your Netlify domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-site-name.netlify.app'  // Add your Netlify URL here
  ],
  credentials: true
}));
```

Or for development/testing, allow all:
```javascript
app.use(cors({
  origin: '*',
  credentials: true
}));
```

## 📝 Environment Variables Needed

### Backend (Render/Railway/etc.):
- `PORT=5000`
- `DB_HOST=your_mysql_host`
- `DB_PORT=3306`
- `DB_NAME=amboseli_trees`
- `DB_USER=your_db_user`
- `DB_PASSWORD=your_db_password`
- `JWT_SECRET=your-secret-key`
- `NODE_ENV=production`

### Frontend (Netlify):
- `VITE_API_BASE_URL=https://your-backend-url.onrender.com`

## 🎯 That's It!

Once deployed:
- Frontend: `https://your-site.netlify.app`
- Backend: `https://your-backend.onrender.com`

See `NETLIFY_DEPLOYMENT.md` for detailed instructions!

