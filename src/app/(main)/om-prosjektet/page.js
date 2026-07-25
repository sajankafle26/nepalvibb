"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, Shield, Users, Target, PawPrint, Globe, TreePine, HandHeart, Sparkles } from 'lucide-react';

export default function OmProsjektetPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/home-content')
      .then(res => res.json())
      .then(data => { setContent(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center pt-24">
      <div className="w-12 h-12 border-4 border-primary/10 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );

  const p = content?.purpose || {};
  const stats = (() => { try { return JSON.parse(p.stats || '[]'); } catch { return []; } })();
  const images = (() => { try { return JSON.parse(p.images || '[]'); } catch { return []; } })();

  return (
    <div className="min-h-screen bg-[#FAFAF9] pt-24">
      {/* ===== HERO ===== */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={p.image || ''} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF9] via-transparent to-transparent" />
        </div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full pt-16">
            <div className="max-w-2xl space-y-8">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                <span className="text-orange-300 font-bold uppercase tracking-widest text-[10px]">{p.subtitle || 'Vårt samfunnsansvar'}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-white tracking-tight leading-[1.1]">
                {p.title || 'En Reise med Formål'}
              </h1>
              <p className="text-white/70 text-base sm:text-lg font-light leading-relaxed max-w-xl">
                {p.description || ''}
              </p>
              <div className="flex gap-4 pt-4">
                <Link href="/plan-your-trip" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 text-xs font-black uppercase tracking-widest rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  Bli med <Heart className="w-3.5 h-3.5" />
                </Link>
                <Link href="#impact" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-xs font-bold uppercase tracking-wider border border-white/20 hover:border-white/40 px-7 py-3.5 rounded-full transition-all">
                  Se resultater
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MISSION STRIP ===== */}
      <section className="relative -mt-20 z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary via-primary to-emerald-800 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border border-white/10">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <div className="flex-shrink-0 w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8 text-orange-400" />
              </div>
              <div className="flex-1 text-center lg:text-left">
                <p className="text-orange-300 text-[10px] font-black uppercase tracking-widest mb-2">Vår Misjon</p>
                <p className="text-white/90 text-lg sm:text-xl font-light leading-relaxed">
                  {p.mission || 'Vår misjon er å skape en bærekraftig fremtid for Nepals gatehunder.'}
                </p>
              </div>
              <Link href="/plan-your-trip" className="flex-shrink-0 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 text-xs font-black uppercase tracking-widest rounded-full border border-white/10 transition-all whitespace-nowrap">
                Støtt saken <HandHeart className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== OUR STORY ===== */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <h5 className="text-orange-500 font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                  <span className="w-6 h-px bg-orange-500" /> Historien Vår
                </h5>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-primary tracking-tight leading-tight">
                  Hvordan Det Hele Startet
                </h2>
              </div>
              <div
                className="text-gray-600 font-light text-[15px] leading-[1.7] space-y-4 [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: p.longDescription || '' }}
              />
              <div className="flex flex-wrap gap-6 pt-4">
                {[
                  { icon: PawPrint, label: 'Gatehunder reddet' },
                  { icon: Globe, label: 'Lokalsamfunn' },
                  { icon: TreePine, label: 'Bærekraft' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 border border-gray-100 shadow-sm">
                    <item.icon className="w-4 h-4 text-orange-500" />
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="absolute -inset-6 bg-gradient-to-r from-orange-500/10 via-emerald-500/10 to-transparent rounded-[3rem] blur-2xl" />
              <div className="relative grid grid-cols-2 gap-4 sm:gap-6">
                {images.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-white/60 ${
                      i === 0 ? 'row-span-2' : ''
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover aspect-[3/4] sm:aspect-[4/5]"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-6 py-4 shadow-xl border border-gray-100 hidden sm:block">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Siden 2015</p>
                <p className="text-orange-500 font-bold text-sm">10+ år med innvirkning</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== IMPACT STATS ===== */}
      {stats.length > 0 && (
        <section id="impact" className="relative py-16 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-emerald-900" />
          <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/3" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h5 className="text-orange-400 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Vår Påvirkning
              </h5>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-white tracking-tight leading-tight">
                Sammen Gjør Vi En Forskjell
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
              {stats.map((stat, i) => (
                <div key={i} className="relative text-center group">
                  <div className="absolute inset-0 bg-white/5 rounded-[2rem] blur-sm group-hover:blur-md transition-all" />
                  <div className="relative p-8 sm:p-10 rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-sm">
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-br from-orange-300 to-orange-500 mb-2">
                      {stat.number}
                    </p>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-wider leading-relaxed">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h5 className="text-orange-500 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 mb-3">
              <span className="w-6 h-px bg-orange-500" /> Slik Fungerer Det <span className="w-6 h-px bg-orange-500" />
            </h5>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-primary tracking-tight leading-tight">
              Ditt Eventyr Gir Håp
            </h2>
            <p className="text-gray-500 font-light text-base mt-3 leading-relaxed">
              Hver reise du bestiller hos oss støtter direkte vårt arbeid for gatehunder i Nepal.
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-24 left-1/2 -translate-x-1/2 w-px h-[60%] bg-gradient-to-b from-orange-500/30 via-orange-500/10 to-transparent hidden md:block" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {[
                { step: '01', icon: Heart, title: 'Book Din Reise', desc: 'Velg din drømmereise til Nepal. Hver bestilling teller.', color: 'from-orange-500 to-amber-500', bg: 'bg-orange-50' },
                { step: '02', icon: Shield, title: 'Vi Donerer', desc: 'En del av reisens pris går direkte til Actual Adventure Foundation.', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50' },
                { step: '03', icon: Users, title: 'Sammen Skapes Endring', desc: 'Ditt valg gir gatehunder et bedre liv – og deg en uforglemmelig opplevelse.', color: 'from-primary to-emerald-700', bg: 'bg-primary/5' },
              ].map((item, i) => (
                <div key={i} className="relative group">
                  <div className={`${item.bg} rounded-[2.5rem] p-8 sm:p-10 border border-transparent group-hover:border-gray-100 transition-all group-hover:shadow-xl group-hover:-translate-y-1 duration-500`}>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-8 shadow-lg`}>
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 block">{item.step}</span>
                    <h3 className="text-lg font-bold font-display text-primary mb-3 leading-tight">{item.title}</h3>
                    <p className="text-gray-500 font-light text-[13px] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      {images.length > 1 && (
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h5 className="text-orange-500 font-bold uppercase tracking-wider text-xs mb-2">Bildegalleri</h5>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-primary tracking-tight leading-tight">
                Prosjektet I Bilder
              </h2>
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
              {images.map((img, i) => (
                <div key={i} className="break-inside-avoid">
                  <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                    <img
                      src={img}
                      alt=""
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-emerald-900" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAF9] to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-orange-300 font-bold uppercase tracking-widest text-[10px]">Bli Med</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white tracking-tight leading-tight mb-5">
            Klar for å gjøre en <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300">forskjell</span>?
          </h2>

          <p className="text-white/60 text-base font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Book din neste reise til Nepal. Opplev Himalaya, kulturen og naturen – og gi samtidig noe tilbake til lokalsamfunnene.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/plan-your-trip"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Planlegg Reisen <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/turer"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-wider border border-white/20 hover:border-white/40 px-8 py-4 rounded-full transition-all"
            >
              Utforsk våre turer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
