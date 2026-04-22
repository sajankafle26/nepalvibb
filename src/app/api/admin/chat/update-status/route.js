import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TripRequest from '@/models/TripRequest';

export async function POST(request) {
  try {
    await dbConnect();
    const { tripId, status } = await request.json();
    
    const trip = await TripRequest.findByIdAndUpdate(
      tripId,
      { status },
      { new: true }
    );
    
    // Add a system message about the status update
    if (trip) {
      const statusLabel = status === 'booked' ? 'BOOKED' : status.toUpperCase();
      const systemMsg = {
        sender: 'system',
        text: `Trip status updated to ${statusLabel}`,
        timestamp: new Date()
      };
      trip.messages.push(systemMsg);
      await trip.save();

      // Emit via socket if available
      if (global._io) {
        global._io.to(tripId).emit('receive-message', {
          id: `sys-${Date.now()}`,
          from: 'system',
          text: systemMsg.text,
          time: systemMsg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: systemMsg.timestamp.toISOString(),
          read: true,
        });
      }
    }

    return NextResponse.json(trip);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
