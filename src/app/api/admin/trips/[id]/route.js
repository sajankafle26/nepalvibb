import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tour from '@/models/Tour';

// GET a specific tour
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const tour = await Tour.findById(id);
    if (!tour) return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    return NextResponse.json(tour);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update a specific tour
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const { _id, ...updateData } = body;
    const tour = await Tour.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!tour) return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    return NextResponse.json(tour);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a specific tour
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const tour = await Tour.findByIdAndDelete(id);
    if (!tour) return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    return NextResponse.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
