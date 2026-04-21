import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import TripRequest from '@/models/TripRequest';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

export async function POST(req) {
  try {
    const { amount, tripId, details } = await req.json();

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency: 'usd',
      metadata: {
        tripId,
        travelerEmail: details.email
      },
    });

    // We also update the trip details in the DB now (provisionally)
    // or we can wait for success. For now, let's just create the intent.
    // The client will call another endpoint or we can update on capture.
    
    // Actually, let's update the trip basic info now so it's ready
    await dbConnect();
    if (tripId) {
      await TripRequest.findByIdAndUpdate(tripId, {
        startDate: details.startDate ? new Date(details.startDate) : undefined,
        endDate: details.endDate ? new Date(details.endDate) : undefined,
        name: `${details.firstName} ${details.lastName}`,
        phone: details.phone
      });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error('Stripe Intent Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
