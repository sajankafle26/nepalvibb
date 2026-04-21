"use client";

import { useState, useEffect, useRef, use } from 'react';
import { 
  Send, User, MapPin, Calendar, 
  Tag, Clock, ArrowLeft, Phone, 
  Mail, ShieldCheck, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminChatPage({ params }) {
  const { id } = use(params);
  const [request, setRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 5000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChat = async () => {
    try {
      const res = await fetch(`/api/chat?id=${id}`);
      const data = await res.json();
      setRequest(data.request);
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tripId: id, 
          message: newMessage,
          sender: 'specialist' // Admin is the specialist
        })
      });
      if (res.ok) {
        setNewMessage("");
        fetchChat();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col lg:flex-row gap-8">
      
      {/* Sidebar: Request Details */}
      <aside className="lg:w-[350px] flex flex-col gap-6">
        <Link href="/admin/requests" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Requests
        </Link>

        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-primary/5 space-y-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl font-black uppercase">
              {request?.name?.[0] || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-black text-primary uppercase tracking-tight">{request?.name || 'Anonymous'}</h2>
              <p className="text-xs text-gray-400 font-medium">Trip Request #{id.slice(-5)}</p>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-gray-50">
            <div className="space-y-4">
               <div className="flex items-center text-xs font-bold text-gray-600">
                <MapPin className="w-4 h-4 mr-3 text-orange-500" /> {request?.destination || 'Not Specified'}
              </div>
              <div className="flex items-center text-xs font-bold text-gray-600">
                <Calendar className="w-4 h-4 mr-3 text-blue-500" /> {request?.month || 'Flexible'}
              </div>
              <div className="flex items-center text-xs font-bold text-gray-600">
                <Tag className="w-4 h-4 mr-3 text-emerald-500" /> {request?.budget || 'Mid-range'}
              </div>
            </div>

            <div className="p-5 bg-gray-50 rounded-2xl space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contact Details</p>
              <div className="flex items-center text-[11px] font-bold text-primary truncate">
                <Mail className="w-3.5 h-3.5 mr-2 text-gray-400" /> {request?.email}
              </div>
              {request?.phone && (
                <div className="flex items-center text-[11px] font-bold text-primary">
                  <Phone className="w-3.5 h-3.5 mr-2 text-gray-400" /> {request?.phone}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="bg-emerald-50 rounded-[2rem] p-6 border border-emerald-100 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-emerald-700">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Active Chat</span>
          </div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        </div>
      </aside>

      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-primary/5 overflow-hidden">
        
        {/* Chat Header */}
        <div className="px-10 py-6 border-b border-gray-50 flex items-center justify-between bg-white/50 backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Specialist Conversation</h3>
          </div>
          <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5" />
            <span>Active now</span>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide"
        >
          {messages.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className={`flex ${msg.sender === 'specialist' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] space-y-2 ${msg.sender === 'specialist' ? 'items-end' : 'items-start'}`}>
                <div className={`px-6 py-4 rounded-[2rem] text-sm leading-relaxed font-medium ${
                  msg.sender === 'specialist' 
                    ? 'bg-primary text-white rounded-tr-none shadow-xl shadow-primary/10' 
                    : 'bg-gray-100 text-primary rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 px-2">
                  {msg.sender === 'specialist' ? 'You' : request?.name?.split(' ')[0] || 'Traveler'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="p-8 bg-gray-50/50 border-t border-gray-50">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your response to the traveler..."
              className="w-full bg-white border-2 border-transparent focus:border-primary rounded-[2rem] pl-8 pr-20 py-5 text-sm font-medium shadow-sm transition-all focus:outline-none"
            />
            <button 
              type="submit"
              className="absolute right-3 p-3 bg-primary text-white rounded-2xl hover:bg-orange-500 transition-all shadow-lg shadow-primary/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
