# AI Chat Support Multi-Company SaaS Platform

A full-stack multi-tenant SaaS platform for AI-powered customer support. Each company can manage their own data, and users can interact with an AI chatbot that uses company-specific context to answer questions.

## Features

- **Multi-Company Support**: Each company has isolated data and users
- **AI Chatbot**: Google Gemini-powered chatbot with company-specific context
- **User Chat History**: Users can view their own chat history
- **Company Admin Dashboard**: Admins can view all company user chats
- **Team Member Management**: Invite team members to view company chats
- **Chat Summaries**: AI-generated summaries for each conversation
- **Company Data Management**: Manage features, pricing, usage docs, and common issues

## Tech Stack

- **Frontend/Backend**: Next.js 14+ (App Router) with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: Google Gemini API (gemini-2.5-flash)
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended)
- PostgreSQL database
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SaaS-support-copilot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/saas_support_copilot?schema=public"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-google-gemini-api-key-here"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── (dashboard)/       # Dashboard routes
│   │   ├── company/           # Company admin routes
│   │   ├── api/               # API routes
│   │   └── ...                # Other routes
│   ├── components/
│   │   ├── chat/              # Chat components
│   │   ├── company/           # Company management components
│   │   ├── layout/            # Layout components
│   │   └── ui/                # UI components
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── db.ts              # Prisma client
│   │   ├── gemini.ts          # Gemini client
│   │   └── utils.ts           # Utility functions
│   └── types/
│       └── index.ts           # TypeScript types
```

## Usage

### Creating an Account

1. Navigate to `/register`
2. Enter your company name, company slug, name, email, and password
3. You'll be automatically set as the company admin

### Managing Company Data

1. As a company admin, go to `/company/settings`
2. Click "Manage Data" to update:
   - Features (JSON array)
   - Pricing (JSON object)
   - Usage documentation (JSON object)
   - Common issues (JSON array)

### Inviting Team Members

1. As a company admin, go to `/company/settings/team`
2. Enter team member email and select role (Support or Admin)
3. Click "Invite" - the invitation token will be returned (in production, this would be sent via email)
4. Team members can accept invitations at `/accept-invitation?token=<token>`

### Using the Chat

1. Users can start chatting at `/dashboard/chat`
2. The AI will use company-specific context from the company data
3. Chat summaries are automatically generated after 5+ messages
4. View chat history at `/dashboard/history`

### Viewing Company Chats

1. Company admins and team members can view all company chats at `/company/chats`
2. Click on any chat to view the full conversation

## API Routes

- `POST /api/auth/register` - Register a new company and user
- `POST /api/chat/message` - Send a message in a chat
- `POST /api/chat/[chatId]/summary` - Generate chat summary
- `PUT /api/company/data` - Update company data (admin only)
- `POST /api/team/invite` - Invite a team member (admin only)
- `GET /api/team/invitations/verify` - Verify invitation token
- `POST /api/team/invitations/accept` - Accept invitation

## Database Schema

- **Company**: Company information
- **User**: Regular users (customers)
- **TeamMember**: Support staff and admins
- **CompanyData**: Company-specific data (features, pricing, etc.)
- **Chat**: Chat conversations
- **Message**: Individual messages in chats
- **Invitation**: Team member invitations

## Security

- All API routes are protected with NextAuth session checks
- Row-level security: Users can only access their own company's data
- Role-based access control for different user types
- Passwords are hashed using bcrypt

## Development

```bash
# Run development server
npm run dev

# Generate Prisma client
npm run db:generate

# Push database schema changes
npm run db:push

# Open Prisma Studio
npm run db:studio
```

## Production Deployment

### Deploying to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications. Follow these steps:

#### Prerequisites

1. **GitHub/GitLab/Bitbucket Account**: Your code needs to be in a Git repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free tier available)
3. **PostgreSQL Database**: Choose one of these options:
   - **Vercel Postgres** (easiest, integrated with Vercel)
   - **Neon** (serverless PostgreSQL, free tier available)
   - **Supabase** (PostgreSQL with additional features, free tier available)
   - **Railway** (simple PostgreSQL hosting, free tier available)

#### Step-by-Step Deployment

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Set up your PostgreSQL database**:
   - If using **Vercel Postgres**:
     - Go to your Vercel dashboard
     - Create a new project or go to an existing one
     - Navigate to Storage → Create Database → Postgres
     - Copy the connection string
   - If using **Neon**:
     - Sign up at [neon.tech](https://neon.tech)
     - Create a new project
     - Copy the connection string from the dashboard
   - If using **Supabase**:
     - Sign up at [supabase.com](https://supabase.com)
     - Create a new project
     - Go to Settings → Database → Connection string
     - Copy the connection string (use the "URI" format)

3. **Deploy to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Vercel will auto-detect Next.js settings

4. **Configure Environment Variables**:
   In the Vercel project settings, add these environment variables:
   
   ```
   DATABASE_URL=your-postgres-connection-string
   NEXTAUTH_SECRET=generate-a-random-secret-here
   NEXTAUTH_URL=https://your-project.vercel.app
   GEMINI_API_KEY=your-gemini-api-key
   ```
   
   To generate `NEXTAUTH_SECRET`, run:
   ```bash
   openssl rand -base64 32
   ```
   
   Or use an online generator: [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

5. **Run Database Migrations**:
   After deployment, you need to run Prisma migrations. You can do this by:
   
   **Option A: Using Vercel CLI** (Recommended):
   ```bash
   npm i -g vercel
   vercel login
   vercel link
   npx prisma migrate deploy
   ```
   
   **Option B: Using a one-time script**:
   - Add a script in `package.json`: `"db:deploy": "prisma migrate deploy"`
   - Run it via Vercel's CLI or add it as a build command temporarily

6. **Deploy**:
   - Click "Deploy" in Vercel
   - Wait for the build to complete
   - Your site will be live at `https://your-project.vercel.app`

#### Post-Deployment Setup

1. **Run Database Migrations** (if not done during deployment):
   ```bash
   npx prisma migrate deploy
   ```

2. **Optional: Seed the database** (if you have seed data):
   ```bash
   npm run db:seed
   ```

3. **Update NEXTAUTH_URL**:
   - After your first deployment, Vercel will give you a URL
   - Update the `NEXTAUTH_URL` environment variable in Vercel dashboard to match your actual deployment URL

#### Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update `NEXTAUTH_URL` to match your custom domain

### Alternative Deployment Options

#### Deploying to Other Platforms

If you prefer other platforms:

1. **Railway**: Similar to Vercel, supports PostgreSQL and Next.js
2. **Render**: Good alternative with PostgreSQL support
3. **DigitalOcean App Platform**: Full control with managed databases
4. **AWS/GCP/Azure**: For enterprise deployments

For all platforms, ensure:
- PostgreSQL database is set up
- Environment variables are configured
- Build command includes `prisma generate`
- Database migrations are run after deployment

### Environment Variables Reference

Required environment variables:

```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"
GEMINI_API_KEY="your-google-gemini-api-key"
```

### Troubleshooting

- **Build fails**: Ensure `prisma generate` runs before `next build`
- **Database connection errors**: Check your `DATABASE_URL` format and network access
- **Authentication issues**: Verify `NEXTAUTH_URL` matches your deployment URL exactly
- **Prisma errors**: Make sure to run `prisma migrate deploy` after first deployment

## License

ISC

