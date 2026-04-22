"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, ArrowRight, Newspaper } from 'lucide-react';

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.h5 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px] mb-6"
          >
            Tips og inspirasjon
          </motion.h5>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none italic"
          >
            Vår Reiseblogg
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-emerald-100/60 max-w-2xl mx-auto text-lg font-medium leading-relaxed"
          >
            Oppdag skjulte perler, praktiske reisetips og historier fra hjertet av Himalaya.
          </motion.p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse space-y-6">
                  <div className="bg-gray-100 aspect-[4/3] rounded-[2.5rem]" />
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-8 bg-gray-100 rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {blogs.map((blog, index) => (
                <motion.article
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link href={`/blogg/${blog.slug}`}>
                    <div className="overflow-hidden rounded-[2.5rem] mb-8 shadow-2xl h-80 relative border-4 border-white group-hover:border-orange-500/20 transition-all">
                      <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-all duration-500"></div>
                      <div className="absolute top-6 left-6">
                        <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-primary flex items-center">
                          <Tag className="w-3 h-3 mr-1.5 text-orange-500" /> {blog.category}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4 px-2">
                      <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-2" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center"><User className="w-3.5 h-3.5 mr-2" /> {blog.author}</span>
                      </div>
                      <h3 className="text-2xl font-black text-primary uppercase leading-[1.1] tracking-tighter group-hover:text-orange-500 transition-colors">
                        {blog.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-orange-500 text-[10px] font-black uppercase tracking-widest">
                        <span>Les mer</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
