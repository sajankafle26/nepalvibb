import dbConnect from '@/lib/mongodb';
import Tour from '@/models/Tour';

export async function generateMetadata({ params }) {
  await dbConnect();
  const resolvedParams = await params;
  const trip = await Tour.findOne({ slug: resolvedParams.slug });

  if (!trip) {
    return {
      title: 'Tur ikke funnet | Nepalvibb',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nepalvibb.com';
  const title = `${trip.title} | Nepalvibb Turer`;
  const description = trip.summary?.substring(0, 160) || `Opplev ${trip.title} i Nepal. Skreddersydde trekking- og kulturreiser med Nepalvibb.`;
  const imageUrl = trip.image || `${siteUrl}/og-image.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/trips/${trip.slug}`,
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

export default function TripLayout({ children }) {
  return <>{children}</>;
}
