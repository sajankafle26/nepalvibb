"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import {
  Calendar, User, Tag, Share2, ArrowLeft,
  ArrowRight, Clock, MessageSquare, Heart,
  ChevronRight, Facebook, Twitter, Linkedin,
  Mail, Bookmark, CheckCircle2, Layout,
  MapPin, Coffee, Eye
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toc, setToc] = useState([]);
  const [activeId, setActiveId] = useState('');
  const contentRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 250]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);
  const blurHero = useTransform(scrollY, [0, 500], [0, 10]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${slug}`);
        const result = await res.json();
        setData(result);

        setTimeout(() => {
          if (contentRef.current) {
            const headings = contentRef.current.querySelectorAll('h2, h3');
            const tocItems = Array.from(headings).map((heading, index) => {
              const id = heading.id || `section-${index}`;
              heading.id = id;
              return {
                id,
                text: heading.innerText,
                level: heading.tagName.toLowerCase() === 'h2' ? 2 : 3
              };
            });
            setToc(tocItems);
          }
        }, 300);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 1.0 }
    );

    const headings = contentRef.current?.querySelectorAll('h2, h3') || [];
    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [toc]);

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-[3px] border-primary/5 border-t-orange-500 rounded-full"
      />
      <p className="mt-8 text-[11px] font-black uppercase tracking-[0.4em] text-primary/40 animate-pulse">Navigerer til eventyret...</p>
    </div>
  );

  if (!data?.blog) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-8xl font-black text-primary/5 absolute select-none">404</h1>
      <div className="relative space-y-6">
        <h2 className="text-4xl font-black text-primary uppercase italic tracking-tighter">Artikkelen ble ikke funnet</h2>
        <p className="text-gray-400 font-medium max-w-xs mx-auto">Vinden har kanskje blåst denne siden bort over Himalaya...</p>
        <Link href="/blogg" className="inline-flex items-center space-x-3 bg-primary text-white px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-orange-500 transition-all">
          <ArrowLeft className="w-4 h-4" /> <span>Tilbake til bloggen</span>
        </Link>
      </div>
    </div>
  );

  const { blog, related } = data;
  const readingTime = Math.ceil((blog.content || "").split(' ').length / 200);

  return (
    <div className="min-h-screen bg-[#FAFAFA] selection:bg-orange-500 selection:text-white overflow-x-hidden">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-orange-500 z-[200] origin-left" style={{ scaleX }} />
      <Navbar />

      {/* Cinematic Hero */}
      <section className="relative h-screen min-h-[800px] w-full flex items-center justify-center overflow-hidden bg-primary">
        <motion.div className="absolute inset-0 z-0" style={{ y: y1, filter: `blur(${blurHero}px)` }}>
          <img src={blog.image} className="w-full h-full object-cover scale-110 brightness-75" alt="" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-transparent to-[#FAFAFA]" />
        </motion.div>

        <div className="max-w-6xl mx-auto px-6 relative z-10 w-full pt-20">
          <motion.div 
            style={{ opacity: opacityHero }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-10"
          >
            <div className="flex flex-wrap items-center justify-center gap-6">
              <span className="bg-orange-500 text-white px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-orange-500/40">
                {blog.category}
              </span>
              <span className="flex items-center space-x-2 text-white/60 text-[11px] font-black uppercase tracking-widest">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{readingTime} minutter lesing</span>
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] italic drop-shadow-2xl max-w-5xl mx-auto">
              {blog.title}
            </h1>

            <div className="flex items-center justify-center space-x-12 pt-12">
              <div className="flex items-center space-x-5 text-left group">
                <div className="w-16 h-16 rounded-[2rem] bg-white p-1 shadow-2xl group-hover:rotate-6 transition-transform duration-500">
                  <div className="w-full h-full rounded-[1.8rem] bg-orange-500 flex items-center justify-center text-white font-black text-2xl uppercase tracking-tighter italic">
                    {blog.author[0]}
                  </div>
                </div>
                <div>
                  <p className="text-white font-black text-sm uppercase tracking-[0.1em]">{blog.author}</p>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Reiseekspert</p>
                </div>
              </div>
              <div className="h-12 w-[1px] bg-white/10 hidden md:block" />
              <div className="hidden md:flex flex-col items-start text-left">
                <p className="text-white font-black text-sm uppercase tracking-[0.1em]">
                  {new Date(blog.createdAt).toLocaleDateString('no-NO', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Publisert</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center space-y-3"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic">Oppdag</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-orange-500/50 to-transparent" />
        </motion.div>
      </section>

      {/* Content Layout */}
      <section className="relative z-20 -mt-32 pb-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Left Rail: TOC */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-40 space-y-16">
                <div className="space-y-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-[2px] bg-orange-500" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Innhold</h4>
                  </div>
                  <nav className="flex flex-col space-y-5">
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={cn(
                          "group flex items-center space-x-4 transition-all duration-500",
                          activeId === item.id ? "translate-x-3" : "opacity-40 hover:opacity-100"
                        )}
                      >
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all duration-500",
                          activeId === item.id ? "bg-orange-500 scale-150" : "bg-gray-300 group-hover:bg-orange-500"
                        )} />
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest transition-colors",
                          activeId === item.id ? "text-primary" : "text-gray-400 group-hover:text-primary"
                        )}>
                          {item.text}
                        </span>
                      </a>
                    ))}
                  </nav>
                </div>

                <div className="pt-12 border-t border-gray-100 space-y-8">
                  <div className="flex items-center space-x-3 text-primary/40">
                    <Share2 className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Del Artikkelen</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {[Facebook, Twitter, Linkedin, Mail].map((Icon, i) => (
                      <button key={i} className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-primary/40 hover:text-orange-500 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10 transition-all group">
                        <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Center: The Article */}
            <main className="flex-1 max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_40px_100px_rgba(0,0,0,0.03)] border border-gray-50 relative"
              >
                {/* Floating Meta */}
                <div className="absolute -top-12 right-12 md:right-20 flex space-x-3">
                  <button className="w-24 h-24 bg-primary rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center text-white space-y-2 group hover:bg-orange-500 transition-all">
                    <Heart className="w-6 h-6 group-hover:fill-white transition-all" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Favoritt</span>
                  </button>
                </div>

                <article 
                  ref={contentRef}
                  className="prose prose-2xl prose-primary max-w-none 
                    prose-headings:text-primary prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:italic
                    prose-h2:text-4xl md:prose-h2:text-5xl prose-h2:mt-24 prose-h2:mb-10 prose-h2:leading-[1]
                    prose-h3:text-2xl prose-h3:mt-16 prose-h3:mb-6
                    prose-p:text-gray-600 prose-p:leading-[1.8] prose-p:font-medium prose-p:text-lg md:prose-p:xl prose-p:mb-10
                    prose-strong:text-primary prose-strong:font-black
                    prose-blockquote:border-l-[10px] prose-blockquote:border-orange-500 prose-blockquote:bg-[#FAFAFA] prose-blockquote:p-12 prose-blockquote:rounded-[3rem] prose-blockquote:italic prose-blockquote:font-black prose-blockquote:text-primary prose-blockquote:text-3xl prose-blockquote:shadow-sm
                    prose-img:rounded-[4rem] prose-img:shadow-2xl prose-img:my-20 prose-img:border-8 prose-img:border-white
                    prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
                    prose-li:text-gray-600 prose-li:font-medium prose-li:text-lg md:prose-li:text-xl
                    marker:text-orange-500"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Tags & Footer Meta */}
                <div className="mt-24 pt-12 border-t border-gray-50 flex flex-wrap gap-4">
                  {blog.category && (
                    <div className="bg-gray-50 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary/40 flex items-center space-x-2">
                      <Tag className="w-3.5 h-3.5 text-orange-500" />
                      <span>{blog.category}</span>
                    </div>
                  )}
                  <div className="bg-gray-50 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary/40 flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    <span>Nepalvibb Insider</span>
                  </div>
                </div>
              </motion.div>

              {/* Author Section */}
              <div className="mt-20 p-12 bg-primary rounded-[4rem] text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative z-10 shrink-0">
                  <div className="w-32 h-32 rounded-[3rem] bg-orange-500 p-1 shadow-2xl rotate-6 group-hover:rotate-0 transition-transform duration-700">
                    <div className="w-full h-full rounded-[2.8rem] bg-primary flex items-center justify-center text-orange-500 font-black text-5xl italic tracking-tighter border-2 border-orange-500/20">
                      {blog.author[0]}
                    </div>
                  </div>
                </div>
                <div className="relative z-10 flex-1 text-center md:text-left space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-400">Signert av</p>
                    <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none">{blog.author}</h3>
                  </div>
                  <p className="text-emerald-100/60 text-lg font-medium leading-relaxed max-w-xl italic">
                    "Min lidenskap er å vise frem den ufortalte skjønnheten i Himalaya. Gjennom mine reiser i Nepal har jeg lært at de største eventyrene ofte finnes i de minste detaljene."
                  </p>
                  <div className="flex items-center justify-center md:justify-start space-x-6 pt-4">
                    <button className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-white group/btn">
                      <span>Alle artikler</span>
                      <ChevronRight className="w-4 h-4 text-orange-500 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <div className="w-[1px] h-4 bg-white/10" />
                    <div className="flex space-x-4">
                      <Twitter className="w-4 h-4 text-white/40 hover:text-orange-500 transition-colors cursor-pointer" />
                      <Linkedin className="w-4 h-4 text-white/40 hover:text-orange-500 transition-colors cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced CTA */}
              <div className="mt-12 bg-white rounded-[4rem] p-12 md:p-20 border border-orange-100 shadow-2xl shadow-orange-500/5 text-center space-y-12 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
                <div className="space-y-6 max-w-2xl mx-auto">
                   <div className="w-20 h-20 bg-orange-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                     <Mountain className="w-10 h-10 text-orange-500" />
                   </div>
                   <h3 className="text-4xl md:text-5xl font-black text-primary uppercase italic tracking-tighter leading-none">Inspirert til å reise?</h3>
                   <p className="text-gray-400 text-lg font-medium">Vi kan hjelpe deg med å planlegge en tur som ligner på det du nettopp leste om.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link href="/plan-your-trip" className="w-full sm:w-auto bg-primary text-white px-12 py-6 rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-orange-500 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-4">
                    <span>Start planleggingen</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button className="w-full sm:w-auto border-2 border-gray-100 text-primary px-10 py-6 rounded-[2rem] text-xs font-black uppercase tracking-widest hover:border-primary transition-all">
                    Se turer i Nepal
                  </button>
                </div>
              </div>
            </main>

            {/* Right Rail: Floating Features */}
            <aside className="hidden xl:block w-80 shrink-0 pt-32">
              <div className="sticky top-40 space-y-10">
                {/* Newsletter Box */}
                <div className="bg-[#1A1A1A] rounded-[3rem] p-10 text-white space-y-8 shadow-2xl">
                   <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/20">
                     <Mail className="w-6 h-6 text-white" />
                   </div>
                   <div className="space-y-2">
                     <h4 className="text-xl font-black uppercase tracking-tight leading-none italic">Innsikt rett i innboksen</h4>
                     <p className="text-white/40 text-[11px] font-medium leading-relaxed">Månedlige tips fra våre guider i Himalaya.</p>
                   </div>
                   <form className="space-y-3">
                     <input 
                      type="email" 
                      placeholder="Din e-post..."
                      className="w-full bg-white/5 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-orange-500 transition-all text-white placeholder-white/20"
                     />
                     <button className="w-full bg-white text-primary py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">
                       Abonner
                     </button>
                   </form>
                </div>

                {/* Popular Destinations Card */}
                <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-8">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Populært Nå</h4>
                   <div className="space-y-6">
                      {[
                        { name: "Everest Base Camp", price: "2,400", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=100&q=80" },
                        { name: "Annapurna Circuit", price: "1,800", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=100&q=80" },
                        { name: "Poon Hill Trek", price: "950", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=100&q=80" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center space-x-4 group cursor-pointer">
                          <img src={item.img} className="w-14 h-14 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                          <div className="space-y-1">
                            <p className="text-[11px] font-black uppercase tracking-tight text-primary group-hover:text-orange-500 transition-colors">{item.name}</p>
                            <p className="text-[10px] font-bold text-gray-400">Fra ${item.price}</p>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Recommended for reading */}
      {related?.length > 0 && (
        <section className="py-40 bg-white border-t border-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 text-center md:text-left">
              <div className="space-y-4">
                <p className="text-orange-500 font-black uppercase tracking-[0.5em] text-[11px]">Neste eventyr</p>
                <h2 className="text-5xl md:text-7xl font-black text-primary uppercase tracking-tighter italic leading-none">Relaterte Historier</h2>
              </div>
              <Link href="/blogg" className="inline-flex items-center space-x-4 text-xs font-black uppercase tracking-widest text-primary/40 hover:text-orange-500 transition-colors group">
                <span>Utforsk Alle</span>
                <div className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-orange-500 transition-all">
                   <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {related.map((post, idx) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/blogg/${post.slug}`} className="group block space-y-8">
                    <div className="h-96 rounded-[4rem] overflow-hidden relative shadow-2xl group-hover:-translate-y-4 transition-all duration-700">
                      <img src={post.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                      <div className="absolute bottom-10 left-10 right-10">
                        <p className="text-orange-400 text-[10px] font-black uppercase tracking-widest mb-3">{post.category}</p>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-tight group-hover:text-orange-400 transition-colors">
                          {post.title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
