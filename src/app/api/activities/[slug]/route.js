import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Activity from '@/models/Activity';
import Tour from '@/models/Tour';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;

    const activity = await Activity.findOne({ slug });
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    // Find tours that match this activity name or slug as category
    const trips = await Tour.find({ 
      $or: [
        { category: activity.name },
        { category: { $regex: new RegExp(activity.name, 'i') } }
      ]
    }).sort({ createdAt: -1 });

    return NextResponse.json({ activity, trips });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;
    const body = await request.json();
    const activity = await Activity.findOneAndUpdate({ slug }, body, { new: true });
    return NextResponse.json(activity);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;
    await Activity.findOneAndDelete({ slug });
    return NextResponse.json({ message: 'Activity deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
