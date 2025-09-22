import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const checks = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercel: process.env.VERCEL ? 'true' : 'false',
      region: process.env.VERCEL_REGION || 'unknown',
      envVars: {
        supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        stripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
        stripePublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        stripeWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
        falKey: !!process.env.FAL_KEY,
        baseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
      },
      missingVars: [] as string[],
    };

    // Check for missing required variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) checks.missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) checks.missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    if (!process.env.STRIPE_SECRET_KEY) checks.missingVars.push('STRIPE_SECRET_KEY');
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) checks.missingVars.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
    if (!process.env.FAL_KEY) checks.missingVars.push('FAL_KEY');

    const status = checks.missingVars.length === 0 ? 'healthy' : 'unhealthy';
    const statusCode = checks.missingVars.length === 0 ? 200 : 500;

    return NextResponse.json({
      status,
      ...checks,
    }, { status: statusCode });

  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
