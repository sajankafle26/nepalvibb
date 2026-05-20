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
    <div className="min-h-screen bg-stone-50/30">

      {/* Dynamic Hero Section */}
      <div className="relative h-[60vh] md:h-[75vh] min-h-[500px] flex items-center justify-center overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-stone-50/30 via-transparent to-transparent"></div>
        </motion.div>

        <div className="relative z-10 text-center px-6 pt-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-orange-400 font-bold uppercase tracking-wider text-xs mb-4"
          >
            Opplev hjertet av Himalaya
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-8xl lg:text-[10rem] font-bold font-display text-white tracking-tight leading-[1] drop-shadow-2xl"
          >
            {destination.name}
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-20 relative z-20">

        {/* Description Section */}
        <div className="bg-white rounded-3xl shadow-sm p-8 sm:p-12 lg:p-16 border border-gray-100 mb-16">
          <div className="">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display text-primary tracking-tight mb-8">
              Om <span className="text-orange-500">{destination.name}</span>
            </h2>
            <div className="space-y-6 text-gray-600 font-light leading-relaxed text-lg border-l-2 border-orange-500 pl-6">
              <p>{destination.description || 'Oppdag de skjulte perlene i denne praktfulle regionen. Fra eldgamle tradisjoner til pustebestående landskap, hvert hjørne forteller en historie om undring og styrke.'}</p>
            </div>
          </div>
        </div>

        {/* Filters Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 px-2">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-primary tracking-tight">Tilgjengelige opplevelser</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">{filteredTours.length} Opplevelser funnet i {destination.name}</p>
          </div>

          <div className="flex items-center space-x-2 bg-gray-100/60 p-1.5 rounded-xl border border-gray-100 shadow-sm">
            <button
              onClick={() => setView('grid')}
              className={cn("p-2.5 rounded-lg transition-all", view === 'grid' ? "bg-primary text-white shadow-sm" : "text-gray-400 hover:bg-white")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={cn("p-2.5 rounded-lg transition-all", view === 'list' ? "bg-primary text-white shadow-sm" : "text-gray-400 hover:bg-white")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-10 items-start pb-24">

          {/* Sidebar Filters */}
          <aside className="w-full lg:w-[320px] sticky top-32 space-y-8 hidden lg:block">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-2.5 bg-emerald-50 rounded-xl text-primary">
                  <FilterIcon className="w-5 h-5" />
                </div>
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-primary">Filtrer resultater</span>
              </div>

              {/* Activity Filter */}
              <div className="space-y-4 mb-10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Aktivitetstype</p>
                <div className="space-y-2">
                  {activities.map(act => (
                    <button
                      key={act}
                      onClick={() => setFilters({ ...filters, activity: act })}
                      className={cn(
                        "w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                        filters.activity === act ? "bg-primary text-white shadow-sm" : "text-gray-400 hover:bg-gray-50 border border-transparent"
                      )}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Filter */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Varighet</p>
                <div className="space-y-2">
                  {[
                    { label: 'Alle Varigheter', value: 'Alle' },
                    { label: '1-5 Dager', value: 'Kort' },
                    { label: '6-12 Dager', value: 'Middels' },
                    { label: '13+ Dager', value: 'Lang' }
                  ].map(dur => (
                    <button
                      key={dur.value}
                      onClick={() => setFilters({ ...filters, duration: dur.value })}
                      className={cn(
                        "w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                        filters.duration === dur.value ? "bg-orange-500 text-white shadow-sm" : "text-gray-400 hover:bg-gray-50 border border-transparent"
                      )}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-primary rounded-3xl p-8 text-white overflow-hidden relative group shadow-md">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10 space-y-6">
                <h4 className="text-xl font-bold font-display text-white tracking-tight">Trenger du hjelp?</h4>
                <p className="text-emerald-100/80 text-xs font-light leading-relaxed">Våre lokale spesialister kan hjelpe deg med å skreddersy den perfekte reisen til {destination.name}.</p>
                <Link href="/plan-your-trip" className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-white text-primary px-6 py-3 rounded-full hover:bg-orange-500 hover:text-white hover:scale-105 transition-all shadow-sm">
                  Kontakt Spesialist <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Tours Grid/List */}
          <div className="flex-1 w-full">
            <AnimatePresence mode="wait">
              {filteredTours.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm"
                >
                  <p className="text-lg font-bold font-display text-primary tracking-tight mb-4">Ingen reiser samsvarer med filtrene</p>
                  <button
                    onClick={() => setFilters({ activity: 'Alle', duration: 'Alle' })}
                    className="text-orange-500 font-bold uppercase tracking-wider text-[10px] underline hover:text-primary transition-colors"
                  >
                    Nullstill alle filtre
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className={cn(
                    "grid gap-6",
                    view === 'grid' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                  )}
                >
                  {filteredTours.map((tour) => (
                    <motion.div
                      layout
                      key={tour._id}
                      className={cn(
                        "bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 group border border-gray-100 flex",
                        view === 'list' ? "flex-col md:flex-row h-auto md:h-72" : "flex-col"
                      )}
                    >
                      <div className={cn("relative overflow-hidden border-b border-gray-50 md:border-b-0 md:border-r border-gray-50", view === 'list' ? "w-full md:w-[280px] h-52 md:h-full" : "h-64")}>
                        <img src={tour.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={tour.title} />
                        <div className="absolute top-4 left-4 bg-primary/95 text-white text-[9px] font-bold uppercase px-3 py-1.5 rounded-full tracking-wider shadow-md backdrop-blur-sm">
                          {tour.category || 'Eventyr'}
                        </div>
                      </div>

                      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          <h3 className="text-lg sm:text-xl font-bold font-display text-primary mb-3 line-clamp-2 leading-snug group-hover:text-orange-500 transition-colors">
                            {tour.title}
                          </h3>
                          <p className="text-sm text-gray-500 font-light line-clamp-2 leading-relaxed">
                            {tour.summary}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-6">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                              <Clock className="w-4 h-4 text-gray-300" />
                              <span>{tour.duration}</span>
                            </div>
                            <div className="text-primary font-bold text-lg">
                              NOK {tour.price?.toLocaleString()}
                            </div>
                          </div>
                          <Link href={`/trips/${tour.slug}`} className="w-10 h-10 bg-gray-50 rounded-xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm flex items-center justify-center group/btn">
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
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
