import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Destination from '@/models/Destination';
import Tour from '@/models/Tour';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;

    // 1. Get destination details
    const destination = await Destination.findOne({ slug });
    if (!destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    // 2. Get tours for this destination
    // We match by name for now, or you might want to add destinationId to Tour model
    const tours = await Tour.find({ 
      $or: [
        { destination: destination.name },
        { location: destination.name }
      ]
    });

    return NextResponse.json({ destination, tours });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
