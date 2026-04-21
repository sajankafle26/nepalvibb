import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TripRequest from '@/models/TripRequest';

export async function POST(req) {
  try {
    const { tripId, paymentIntentId } = await req.json();

    await dbConnect();
    if (tripId) {
      await TripRequest.findByIdAndUpdate(tripId, {
        status: 'booked',
        paymentStatus: 'paid',
        paymentId: paymentIntentId // Store Stripe ID
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Stripe Confirm Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
