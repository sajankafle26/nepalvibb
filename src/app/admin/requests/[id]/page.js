"use client";

import { useState, useEffect, useRef, use } from 'react';
import { 
  ArrowLeft, Send, User, Clock, 
  CheckCircle2, MapPin, Tag, Calendar,
  Shield, CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminChatPage({ params }) {
  const { id } = use(params);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [request?.messages]);

  const fetchRequest = async () => {
    try {
      const res = await fetch(`/api/chat?id=${id}`);
      const data = await res.json();
      setRequest(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch('/api/admin/chat/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId: id, text: input }),
      });
      if (res.ok) {
        setInput('');
        fetchRequest();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col lg:flex-row gap-10">
      
      {/* Left: Chat Container */}
      <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
        
        {/* Chat Header */}
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center space-x-4">
            <Link href="/admin/requests" className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center font-black text-primary text-xs uppercase">
                {request.name ? request.name.split(' ').map(n => n[0]).join('') : 'U'}
              </div>
              <div>
                <h2 className="text-sm font-black text-primary uppercase tracking-tight">{request.name || 'Anonymous'}</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Live Conversation</span>
                </div>
              </div>
            </div>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-orange-100 text-orange-600">
            {request.status}
          </span>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30">
          {request.messages.map((msg, i) => (
            <div 
              key={i} 
              className={cn(
                "flex flex-col max-w-[80%]",
                msg.sender === 'specialist' ? "ml-auto items-end" : "items-start"
              )}
            >
              <div className={cn(
                "px-5 py-4 rounded-2xl text-sm font-medium shadow-sm",
                msg.sender === 'specialist' ? "bg-primary text-white rounded-br-none" : "bg-white text-gray-700 border border-gray-100 rounded-bl-none",
                msg.sender === 'system' && "bg-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest border-0 mx-auto"
              )}>
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-300 font-bold mt-2 px-2">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Reply Area */}
        <div className="p-6 bg-white border-t border-gray-50 shrink-0">
          <form onSubmit={handleSend} className="flex items-center space-x-4">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your response..."
              className="flex-1 bg-gray-50 border-0 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20"
            />
            <button 
              disabled={sending || !input.trim()}
              className="bg-primary text-white p-4 rounded-2xl hover:bg-emerald-900 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {sending ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>

      {/* Right: Trip Context Sidebar */}
      <aside className="w-full lg:w-80 space-y-6 overflow-y-auto pr-2">
        <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-4">Traveler Profile</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-blue-500" />
              <p className="text-xs font-bold text-gray-600">{request.group || 'Solo traveler'}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-orange-500" />
              <p className="text-xs font-bold text-gray-600">{request.month || 'Flexible dates'}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Tag className="w-4 h-4 text-emerald-500" />
              <p className="text-xs font-bold text-gray-600">{request.budget || 'Mid-range budget'}</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-4">Specialist Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Set Trip Price (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                  <input 
                    type="number" 
                    value={request.price || 0}
                    onChange={(e) => setRequest({ ...request, price: parseFloat(e.target.value) })}
                    className="w-full bg-gray-50 border-0 rounded-xl pl-8 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button 
                  onClick={async () => {
                    const res = await fetch(`/api/admin/chat/update-price`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ tripId: id, price: request.price })
                    });
                    if (res.ok) alert('Price updated!');
                  }}
                  className="w-full bg-primary text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-900 transition-all"
                >
                  Save Price
                </button>
              </div>
            </div>
            <button className="flex items-center justify-between p-4 bg-emerald-50 text-emerald-700 rounded-2xl hover:bg-emerald-100 transition-colors">
              <span className="text-[10px] font-black uppercase tracking-widest">Mark as Booked</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
            <button className="flex items-center justify-between p-4 bg-blue-50 text-blue-700 rounded-2xl hover:bg-blue-100 transition-colors">
              <span className="text-[10px] font-black uppercase tracking-widest">Send Itinerary</span>
              <Shield className="w-4 h-4" />
            </button>
          </div>
        </section>

        {request.notes && (
          <section className="bg-orange-50/50 rounded-[2.5rem] border border-orange-100 p-8">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-400 mb-4">Internal Notes</h3>
            <p className="text-xs text-orange-900 font-medium leading-relaxed italic">
              "{request.notes}"
            </p>
          </section>
        )}
      </aside>
    </div>
  );
}
