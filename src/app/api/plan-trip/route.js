import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TripRequest from '@/models/TripRequest';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trips = await TripRequest.find({ 
      $or: [
        { userId: session.user.id },
        { email: session.user.email }
      ]
    }).sort({ createdAt: -1 });

    return NextResponse.json(trips);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { selections, contact } = body;
    const session = await getServerSession(authOptions);
    
    // Create a new TripRequest which enables chat
    const tripRequest = await TripRequest.create({
      ...contact,
      ...selections, 
      userId: session?.user?.id || null,
      status: 'active',
      messages: [
        {
          sender: 'specialist',
          text: `Hei ${contact.name}! Takk for at du planlegger reisen din med Nepalvibb. Jeg har mottatt din forespørsel og ser frem til å hjelpe deg med å skreddersy det perfekte Himalaya-eventyret. 🙏`,
          timestamp: new Date()
        }
      ]
    });

    return NextResponse.json(tripRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
