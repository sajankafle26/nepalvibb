"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Menu, X, Phone, Mail, ChevronDown, Globe, Search, User, LogOut, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dynamicActivities, setDynamicActivities] = useState([]);
  const [settings, setSettings] = useState(null);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actRes, setRes] = await Promise.all([
          fetch('/api/activities'),
          fetch('/api/admin/settings')
        ]);
        const acts = await actRes.json();
        const sets = await setRes.json();
        setDynamicActivities(Array.isArray(acts) ? acts : []);
        setSettings(sets);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Hjem', href: '/' },
    {
      name: 'Destinasjon',
      dropdown: [
        { name: 'Nepal', href: '/destination/nepal' },
        { name: 'India', href: '/destination/india' },
        { name: 'Bhutan', href: '/destination/bhutan' },
        { name: 'Tibet', href: '/destination/tibet' },
      ]
    },
    {
      name: 'Aktiviteter',
      dropdown: dynamicActivities.map(a => ({
        name: a.name,
        href: `/activity/${a.slug}`
      }))
    },
    {
      name: 'Bedrift',
      dropdown: [
        { name: 'Om Oss', href: '/om-oss' },
        { name: 'Blogg', href: '/blogg' },
        { name: 'Kontakt oss', href: '/kontakt-oss' },
      ]
    },
  ];

  const contactEmail = settings?.contactEmail || 'info@nepalvibb.com';
  const contactPhone = settings?.contactPhone || '+47 48672979';
  const whatsapp = settings?.whatsapp || '4748672979';
  const viber = settings?.viber || '4748672979';

  return (
    <header className="fixed w-full z-[100] transition-all duration-500">
      <div className={cn(
        "bg-primary text-white py-2 transition-all duration-500 ",
        isScrolled ? "hidden sm:block" : "block"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-center sm:justify-between items-center text-[9px] sm:text-[11px] font-medium tracking-wider">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <a href={`mailto:${contactEmail}`} className="flex items-center hover:text-orange-400 transition-colors group">
              <Mail className="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-1.5 sm:mr-2 group-hover:scale-110 transition-transform" />
              <span className="opacity-80 truncate max-w-[120px] sm:max-w-none">{contactEmail}</span>
            </a>
            <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="flex items-center hover:text-orange-400 transition-colors group">
              <Phone className="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-1.5 sm:mr-2 group-hover:scale-110 transition-transform" />
              <span className="opacity-80">{contactPhone}</span>
            </a>
          </div>
          <div className="hidden sm:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-emerald-300">
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase text-[9px] font-black tracking-[0.2em]">24/7 Kundestøtte</span>
            </div>
            <div className="flex items-center space-x-3 border-l border-white/10 pl-6 ml-6">
              <button className="hover:scale-125 transition-transform">🇳🇴</button>
              <button className="hover:scale-125 transition-transform opacity-50">🇬🇧</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={cn(
        "transition-all duration-500",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-2xl py-3 border-b border-gray-100"
          : "bg-black/20 backdrop-blur-[2px] py-6"
      )}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center h-full">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <img
                src="https://nepalvibb.com/wp-content/uploads/2025/05/logo-w.svg"
                alt="Nepalvibb Logo"
                className={cn(
                  "h-12 w-auto transition-all duration-500",
                  isScrolled ? "brightness-0" : "brightness-100"
                )}
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative group py-2"
                  onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {link.dropdown ? (
                    <button className={cn(
                      "text-[11px] font-black uppercase tracking-[0.25em] flex items-center transition-all duration-300 cursor-pointer",
                      isScrolled ? "text-gray-800" : "text-white",
                      activeDropdown === link.name && "text-orange-500"
                    )}>
                      {link.name}
                      <ChevronDown className={cn(
                        "ml-1.5 w-3.5 h-3.5 transition-transform duration-300",
                        activeDropdown === link.name && "rotate-180"
                      )} />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={cn(
                        "text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-300 relative py-1",
                        isScrolled ? "text-gray-800" : "text-white",
                        pathname === link.href ? "text-orange-500" : "hover:text-orange-400"
                      )}
                    >
                      {link.name}
                      {pathname === link.href && (
                        <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-500" />
                      )}
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {link.dropdown && activeDropdown === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full -left-6 w-64 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl py-6 mt-4 z-[110] border border-gray-100 overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-orange-500" />
                        {link.dropdown.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block px-8 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-700 hover:bg-emerald-50 hover:text-primary transition-all flex items-center group/item"
                          >
                            <span className="w-0 group-hover/item:w-3 h-0.5 bg-orange-500 mr-0 group-hover/item:mr-3 transition-all duration-300" />
                            {sub.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <Link
                href="/plan-your-trip"
                className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black px-8 py-4 rounded-full transition-all uppercase tracking-[0.25em] shadow-2xl hover:shadow-orange-500/30 active:scale-95 flex items-center group"
              >
                <Search className="w-3.5 h-3.5 mr-2.5 group-hover:scale-110 transition-transform" />
                Planlegg Reisen
              </Link>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-4 pl-6 border-l border-gray-100/20">
                {status === 'authenticated' ? (
                  <div className="flex items-center space-x-4">
                    <Link 
                      href="/dashboard" 
                      className={cn(
                        "flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest hover:text-orange-500 transition-colors",
                        isScrolled ? "text-gray-800" : "text-white"
                      )}
                    >
                      <Layout className="w-4 h-4" />
                      <span>Min oversikt</span>
                    </Link>
                    <button 
                      onClick={() => signOut()}
                      className={cn(
                        "flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition-colors",
                        isScrolled ? "text-gray-800" : "text-white"
                      )}
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    className={cn(
                      "flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest hover:text-orange-500 transition-colors",
                      isScrolled ? "text-gray-800" : "text-white"
                    )}
                  >
                    <User className="w-4 h-4" />
                    <span>Logg inn</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Toggle */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "p-2 rounded-xl transition-all active:scale-90",
                  isScrolled ? "text-gray-800 hover:bg-gray-100" : "text-white hover:bg-white/10"
                )}
              >
                {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-8 py-12 space-y-8">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    {link.dropdown ? (
                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{link.name}</p>
                        {link.dropdown.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block text-xl font-black text-primary uppercase tracking-tighter"
                            onClick={() => setIsOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className="block text-3xl font-black text-primary uppercase tracking-tighter"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
                <Link
                  href="/plan-your-trip"
                  className="block bg-orange-500 text-white text-center py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl"
                  onClick={() => setIsOpen(false)}
                >
                  Planlegg reisen
                </Link>

                <div className="pt-8 border-t border-gray-100">
                  {status === 'authenticated' ? (
                    <div className="space-y-4">
                       <Link 
                        href="/dashboard" 
                        className="flex items-center space-x-4 text-xl font-black text-primary uppercase tracking-tighter"
                        onClick={() => setIsOpen(false)}
                      >
                        <Layout className="w-6 h-6" />
                        <span>Min oversikt</span>
                      </Link>
                      <button 
                        onClick={() => signOut()}
                        className="flex items-center space-x-4 text-xl font-black text-red-500 uppercase tracking-tighter"
                      >
                        <LogOut className="w-6 h-6" />
                        <span>Logg ut</span>
                      </button>
                    </div>
                  ) : (
                    <Link 
                      href="/login" 
                      className="flex items-center space-x-4 text-2xl font-black text-primary uppercase tracking-tighter"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-7 h-7" />
                      <span>Logg inn</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
