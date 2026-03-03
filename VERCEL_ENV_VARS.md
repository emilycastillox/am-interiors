# Vercel Environment Variables

## Required Environment Variables

### 1. `DATABASE_URL` (Required)
**Description**: Connection string for your PostgreSQL database (Supabase)

**Format**: 
```
postgresql://[user]:[password]@[host]:[port]/[database]?schema=public&sslmode=require
```

**How to get it**:
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Under **Connection string**, select **URI**
4. Copy the connection string (it will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)
5. Replace `[YOUR-PASSWORD]` with your actual database password

**Example**:
```
postgresql://postgres:your_password_here@db.abcdefghijklmnop.supabase.co:5432/postgres?schema=public&sslmode=require
```

## Optional Environment Variables (Recommended for Production)

### 2. `ADMIN_USERNAME` (Optional - Recommended)
**Description**: Admin username for CRM login

**Default**: `aminteriorsadmin` (hardcoded in `app/api/auth/login/route.ts`)

**Recommendation**: Set this to a custom username for better security

### 3. `ADMIN_PASSWORD` (Optional - Recommended)
**Description**: Admin password for CRM login

**Default**: `12345` (hardcoded in `app/api/auth/login/route.ts`)

**Recommendation**: Set this to a strong password for production

**Note**: To use these, you'll need to update `app/api/auth/login/route.ts` to read from environment variables:
```typescript
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "aminteriorsadmin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "12345"
```

### 4. `INVOICING_API_KEY` (Required for Invoice Generation)
**Description**: API key for InvoicingAPI to generate invoice PDFs

**How to get it**:
1. Sign up at [invoicingapi.com](https://invoicingapi.com)
2. Navigate to your dashboard/API settings
3. Copy your API key

**Example**:
```
INVOICING_API_KEY=your_api_key_here
```

**Note**: Without this key, invoice creation will still work in the database, but PDF generation and email sending will be skipped.

### 5. `INVOICING_API_URL` (Optional)
**Description**: Base URL for InvoicingAPI (usually doesn't need to be changed)

**Default**: `https://dev.invoicingapi.com/v1/invoice/createinvoice`

**Example**:
```
INVOICING_API_URL=https://dev.invoicingapi.com/v1/invoice/createinvoice
```

### 6. `MAILGUN_API_KEY` (Required for Email Sending)
**Description**: API key for Mailgun to send invoice emails

**How to get it**:
1. Sign up at [mailgun.com](https://www.mailgun.com)
2. Navigate to **Sending** → **Domain Settings** → **API Keys**
3. Copy your Private API key

**Example**:
```
MAILGUN_API_KEY=your_mailgun_api_key_here
```

**Note**: Without this key, invoice creation will still work in the database, but email sending will be skipped.

### 7. `MAILGUN_DOMAIN` (Optional - Has Default)
**Description**: Your verified Mailgun domain for sending emails

**Default**: `sandbox0998a7715b25409181f87acf92cafa2c.mailgun.org` (sandbox domain)

**How to get it**:
1. In Mailgun dashboard, go to **Sending** → **Domains**
2. Use your verified domain (sandbox or custom domain)
3. For sandbox: Use the sandbox domain provided by Mailgun
4. For custom domain: Make sure the domain is verified and DNS records are set up correctly

**Example (Sandbox)**:
```
MAILGUN_DOMAIN=sandbox0998a7715b25409181f87acf92cafa2c.mailgun.org
```

**Example (Custom Domain)**:
```
MAILGUN_DOMAIN=mg.yourdomain.com
```

**Note**: Sandbox domains can only send to authorized recipients. Add recipient emails in Mailgun dashboard under **Sending** → **Authorized Recipients**.

### 8. `MAILGUN_FROM_EMAIL` (Optional)
**Description**: Email address to send invoices from

**Default**: `noreply@${MAILGUN_DOMAIN}`

**Example**:
```
MAILGUN_FROM_EMAIL=noreply@yourdomain.com
```

**Note**: This email must be from your verified Mailgun domain.

### 8. `MAILGUN_BASE_URL` (Optional)
**Description**: Base URL for Mailgun API

**Default**: `https://api.mailgun.net`

**Example**:
```
MAILGUN_BASE_URL=https://api.mailgun.net
```

**Note**: For EU infrastructure, use `https://api.eu.mailgun.net`

### 9. `MAILGUN_FROM_EMAIL` (Optional)
**Description**: Email address to send invoices from

**Default**: `noreply@${MAILGUN_DOMAIN}`

**Example**:
```
MAILGUN_FROM_EMAIL=noreply@sandbox0998a7715b25409181f87acf92cafa2c.mailgun.org
```

**Note**: This email must be from your verified Mailgun domain.

### 10. `MAILGUN_FROM_NAME` (Optional)
**Description**: Display name for the sender

**Default**: `AM Interiors`

**Example**:
```
MAILGUN_FROM_NAME=AM Interiors
```

## How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter the variable name (e.g., `DATABASE_URL`)
5. Enter the variable value
6. Select the environments where it should be available:
   - ✅ **Production**
   - ✅ **Preview** (optional, for testing)
   - ✅ **Development** (optional, for local dev)
7. Click **Save**

## After Adding Environment Variables

1. **Redeploy your application**:
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Select **Redeploy**

2. **Verify the database connection**:
   - After deployment, check the Vercel function logs
   - Try accessing `/admin/login` and logging in
   - If you see database errors, verify your `DATABASE_URL` is correct

## Important Notes

- ⚠️ **Never commit `.env` files** to your repository
- 🔒 **Keep your `DATABASE_URL` secure** - it contains sensitive credentials
- 🔄 **Redeploy after adding/changing environment variables** for changes to take effect
- ✅ **Vercel automatically sets `NODE_ENV=production`** in production deployments, so cookies will be secure

## Troubleshooting

### Database Connection Issues
- Verify your Supabase database is running
- Check that your `DATABASE_URL` includes `?sslmode=require` for Supabase
- Ensure your Supabase project allows connections from Vercel's IP addresses
- Check Vercel function logs for specific error messages

### Authentication Issues
- Verify cookies are working (check browser DevTools → Application → Cookies)
- Ensure `secure: true` is set for production (handled automatically by `NODE_ENV` check)
- Check that the session cookie is being set correctly



