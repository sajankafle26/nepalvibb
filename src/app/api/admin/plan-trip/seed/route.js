import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PlanTripQuestion from '@/models/PlanTripQuestion';

const initialQuestions = [
  {
    question: "Hvilken type opplevelse ser du etter?",
    description: "Velg den kategorien som passer best for din drømmereise.",
    type: "select",
    order: 1,
    options: [
      { label: "Fjellturer & Trekking", value: "trekking", icon: "Mountain" },
      { label: "Kultur & Historie", value: "culture", icon: "Globe" },
      { label: "Luksus & Avslapning", value: "luxury", icon: "Sparkles" },
      { label: "Eventyr & Sport", value: "adventure", icon: "Zap" }
    ]
  },
  {
    question: "Hvor ønsker du å reise?",
    description: "Du kan velge flere destinasjoner.",
    type: "multi-select",
    order: 2,
    options: [
      { label: "Nepal", value: "nepal", icon: "MapPin" },
      { label: "Bhutan", value: "bhutan", icon: "MapPin" },
      { label: "Tibet", value: "tibet", icon: "MapPin" },
      { label: "India", value: "india", icon: "MapPin" }
    ]
  },
  {
    question: "Hvor mange reiser dere?",
    description: "Dette hjelper oss med å planlegge logistikk og overnatting.",
    type: "select",
    order: 3,
    options: [
      { label: "Solo", value: "1", icon: "User" },
      { label: "Par", value: "2", icon: "Users" },
      { label: "Liten gruppe (3-5)", value: "3-5", icon: "Users" },
      { label: "Stor gruppe (6+)", value: "6+", icon: "Users" }
    ]
  }
];

export async function GET() {
  try {
    await dbConnect();
    await PlanTripQuestion.deleteMany({}); // Clear existing
    await PlanTripQuestion.create(initialQuestions);
    return NextResponse.json({ message: 'Questions seeded successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to seed questions' }, { status: 500 });
  }
}
