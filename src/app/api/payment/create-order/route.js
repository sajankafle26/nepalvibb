import { NextResponse } from 'next/server';

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

// POST /api/payment/create-order
export async function POST(req) {
  try {
    const { amount, currency = 'NOK', tripTitle, tripId } = await req.json();

    const accessToken = await getAccessToken();

    const order = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: tripId || `trip_${Date.now()}`,
            description: tripTitle || 'Nepalvibb Travel Package',
            amount: {
              currency_code: currency,
              value: String(parseFloat(amount).toFixed(2)),
            },
          },
        ],
        application_context: {
          brand_name: 'Nepalvibb',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/cancelled`,
        },
      }),
    });

    const orderData = await order.json();
    return NextResponse.json({ orderId: orderData.id, status: orderData.status });
  } catch (err) {
    console.error('PayPal create order error:', err);
    return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
  }
}
