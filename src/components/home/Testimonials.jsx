"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/admin/reviews'); // Fetching all but we will filter for approved
        const data = await res.json();
        setReviews(data.filter(r => r.status === 'approved').slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading || reviews.length === 0) return null;

  return (
    <section className="py-32 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 space-y-4">
          <h5 className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px]">Gjestevurderinger</h5>
          <h2 className="text-5xl md:text-7xl font-black text-primary uppercase tracking-tighter leading-none italic">Hva våre<br />gjester sier</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div 
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group relative"
            >
              <Quote className="absolute top-8 right-10 w-12 h-12 text-primary/5 group-hover:text-orange-500/10 transition-colors" />
              
              <div className="space-y-8 relative z-10">
                <div className="flex text-orange-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={cn("w-4 h-4", review.rating >= star ? "fill-current" : "opacity-10")} />
                  ))}
                </div>
                
                <p className="text-gray-500 font-medium italic leading-relaxed text-lg">
                  "{review.comment.length > 120 ? review.comment.substring(0, 120) + '...' : review.comment}"
                </p>

                <div className="flex items-center space-x-4 pt-4">
                  <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                    {review.userName[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-primary uppercase tracking-tight">{review.userName}</h4>
                    <p className="text-[9px] font-black uppercase tracking-widest text-orange-500">{review.tripId?.title || 'Nepalvibb Gjest'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
