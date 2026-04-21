import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Banner from '@/models/Banner';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const { _id, ...updateData } = body;
    const banner = await Banner.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    await Banner.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Banner deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
