# Database Migration Guide for Vercel

This guide will help you migrate your local database to Vercel.

## Step 1: Set Up Database on Vercel

You have two options:

### Option A: Vercel Postgres (Recommended - Easiest)

1. Go to your Vercel project dashboard
2. Navigate to **Storage** tab
3. Click **Create Database** → Select **Postgres**
4. Choose a name for your database
5. Select a region (choose closest to your users)
6. Click **Create**
7. Copy the **Connection String** (you'll need this in Step 2)

### Option B: External Database Provider

If you prefer an external provider:

**Neon (Free tier available):**
1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Copy the connection string from the dashboard

**Supabase (Free tier available):**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database → Connection string
4. Copy the connection string (use "URI" format)

## Step 2: Configure Environment Variables in Vercel

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add or update the `DATABASE_URL` variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Your PostgreSQL connection string from Step 1
   - **Environment**: Select all (Production, Preview, Development)
3. Make sure these other variables are also set:
   - `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (your Vercel URL, e.g., `https://your-project.vercel.app`)
   - `GEMINI_API_KEY` (your Google Gemini API key)

## Step 3: Create Initial Migration (Local)

First, create the migration files from your schema:

```bash
# Make sure your local DATABASE_URL points to your local database
npx prisma migrate dev --name init --create-only
```

This creates the migration files without applying them. If you get an error, you can also use:

```bash
npx prisma migrate dev --name init
```

**Note**: If you've been using `prisma db push` locally, you may need to reset your local database first:
```bash
npx prisma migrate reset
npx prisma migrate dev --name init
```

## Step 4: Commit Migration Files

Make sure migrations are NOT in `.gitignore` (they should be committed):

```bash
# Check if migrations folder exists
ls prisma/migrations

# If it exists, add it to git
git add prisma/migrations
git commit -m "Add initial database migration"
git push
```

**Important**: Check your `.gitignore` - if it has `/prisma/migrations`, remove that line. Migrations should be committed to version control.

## Step 5: Run Migrations on Vercel Database

After your code is pushed and Vercel has the `DATABASE_URL` set, run migrations:

### Method 1: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project (if not already linked)
vercel link

# Pull environment variables to local .env.local
vercel env pull .env.local

# Run migrations against Vercel database
npx prisma migrate deploy
```

### Method 2: Using Vercel's Build Command

You can also add migration to your build process temporarily:

1. Go to Vercel project → **Settings** → **General** → **Build & Development Settings**
2. Update **Build Command** to:
   ```
   prisma generate && prisma migrate deploy && next build
   ```
3. Redeploy your project

**Note**: After migrations run successfully, you can revert the build command back to:
```
prisma generate && next build
```

## Step 6: Verify Migration

Check that your tables were created:

```bash
# Using Vercel CLI with environment variables
vercel env pull .env.local
npx prisma studio
```

Or connect directly to your database using a PostgreSQL client.

## Step 7: Seed Production Database (Optional)

If you want to seed your production database with initial data:

```bash
# Make sure .env.local has your Vercel DATABASE_URL
vercel env pull .env.local

# Run seed script
npm run db:seed
```

**Warning**: Only run seed if you want sample data. If you have important local data, see Step 8.

## Step 8: Migrate Local Data to Production (Optional)

If you have important data in your local database that you want to migrate:

### Option A: Using Prisma Studio (Small datasets)

1. Export data from local database:
   ```bash
   # Connect to local DB
   npx prisma studio
   # Manually copy important records
   ```

### Option B: Using pg_dump (Recommended for larger datasets)

```bash
# Export local database
pg_dump -h localhost -U your_user -d your_database > local_backup.sql

# Import to production (replace with your Vercel DB connection details)
psql "your_vercel_connection_string" < local_backup.sql
```

### Option C: Using a migration script

Create a script to copy specific data:

```typescript
// scripts/migrate-data.ts
import { PrismaClient } from '@prisma/client'

const localDb = new PrismaClient({
  datasources: { db: { url: process.env.LOCAL_DATABASE_URL } }
})

const prodDb = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
})

async function migrate() {
  // Copy companies
  const companies = await localDb.company.findMany()
  for (const company of companies) {
    await prodDb.company.upsert({
      where: { id: company.id },
      update: company,
      create: company,
    })
  }
  
  // Copy users (be careful with passwords - they should already be hashed)
  const users = await localDb.user.findMany()
  for (const user of users) {
    await prodDb.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    })
  }
  
  // Add other models as needed
}

migrate()
  .catch(console.error)
  .finally(() => {
    localDb.$disconnect()
    prodDb.$disconnect()
  })
```

## Troubleshooting

### Migration fails with "database does not exist"
- Make sure `DATABASE_URL` is correctly set in Vercel
- Verify the connection string format: `postgresql://user:password@host:port/database?schema=public`

### Migration fails with permission errors
- Check that your database user has CREATE TABLE permissions
- Some providers require you to enable migrations in their dashboard

### "Migration already applied" error
- Your database might already have tables
- Use `prisma migrate reset` to start fresh (⚠️ deletes all data)
- Or use `prisma db push` instead (not recommended for production)

### Connection timeout
- Check firewall settings on your database
- Some providers require IP whitelisting (Vercel Postgres doesn't need this)

## Next Steps

After successful migration:
1. ✅ Test your application on Vercel
2. ✅ Verify authentication works
3. ✅ Test database operations (create, read, update)
4. ✅ Set up database backups (if using external provider)
5. ✅ Monitor database usage and performance

## Quick Reference Commands

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio

# Pull Vercel environment variables
vercel env pull .env.local
```

