"use client";

import { motion } from 'framer-motion';
import { ShieldCheck, Users, Globe, Award, Heart, Sparkles, ChevronRight, Compass } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

export default function AboutPage() {
  const values = [
    { title: 'Lokal Ekspertise', desc: 'Våre guider er født og oppvokst i Himalaya, og kjenner hver sti og tradisjon.', icon: Compass, color: 'text-orange-500', bg: 'bg-orange-50' },
    { title: 'Bærekraft', desc: 'Vi forplikter oss til å bevare naturen og støtte lokalsamfunnene vi besøker.', icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Sikkerhet Først', desc: 'Din trygghet er vår høyeste prioritet, med sertifiserte guider og moderne utstyr.', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Skreddersydd', desc: 'Vi skaper reiser som passer dine drømmer, fysiske form og budsjett.', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Cinematic Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover" 
            alt="Himalayan mountains"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h5 className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px] drop-shadow-lg">Vår Historie</h5>
            <h1 className="text-6xl md:text-[8rem] font-black text-white uppercase tracking-tighter leading-[0.8] italic drop-shadow-2xl">
              Oppdag<br /><span className="text-orange-500">Nepalvibb</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <h2 className="text-5xl md:text-7xl font-black text-primary uppercase tracking-tighter leading-none italic">
              Vi skaper<br />minner for livet
            </h2>
            <div className="space-y-6 text-xl text-gray-500 font-medium leading-relaxed italic border-l-4 border-orange-500 pl-8">
              <p>
                Nepalvibb ble grunnlagt med en lidenskap for å dele skjønnheten og mystikken i Himalaya med resten av verden. 
              </p>
              <p>
                Med over 15 års erfaring i bransjen, har vi utviklet et unikt nettverk av lokale spesialister som sikrer at hver reise er autentisk, trygg og uforglemmelig.
              </p>
            </div>
            <div className="flex items-center space-x-12 pt-6">
              <div className="text-center">
                <p className="text-4xl font-black text-primary italic">15+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Års Erfaring</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-primary italic">5k+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Fornøyde Gjest</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-primary italic">100%</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Lokal Guiding</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative h-[600px] rounded-[4rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2071&auto=format&fit=crop" 
                className="w-full h-full object-cover" 
                alt="Sherpa in Nepal"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[3rem] shadow-2xl space-y-4 max-w-xs border border-gray-100">
              <Heart className="w-10 h-10 text-red-500 fill-current" />
              <p className="text-sm font-bold text-primary leading-relaxed">
                "Vi reiser ikke bare for å se nye steder, men for å se verden med nye øyne."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 space-y-6">
            <h2 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tighter italic">Våre Kjerneverdier</h2>
            <p className="text-gray-400 font-medium max-w-xl mx-auto">Grunnpilarene i alt vi gjør, fra planlegging til gjennomføring.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-10 rounded-[3.5rem] border border-white hover:border-primary/10 hover:shadow-2xl transition-all group">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform", v.bg)}>
                  <v.icon className={cn("w-8 h-8", v.color)} />
                </div>
                <h3 className="text-xl font-black text-primary uppercase tracking-tight mb-4">{v.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-32 max-w-7xl mx-auto px-6 text-center">
        <div className="bg-primary rounded-[5rem] p-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1551882547-ff43c63faf76?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="" />
          </div>
          <div className="relative z-10 space-y-10">
            <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-none">
              Klar for ditt<br />neste eventyr?
            </h2>
            <div className="flex justify-center items-center space-x-6">
              <Link href="/plan-your-trip" className="bg-orange-500 text-white px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:bg-orange-600 hover:scale-105 transition-all">
                Planlegg Reisen
              </Link>
              <Link href="/kontakt-oss" className="text-white text-[11px] font-black uppercase tracking-widest hover:text-orange-500 transition-colors">
                Kontakt Oss →
              </Link>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
