import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Activity from '@/models/Activity';

export async function GET() {
  try {
    await dbConnect();
    const activities = await Activity.find({}).sort({ name: 1 });
    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const activity = await Activity.create(body);
    return NextResponse.json(activity);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
