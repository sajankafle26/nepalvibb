import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import HomeContent from '@/models/HomeContent';
import dbConnect from '@/lib/mongodb';

import HeroBanner from '@/components/home/HeroBanner';

const SearchSection = dynamic(() => import('@/components/home/SearchSection'), { ssr: true });
const DestinationCards = dynamic(() => import('@/components/home/DestinationCards'), { ssr: true });
const FeaturedActivities = dynamic(() => import('@/components/home/FeaturedActivities'), { ssr: true });
const WhoWeAre = dynamic(() => import('@/components/home/WhoWeAre'), { ssr: true });
const FeaturedTours = dynamic(() => import('@/components/home/FeaturedTours'), { ssr: true });
const LatestBlogs = dynamic(() => import('@/components/home/LatestBlogs'), { ssr: true });
const Testimonials = dynamic(() => import('@/components/home/Testimonials'), { ssr: true });

export const revalidate = 300;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nepalvibb.com';

export const metadata = {
  title: 'Nepalvibb – Din Norske Reisepartner til Nepal & Himalaya',
  description: 'Opplev Nepal med Nepalvibb. Vi tilbyr skreddersydde trekking-, kultur- og eventyrreiser i Himalaya. Norskspråklig support, lokale eksperter og uforglemmelige opplevelser.',
  keywords: ['Nepal reise', 'trekking Nepal', 'Himalaya', 'Everest Base Camp', 'Annapurna', 'Nepal tur', 'reisebyrå Nepal', 'norsk reisebyrå'],
  authors: [{ name: 'Nepalvibb' }],
  creator: 'Nepalvibb',
  publisher: 'Nepalvibb',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
    languages: { 'no': '/' },
  },
  openGraph: {
    title: 'Nepalvibb – Din Norske Reisepartner til Nepal & Himalaya',
    description: 'Skreddersydde trekking-, kultur- og eventyrreiser i Nepal. Norskspråklig support og lokale eksperter.',
    url: siteUrl,
    siteName: 'Nepalvibb',
    locale: 'nb_NO',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Nepalvibb – Reiser til Nepal og Himalaya',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nepalvibb – Din Norske Reisepartner til Nepal & Himalaya',
    description: 'Skreddersydde trekking-, kultur- og eventyrreiser i Nepal. Norskspråklig support og lokale eksperter.',
    images: [`${siteUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

async function getHomeContent() {
  await dbConnect();
  let content = await HomeContent.findOne({});
  if (!content) {
    content = await HomeContent.create({});
  }
  return JSON.parse(JSON.stringify(content));
}

export default async function Home() {
  const content = await getHomeContent();

  return (
    <main className="relative bg-white">
      <HeroBanner />
      
      {/* Filter Section */}
      <SearchSection />
      
      {/* Destination Grid */}
      <DestinationCards content={content.destinations} />

      {/* Featured Activities */}
      <FeaturedActivities content={content.activities} />
      
      {/* Who We Are */}
      <WhoWeAre content={content.whoWeAre} />
      
      {/* Featured Tours */}
      <FeaturedTours content={content.tours} />
    
      {/* Purpose Section */}
      <section className="relative py-28 sm:py-40 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url("${content.purpose?.image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80'}")` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-emerald-900/95"></div>

        {/* Decorative Elements */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-2xl"></div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full mb-8 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
            <span className="text-orange-300 font-bold uppercase tracking-widest text-[10px]">
              {content.purpose?.subtitle || 'Vår Visjon'}
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display text-white tracking-tight mb-6 leading-[1.1]">
            {content.purpose?.title || 'Opplevelser som'}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300">
              forvandler
            </span>
          </h2>

          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-300 mx-auto mb-8 rounded-full"></div>

          <p className="text-white/70 max-w-3xl mx-auto mb-12 text-lg sm:text-xl font-light leading-relaxed">
            {content.purpose?.description || 'Vi skaper autentiske reiser som forbinder deg med hjertet av Nepal – fra Himalaya til eldgamle kulturarv.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/plan-your-trip"
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 text-xs font-black uppercase tracking-widest transition-all duration-300 rounded-full shadow-[0_15px_35px_rgba(249,115,22,0.4)] hover:shadow-[0_20px_50px_rgba(249,115,22,0.5)] hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                {content.purpose?.buttonText || 'Planlegg Reisen'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            <Link
              href="/turer"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-xs font-bold uppercase tracking-wider transition-all border border-white/20 hover:border-white/40 px-8 py-4 rounded-full hover:bg-white/5"
            >
              Utforsk våre turer
            </Link>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent"></div>
      </section>

      {/* Testimonials */}
      <Testimonials content={content.testimonials} />

      {/* Blogs / News */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h5 className="text-orange-500 font-bold uppercase tracking-wider text-xs mb-3">
              {content.blog?.subtitle}
            </h5>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display text-primary tracking-tight leading-tight">
              {content.blog?.title}
            </h2>
          </div>
          
          <LatestBlogs />

          <div className="mt-12 text-center">
            <Link href="/blogg" className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-orange-500 transition-colors group">
              <span>Se alle artikler</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
