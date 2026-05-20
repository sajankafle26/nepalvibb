import dbConnect from '@/lib/mongodb';
import Activity from '@/models/Activity';

export async function generateMetadata({ params }) {
  await dbConnect();
  // Depending on Next.js version, params might need to be awaited. 
  // We'll safely handle both.
  const resolvedParams = await params;
  const activity = await Activity.findOne({ slug: resolvedParams.slug });

  if (!activity) {
    return {
      title: 'Aktivitet ikke funnet | Nepalvibb',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nepalvibb.com';
  const title = `${activity.name} | Nepalvibb`;
  const description = activity.description?.substring(0, 160) || `Oppdag ${activity.name.toLowerCase()} opplevelser i Nepal med Nepalvibb.`;
  const imageUrl = activity.image || `${siteUrl}/og-image.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/activity/${activity.slug}`,
      siteName: 'Nepalvibb',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'nb_NO',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function ActivityLayout({ children }) {
  return <>{children}</>;
}
