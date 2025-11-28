# Quick Deployment Guide

## 🚀 Deploy to Vercel in 5 Minutes

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Set Up Database

Choose one:
- **Vercel Postgres** (easiest): In Vercel dashboard → Storage → Create Postgres
- **Neon** (free): [neon.tech](https://neon.tech) → Create project
- **Supabase** (free): [supabase.com](https://supabase.com) → Create project

Copy your PostgreSQL connection string.

### Step 3: Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Will be `https://your-project.vercel.app` (update after first deploy)
   - `GEMINI_API_KEY` - Your Google Gemini API key
4. Click "Deploy"

### Step 4: Run Database Migrations

After first deployment, run:
```bash
npm i -g vercel
vercel login
vercel link
npx prisma migrate deploy
```

Or use Vercel's CLI to run it:
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

### Step 5: Update NEXTAUTH_URL

1. After deployment, copy your Vercel URL
2. Go to Project Settings → Environment Variables
3. Update `NEXTAUTH_URL` to your actual deployment URL
4. Redeploy (or it will auto-redeploy)

### ✅ Done!

Your site is now live! Visit your Vercel URL to see it in action.

## 🔧 Troubleshooting

**Build fails?**
- Check that all environment variables are set
- Ensure `DATABASE_URL` is correct

**Database connection errors?**
- Verify your database allows connections from Vercel IPs
- Check connection string format

**Auth not working?**
- Make sure `NEXTAUTH_URL` matches your deployment URL exactly
- Regenerate `NEXTAUTH_SECRET` if needed

## 📝 Next Steps

- Add a custom domain in Vercel project settings
- Set up automatic deployments from your main branch
- Configure environment variables for preview deployments

