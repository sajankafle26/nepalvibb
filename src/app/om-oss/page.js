"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Users, Globe, Award, Heart, 
  Sparkles, ChevronRight, Compass, Facebook, 
  Instagram, Linkedin, Twitter 
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

export default function AboutPage() {
  const [content, setContent] = useState(null);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutRes, teamRes] = await Promise.all([
          fetch('/api/about-content'),
          fetch('/api/team-members')
        ]);
        const aboutData = await aboutRes.json();
        const teamData = await teamRes.json();
        setContent(aboutData);
        setTeam(teamData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const values = content?.values?.map(v => ({
    ...v,
    icon: v.icon === 'Compass' ? Compass : v.icon === 'Globe' ? Globe : Sparkles,
    color: v.icon === 'Compass' ? 'text-orange-500' : v.icon === 'Globe' ? 'text-emerald-500' : 'text-blue-500',
    bg: v.icon === 'Compass' ? 'bg-orange-50' : v.icon === 'Globe' ? 'bg-emerald-50' : 'bg-blue-50'
  })) || [];

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      
      {/* Cinematic Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={content?.hero?.image} 
            className="w-full h-full object-cover" 
            alt="Hero background"
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
            <h5 className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px] drop-shadow-lg">
              {content?.hero?.subtitle}
            </h5>
            <h1 className="text-6xl md:text-[8rem] font-black text-white uppercase tracking-tighter leading-[0.8] italic drop-shadow-2xl">
              {content?.hero?.title?.split(' ').map((word, i) => (
                <span key={i} className={i === 1 ? "text-orange-500" : ""}>
                  {word}{' '}
                  {i === 0 && <br />}
                </span>
              ))}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <h2 className="text-5xl md:text-7xl font-black text-primary uppercase tracking-tighter leading-none italic">
              {content?.mission?.title}
            </h2>
            <div className="space-y-6 text-xl text-gray-500 font-medium leading-relaxed italic border-l-4 border-orange-500 pl-8">
              <p>{content?.mission?.description}</p>
            </div>
            <div className="flex items-center space-x-12 pt-6">
              {content?.mission?.stats?.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-4xl font-black text-primary italic">{stat.number}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="relative h-[600px] rounded-[4rem] overflow-hidden shadow-2xl">
              <img 
                src={content?.mission?.image} 
                className="w-full h-full object-cover" 
                alt="Mission"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[3rem] shadow-2xl space-y-4 max-w-xs border border-gray-100">
              <Heart className="w-10 h-10 text-red-500 fill-current" />
              <p className="text-sm font-bold text-primary leading-relaxed italic">
                {content?.mission?.quote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {team.length > 0 && (
        <section className="py-32 overflow-hidden bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24 space-y-4">
              <h5 className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px]">Menneskene bak</h5>
              <h2 className="text-5xl md:text-7xl font-black text-primary uppercase tracking-tighter leading-none italic">Vårt Ekspertteam</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {team.map((member, i) => (
                <motion.div 
                  key={member._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-xl mb-8">
                    <img src={member.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt={member.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                      <div className="flex space-x-4">
                        {member.socialLinks?.facebook && <a href={member.socialLinks.facebook} className="text-white hover:text-orange-500"><Facebook className="w-5 h-5" /></a>}
                        {member.socialLinks?.instagram && <a href={member.socialLinks.instagram} className="text-white hover:text-orange-500"><Instagram className="w-5 h-5" /></a>}
                        {member.socialLinks?.linkedin && <a href={member.socialLinks.linkedin} className="text-white hover:text-orange-500"><Linkedin className="w-5 h-5" /></a>}
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-black text-primary uppercase tracking-tight italic mb-1">{member.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">{member.role}</p>
                    {member.bio && <p className="text-[11px] text-gray-400 mt-4 line-clamp-2 px-4 leading-relaxed font-medium italic">"{member.bio}"</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 space-y-6">
            <h2 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tighter italic">{content?.valuesTitle}</h2>
            <p className="text-gray-400 font-medium max-w-xl mx-auto">{content?.valuesSubtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-10 rounded-[3.5rem] border border-gray-100 hover:border-primary/10 hover:shadow-2xl transition-all group">
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
