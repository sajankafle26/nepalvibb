"use client";

import { useState, useEffect } from 'react';
import { Star, Send, User, Calendar, CheckCircle2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ReviewSection({ tripId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [tripId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?tripId=${tripId}`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, tripId })
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ userName: '', userEmail: '', rating: 5, comment: '' });
        setTimeout(() => {
          setSubmitted(false);
          setShowForm(false);
        }, 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="omtaler" className="scroll-mt-40 space-y-16">
      <div className="flex items-end justify-between border-b border-gray-100 pb-10">
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-primary uppercase tracking-tighter italic">Gjestevurderinger</h2>
          <div className="flex items-center space-x-4">
            <div className="flex text-orange-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{reviews.length} Omtaler</span>
          </div>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-orange-500 transition-all"
        >
          {showForm ? 'Avbryt' : 'Skriv en omtale'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 p-10 md:p-16 rounded-[3.5rem] border border-gray-100 space-y-10">
              {submitted ? (
                <div className="text-center space-y-6 py-10">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-primary uppercase italic">Takk for din omtale!</h3>
                  <p className="text-gray-500 font-medium">Din vurdering er sendt til moderering og vil bli synlig så snart den er godkjent av en administrator.</p>
                </div>
              ) : (
                <>
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-black text-primary uppercase italic">Del din opplevelse</h3>
                    <p className="text-gray-400 text-sm font-medium">Din tilbakemelding hjelper oss å bli bedre og andre reisende å velge riktig.</p>
                  </div>
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Navn</label>
                      <input 
                        type="text" 
                        required
                        value={formData.userName}
                        onChange={(e) => setFormData({...formData, userName: e.target.value})}
                        className="w-full bg-white border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-primary shadow-sm" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">E-post</label>
                      <input 
                        type="email" 
                        required
                        value={formData.userEmail}
                        onChange={(e) => setFormData({...formData, userEmail: e.target.value})}
                        className="w-full bg-white border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-primary shadow-sm" 
                      />
                    </div>
                    <div className="md:col-span-2 space-y-3 text-center">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Din Vurdering</label>
                      <div className="flex justify-center space-x-4 pt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star}
                            type="button"
                            onClick={() => setFormData({...formData, rating: star})}
                            className="transition-transform active:scale-90"
                          >
                            <Star className={cn("w-8 h-8", formData.rating >= star ? "text-orange-500 fill-current" : "text-gray-200")} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Din Tilbakemelding</label>
                      <textarea 
                        rows={5} 
                        required
                        value={formData.comment}
                        onChange={(e) => setFormData({...formData, comment: e.target.value})}
                        className="w-full bg-white border-none rounded-[2rem] px-8 py-6 text-sm font-medium focus:ring-2 focus:ring-primary shadow-sm resize-none" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button 
                        disabled={submitting}
                        className="w-full bg-primary text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-orange-500 transition-all flex items-center justify-center space-x-4"
                      >
                        {submitting ? (
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Send Omtale</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-gray-50 rounded-[3.5rem] p-20 text-center space-y-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-gray-200">
              <MessageSquare className="w-8 h-8" />
            </div>
            <p className="text-xl font-black text-primary uppercase tracking-tight italic">Ingen omtaler ennå</p>
            <p className="text-gray-400 text-sm font-medium italic">Bli den første til å dele din erfaring fra denne reisen!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {reviews.map((review) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={review._id} 
                className="bg-white rounded-[3.5rem] p-10 md:p-12 border border-gray-100 hover:shadow-2xl transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-primary/10 rotate-3 group-hover:rotate-0 transition-transform">
                      {review.userName[0]}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-black text-primary uppercase tracking-tighter italic">{review.userName}</h4>
                      <div className="flex items-center space-x-3 text-[9px] font-black uppercase tracking-widest text-gray-300">
                        <Calendar className="w-3 h-3 text-orange-500" />
                        <span>{new Date(review.createdAt).toLocaleDateString('no-NO')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex text-orange-500 bg-orange-50 px-6 py-2 rounded-full">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={cn("w-4 h-4", review.rating >= star ? "fill-current" : "opacity-20")} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 font-medium leading-relaxed italic text-lg border-l-4 border-orange-500 pl-8 ml-2">
                  "{review.comment}"
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
