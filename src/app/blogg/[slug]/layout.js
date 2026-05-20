import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function generateMetadata({ params }) {
  await dbConnect();
  const resolvedParams = await params;
  const blog = await Blog.findOne({ slug: resolvedParams.slug });

  if (!blog) {
    return {
      title: 'Artikkel ikke funnet | Nepalvibb',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nepalvibb.com';
  const title = `${blog.title} | Nepalvibb Blogg`;
  // Extract a brief summary from HTML content if possible, or use a default description
  let description = 'Les vår nyeste reiseartikkel om Nepal på Nepalvibb.';
  if (blog.content) {
    const plainText = blog.content.replace(/<[^>]*>?/gm, '');
    description = plainText.substring(0, 160) + (plainText.length > 160 ? '...' : '');
  }

  const imageUrl = blog.image || `${siteUrl}/og-image.jpg`;

  return {
    title,
    description,
    authors: [{ name: blog.author || 'Nepalvibb Editor' }],
    openGraph: {
      title,
      description,
      url: `${siteUrl}/blogg/${blog.slug}`,
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
      type: 'article',
      publishedTime: blog.createdAt,
      authors: [blog.author || 'Nepalvibb Editor'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function BlogLayout({ children }) {
  return <>{children}</>;
}
