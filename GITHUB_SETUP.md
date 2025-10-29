# 🚀 GitHub Repository Setup Guide

Your SchoolBridge project is ready to be pushed to GitHub!

## ✅ What's Already Done

- ✅ Git repository initialized
- ✅ All files committed to local repository
- ✅ Branch renamed to `main`
- ✅ `.gitignore` configured (excludes node_modules, .env, .next, etc.)

## 📋 Quick Setup Steps

### Option 1: Create Repository on GitHub.com (Recommended)

1. **Go to GitHub.com** and login
2. **Click the "+" icon** in the top right → "New repository"
3. **Fill in the details:**
   - Repository name: `schoolbridge`
   - Description: `SchoolBridge - Offline-first school management platform for Madagascar`
   - Visibility: Choose **Private** or **Public**
   - ⚠️ **DO NOT** initialize with README, .gitignore, or license (we already have these)

4. **After creating, run these commands:**

```bash
git remote add origin https://github.com/YOUR-USERNAME/schoolbridge.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

### Option 2: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:YOUR-USERNAME/schoolbridge.git
git push -u origin main
```

## 🔒 Setting Up Branch Protection (Recommended)

After pushing your code, set up branch protection:

1. Go to your repository on GitHub
2. Click **Settings** → **Branches**
3. Click **Add rule** under "Branch protection rules"
4. Branch name pattern: `main`
5. Enable these protections:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators (optional but recommended)

## 📝 Recommended GitHub Settings

### Repository Settings
- Enable **Issues** for bug tracking
- Enable **Discussions** for community questions
- Add topics: `nextjs`, `typescript`, `education`, `pwa`, `offline-first`, `madagascar`, `school-management`

### Secrets for CI/CD (later)
When setting up GitHub Actions, you'll need these secrets:
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `NEXTAUTH_SECRET` - Your NextAuth secret key
- `SENTRY_DSN` - Sentry error tracking DSN (when configured)

## 🎯 What Gets Pushed

Your initial commit includes:
- ✅ Complete Next.js 14 project structure
- ✅ Prisma schema and migrations
- ✅ All documentation (8 markdown files)
- ✅ Landing page with SchoolBridge branding
- ✅ Configuration files (Tailwind, TypeScript, etc.)

**Excluded from Git (in .gitignore):**
- ❌ node_modules/
- ❌ .env and .env.local (credentials)
- ❌ .next/ (build files)
- ❌ src/generated/prisma (generated code)

## 🔐 Security Reminder

⚠️ **NEVER commit these files:**
- `.env` or `.env.local` (contains database credentials)
- API keys or secrets
- Private keys or certificates

Your `.gitignore` is already configured to prevent this.

## ✅ Verification

After pushing, verify on GitHub:
- [ ] All files are visible in the repository
- [ ] README.md displays correctly
- [ ] No `.env` files are visible
- [ ] Branch is named `main`

## 📞 Need Help?

If you encounter authentication issues:

1. **HTTPS Authentication:**
   - Use a Personal Access Token (not password)
   - Create token at: https://github.com/settings/tokens
   - Select scopes: `repo`, `workflow`

2. **SSH Authentication:**
   - Generate SSH key: `ssh-keygen -t ed25519 -C "jms@projet.lan"`
   - Add to GitHub: https://github.com/settings/keys

---

## 🎉 Next Steps After GitHub Setup

Once your repository is on GitHub:

1. ✅ Update TODO.md to mark "Set up GitHub repository" as complete
2. 🔄 Set up GitHub Actions for CI/CD (next task)
3. 📊 Configure Sentry for error tracking
4. 🌍 Set up i18n with next-intl
5. 🔐 Begin Sprint 2: Authentication & Security

---

**Repository URL Pattern:**
- HTTPS: `https://github.com/YOUR-USERNAME/schoolbridge`
- SSH: `git@github.com:YOUR-USERNAME/schoolbridge.git`

Good luck! 🚀
