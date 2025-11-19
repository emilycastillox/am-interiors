# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to be fully provisioned

## 2. Get Your Database Connection String

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection string** section
3. Copy the **URI** connection string (it will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)
4. Replace `[YOUR-PASSWORD]` with your actual database password

## 3. Set Up Environment Variables

1. Create a `.env` file in the root of your project
2. Add your database URL:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
```

**Note:** For production/Vercel, you'll need to add this as an environment variable in your Vercel project settings.

## 4. Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Push the schema to Supabase
npx prisma db push

# Or use migrations (recommended for production)
npx prisma migrate dev --name init
```

## 5. Verify Connection

You can verify the connection by running:

```bash
npx prisma studio
```

This will open Prisma Studio where you can view and manage your database.
