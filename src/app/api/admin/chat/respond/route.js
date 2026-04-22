import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TripRequest from '@/models/TripRequest';

export async function POST(req) {
  try {
    await dbConnect();
    const { tripId, text, attachment } = await req.json();

    const trip = await TripRequest.findById(tripId);
    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });

    trip.messages.push({
      sender: 'specialist',
      text,
      attachment: attachment || null,
      timestamp: new Date()
    });

    await trip.save();

    // Emit via socket if available
    if (global._io) {
      const timestamp = new Date();
      global._io.to(tripId).emit('receive-message', {
        id: `api-${Date.now()}`,
        from: 'specialist',
        text,
        attachment: attachment || null,
        time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: timestamp.toISOString(),
        read: false,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
