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
        setTours(Array.isArray(data) ? data : []);
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
    <section id="tours" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h5 className="text-orange-500 font-bold uppercase tracking-widest text-[10px] mb-4">
            {content?.subtitle || 'Våre Mest Populære Turer'}
          </h5>
          <h2 className="text-5xl md:text-6xl font-black text-primary uppercase tracking-tighter mb-8 leading-none">
            {content?.title || 'Finn Ditt Perfekte Eventyr'}
          </h2>
          <div className="flex justify-center">
            <Link href="/activity/turer" className="text-primary font-black border-b-4 border-orange-500 pb-2 uppercase text-[10px] tracking-[0.2em] hover:text-orange-500 transition-colors">
              Se alle avtaler
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-12">
          {tours.map((tour) => (
              <div className="bg-white rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-3 group border border-gray-100 flex flex-col">
                <div className="relative h-40 sm:h-80 overflow-hidden">
                  <img 
                    src={tour.image} 
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 sm:top-8 sm:left-8 bg-primary/95 text-white text-[7px] sm:text-[9px] font-black uppercase px-3 sm:px-4 py-1.5 sm:py-2 rounded-full tracking-[0.2em] shadow-2xl backdrop-blur-sm">
                    {tour.difficulty}
                  </div>
                  <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 bg-orange-500 text-white font-black px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-2xl scale-100 sm:scale-110 group-hover:scale-110 sm:group-hover:scale-125 transition-transform duration-500">
                    <p className="text-[7px] sm:text-[10px] block font-light text-orange-200 uppercase tracking-widest leading-none mb-1">Fra</p>
                    <p className="text-[10px] sm:text-base">NOK {tour.price?.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="p-5 sm:p-10 flex-1 flex flex-col">
                  <h3 className="text-sm sm:text-2xl font-black text-primary mb-3 sm:mb-6 line-clamp-2 leading-none uppercase tracking-tighter group-hover:text-orange-500 transition-colors">
                    {tour.title}
                  </h3>
                  <p className="hidden sm:block text-gray-400 font-light text-base mb-10 line-clamp-3 leading-relaxed">
                    {tour.summary}
                  </p>
                  <Link href={`/trips/${tour.slug}`} className="mt-auto inline-flex items-center text-primary font-black uppercase text-[8px] sm:text-[10px] tracking-[0.2em] group-hover:gap-4 sm:group-hover:gap-6 gap-2 sm:gap-3 transition-all">
                    Les mer <span className="text-orange-500 text-sm sm:text-lg">→</span>
                  </Link>
                </div>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}
