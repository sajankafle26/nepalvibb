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
      <section className="relative py-48 bg-cover bg-center overflow-hidden" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80")' }}>
        <div className="absolute inset-0 bg-primary/85 backdrop-blur-[2px]"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h5 className="text-orange-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-8 animate-pulse">
            {content.purpose.subtitle}
          </h5>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-10 leading-none">
            {content.purpose.title}
          </h2>
          <p className="text-emerald-100/80 max-w-2xl mx-auto mb-14 text-xl font-light leading-relaxed">
            {content.purpose.description}
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-14 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all rounded-full shadow-2xl hover:scale-105">
            {content.purpose.buttonText}
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Blogs / News */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h5 className="text-orange-500 font-bold uppercase tracking-widest text-[10px] mb-4">
              {content.blog.subtitle}
            </h5>
            <h2 className="text-5xl md:text-6xl font-black text-primary uppercase tracking-tighter leading-none">
              {content.blog.title}
            </h2>
          </div>
          
          <LatestBlogs />

          <div className="mt-20 text-center">
            <Link href="/blogg" className="inline-flex items-center space-x-3 text-xs font-black uppercase tracking-widest text-primary hover:text-orange-500 transition-colors group">
              <span>Se alle artikler</span>
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
