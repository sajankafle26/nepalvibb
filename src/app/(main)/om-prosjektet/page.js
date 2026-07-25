"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, Shield, Users, Target } from 'lucide-react';

export default function OmProsjektetPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/home-content')
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-primary/10 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  const p = content?.purpose || {};
  const stats = (() => { try { return JSON.parse(p.stats || '[]'); } catch { return []; } })();
  const images = (() => { try { return JSON.parse(p.images || '[]'); } catch { return []; } })();

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={p.image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80'}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 pb-14 w-full">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
              <span className="text-orange-300 font-bold uppercase tracking-widest text-[10px]">{p.subtitle || 'Vårt samfunnsansvar'}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-display text-white tracking-tight leading-tight max-w-4xl">
              {p.title || 'En Reise med Formål'}
            </h1>
          </div>
        </div>
      </section>

      {/* Description + Mission */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h5 className="text-orange-500 font-bold uppercase tracking-wider text-xs">Om Prosjektet</h5>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-primary tracking-tight leading-tight">
                  {p.title?.split(':')[0] || 'En Reise med Formål'}
                </h2>
              </div>
              <div
                className="text-gray-600 font-light text-lg leading-relaxed space-y-4 [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: p.longDescription || '' }}
              />
              <div className="bg-primary/5 border-l-4 border-orange-500 rounded-r-2xl p-6">
                <div className="flex items-start gap-4">
                  <Target className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-primary font-bold text-sm mb-1">Vår Misjon</p>
                    <p className="text-gray-600 font-light leading-relaxed text-sm">
                      {p.mission || 'Vår misjon er å skape en bærekraftig fremtid for Nepals gatehunder.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/10 to-emerald-500/10 rounded-[2.5rem] blur-xl"></div>
              <div className="relative grid grid-cols-2 gap-4">
                {images.slice(0, 4).map((img, i) => (
                  <div key={i} className={`rounded-2xl overflow-hidden shadow-md ${i === 0 ? 'row-span-2' : ''}`}>
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover aspect-[4/5]"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="py-16 bg-primary">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center space-y-2">
                  <p className="text-4xl sm:text-5xl font-black font-display text-orange-400">{stat.number}</p>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-20 sm:py-28 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h5 className="text-orange-500 font-bold uppercase tracking-wider text-xs mb-3">Slik Fungerer Det</h5>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-primary tracking-tight mb-16">
            Ditt Eventyr Gjør En Forskjell
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: 'Du booker en reise', desc: 'Velg din drømmereise til Nepal hos oss.' },
              { icon: Shield, title: 'Vi donerer', desc: 'En del av reisens pris går direkte til Actual Adventure Foundation.' },
              { icon: Users, title: 'Sammen skaper vi endring', desc: 'Ditt valg gir gatehunder i Nepal et bedre liv.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="text-lg font-bold font-display text-primary mb-3">{item.title}</h3>
                <p className="text-gray-500 font-light text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-primary tracking-tight leading-tight">
            Klar for å gjøre en forskjell?
          </h2>
          <p className="text-gray-500 font-light text-lg max-w-2xl mx-auto">
            Book din neste reise til Nepal og bidra til en bedre fremtid for gatehundene.
          </p>
          <Link
            href="/plan-your-trip"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 text-xs font-black uppercase tracking-widest rounded-full shadow-[0_15px_35px_rgba(249,115,22,0.4)] hover:shadow-[0_20px_50px_rgba(249,115,22,0.5)] hover:scale-105 transition-all"
          >
            Planlegg Reisen <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
