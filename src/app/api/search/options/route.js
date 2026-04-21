import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tour from '@/models/Tour';
import Destination from '@/models/Destination';
import Activity from '@/models/Activity';

export async function GET() {
  try {
    await dbConnect();

    // 1. Get unique destinations
    const destinations = await Destination.find({}, 'name').sort({ name: 1 });

    // 2. Get unique activities (from dedicated Activity model)
    const activities = await Activity.find({}, 'name').sort({ name: 1 });

    // 3. Dynamic Duration ranges
    const durations = [
      { label: '1-5 Days', value: '1-5' },
      { label: '6-12 Days', value: '6-12' },
      { label: '13-20 Days', value: '13-20' },
      { label: '21+ Days', value: '21+' },
    ];

    return NextResponse.json({
      destinations: destinations.map(d => d.name),
      activities: activities.map(a => a.name),
      durations
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
