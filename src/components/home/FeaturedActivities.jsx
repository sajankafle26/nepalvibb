"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Mountain, Wind, Zap, Compass } from 'lucide-react';

export default function FeaturedActivities({ content }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/activities');
        const data = await res.json();
        const featured = Array.isArray(data) ? data.filter(a => a.isFeatured) : [];
        setActivities(featured);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading || activities.length === 0) return null;

  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl space-y-4">
            <h5 className="text-orange-500 font-black uppercase tracking-[0.3em] text-[10px]">
              {content?.subtitle || 'Ting å gjøre i Nepal'}
            </h5>
            <h2 className="text-5xl md:text-7xl font-black text-primary uppercase tracking-tighter leading-[0.8] italic">
              {content?.title || 'Eventyrlige Opplevelser'}
            </h2>
          </div>
          <Link href="/activity/all" className="bg-primary/5 hover:bg-primary hover:text-white text-primary px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
            Se alle aktiviteter
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {activities.map((activity, index) => (
            <motion.div
              key={activity._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <Link href={`/activity/${activity.slug}`}>
                <div className="h-[280px] sm:h-[500px] rounded-[2rem] sm:rounded-[3rem] overflow-hidden relative border-2 border-transparent group-hover:border-orange-500/20 transition-all shadow-2xl">
                  <img 
                    src={activity.image} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    alt={activity.name} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent" />
                  
                  <div className="absolute inset-0 p-4 sm:p-10 flex flex-col justify-end text-white">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-6 group-hover:scale-110 group-hover:bg-orange-500 transition-all">
                      <Compass className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-sm sm:text-3xl font-black uppercase tracking-tight mb-1 sm:mb-4 leading-none">
                      {activity.name}
                    </h3>
                    <p className="hidden sm:block text-sm text-white/60 font-medium line-clamp-2 mb-8 group-hover:text-white/100 transition-colors">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-2 sm:space-x-3 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-orange-500">
                      <span>Utforsk</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
