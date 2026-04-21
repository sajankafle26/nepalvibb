"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HeroBanner() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setBanners(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching banners:', err);
        setLoading(false);
      });
  }, []);

  // Auto-slide
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (loading) return (
    <div className="h-screen min-h-[600px] sm:min-h-[750px] bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-white/20 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );

  // Fallback if no banners found
  const activeBanners = banners.length > 0 ? banners : [{
    title: "Unik",
    highlightText: "Kulturelle",
    subtitle: "Opplevelse",
    badgeText: "Oppdag de mest engasjerte stedene",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80",
    buttonText: "TA EN TUR",
    buttonLink: "/trips"
  }];

  const currentBanner = activeBanners[current];

  return (
    <div className="relative h-[100svh] sm:h-[95vh] min-h-[600px] sm:min-h-[750px] flex items-center justify-center overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div 
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          {/* Zooming Background Image */}
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${currentBanner.image}")`,
              backgroundAttachment: 'fixed'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
          </motion.div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 max-w-6xl mx-auto pt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <span className="inline-block text-white text-[10px] sm:text-[14px] font-black uppercase tracking-[0.4em] mb-6 sm:mb-8 py-2 px-6 border border-white/20 rounded-full backdrop-blur-md bg-white/5">
                {currentBanner.badgeText || "Explore Nepal"}
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-[2.75rem] leading-[0.9] xs:text-5xl sm:text-7xl md:text-8xl font-black text-white mb-10 sm:mb-12 drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] uppercase tracking-tighter italic"
            >
              {currentBanner.title} <br /> 
              {currentBanner.highlightText && (
                <>
                  <span className="text-transparent stroke-text-white">{currentBanner.highlightText}</span> <br />
                </>
              )}
              {currentBanner.subtitle}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 w-full sm:w-auto"
            >
              <Link 
                href={currentBanner.buttonLink || "/trips"} 
                className="group relative w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-10 sm:px-14 py-5 sm:py-6 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] transition-all rounded-2xl sm:rounded-full shadow-[0_20px_40px_rgba(249,115,22,0.4)] overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {currentBanner.buttonText || "DISCOVER"} <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
              
              {currentBanner.videoLink && (
                <button className="flex items-center text-white group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/30 flex items-center justify-center mr-4 group-hover:bg-white group-hover:text-primary transition-all duration-500">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em]">Se video</span>
                </button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {activeBanners.length > 1 && (
        <>
          <div className="absolute bottom-8 right-6 sm:bottom-12 sm:right-12 flex flex-row sm:flex-col gap-3 sm:gap-4 z-20">
            {activeBanners.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrent(i)}
                className={cn(
                  "rounded-full transition-all duration-500",
                  i === current 
                    ? "bg-orange-500 w-8 h-2 sm:w-2 sm:h-8" 
                    : "bg-white/20 hover:bg-white/40 w-2 h-2"
                )} 
              />
            ))}
          </div>

          <div className="absolute bottom-20 sm:bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-8 sm:space-x-12 z-20 scale-90 sm:scale-100">
            <button 
              onClick={() => setCurrent(prev => (prev - 1 + activeBanners.length) % activeBanners.length)}
              className="p-3 border border-white/10 rounded-full text-white hover:bg-white hover:text-black transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrent(prev => (prev + 1) % activeBanners.length)}
              className="p-3 border border-white/10 rounded-full text-white hover:bg-white hover:text-black transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </>
      )}

      {/* Decorations */}
      <div className="absolute bottom-16 left-12 hidden xl:block text-white/50 text-[10px] font-black uppercase tracking-[0.5em] [writing-mode:vertical-lr] rotate-180">
        Scroll for å oppdage
      </div>

      <style jsx>{`
        .stroke-text-white {
          -webkit-text-stroke: 1px rgba(255,255,255,0.8);
          color: transparent;
        }
      `}</style>
    </div>
  );
}
