import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tour from '@/models/Tour';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    const destination = searchParams.get('destination');
    const activity = searchParams.get('activity');
    const duration = searchParams.get('duration');
    const query = searchParams.get('q');

    let filter = {};

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { summary: { $regex: query, $options: 'i' } }
      ];
    }

    if (destination && destination !== 'choose Destination') {
      filter.destination = destination;
    }

    if (activity && activity !== 'choose activities') {
      // Improved activity matching: match in title, summary, or category
      filter.$or = filter.$or || [];
      filter.$or.push(
        { title: { $regex: activity, $options: 'i' } },
        { summary: { $regex: activity, $options: 'i' } },
        { category: { $regex: activity, $options: 'i' } }
      );
    }

    let tours = await Tour.find(filter).limit(50);

    // Filter by duration manually if requested, since duration is a String in schema
    if (duration && duration !== 'Duration') {
      const range = duration.split(' ')[0]; // e.g. "1-5" or "21+"
      
      tours = tours.filter(tour => {
        const tourDays = parseInt(tour.duration); // Parses "12 Days" to 12
        if (isNaN(tourDays)) return true;

        if (range.includes('-')) {
          const [min, max] = range.split('-').map(Number);
          return tourDays >= min && tourDays <= max;
        } else if (range.includes('+')) {
          const min = parseInt(range);
          return tourDays >= min;
        }
        return true;
      });
    }

    return NextResponse.json(tours);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
