import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if all required Stripe environment variables are set
    const checks = {
      stripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      stripePublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      stripeWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      isTestMode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') || false,
    };

    return NextResponse.json({
      success: true,
      message: 'Stripe configuration check',
      checks,
      recommendations: {
        ...(checks.stripeSecretKey ? {} : { error: 'STRIPE_SECRET_KEY is missing from .env.local' }),
        ...(checks.stripePublishableKey ? {} : { error: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing from .env.local' }),
        ...(checks.stripeWebhookSecret ? {} : { warning: 'STRIPE_WEBHOOK_SECRET is missing - webhooks will not work' }),
        ...(checks.isTestMode ? { info: 'Using Stripe test mode - safe for testing' } : { warning: 'Using live Stripe keys - be careful!' }),
      }
    });

  } catch (error) {
    console.error('Error checking Stripe configuration:', error);
    return NextResponse.json(
      { error: 'Failed to check Stripe configuration' },
      { status: 500 }
    );
  }
}
