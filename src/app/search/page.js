"use client";

import { useState, useEffect, use, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, Filter, MapPin, 
  Clock, Star, ArrowRight,
  Compass, Calendar, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

function SearchContent() {
  const searchParams = useSearchParams();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const destination = searchParams.get('destination');
  const activity = searchParams.get('activity');
  const duration = searchParams.get('duration');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?${searchParams.toString()}`);
        const data = await res.json();
        setTours(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-40 pb-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="space-y-4">
              <h5 className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px]">Søkeresultater</h5>
              <h1 className="text-5xl md:text-7xl font-black text-primary uppercase tracking-tighter leading-none italic">
                Oppdag ditt <br /> <span className="text-orange-500">Eventyr</span>
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              {destination && (
                <div className="bg-white border border-gray-100 px-6 py-3 rounded-2xl flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>{destination}</span>
                </div>
              )}
              {activity && (
                <div className="bg-white border border-gray-100 px-6 py-3 rounded-2xl flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                  <Compass className="w-4 h-4 text-blue-500" />
                  <span>{activity}</span>
                </div>
              )}
              {duration && (
                <div className="bg-white border border-gray-100 px-6 py-3 rounded-2xl flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span>{duration} dager</span>
                </div>
              )}
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="py-32 text-center">
              <div className="w-16 h-16 border-4 border-primary/10 border-t-orange-500 rounded-full animate-spin mx-auto mb-8" />
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 animate-pulse">Vi finner de beste treffene for deg...</p>
            </div>
          ) : tours.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 space-y-8 shadow-sm">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-10 h-10 text-gray-200" />
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                <h3 className="text-3xl font-black text-primary uppercase tracking-tight italic">Ingen treff funnet</h3>
                <p className="text-gray-400 font-medium leading-relaxed">Vi fant dessverre ingen turer som matchet dine valg. Prøv å justere filtrene dine eller søk etter noe annet.</p>
              </div>
              <Link href="/" className="inline-block bg-primary text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-500 transition-all shadow-xl shadow-primary/20">
                Gå tilbake til forsiden
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {tours.map((tour) => (
                <div key={tour._id} className="bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gray-100 flex flex-col">
                  <div className="relative h-80 overflow-hidden">
                    <img src={tour.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={tour.title} />
                    <div className="absolute top-8 left-8 bg-primary/90 backdrop-blur-md text-white text-[9px] font-black uppercase px-5 py-2 rounded-full tracking-[0.2em]">
                      {tour.difficulty}
                    </div>
                    <div className="absolute bottom-8 right-8 bg-orange-500 text-white font-black px-6 py-4 rounded-3xl shadow-2xl">
                      <p className="text-[9px] font-medium text-orange-200 uppercase tracking-widest mb-1">Fra</p>
                      <p className="text-lg leading-none">NOK {tour.price?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="p-12 flex-1 flex flex-col">
                    <h3 className="text-2xl font-black text-primary mb-6 uppercase tracking-tight line-clamp-2 leading-none italic group-hover:text-orange-500 transition-colors">
                      {tour.title}
                    </h3>
                    <p className="text-gray-400 font-medium mb-10 line-clamp-2 leading-relaxed text-sm">
                      {tour.summary}
                    </p>
                    <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span>{tour.duration}</span>
                        </div>
                      </div>
                      <Link href={`/trips/${tour.slug}`} className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center group-hover:text-orange-500 transition-all">
                        <span>Se reise</span> 
                        <ArrowRight className="w-4 h-4 ml-2 text-orange-500" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
