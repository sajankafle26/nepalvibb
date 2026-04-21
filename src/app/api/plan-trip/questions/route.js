import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PlanTripQuestion from '@/models/PlanTripQuestion';

export async function GET() {
  try {
    await dbConnect();
    const questions = await PlanTripQuestion.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
