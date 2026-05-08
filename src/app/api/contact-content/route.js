import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ContactContent from '@/models/ContactContent';

export async function GET() {
  await dbConnect();
  try {
    let content = await ContactContent.findOne({});
    if (!content) {
      content = await ContactContent.create({});
    }
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    let content = await ContactContent.findOne({});
    if (content) {
      content = await ContactContent.findByIdAndUpdate(content._id, body, { new: true });
    } else {
      content = await ContactContent.create(body);
    }
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
