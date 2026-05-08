"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe, ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

export default function ContactPage() {
  const [content, setContent] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, settingsRes] = await Promise.all([
          fetch('/api/contact-content'),
          fetch('/api/admin/settings')
        ]);
        const contentData = await contentRes.json();
        const settingsData = await settingsRes.json();
        setContent(contentData);
        setSettings(settingsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      
      {/* Cinematic Hero */}
      <section className="relative pt-60 pb-32 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500 via-transparent to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h5 className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px]">
              {content?.hero?.subtitle || 'La oss snakke'}
            </h5>
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.8] italic">
              {content?.hero?.title || 'Kontakt Oss'}
            </h1>
            <p className="text-emerald-100/60 max-w-2xl mx-auto text-lg font-medium">
              {content?.hero?.description || 'Våre reiseeksperter er klare til å hjelpe deg med å planlegge ditt neste eventyr i Himalaya.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-primary uppercase tracking-tighter italic">
                {content?.form?.title || 'Send oss en melding'}
              </h2>
              <p className="text-gray-400 font-medium italic">
                {content?.form?.subtitle || 'Fyll ut skjemaet nedenfor, så kontakter vi deg i løpet av 24 timer.'}
              </p>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Navn</label>
                <input type="text" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-primary transition-all" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">E-post</label>
                <input type="email" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-primary transition-all" />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Melding</label>
                <textarea rows={6} className="w-full bg-gray-50 border-none rounded-3xl px-6 py-5 text-sm font-medium focus:ring-2 focus:ring-primary transition-all resize-none" />
              </div>
              <div className="md:col-span-2">
                <button className="bg-orange-500 text-white px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:bg-orange-600 hover:scale-105 transition-all flex items-center space-x-4">
                  <span>Send Melding</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Info Side */}
          <div className="lg:col-span-5 space-y-10">
            <div className="bg-primary p-12 rounded-[3.5rem] text-white space-y-12 shadow-2xl shadow-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Globe className="w-32 h-32" />
              </div>
              
              <h3 className="text-2xl font-black uppercase tracking-tight italic">Kontaktinformasjon</h3>
              
              <div className="space-y-8 relative z-10">
                <div className="flex space-x-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-orange-500 flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-1">
                      {settings?.visitingAddressLabel || 'Besøksadresse'}
                    </p>
                    <p className="text-base font-bold leading-relaxed">
                      {settings?.address}<br />
                      {settings?.kathmanduAddress && <span className="opacity-60">Nepal: {settings.kathmanduAddress}</span>}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-orange-500 flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-1">
                      {settings?.callUsLabel || 'Ring Oss'}
                    </p>
                    <p className="text-xl font-black">{settings?.contactPhone}</p>
                    <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest">
                      {settings?.callUsHours || 'Tilgjengelig Man-Fre'}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-orange-500 flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-1">
                      {settings?.sendEmailLabel || 'Send E-post'}
                    </p>
                    <p className="text-xl font-black">{settings?.contactEmail}</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                 <div className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-emerald-300">
                    <Clock className="w-4 h-4" />
                    <span>{settings?.replyTimeLabel || 'Svarer innen 24 timer'}</span>
                 </div>
              </div>
            </div>

            {/* Support Box */}
            <a 
              href={`https://wa.me/${settings?.whatsapp || ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-xl transition-all block"
            >
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-primary uppercase tracking-tight">Chat med oss</h4>
                  <p className="text-xs text-gray-400 font-medium">Vi er tilgjengelige på WhatsApp</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
