import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Destination from '@/models/Destination';

export async function GET() {
  try {
    await dbConnect();
    const destinations = await Destination.find({});
    destinations.sort((a, b) => {
      if (a.name === 'Nepal') return -1;
      if (b.name === 'Nepal') return 1;
      return a.name.localeCompare(b.name);
    });
    return NextResponse.json(destinations);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
