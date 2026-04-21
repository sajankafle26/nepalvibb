"use client";

import { useState, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Send, MapPin, Calendar, Users, 
  Clock, Edit2, ChevronRight, Paperclip,
  CheckCircle2, Circle, MoreHorizontal,
  MessageCircle, Phone, Star, X, CreditCard, ArrowRight, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const SPECIALIST = {
  name: "Nepalvibb Ekspert",
  title: "Reisespesialist for Nepal",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
  rating: 4.9,
  trips: 312,
  responseTime: "< 1 time",
};

const QUICK_REPLIES = [
  "Fjellvandring",
  "Lokal kultur og templer",
  "Dyreliv og nasjonalparker",
  "Alt — overrask meg!",
];

const TRIP_DEFAULTS = {
  title: 'Nepal-eventyr',
  slug: 'nepal',
  price: '1800',
  duration: '10 dager',
  image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
  destination: 'Nepal',
};

export default function ChatPage({ params }) {
  const { id } = use(params);
  const searchParams = useSearchParams();

  const tripTitle = searchParams.get('title') || TRIP_DEFAULTS.title;
  const tripSlug = searchParams.get('slug') || TRIP_DEFAULTS.slug;
  const tripPrice = searchParams.get('price') || TRIP_DEFAULTS.price;
  const tripDuration = searchParams.get('duration') || TRIP_DEFAULTS.duration;
  const tripImage = searchParams.get('image') || TRIP_DEFAULTS.image;
  const tripDestination = searchParams.get('destination') || TRIP_DEFAULTS.destination;

  const [messages, setMessages] = useState([]);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState('oversikt');
  const endRef = useRef(null);

  useEffect(() => {
    const fetchChat = async () => {
      if (id === 'new') {
        setMessages([
          { id: 1, from: 'specialist', text: `Hei! Jeg er din dedikerte reisespesialist hos Nepalvibb. Jeg er klar for å hjelpe deg med å planlegge dette eventyret. 🙏`, time: 'Nå' },
          { id: 2, from: 'specialist', text: `Jeg ser at du er interessert i "${tripTitle}" — et flott valg! Jeg vil gjerne hjelpe deg med å skreddersy dette for deg.`, time: 'Akkurat nå' }
        ]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/chat?id=${id}`);
        const data = await res.json();
        if (data) {
          setRequest(data);
          if (data.messages) {
            setMessages(data.messages.map((m, i) => ({
              id: i,
              from: m.sender === 'user' ? 'user' : 'specialist',
              text: m.text,
              time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            })));
          }
        }
      } catch (error) {
        console.error('Error fetching chat:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, [id, tripTitle]);

  const tripSummary = {
    title: tripTitle,
    destination: tripDestination,
    dates: 'September 2025',
    duration: tripDuration,
    travelers: '2 reisende',
    budget: request?.budget || 'Middels',
    status: request?.status || 'Planlegging pågår',
    price: request?.price || tripPrice,
  };

  const [checklist, setChecklist] = useState([
    { id: 1, done: true, label: "Reiseønsker sendt" },
    { id: 2, done: true, label: "Spesialist tildelt" },
    { id: 3, done: false, label: "Utkast til reiserute mottatt" },
    { id: 4, done: false, label: "Datoer bekreftet" },
    { id: 5, done: false, label: "Reise bestilt" },
  ]);

  const updateTask = (id, done = true) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done } : item));
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.from === 'specialist') {
      const txt = lastMsg.text.toLowerCase();
      if (txt.includes('itinerary') || txt.includes('proposal') || txt.includes('reiserute')) {
        updateTask(3, true);
      }
    }
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setSending(true);

    const userMsg = { id: Date.now(), from: 'user', text: msg, time: 'Akkurat nå' };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, tripId: id }),
      });
      const data = await res.json();
      const botMsg = { id: Date.now() + 1, from: 'specialist', text: data.reply, time: 'Akkurat nå' };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      const errMsg = { id: Date.now() + 1, from: 'specialist', text: "Beklager, jeg kunne ikke behandle meldingen din. Vennligst prøv igjen.", time: 'Akkurat nå' };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shrink-0">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="bg-primary text-white p-1.5 rounded-lg group-hover:bg-emerald-900 transition-colors">
            <X className="w-4 h-4" />
          </div>
          <span className="text-xl font-black tracking-tighter">
            <span className="text-primary">NEPAL</span><span className="text-orange-500">VIBB</span>
          </span>
        </Link>
        <div className="text-center">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Oversikt over reiseplanlegging</p>
        </div>
        <div className="w-20" />
      </div>

      <div className="flex flex-col lg:flex-row flex-1">
        <div className="flex flex-col flex-1 min-w-0">
          <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img src={SPECIALIST.avatar} className="w-12 h-12 rounded-full object-cover border-2 border-primary" alt={SPECIALIST.name} />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <p className="font-black text-primary text-sm uppercase tracking-tight">{SPECIALIST.name}</p>
                <p className="text-[10px] text-gray-400 font-medium">{SPECIALIST.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <div className="flex items-center space-x-1.5">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-primary font-black">{SPECIALIST.rating}</span>
                <span>({SPECIALIST.trips} reiser)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Svarer {SPECIALIST.responseTime}</span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8 flex-1 overflow-y-auto">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex items-end space-x-4", msg.from === 'user' ? "flex-row-reverse space-x-reverse" : "")}
                >
                  {msg.from === 'specialist' && (
                    <img src={SPECIALIST.avatar} className="w-8 h-8 rounded-full object-cover border border-gray-100 shrink-0" alt="" />
                  )}
                  <div className={cn(
                    "max-w-lg px-6 py-4 rounded-3xl text-sm leading-relaxed font-medium",
                    msg.from === 'user' 
                      ? "bg-primary text-white rounded-br-sm" 
                      : "bg-white text-gray-700 rounded-bl-sm shadow-sm border border-gray-100"
                  )}>
                    {msg.text}
                    <p className={cn("text-[10px] mt-2 font-normal", msg.from === 'user' ? "text-white/50" : "text-gray-300")}>
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {sending && (
              <div className="flex items-end space-x-4">
                <img src={SPECIALIST.avatar} className="w-8 h-8 rounded-full object-cover border border-gray-100" alt="" />
                <div className="bg-white rounded-3xl rounded-bl-sm px-6 py-5 shadow-sm border border-gray-100 flex space-x-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} className="w-2 h-2 bg-gray-300 rounded-full" animate={{ y: [0, -6, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="px-8 pb-4 flex flex-wrap gap-3">
            {QUICK_REPLIES.map(reply => (
              <button
                key={reply}
                onClick={() => sendMessage(reply)}
                className="text-[11px] font-bold border border-gray-200 rounded-full px-4 py-2 text-gray-600 hover:border-primary hover:text-primary hover:bg-emerald-50 transition-all"
              >
                {reply}
              </button>
            ))}
          </div>

          <div className="bg-gradient-to-r from-primary to-emerald-700 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 p-2 rounded-xl">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-black text-sm uppercase tracking-tight">Klar for å bekrefte reisen?</p>
                <p className="text-emerald-200 text-[10px] font-medium">Sikre datoene dine med et depositum. Gratis avbestilling 30+ dager før.</p>
              </div>
            </div>
            <Link
              href={`/payment?tripId=${id}&amount=${tripSummary.price}`}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center space-x-2 shrink-0 shadow-xl"
            >
              <span>Bestill nå</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border-t border-gray-100 p-5 shrink-0 sticky bottom-0 z-40">
            <div className="flex items-center space-x-4 bg-gray-50 rounded-2xl px-5 py-3 border-2 border-gray-100 focus-within:border-primary transition-colors">
              <button className="text-gray-400 hover:text-primary transition-colors shrink-0">
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Send melding til din spesialist..."
                className="flex-1 bg-transparent text-sm font-medium focus:outline-none text-gray-800 placeholder-gray-400"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || sending}
                className={cn(
                  "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  input.trim() ? "bg-primary text-white hover:bg-emerald-900 shadow-lg" : "bg-gray-100 text-gray-400"
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <aside className="w-full lg:w-[360px] bg-white border-l border-gray-100 flex flex-col hidden lg:flex">
          <div className="flex border-b border-gray-100 px-6 pt-4 sticky top-[72px] bg-white z-40">
            {['oversikt', 'sjekkliste'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "mr-8 pb-4 text-[11px] font-black uppercase tracking-widest transition-all border-b-2",
                  activeTab === tab ? "text-primary border-primary" : "text-gray-400 border-transparent"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-8 overflow-y-auto">
            {activeTab === 'oversikt' && (
              <>
                <div className="relative rounded-3xl overflow-hidden h-48">
                  <img src={tripImage} className="w-full h-full object-cover" alt={tripTitle} />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-6">
                    <div>
                      <p className="text-white font-black text-lg uppercase tracking-tighter leading-tight">{tripSummary.title}</p>
                      <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-widest mt-1">{tripSummary.duration} • {tripSummary.dates}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Reisedetaljer</h3>
                  <div className="space-y-3">
                    {[
                      { icon: MapPin, label: "Destinasjon", value: tripSummary.destination },
                      { icon: Calendar, label: "Reisedatoer", value: tripSummary.dates },
                      { icon: Clock, label: "Varighet", value: tripSummary.duration },
                      { icon: Users, label: "Reisende", value: tripSummary.travelers },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-4 h-4 text-orange-500" />
                          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{item.label}</span>
                        </div>
                        <span className="text-xs font-bold text-primary">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full flex items-center justify-center space-x-3 border-2 border-dashed border-gray-200 rounded-2xl py-4 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:border-primary hover:text-primary transition-all">
                  <Edit2 className="w-4 h-4" />
                  <span>Rediger reisedetaljer</span>
                </button>

                <div className="bg-emerald-50/50 rounded-3xl p-5 space-y-4 border border-emerald-100">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Din Spesialist</h3>
                  <div className="flex items-center space-x-4">
                    <img src={SPECIALIST.avatar} className="w-12 h-12 rounded-full border-2 border-primary object-cover" alt="" />
                    <div>
                      <p className="font-black text-primary text-sm uppercase tracking-tight">{SPECIALIST.name}</p>
                      <p className="text-[10px] text-gray-400">{SPECIALIST.title}</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-primary text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2">
                      <MessageCircle className="w-3.5 h-3.5" /><span>Melding</span>
                    </button>
                    <button className="flex-1 border-2 border-gray-100 text-gray-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 hover:border-primary hover:text-primary transition-all">
                      <Phone className="w-3.5 h-3.5" /><span>Ring</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl overflow-hidden border-2 border-orange-100 bg-orange-50/30">
                  <div className="p-6 space-y-5">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Fra</p>
                      <p className="text-3xl font-black text-primary tracking-tighter mt-1">${tripPrice}<span className="text-sm text-gray-400 font-light">/person</span></p>
                    </div>

                    <Link
                      href={`/payment?tripId=${id}&amount=${tripSummary.price}`}
                      className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-xl"
                    >
                      Bestill denne reisen
                    </Link>

                    <Link
                      href={`/trips/${tripSlug}`}
                      className="block w-full text-center border-2 border-gray-200 text-gray-500 hover:border-primary hover:text-primary py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Se full reiserute
                    </Link>

                    <div className="space-y-2 pt-1 text-[10px] font-medium text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Sikker betaling</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Gratis avbestilling 30+ dager før</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'sjekkliste' && (
              <div className="space-y-8">
                <div className="bg-gray-50 rounded-3xl p-6 space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-gray-400">Fremdrift</span>
                    <span className="text-primary">{checklist.filter(i => i.done).length}/{checklist.length}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(checklist.filter(i => i.done).length / checklist.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  {checklist.map(item => (
                    <div key={item.id} className={cn(
                      "flex items-center space-x-4 p-4 rounded-2xl transition-all",
                      item.done ? "bg-emerald-50/50" : "bg-gray-50"
                    )}>
                      {item.done ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> : <Circle className="w-5 h-5 text-gray-300 shrink-0" />}
                      <div className="flex flex-col flex-1">
                        <span className={cn("text-sm font-medium", item.done ? "text-primary" : "text-gray-400")}>{item.label}</span>
                        {item.id === 4 && !item.done && (
                          <button onClick={() => updateTask(4, true)} className="text-[10px] font-black uppercase tracking-widest text-orange-500 mt-1 hover:underline text-left">
                            Bekreft datoer nå
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
