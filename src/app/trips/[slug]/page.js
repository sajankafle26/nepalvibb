"use client";

import { useState, useEffect, use } from 'react';
import { 
  Clock, Globe, User, Star, Check, CheckCircle,
  MapPin, MessageCircle, ArrowRight, Shield,
  Share2, Heart, Printer, ChevronRight,
  Info, Compass, Home, Tag, Calendar,
  Mountain, Wind, Zap, ShieldCheck, XCircle,
  Camera, Utensils, Bed, CreditCard, Briefcase
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ReviewSection from '@/components/trips/ReviewSection';

export default function TripDetailPage({ params }) {
  const { slug } = use(params);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('oversikt');

  const tabs = [
    { id: 'oversikt', label: 'Oversikt' },
    { id: 'turdetaljer', label: 'Turdetaljer' },
    { id: 'reiserute', label: 'Reiserute' },
    { id: 'tjenester', label: 'Inkludert/Ekskludert' },
    { id: 'galleri', label: 'Galleri' },
    { id: 'info', label: 'Viktig Info' },
    { id: 'omtaler', label: 'Omtaler' },
  ];

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await fetch(`/api/trips/${slug}`);
        if (!res.ok) throw new Error('Trip not found');
        const data = await res.json();
        setTrip(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [slug]);

  useEffect(() => {
    if (loading || !trip) return;

    const observerOptions = {
      root: null,
      rootMargin: '-150px 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    tabs.forEach((tab) => {
      const element = document.getElementById(tab.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [loading, trip]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 150;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Navbar />
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!trip) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center pt-60 space-y-6">
        <Zap className="w-12 h-12 text-red-500" />
        <h1 className="text-4xl font-black text-primary uppercase tracking-tighter italic">Reise Ikke Funnet</h1>
        <Link href="/" className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">Tilbake til Hjem</Link>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-white">
      
      {/* Cinematic Hero */}
      <section className="relative h-[70svh] sm:h-[85vh] min-h-[500px] sm:min-h-[600px] overflow-hidden">
        <img src={trip.image} className="w-full h-full object-cover" alt={trip.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 pb-24 w-full">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-8">
              <span className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                {trip.category}
              </span>
              <h1 className="text-5xl md:text-[6.5rem] font-black text-white uppercase tracking-tighter leading-[0.8] italic drop-shadow-2xl">
                {trip.title}
              </h1>
              <div className="flex flex-wrap gap-10 text-white/90 text-[11px] font-black uppercase tracking-[0.2em]">
                <span className="flex items-center"><Clock className="w-4 h-4 mr-3 text-orange-500" /> {trip.duration}</span>
                <span className="flex items-center"><Mountain className="w-4 h-4 mr-3 text-orange-500" /> {trip.difficulty}</span>
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-3 text-orange-500" /> {trip.destination}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scrollspy Navigation */}
      <div className="sticky top-[80px] z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-6">
          <div className="flex space-x-12 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => scrollToSection(tab.id)}
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.25em] transition-all relative pb-2 whitespace-nowrap",
                  activeSection === tab.id ? "text-primary" : "text-gray-400 hover:text-primary"
                )}
              >
                {tab.label}
                {activeSection === tab.id && <motion.div layoutId="activeSection" className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-full" />}
              </button>
            ))}
          </div>
          <Link href="/plan-your-trip" className="hidden md:block bg-primary text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-orange-500 transition-all">Bestill Reisen</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row gap-20">
        <div className="lg:w-2/3 space-y-24">
          
          {/* Oversikt Section */}
          <section id="oversikt" className="scroll-mt-40 space-y-16">
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-primary uppercase tracking-tighter italic">Om Reisen</h2>
              <div className="prose prose-xl prose-primary max-w-none text-gray-500 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: trip.overview || trip.summary }} />
            </div>

            {trip.highlights?.length > 0 && (
              <div className="space-y-10 bg-gray-50 p-12 rounded-[3.5rem] border border-gray-100">
                <h3 className="text-2xl font-black text-primary uppercase tracking-tight italic flex items-center">
                  <Star className="w-6 h-6 mr-4 text-orange-500 fill-current" /> Høydepunkter
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {trip.highlights.map((h, i) => (
                    <div key={i} className="flex items-start space-x-4 group">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                        <Check className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-bold text-gray-600 leading-tight">{h}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Turdetaljer Section */}
          {trip.tripDetails?.length > 0 && (
            <section id="turdetaljer" className="scroll-mt-40 space-y-12">
              <h2 className="text-4xl font-black text-primary uppercase tracking-tighter italic">Turdetaljer</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {trip.tripDetails.map((detail, i) => {
                  const Icon = ({
                    Clock: Clock,
                    Globe: Globe,
                    User: User,
                    MapPin: MapPin,
                    Mountain: Mountain,
                    Users: Users,
                    Zap: Zap,
                    Shield: Shield,
                    Compass: Compass,
                    Home: Home,
                    Calendar: Calendar,
                  }[detail.icon] || Info);
                  
                  return (
                    <div key={i} className="p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-4 hover:bg-white hover:shadow-xl transition-all group">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                        <Icon className="w-6 h-6 text-orange-500 group-hover:text-white" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{detail.label}</h4>
                        <p className="text-sm font-bold text-primary">{detail.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Reiserute Section */}
          <section id="reiserute" className="scroll-mt-40 space-y-12">
            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter italic">Detaljert Reiserute</h2>
            <div className="space-y-10 relative">
              <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-gray-100 hidden md:block" />
              {(trip.itinerary || []).map((item, idx) => (
                <div key={idx} className="relative md:pl-24 group">
                  <div className="absolute left-0 top-0 w-12 h-12 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center font-black text-primary text-sm shadow-sm group-hover:bg-primary group-hover:text-white transition-all hidden md:flex z-10">{item.day}</div>
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 hover:shadow-2xl transition-all">
                    <h3 className="text-xl font-black text-primary uppercase mb-4">{item.title}</h3>
                    <div className="prose prose-sm max-w-none text-gray-500 font-medium" dangerouslySetInnerHTML={{ __html: item.details }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tjenester Section */}
          <section id="tjenester" className="scroll-mt-40 space-y-12">
            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter italic">Inkludert & Ekskludert</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-emerald-50/50 p-12 rounded-[3.5rem] border border-emerald-100 space-y-8">
                <h3 className="text-xl font-black text-emerald-600 uppercase tracking-tight flex items-center"><CheckCircle className="w-5 h-5 mr-3" /> Pris Inkluderer</h3>
                <ul className="space-y-4">
                  {trip.priceIncludes?.map((item, i) => (
                    <li key={i} className="flex items-start space-x-3 text-sm font-bold text-emerald-800/70">
                      <Check className="w-4 h-4 mt-1 flex-shrink-0" /> <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50/50 p-12 rounded-[3.5rem] border border-red-100 space-y-8">
                <h3 className="text-xl font-black text-red-600 uppercase tracking-tight flex items-center"><XCircle className="w-5 h-5 mr-3" /> Pris Ekskluderer</h3>
                <ul className="space-y-4">
                  {trip.priceExcludes?.map((item, i) => (
                    <li key={i} className="flex items-start space-x-3 text-sm font-bold text-red-800/70">
                      <XCircle className="w-4 h-4 mt-1 flex-shrink-0" /> <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Galleri Section */}
          <section id="galleri" className="scroll-mt-40 space-y-12">
            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter italic">Bildegalleri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {trip.gallery?.map((img, i) => (
                <div key={i} className="h-80 rounded-[2.5rem] overflow-hidden shadow-xl">
                  <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt="" />
                </div>
              ))}
            </div>
          </section>

          {/* Info Section */}
          <section id="info" className="scroll-mt-40 space-y-12">
            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter italic">Viktig Informasjon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: 'Beste Reisetid', value: trip.usefulInfo?.bestTime, icon: Calendar },
                { label: 'Overnatting', value: trip.usefulInfo?.accommodation, icon: Bed },
                { label: 'Måltider', value: trip.usefulInfo?.meals, icon: Utensils },
                { label: 'Visum & Forsikring', value: trip.usefulInfo?.visaInfo, icon: CreditCard },
                { label: 'Pakkeliste', value: trip.usefulInfo?.packingList, icon: Briefcase },
              ].map((item, i) => item.value && (
                <div key={i} className="p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <item.icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</h4>
                  <p className="text-sm font-bold text-primary leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Omtaler Section */}
          <ReviewSection tripId={trip._id} />
        </div>

        {/* Sidebar */}
        <aside className="lg:w-1/3">
          <div className="sticky top-40 space-y-10">
            <div className="bg-white border-2 border-gray-100 rounded-[3.5rem] p-12 shadow-2xl shadow-primary/5 text-center space-y-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-4">Fra kun</p>
                <p className="text-6xl font-black text-primary tracking-tighter">NOK {trip.price?.toLocaleString()}</p>
              </div>
              <div className="space-y-4">
                <Link href="/plan-your-trip" className="block bg-emerald-500 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all">Bestill nå</Link>
                <Link href="/plan-your-trip" className="block border-2 border-gray-100 py-6 rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:border-primary transition-all">Snakk med ekspert</Link>
              </div>
              <div className="pt-8 border-t border-gray-50 space-y-4">
                <div className="flex items-center justify-center space-x-3 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-orange-500" /> <span>Sikker Betaling</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  <Globe className="w-4 h-4 text-orange-500" /> <span>Lokale Eksperter</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

    </div>
  );
}
