"use client";

import Link from 'next/link';
import { Clock, MapPin, Star, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

import { useState, useEffect, useRef } from 'react';

export default function FeaturedTours({ content }) {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch('/api/trips/featured');
        const data = await res.json();
        if (Array.isArray(data)) {
          const sorted = [...data].sort((a, b) => {
            const catA = a.category?.toLowerCase() || '';
            const catB = b.category?.toLowerCase() || '';
            const scoreA = catA === 'tour' ? 2 : catA === 'trekking' ? 1 : 0;
            const scoreB = catB === 'tour' ? 2 : catB === 'trekking' ? 1 : 0;
            return scoreB - scoreA;
          });
          setTours(sorted.slice(0, 9));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [tours]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('div')?.offsetWidth || 380;
    el.scrollBy({ left: direction * (cardWidth + 24), behavior: 'smooth' });
  };

  if (loading) return null;
  return (
    <section id="tours" className="py-16 sm:py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h5 className="text-orange-500 font-bold uppercase tracking-wider text-xs mb-3">
            {content?.subtitle || 'Mest Populære Turpakker'}
          </h5>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display text-primary tracking-tight mb-8 leading-tight">
            {content?.title || 'Nepal-fotturpakke'}
          </h2>
          <div className="flex justify-center">
            <Link
              href="/activity/turer"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase text-sm tracking-wider px-8 py-4 rounded-full shadow-[0_10px_30px_rgba(249,115,22,0.35)] hover:shadow-[0_15px_40px_rgba(249,115,22,0.45)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Se alle turer
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Scrollable Tours with Arrows */}
        <div className="relative group/section">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll(-1)}
              className="absolute -left-4 sm:-left-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll(1)}
              className="absolute -right-4 sm:-right-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4 -mb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tours.map((tour) => (
              <div
                key={tour._id || tour.slug}
                className="min-w-[300px] sm:min-w-[340px] lg:min-w-[380px] max-w-[400px] flex-shrink-0 snap-start bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 group border border-gray-100 flex flex-col hover:shadow-lg"
              >
                <div className="relative h-56 sm:h-72 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-primary/95 text-white text-[9px] font-bold uppercase px-3 py-1.5 rounded-full tracking-wider shadow-md backdrop-blur-sm">
                    {tour.category || 'Eventyr'}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-orange-500 text-white font-bold px-4 py-2 rounded-2xl shadow-md transition-transform duration-500">
                    <p className="text-[9px] block font-light text-orange-200 uppercase tracking-wider leading-none mb-0.5">Fra</p>
                    <p className="text-sm">NOK {tour.price?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-primary mb-3 line-clamp-2 leading-snug group-hover:text-orange-500 transition-colors">
                    {tour.title}
                  </h3>
                  <p className="text-gray-500 font-light text-sm mb-6 line-clamp-3 leading-relaxed">
                    {tour.summary}
                  </p>
                  <Link href={`/trips/${tour.slug}`} className="mt-auto inline-flex items-center text-primary font-bold uppercase text-xs tracking-wider gap-2 hover:text-orange-500 transition-colors">
                    <span>Les mer</span>
                    <span className="text-orange-500 text-base group-hover:translate-x-1.5 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
