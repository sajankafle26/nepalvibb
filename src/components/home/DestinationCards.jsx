"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function DestinationCards({ content }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch('/api/destinations');
        const data = await res.json();
        setDestinations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  if (loading) return null; 

  return (
    <section className="py-24 sm:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 sm:mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.h5 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-orange-500 font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[9px] sm:text-[10px] mb-4 sm:mb-6"
            >
              {content?.subtitle || 'Oppdag verden med oss'}
            </motion.h5>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-black text-primary uppercase tracking-tighter leading-[0.95] italic"
            >
              {content?.title || 'Velg Din Neste Destinasjon'}
            </motion.h2>
          </div>
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="shrink-0"
          >
            <Link href="/destination/nepal" className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-primary border-b-4 border-orange-500 pb-2 hover:text-orange-500 transition-colors">
              Se alle destinasjoner
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                href={`/destination/${destination.slug}`}
                className="group relative rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden h-[450px] sm:h-[550px] block transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.2)]"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                  style={{ backgroundImage: `url(${destination.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-700" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8 sm:p-12 text-center">
                  <div className="translate-y-6 sm:translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                    <span className="text-orange-400 font-black uppercase text-[9px] sm:text-[10px] tracking-[0.3em] mb-3 sm:mb-4 block opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      Nepalvibb Reise
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-700">
                      {destination.name}
                    </h3>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-md w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-10 group-hover:translate-y-0 shadow-2xl">
                    <ArrowUpRight className="text-white w-5 h-5 sm:w-6 sm:h-6" />
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
