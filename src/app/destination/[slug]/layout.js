import dbConnect from '@/lib/mongodb';
import Destination from '@/models/Destination';

export async function generateMetadata({ params }) {
  await dbConnect();
  const resolvedParams = await params;
  const destination = await Destination.findOne({ slug: resolvedParams.slug });

  if (!destination) {
    return {
      title: 'Destinasjon ikke funnet | Nepalvibb',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nepalvibb.com';
  const title = `${destination.name} Reiser & Turer | Nepalvibb`;
  const description = destination.description?.substring(0, 160) || `Utforsk vakre ${destination.name} med Nepalvibb. Finn den perfekte reisen for deg.`;
  const imageUrl = destination.image || `${siteUrl}/og-image.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/destination/${destination.slug}`,
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

export default function DestinationLayout({ children }) {
  return <>{children}</>;
}
