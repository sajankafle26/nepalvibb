import HeroBanner from '@/components/home/HeroBanner';
import SearchSection from '@/components/home/SearchSection';
import DestinationCards from '@/components/home/DestinationCards';
import FeaturedActivities from '@/components/home/FeaturedActivities';
import WhoWeAre from '@/components/home/WhoWeAre';
import FeaturedTours from '@/components/home/FeaturedTours';
import LatestBlogs from '@/components/home/LatestBlogs';
import Testimonials from '@/components/home/Testimonials';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import HomeContent from '@/models/HomeContent';
import dbConnect from '@/lib/mongodb';

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
      <section className="relative py-24 sm:py-32 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url("${content.purpose?.image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80'}")` }}>
        <div className="absolute inset-0 bg-primary/90 backdrop-blur-[2px]"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h5 className="text-orange-400 font-bold uppercase tracking-wider text-xs mb-6">
            {content.purpose?.subtitle}
          </h5>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white tracking-tight mb-8 leading-tight">
            {content.purpose?.title}
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-10 text-lg font-light leading-relaxed">
            {content.purpose?.description}
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4.5 text-xs font-bold uppercase tracking-wider transition-all rounded-full shadow-lg hover:scale-105">
            {content.purpose?.buttonText}
          </button>
        </div>
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
