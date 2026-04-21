"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  Clock, MapPin, Star, Compass, 
  ArrowRight, Mountain, Wind, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ActivityDetailPage({ params }) {
  const { slug } = use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/activities/${slug}`);
        if (!res.ok) throw new Error('Activity not found');
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

  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <h1 className="text-4xl font-black text-primary uppercase tracking-tighter mb-4 italic">Aktivitet ikke funnet</h1>
      <Link href="/" className="bg-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px]">Tilbake til hjem</Link>
    </div>
  );

  const { activity, trips = [] } = data;

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden flex items-center pt-20">
        <img 
          src={activity.image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80'} 
          className="absolute inset-0 w-full h-full object-cover"
          alt={activity.name}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-6 w-full pt-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl space-y-6"
          >
            <h5 className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px]">Opplev mer i Himalaya</h5>
            <h1 className="text-5xl md:text-[7rem] font-black text-white uppercase tracking-tighter leading-[0.8] italic">
              {activity.name}
            </h1>
            <p className="text-xl text-white/70 font-medium leading-relaxed italic border-l-4 border-orange-500 pl-6">
              {activity.description || `Oppdag de mest spektakulære ${activity.name.toLowerCase()} opplevelsene i hjertet av Nepal.`}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trips Grid */}
      <section className="py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tighter italic">Anbefalte Reiser</h2>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic">Håndplukkede {activity.name} opplevelser for deg</p>
            </div>
            <div className="flex items-center space-x-4 bg-white px-8 py-4 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">{trips.length} Reiser funnet</span>
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {trips.length > 0 ? trips.map((trip) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={trip._id} 
                className="bg-white rounded-[4rem] overflow-hidden shadow-2xl border border-gray-50 group transition-all hover:-translate-y-3"
              >
                <div className="h-80 overflow-hidden relative border-b-4 border-white">
                  <img 
                    src={trip.image} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    alt={trip.title}
                  />
                  <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-md text-white text-[9px] font-black uppercase px-5 py-2 rounded-full tracking-[0.2em] italic">
                    {trip.difficulty || 'Normal'}
                  </div>
                </div>
                <div className="p-12 space-y-8">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">{trip.duration}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 italic">{trip.destination}</span>
                  </div>
                  <h3 className="text-2xl font-black text-primary uppercase tracking-tight group-hover:text-orange-500 transition-colors line-clamp-2 leading-tight italic">
                    {trip.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-400 line-clamp-2 leading-relaxed">
                    {trip.summary}
                  </p>
                  <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-primary">
                      <span className="text-[9px] block font-black uppercase tracking-widest text-gray-300 mb-1">Pris Fra</span>
                      <span className="text-2xl font-black italic">NOK {trip.price?.toLocaleString()}</span>
                    </div>
                    <Link href={`/trips/${trip.slug}`} className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                      <ArrowRight className="w-6 h-6" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-32 text-center space-y-8">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-10 h-10 text-gray-300" />
                </div>
                <div className="space-y-4">
                  <p className="text-2xl font-black text-primary uppercase tracking-tight italic">Ingen reiser funnet i denne kategorien</p>
                  <p className="text-gray-400 font-medium italic">Vi jobber med å sette opp nye eventyr for denne aktiviteten.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
