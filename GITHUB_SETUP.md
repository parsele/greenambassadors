# GitHub Setup Guide

This guide will help you push only the necessary files to GitHub.

## ✅ What Will Be Included

**Included (Important Files):**
- ✅ All source code (`server/`, `client/src/`)
- ✅ Configuration files (`package.json`, `vite.config.js`, `netlify.toml`)
- ✅ Documentation (`.md` files)
- ✅ Database setup scripts

**Excluded (Automatically Ignored):**
- ❌ `node_modules/` - Dependencies (will be installed via `npm install`)
- ❌ `.env` files - Your secrets (passwords, API keys)
- ❌ `dist/` or `build/` - Build outputs
- ❌ Log files
- ❌ IDE files (`.vscode/`, `.idea/`)
- ❌ OS files (`.DS_Store`, `Thumbs.db`)

## 🚀 Step-by-Step: Push to GitHub

### Step 1: Initialize Git Repository (if not already done)

```bash
cd C:\Users\DELL\project21
git init
```

### Step 2: Check What Will Be Committed

```bash
git status
```

This shows you all files that will be included. Make sure `.env` files are NOT listed!

### Step 3: Add All Important Files

```bash
git add .
```

This adds all files except those in `.gitignore`.

### Step 4: Verify What's Being Added

```bash
git status
```

**IMPORTANT:** Check that:
- ✅ No `.env` files are listed
- ✅ No `node_modules/` folders are listed
- ✅ Your source code IS listed

### Step 5: Create Your First Commit

```bash
git commit -m "Initial commit: Amboseli Tree Tracker"
```

### Step 6: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the "+" icon → "New repository"
3. Name it: `amboseli-tree-tracker` (or your choice)
4. **DO NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

### Step 7: Connect and Push

GitHub will show you commands. Use these:

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/amboseli-tree-tracker.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## 🔒 Security Checklist

Before pushing, verify:

- [ ] `.env` files are NOT in the repository
- [ ] `server/.env` is NOT committed
- [ ] No passwords or secrets in code
- [ ] Database credentials are in `.env` (not in code)
- [ ] JWT secret is in `.env` (not hardcoded)

## 📝 Files That Should Be in GitHub

✅ **Include these:**
- `package.json` files
- Source code (`server/`, `client/src/`)
- Configuration files (`vite.config.js`, `netlify.toml`)
- Documentation (`.md` files)
- `.gitignore` files

❌ **Never include:**
- `.env` files
- `node_modules/`
- Build outputs (`dist/`, `build/`)
- Logs
- Personal secrets

## 🔄 Future Updates

After making changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

## 📋 Quick Command Reference

```bash
# Check status
git status

# Add files
git add .

# Commit
git commit -m "Your message"

# Push to GitHub
git push

# Check what files are tracked
git ls-files
```

## ⚠️ If You Accidentally Added .env

If you accidentally committed `.env`:

```bash
# Remove from git (but keep local file)
git rm --cached server/.env
git commit -m "Remove .env file"
git push
```

Then update your `.gitignore` and make sure `.env` is listed.

