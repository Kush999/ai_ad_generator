import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { database } from '@/lib/database';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    console.error('Missing stripe-signature header');
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('Webhook verified successfully, event type:', event.type);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);
        
        if (!session.metadata) {
          console.error('No metadata found in session');
          break;
        }

        const { userId, credits } = session.metadata;
        
        if (!userId || !credits) {
          console.error('Missing userId or credits in metadata:', session.metadata);
          break;
        }

        console.log(`Processing payment: Adding ${credits} credits to user ${userId}`);

        // Add credits to user account
        const { error } = await database.addCredits(userId, parseInt(credits));
        
        if (error) {
          console.error('Error adding credits after payment:', error);
          return NextResponse.json(
            { error: 'Failed to add credits' },
            { status: 500 }
          );
        }

        console.log(`✅ Successfully added ${credits} credits to user ${userId}`);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log('✅ Payment succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.error('❌ Payment failed:', paymentIntent.id, paymentIntent.last_payment_error?.message);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        console.log('⏰ Checkout session expired:', session.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
