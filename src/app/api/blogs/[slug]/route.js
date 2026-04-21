import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Get related blogs
    const related = await Blog.find({ 
      category: blog.category,
      _id: { $ne: blog._id }
    }).limit(3);

    return NextResponse.json({ blog, related });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
