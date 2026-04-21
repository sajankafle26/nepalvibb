import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TripRequest from '@/models/TripRequest';

const PAYPAL_BASE = process.env.PAYPAL_MODE === 'sandbox'
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await res.json();
  return data.access_token;
}

// POST /api/payment/capture-order
export async function POST(req) {
  try {
    const { orderId, tripId, bookingDetails } = await req.json();

    const accessToken = await getAccessToken();

    const capture = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const captureData = await capture.json();
    if (captureData.status === 'COMPLETED') {
      const payer = captureData.payer;
      const purchaseUnits = captureData.purchase_units?.[0];
      const amount = purchaseUnits?.payments?.captures?.[0]?.amount;

      // Update Trip Request in DB
      await dbConnect();
      if (tripId) {
        await TripRequest.findByIdAndUpdate(tripId, {
          status: 'booked',
          paymentStatus: 'paid',
          startDate: bookingDetails.startDate ? new Date(bookingDetails.startDate) : undefined,
          endDate: bookingDetails.endDate ? new Date(bookingDetails.endDate) : undefined,
          name: `${bookingDetails.firstName} ${bookingDetails.lastName}`,
          phone: bookingDetails.phone
        });
      }

      return NextResponse.json({
        success: true,
        transactionId: captureData.id,
        payerName: payer ? `${payer.name?.given_name} ${payer.name?.surname}` : 'Unknown',
        payerEmail: payer?.email_address,
        amount: amount?.value,
        currency: amount?.currency_code,
        status: captureData.status,
        tripId: tripId
      });
    }

    return NextResponse.json({ success: false, status: captureData.status }, { status: 400 });
  } catch (err) {
    console.error('PayPal capture error:', err);
    return NextResponse.json({ error: 'Failed to capture PayPal payment' }, { status: 500 });
  }
}
