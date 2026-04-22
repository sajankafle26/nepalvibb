"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Facebook, Instagram, Twitter,
  Mail, Phone, MapPin, ExternalLink,
  ShieldCheck, Globe, HelpCircle, Heart,
  ArrowRight, Youtube, Linkedin, MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Footer() {
  const [dynamicData, setDynamicData] = useState({
    destinations: [],
    activities: [],
    settings: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, actRes, setRes] = await Promise.all([
          fetch('/api/destinations'),
          fetch('/api/activities'),
          fetch('/api/admin/settings') // Using the public-ish settings route
        ]);
        const dests = await destRes.json();
        const acts = await actRes.json();
        const settings = await setRes.json();
        setDynamicData({
          destinations: Array.isArray(dests) ? dests.slice(0, 5) : [],
          activities: Array.isArray(acts) ? acts.slice(0, 5) : [],
          settings: settings
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const fallbackSettings = {
    address: 'Nygata 12, 0159 Oslo, Norge',
    kathmanduAddress: 'Thamel, Kathmandu, Nepal',
    contactEmail: 'info@nepalvibb.com',
    contactPhone: '+47 486 72 979',
    footerAbout: 'Nepalvibb er din personlige portal til Himalaya. Vi kobler deg med lokale eksperter for å skape uforglemmelige og bærekraftige reiseopplevelser i hjertet av Asia.',
    socialLinks: { facebook: '#', instagram: '#', youtube: '#', linkedin: '#' },
    affiliations: [
      { name: 'NTB', logoUrl: 'https://www.actual-adventure.com/public/uploads/ntb.svg' },
      { name: 'TAAN', logoUrl: 'https://www.actual-adventure.com/public/uploads/taan.svg' },
      { name: 'NMA', logoUrl: 'https://www.actual-adventure.com/public/uploads/nma.svg' },
      { name: 'RGF', logoUrl: 'https://rgf.no/wp-content/themes/rgf/assets/img/logo.svg' },
      { name: 'Keep Nepal Green', logoUrl: 'https://www.actual-adventure.com/public/uploads/keep.svg' },
      { name: 'Government of Nepal', logoUrl: 'https://www.actual-adventure.com/public/uploads/nepal-goverment.svg' }
    ],
    copyrightText: '© 2025 NEPALVIBB AS. ALL RIGHTS RESERVED.'
  };

  const s = dynamicData.settings ? {
    ...fallbackSettings,
    ...dynamicData.settings,
    // Ensure affiliations are merged carefully or fall back if empty
    affiliations: (dynamicData.settings.affiliations && dynamicData.settings.affiliations.length > 0) 
      ? dynamicData.settings.affiliations 
      : fallbackSettings.affiliations
  } : fallbackSettings;

  const footerLinks = [
    {
      title: 'Destinasjoner',
      links: dynamicData.destinations.map(d => ({
        label: d.name,
        href: `/destination/${d.slug}`
      }))
    },
    {
      title: 'Topp Aktiviteter',
      links: dynamicData.activities.map(a => ({
        label: a.name,
        href: `/activity/${a.slug}`
      }))
    },
    {
      title: 'Bedrift',
      links: [
        { label: 'Om Oss', href: '/om-oss' },
        { label: 'Blogg', href: '/blogg' },
        { label: 'Karriere', href: '/karriere' },
        { label: 'Vår Historie', href: '/var-historie' },
      ]
    },
    {
      title: 'Støtte',
      links: [
        { label: 'Kontakt Oss', href: '/kontakt-oss' },
        { label: 'Betingelser', href: '/betingelser' },
        { label: 'Personvern', href: '/personvern' },
        { label: 'Administrasjon', href: '/admin/login' },
      ]
    }
  ];

  return (
    <footer className="bg-white pt-32 pb-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Top Section: Branding & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20 border-b border-gray-100">
          <div className="lg:col-span-4 space-y-10">
            <Link href="/" className="inline-block group">
              <img
                src="https://nepalvibb.com/wp-content/uploads/2025/05/logo-w.svg"
                alt="Nepalvibb"
                className="h-14 w-auto brightness-0"
              />
            </Link>
            <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-sm">
              {s.footerAbout}
            </p>
            <div className="flex items-center space-x-4">
              {[
                { icon: Facebook, href: s.socialLinks?.facebook },
                { icon: Instagram, href: s.socialLinks?.instagram },
                { icon: Youtube, href: s.socialLinks?.youtube },
                { icon: Linkedin, href: s.socialLinks?.linkedin }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-12">
            {footerLinks.map((column) => (
              <div key={column.title} className="space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{column.title}</h4>
                <ul className="space-y-4">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[11px] font-black text-gray-400 hover:text-orange-500 transition-colors uppercase tracking-widest flex items-center group"
                      >
                        <span className="w-0 group-hover:w-3 h-[1px] bg-orange-500 mr-0 group-hover:mr-2 transition-all" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Affiliations Section */}
        <div className="py-16 border-t border-gray-100">
          <div className="flex flex-col items-center space-y-10">
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Vi er tilknyttet</h5>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">

              {s.affiliations?.map((logo, i) => (
                <div key={i} className="group flex flex-col items-center">
                  <img
                    src={logo.logoUrl}
                    alt={logo.name}
                    className="h-14 md:h-16 w-auto object-contain grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden h-14 md:h-16 px-6 items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:border-primary/20 group-hover:text-primary transition-all">
                    {logo.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subsidiary Section */}
        <div className="py-10 border-t border-gray-100 ">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Datterselskap av</span>
            <a
              href="https://www.actual-adventure.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-3 px-6 py-3 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-100"
            >
              <img
                src="https://www.actual-adventure.com/public/uploads/actual-adventure-logo-np.svg"
                alt="Actual Adventure"
                className="h-8 bg-gray-500 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-orange-500 transition-colors" />
            </a>
          </div>
        </div>

        {/* Support Section */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-gray-100">
          <div className="flex space-x-6 items-start">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Besøksadresse</h5>
              <div className="text-sm font-bold text-gray-500 leading-relaxed">
                <p>{s.address}</p>
                {s.kathmanduAddress && <p className="mt-1 opacity-60">Nepal: {s.kathmanduAddress}</p>}
              </div>
            </div>
          </div>
          <div className="flex space-x-6 items-start">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 flex-shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Ring Oss</h5>
              <p className="text-sm font-bold text-gray-500 leading-relaxed">
                {s.contactPhone}<br />
                <span className="opacity-60">Man-Fre: 09:00 - 17:00</span>
              </p>
            </div>
          </div>
          <div className="flex space-x-6 items-start">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Send E-post</h5>
              <p className="text-sm font-bold text-gray-500 leading-relaxed">
                {s.contactEmail}<br />
                <span className="opacity-60">Svar innen 24 timer</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Badges */}
        <div className="pt-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {s.copyrightText}
            </p>
            <div className="h-4 w-[1px] bg-gray-100 hidden md:block" />
            <div className="flex items-center space-x-6">
              <Link href="/betingelser" className="text-[10px] font-black text-gray-300 hover:text-primary transition-colors uppercase tracking-widest">Betingelser</Link>
              <Link href="/personvern" className="text-[10px] font-black text-gray-300 hover:text-primary transition-colors uppercase tracking-widest">Personvern</Link>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center px-6 py-3 bg-gray-50 rounded-2xl space-x-3 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-primary">Sikker Betaling</span>
            </div>
            <div className="flex items-center px-6 py-3 bg-gray-50 rounded-2xl space-x-3 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
              <Globe className="w-4 h-4 text-orange-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-primary">Medlem av RGF</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
