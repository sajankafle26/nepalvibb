"use client";

import Link from 'next/link';
import { Clock, MapPin, Star } from 'lucide-react';

import { useState, useEffect } from 'react';

export default function FeaturedTours({ content }) {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

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
          setTours(sorted);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  if (loading) return null;
  return (
    <section id="tours" className="py-16 sm:py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h5 className="text-orange-500 font-bold uppercase tracking-wider text-xs mb-3">
            {content?.subtitle || 'Våre Mest Populære Turer'}
          </h5>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display text-primary tracking-tight mb-6 leading-tight">
            {content?.title || 'Finn ditt perfekte eventyr'}
          </h2>
          <div className="flex justify-center">
            <Link href="/activity/turer" className="text-primary font-bold border-b-2 border-orange-500 pb-1 uppercase text-xs tracking-wider hover:text-orange-500 transition-colors">
              Se alle turer
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div key={tour._id || tour.slug} className="bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 group border border-gray-100 flex flex-col hover:shadow-lg">
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
    </section>
  );
}
