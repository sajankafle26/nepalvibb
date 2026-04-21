import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const { _id, ...updateData } = body;
    const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Blog deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
