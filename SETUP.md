# Setup Instructions

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
# Get these from your Supabase project dashboard at https://app.supabase.com
# Project Settings > API > URL and Project Settings > API > Project API keys
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_generate_a_random_string
```

## Supabase Authentication Setup

### 1. Configure Authentication in Supabase Dashboard

1. Go to your Supabase project dashboard at https://app.supabase.com
2. Navigate to **Authentication > Providers**
3. **Email** provider should already be enabled
4. **For Google OAuth** (optional):
   - Enable the Google provider
   - Add your Google OAuth credentials (Client ID and Client Secret)
   - Get these from [Google Cloud Console](https://console.cloud.google.com/)

### 2. Configure URL Settings

In **Authentication > URL Configuration**:
- Site URL: `http://localhost:3000` (for development)
- Redirect URLs: `http://localhost:3000/auth/callback`

### 3. Authentication Features Included

✅ **Email/Password Authentication** with validation  
✅ **Google OAuth Integration**  
✅ **Persistent sessions** across page refreshes  
✅ **Protected functionality** (image generation requires sign-in)  
✅ **Email confirmation** for new signups  
✅ **Secure password requirements** (minimum 6 characters)  
✅ **Professional UI components** with error handling  

### 4. Security Features

- Row Level Security (RLS) ready (configure policies in Supabase dashboard)
- Secure session management
- CSRF protection through Supabase
- Email verification for new accounts

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Installed Dependencies

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** components (with utils setup)
- **Supabase** for database and authentication
- **Stripe** for payments
- **ESLint** for code linting

## Available Components

- Configured shadcn/ui with utilities in `src/lib/utils.ts`
- Supabase client setup in `src/lib/supabase.ts`
- Stripe client/server setup in `src/lib/stripe.ts`

## Adding shadcn/ui Components

To add shadcn/ui components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
# etc.
```
