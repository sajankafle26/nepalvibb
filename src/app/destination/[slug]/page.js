"use client";

import { useState, useEffect, use } from 'react';
import { 
  MapPin, Clock, Tag, LayoutGrid, List, 
  Filter as FilterIcon, ChevronRight, Compass,
  AlertCircle, ArrowRight, Star, Heart
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

export default function DestinationDetailPage({ params }) {
  const { slug } = use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [filters, setFilters] = useState({
    activity: 'Alle',
    duration: 'Alle'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/destinations/${slug}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!data?.destination) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-6">
      <AlertCircle className="w-16 h-16 text-red-500" />
      <h1 className="text-4xl font-black text-primary uppercase tracking-tighter italic">Destinasjon ikke funnet</h1>
      <Link href="/" className="bg-orange-500 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl">Tilbake til hjem</Link>
    </div>
  );

  const { destination, tours = [] } = data;

  const filteredTours = tours.filter(tour => {
    const matchActivity = filters.activity === 'Alle' || tour.category === filters.activity;
    
    let matchDuration = true;
    if (filters.duration !== 'Alle') {
      const days = parseInt(tour.duration);
      if (filters.duration === 'Kort') matchDuration = days <= 5;
      if (filters.duration === 'Middels') matchDuration = days > 5 && days <= 12;
      if (filters.duration === 'Lang') matchDuration = days > 12;
    }
    
    return matchActivity && matchDuration;
  });

  const activities = ['Alle', ...new Set(tours.map(t => t.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Dynamic Hero Section */}
      <div className="relative h-[75vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${destination.image || 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1920&q=80'}")`,
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        </motion.div>
        
        <div className="relative z-10 text-center px-6 pt-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-orange-500 font-black uppercase tracking-[0.6em] text-[10px] mb-6"
          >
            Opplev hjertet av Himalaya
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-7xl md:text-[10rem] font-black text-white uppercase tracking-tighter leading-[0.8] italic drop-shadow-2xl"
          >
            {destination.name}
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-24 relative z-20">
        
        {/* Description Section */}
        <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] p-12 lg:p-24 border border-gray-50 mb-24">
          <div className="max-w-4xl">
            <h2 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tighter mb-10 italic">
              Om <span className="text-orange-500">{destination.name}</span>
            </h2>
            <div className="space-y-6 text-gray-500 font-medium leading-relaxed text-xl italic border-l-4 border-orange-500 pl-8">
              <p>{destination.description || 'Oppdag de skjulte perlene i denne praktfulle regionen. Fra eldgamle tradisjoner til pustebestående landskap, hvert hjørne forteller en historie om undring og styrke.'}</p>
            </div>
          </div>
        </div>

        {/* Filters Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16 px-4">
          <div>
            <h3 className="text-4xl font-black text-primary uppercase tracking-tighter italic">Tilgjengelige Eventyr</h3>
            <p className="text-sm text-gray-400 font-black uppercase tracking-widest mt-2">{filteredTours.length} Opplevelser funnet i {destination.name}</p>
          </div>
          
          <div className="flex items-center space-x-4 bg-gray-50 p-2 rounded-2xl border border-gray-100 shadow-sm">
            <button 
              onClick={() => setView('grid')}
              className={cn("p-4 rounded-xl transition-all", view === 'grid' ? "bg-primary text-white shadow-xl" : "text-gray-400 hover:bg-white")}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn("p-4 rounded-xl transition-all", view === 'list' ? "bg-primary text-white shadow-xl" : "text-gray-400 hover:bg-white")}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-16 items-start pb-32">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-[350px] sticky top-32 space-y-10">
            <div className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-2xl shadow-primary/5">
              <div className="flex items-center space-x-4 mb-12">
                <div className="p-3 bg-emerald-50 rounded-2xl text-primary">
                  <FilterIcon className="w-6 h-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.3em] text-primary italic">Filtrer Resultater</span>
              </div>

              {/* Activity Filter */}
              <div className="space-y-8 mb-16">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Aktivitetstype</p>
                <div className="space-y-3">
                  {activities.map(act => (
                    <button 
                      key={act}
                      onClick={() => setFilters({...filters, activity: act})}
                      className={cn(
                        "w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                        filters.activity === act ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-gray-400 hover:bg-gray-50 border border-transparent"
                      )}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Filter */}
              <div className="space-y-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Varighet</p>
                <div className="space-y-3">
                  {[
                    { label: 'Alle Varigheter', value: 'Alle' },
                    { label: '1-5 Dager', value: 'Kort' },
                    { label: '6-12 Dager', value: 'Middels' },
                    { label: '13+ Dager', value: 'Lang' }
                  ].map(dur => (
                    <button 
                      key={dur.value}
                      onClick={() => setFilters({...filters, duration: dur.value})}
                      className={cn(
                        "w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                        filters.duration === dur.value ? "bg-orange-500 text-white shadow-xl shadow-orange-500/20" : "text-gray-400 hover:bg-gray-50 border border-transparent"
                      )}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-primary rounded-[3.5rem] p-12 text-white overflow-hidden relative group shadow-2xl shadow-primary/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10 space-y-8">
                <h4 className="text-2xl font-black uppercase tracking-tighter italic">Trenger du hjelp?</h4>
                <p className="text-emerald-100/70 text-xs font-medium leading-relaxed italic">Våre lokale spesialister kan hjelpe deg med å skreddersy den perfekte reisen til {destination.name}.</p>
                <Link href="/plan-your-trip" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest bg-white text-primary px-8 py-4 rounded-2xl hover:bg-orange-500 hover:text-white hover:scale-105 transition-all shadow-xl">
                  Kontakt Spesialist <ArrowRight className="w-4 h-4 ml-3" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Tours Grid/List */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {filteredTours.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-[4rem] p-32 text-center border border-gray-50 shadow-sm"
                >
                  <p className="text-2xl font-black text-primary uppercase tracking-tight italic mb-4">Ingen reiser samsvarer med filtrene</p>
                  <button 
                    onClick={() => setFilters({activity: 'Alle', duration: 'Alle'})}
                    className="text-orange-500 font-black uppercase tracking-widest text-[10px] underline hover:text-primary transition-colors"
                  >
                    Nullstill alle filtre
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  layout
                  className={cn(
                    "grid gap-12",
                    view === 'grid' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                  )}
                >
                  {filteredTours.map((tour) => (
                    <motion.div 
                      layout
                      key={tour._id} 
                      className={cn(
                        "bg-white rounded-[4rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 group border border-gray-50 flex",
                        view === 'list' ? "flex-col md:flex-row h-auto md:h-80" : "flex-col"
                      )}
                    >
                      <div className={cn("relative overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-white", view === 'list' ? "w-full md:w-[400px] h-72 md:h-full" : "h-80")}>
                        <img src={tour.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={tour.title} />
                        <div className="absolute top-8 left-8 bg-primary/90 backdrop-blur-md text-white text-[9px] font-black uppercase px-5 py-2 rounded-full tracking-widest italic">
                          {tour.category || 'Eventyr'}
                        </div>
                      </div>
                      
                      <div className="p-12 flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                          <h3 className="text-2xl font-black text-primary uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-orange-500 transition-colors italic">
                            {tour.title}
                          </h3>
                          <p className="text-sm text-gray-400 font-medium line-clamp-2 leading-relaxed">
                            {tour.summary}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-10 border-t border-gray-50 mt-auto">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2 text-[10px] font-black text-gray-300 uppercase tracking-widest italic">
                              <Clock className="w-4 h-4" />
                              <span>{tour.duration}</span>
                            </div>
                            <div className="text-primary font-black text-xl italic">
                              NOK {tour.price?.toLocaleString()}
                            </div>
                          </div>
                          <Link href={`/trips/${tour.slug}`} className="w-14 h-14 bg-gray-50 rounded-2xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm flex items-center justify-center group/btn">
                            <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
