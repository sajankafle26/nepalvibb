"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { 
  Calendar, Users, MapPin, Compass,
  Send, ChevronRight, ChevronLeft, CheckCircle2,
  Mountain, Landmark, Heart, Sparkles, Layout, Mail, User, MessageSquare, Globe, Zap,
  MessageCircle, ArrowUp, ChevronDown, Check, Info, Shield, Star, Edit2
} from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { cn } from '@/lib/utils';
const IconMap = {
  MapPin, Mountain, Landmark, Heart, Sparkles, Calendar, Users, Send, Mail, User, MessageSquare, Globe, Zap, Compass, Layout, Star
};

export default function PlanYourTripPage() {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState([]);
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [createdTripId, setCreatedTripId] = useState(null);
  const [responses, setResponses] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [error, setError] = useState('');

  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (session?.user) {
      setContactInfo(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || ''
      }));
    }
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qRes, tRes, dRes, aRes] = await Promise.all([
          fetch('/api/plan-trip/questions'),
          fetch('/api/trips'),
          fetch('/api/destinations'),
          fetch('/api/activities')
        ]);
        const [qData, tData, dData, aData] = await Promise.all([
          qRes.json(), tRes.json(), dRes.json(), aRes.json()
        ]);
        setQuestions(Array.isArray(qData) ? qData : []);
        setTours(Array.isArray(tData) ? tData : []);
        setDestinations(Array.isArray(dData) ? dData : []);
        setActivities(Array.isArray(aData) ? aData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const hasContactStep = !session?.user;
  const totalSteps = questions.length + (hasContactStep ? 1 : 0);
  const isLastStep = currentStepIdx === totalSteps - 1;
  const currentQuestion = questions[currentStepIdx];

  const handleOptionToggle = (questionId, value, isMulti) => {
    setError(''); // Clear error when user makes a selection
    const currentValues = responses[questionId] || [];
    if (isMulti) {
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      setResponses({ ...responses, [questionId]: newValues });
    } else {
      setResponses({ ...responses, [questionId]: [value] });
    }
  };

  const nextStep = () => {
    setError(''); // Reset error on attempt
    // Validation
    if (currentStepIdx < questions.length) {
      if (currentQuestion.question === 'Tour details') {
        if (!responses['accommodation']) {
          setError('Vennligst velg et overnattingsalternativ.');
          return;
        }
        if (!responses['budget_flexible']) {
          setError('Vennligst oppgi om budsjettet ditt er fleksibelt.');
          return;
        }
      } else {
        const isTravelDateStep = currentQuestion.question?.toLowerCase().includes('date') ||
          currentQuestion.question?.toLowerCase().includes('when') ||
          currentQuestion.question?.toLowerCase().includes('reisedato');

        if (isTravelDateStep) {
          if (!responses['departure_date']) {
            setError('Vennligst velg i det minste en avreisedato.');
            return;
          }
        } else {
          const selection = responses[currentQuestion._id];
          if (!selection || selection.length === 0) {
            setError('Vennligst fyll ut eller velg et alternativ for å fortsette.');
            return;
          }
        }
      }
    } else if (hasContactStep) {
      // Contact step validation
      if (!contactInfo.name.trim() || !contactInfo.email.trim()) {
        setError('Vennligst fyll inn navn og e-post.');
        return;
      }
    }

    if (currentStepIdx < totalSteps - 1) {
      setCurrentStepIdx(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      submitForm();
    }
  };

  const submitForm = async () => {
    try {
      const res = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selections: responses,
          contact: contactInfo
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCreatedTripId(data._id);
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="pt-60 pb-32 max-w-xl mx-auto px-6 text-center space-y-10">
        <div className="relative">
          <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl rotate-12">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-4 -right-4 bg-orange-500 text-white p-2 rounded-full shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-black text-primary uppercase tracking-tighter italic leading-none">Reiseplan Mottatt!</h1>
          <p className="text-gray-500 font-medium italic text-lg leading-relaxed max-w-md mx-auto">
            Takk for at du valgte Nepalvibb. Din personlige reisespesialist har allerede sendt deg en melding i din chat-portal.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link href={`/plan-your-trip/chat/${createdTripId}`} className="bg-primary text-white px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-emerald-900 transition-all flex items-center justify-center space-x-3 hover:scale-105 active:scale-95">
            <MessageSquare className="w-4 h-4" />
            <span>Gå til Chat-Portal</span>
          </Link>
          <Link href="/" className="border-2 border-gray-100 text-primary px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-primary transition-all flex items-center justify-center">Hjem</Link>
        </div>
      </div>
    </div>
  );

  const stepLabels = [
    "Reisefølge",
    "Når reiser du?",
    "Hva vil du oppleve?",
    "Planlegg detaljer",
    "Kontakt oss"
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-primary/10">

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-emerald-900 transition-all hover:scale-110 active:scale-90"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 pt-44 pb-32">
            <header className="mb-16 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Compass className="w-3.5 h-3.5" />
                <span>Skreddersy din Nepal-opplevelse</span>
              </div>
              <h1 className="text-6xl font-black text-primary uppercase tracking-tighter italic leading-[0.9]">
                Drømmereisen <br />
                <span className="text-orange-500">Starter Her</span>
              </h1>
            </header>

            {/* Premium Stepper */}
            <div className="mb-20">
              <div className="flex items-center justify-between relative px-2">
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-50 -translate-y-1/2 z-0" />
                <motion.div 
                  className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 z-0 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: currentStepIdx / (totalSteps - 1) }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                
                {stepLabels.slice(0, totalSteps).map((label, i) => {
                  const isActive = currentStepIdx === i;
                  const isCompleted = currentStepIdx > i;
                  return (
                    <div key={i} className="relative z-10 flex flex-col items-center">
                      <motion.div 
                        animate={{ 
                          scale: isActive ? 1.2 : 1,
                          backgroundColor: isActive || isCompleted ? "var(--primary)" : "#ffffff",
                          borderColor: isActive || isCompleted ? "var(--primary)" : "#F3F4F6",
                          color: isActive || isCompleted ? "#ffffff" : "#D1D5DB"
                        }}
                        className={cn(
                          "w-10 h-10 rounded-2xl border-4 flex items-center justify-center transition-all duration-300 shadow-sm",
                          isActive && "shadow-xl ring-8 ring-primary/10"
                        )}
                      >
                        {isCompleted ? <Check className="w-5 h-5 stroke-[4px]" /> : <span className="text-xs font-black">{i + 1}</span>}
                      </motion.div>
                      <span className={cn(
                        "absolute top-14 text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-colors",
                        isActive ? "text-primary opacity-100" : "text-gray-300 opacity-0 lg:opacity-100"
                      )}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

        {/* 2-Column Content */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* Left Column: Form */}
          <div className="flex-1 space-y-12 w-full lg:max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                  {currentQuestion ? (
                    <div className="space-y-10">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Steg {currentStepIdx + 1}</p>
                        <h2 className="text-4xl font-black text-primary uppercase tracking-tighter leading-tight">
                          {currentQuestion.question}
                        </h2>
                      </div>

                      {/* Specialized Rendering */}
                      {currentQuestion.question?.toLowerCase().includes('date') ||
                        currentQuestion.question?.toLowerCase().includes('when') ||
                        currentQuestion.question?.toLowerCase().includes('reisedato') ? (
                        <div className="space-y-10">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="group space-y-3">
                              <div className="flex items-center space-x-2 text-gray-400 group-focus-within:text-primary transition-colors">
                                <Calendar className="w-4 h-4" />
                                <label className="text-[11px] font-black uppercase tracking-widest">Avreisedato</label>
                              </div>
                              <input
                                type="date"
                                value={responses['departure_date'] || ''}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={e => { setError(''); setResponses(r => ({ ...r, departure_date: e.target.value })); }}
                                className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-[2rem] px-8 py-5 text-sm font-bold text-gray-800 focus:outline-none focus:border-primary focus:bg-white transition-all cursor-pointer shadow-sm"
                              />
                            </div>
                            <div className="group space-y-3">
                              <div className="flex items-center space-x-2 text-gray-400 group-focus-within:text-primary transition-colors">
                                <Calendar className="w-4 h-4" />
                                <label className="text-[11px] font-black uppercase tracking-widest">Returdato</label>
                              </div>
                              <input
                                type="date"
                                value={responses['return_date'] || ''}
                                min={responses['departure_date'] || new Date().toISOString().split('T')[0]}
                                onChange={e => { setError(''); setResponses(r => ({ ...r, return_date: e.target.value })); }}
                                className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-[2rem] px-8 py-5 text-sm font-bold text-gray-800 focus:outline-none focus:border-primary focus:bg-white transition-all cursor-pointer shadow-sm"
                              />
                            </div>
                          </div>
                          
                          <motion.label 
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="flex items-center space-x-4 cursor-pointer group p-6 bg-emerald-50/50 rounded-3xl border-2 border-transparent hover:border-primary/20 transition-all"
                          >
                            <div
                              onClick={() => { setError(''); setResponses(r => ({ ...r, flexible_dates: !r.flexible_dates })); }}
                              className={cn(
                                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0",
                                responses['flexible_dates'] ? "bg-primary border-primary" : "bg-white border-gray-200 group-hover:border-primary"
                              )}
                            >
                              {responses['flexible_dates'] && <Check className="text-white w-4 h-4 stroke-[3px]" />}
                            </div>
                            <div>
                              <p className="text-sm font-black text-primary uppercase tracking-tight">Datoene mine er fleksible</p>
                              <p className="text-[11px] text-gray-400 font-medium">±3 dager gir oss mulighet til å finne bedre priser og ruter.</p>
                            </div>
                          </motion.label>
                        </div>
                      ) : currentQuestion.question === 'Tour details' ? (
                        <div className="space-y-12">
                          {/* Rich Visual Selectors */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Destination */}
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2 text-gray-400">
                                <MapPin className="w-4 h-4" />
                                <label className="text-[11px] font-black uppercase tracking-widest">Velg destinasjon</label>
                              </div>
                              <div className="relative group">
                                <select
                                  value={responses['destination'] || ''}
                                  onChange={(e) => setResponses({ ...responses, destination: e.target.value })}
                                  className="w-full bg-white border-2 border-gray-100 rounded-[2rem] px-8 py-5 text-sm font-bold text-gray-900 focus:border-primary appearance-none pr-12 relative z-10 cursor-pointer shadow-sm transition-all"
                                >
                                  <option value="">Velg destinasjon</option>
                                  {destinations.map(d => (
                                    <option key={d._id} value={d.slug}>{d.title}</option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-0 pointer-events-none group-hover:text-primary transition-colors" />
                              </div>
                            </div>

                            {/* Tour */}
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2 text-gray-400">
                                <Mountain className="w-4 h-4" />
                                <label className="text-[11px] font-black uppercase tracking-widest">Velg spesifikk tur (valgfritt)</label>
                              </div>
                              <div className="relative group">
                                <select
                                  value={responses['tour'] || ''}
                                  onChange={(e) => setResponses({ ...responses, tour: e.target.value })}
                                  className="w-full bg-white border-2 border-gray-100 rounded-[2rem] px-8 py-5 text-sm font-bold text-gray-900 focus:border-primary appearance-none pr-12 relative z-10 cursor-pointer shadow-sm transition-all"
                                >
                                  <option value="">Ingen spesifikk tur</option>
                                  {tours.map(t => (
                                    <option key={t._id} value={t.slug}>{t.title}</option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-0 pointer-events-none group-hover:text-primary transition-colors" />
                              </div>
                            </div>
                          </div>

                          {/* Accommodation Visual Cards */}
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-gray-400">
                                <Heart className="w-4 h-4" />
                                <label className="text-[11px] font-black uppercase tracking-widest">Hvor vil du bo? *</label>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {(currentQuestion.options || []).map(opt => {
                                const isSelected = responses['accommodation'] === opt.value;
                                return (
                                  <motion.button
                                    key={opt.value}
                                    whileHover={{ y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setResponses({ ...responses, accommodation: opt.value })}
                                    className={cn(
                                      "p-6 rounded-[2.5rem] border-2 text-left transition-all relative overflow-hidden",
                                      isSelected ? "border-primary bg-emerald-50/30 shadow-xl shadow-primary/5" : "border-gray-50 bg-white hover:border-gray-200"
                                    )}
                                  >
                                    <div className="flex items-start justify-between mb-4">
                                      <div className={cn(
                                        "w-10 h-10 rounded-2xl flex items-center justify-center",
                                        isSelected ? "bg-primary text-white" : "bg-gray-50 text-gray-300"
                                      )}>
                                        {(() => {
                                          const IconComp = IconMap[opt.icon || 'Layout'] || Layout;
                                          return <IconComp className="w-5 h-5" />;
                                        })()}
                                      </div>
                                      {isSelected && <div className="bg-primary text-white p-1 rounded-full"><Check className="w-3 h-3 stroke-[4px]" /></div>}
                                    </div>
                                    <p className="text-sm font-black text-primary uppercase tracking-tight mb-1">{opt.label}</p>
                                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed">{opt.description}</p>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Budget & Title Refined */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2 text-gray-400">
                                <Sparkles className="w-4 h-4" />
                                <label className="text-[11px] font-black uppercase tracking-widest">Budsjett per person (NOK)</label>
                              </div>
                              <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-black text-sm group-focus-within:text-primary transition-colors">NOK</div>
                                <input
                                  type="number"
                                  placeholder="f.eks 15000"
                                  value={responses['budget'] || ''}
                                  onChange={e => setResponses({ ...responses, 'budget': e.target.value })}
                                  className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-2xl px-12 py-5 text-sm font-black text-primary focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                                />
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2 text-gray-400">
                                <Zap className="w-4 h-4" />
                                <label className="text-[11px] font-black uppercase tracking-widest">Er budsjettet fleksibelt? *</label>
                              </div>
                              <div className="relative group">
                                <select
                                  value={responses['budget_flexible'] || ''}
                                  onChange={e => setResponses({ ...responses, 'budget_flexible': e.target.value })}
                                  className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-2xl px-8 py-5 text-sm font-bold text-gray-900 focus:border-primary appearance-none pr-12 cursor-pointer shadow-sm transition-all"
                                >
                                  <option value="">Velg</option>
                                  <option value="yes">Ja, jeg er fleksibel</option>
                                  <option value="no">Nei, fast budsjett</option>
                                  <option value="enough">Bare et estimat</option>
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none group-hover:text-primary transition-colors" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4 pt-4">
                             <div className="flex items-center space-x-2 text-gray-400">
                                <Edit2 className="w-4 h-4" />
                                <label className="text-[11px] font-black uppercase tracking-widest">Fortell oss mer (valgfritt)</label>
                              </div>
                              <textarea
                                rows={5}
                                value={responses['trip_description'] || ''}
                                onChange={e => setResponses({ ...responses, 'trip_description': e.target.value })}
                                className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-[2.5rem] px-8 py-6 text-sm font-medium text-gray-800 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm resize-none"
                                placeholder="Har du spesielle ønsker for overnatting, mat eller aktiviteter? Fortell oss gjerne litt om dine drømmer for reisen..."
                              />
                          </div>
                        </div>
                      ) : (
                        /* Default Option Cards */
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {currentQuestion.type === 'text' ? (
                            <div className="col-span-2 space-y-4">
                              <textarea
                                rows={8}
                                value={responses[currentQuestion._id]?.[0] || ''}
                                onChange={e => setResponses({ ...responses, [currentQuestion._id]: [e.target.value] })}
                                className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-[2.5rem] px-10 py-8 text-base font-medium text-gray-800 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner resize-none"
                                placeholder="Del dine tanker med oss..."
                              />
                            </div>
                          ) : (
                            currentQuestion.options.map(opt => {
                              const Icon = IconMap[opt.icon] || Layout;
                              const isSelected = (responses[currentQuestion._id] || []).includes(opt.value);
                              return (
                                <motion.button
                                  key={opt.value}
                                  whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleOptionToggle(currentQuestion._id, opt.value, currentQuestion.type === 'multi-select')}
                                  className={cn(
                                    "p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-start space-y-6 text-left relative group overflow-hidden",
                                    isSelected ? "border-primary bg-emerald-50/30 shadow-2xl shadow-primary/5" : "border-gray-50 bg-white hover:border-gray-200"
                                  )}
                                >
                                  <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                                    isSelected ? "bg-primary text-white rotate-6" : "bg-gray-50 text-gray-300 group-hover:rotate-6"
                                  )}>
                                    <Icon className="w-7 h-7" />
                                  </div>
                                  <div className="space-y-1">
                                    <p className={cn(
                                      "text-sm font-black uppercase tracking-tight transition-colors",
                                      isSelected ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                                    )}>{opt.label}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">Klikk for å velge</p>
                                  </div>
                                  {isSelected && (
                                    <motion.div 
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="absolute top-6 right-6 bg-primary text-white p-1 rounded-full"
                                    >
                                      <Check className="w-4 h-4 stroke-[4px]" />
                                    </motion.div>
                                  )}
                                </motion.button>
                              );
                            })
                          )}
                        </div>
                      )}

                      {/* Group Size Enhancements */}
                      {(() => {
                        const selected = responses[currentQuestion._id] || [];
                        const showCounter = selected.some(v =>
                          v?.toLowerCase().includes('famil') ||
                          v?.toLowerCase().includes('group') ||
                          v?.toLowerCase().includes('gruppe')
                        );
                        if (!showCounter) return null;
                        return (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-10 rounded-[3rem] border-2 border-primary/5 bg-emerald-50/30 space-y-10 shadow-inner"
                          >
                            <div className="flex items-center space-x-3">
                              <Users className="w-5 h-5 text-primary" />
                              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Spesifiser din gruppe</h3>
                            </div>
                            
                            <div className="space-y-8">
                              <div className="flex items-center justify-between group">
                                <div className="space-y-1">
                                  <p className="text-lg font-black text-primary uppercase tracking-tighter italic">Voksne</p>
                                  <p className="text-[11px] text-gray-400 font-medium">12 år og eldre</p>
                                </div>
                                <div className="flex items-center space-x-6">
                                  <button type="button" onClick={() => { const n = Math.max(1, adults - 1); setAdults(n); setResponses(r => ({ ...r, adults: n, children })); }} className="w-12 h-12 rounded-2xl border-2 border-white bg-white shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all font-black text-2xl active:scale-90">−</button>
                                  <span className="w-10 text-center text-3xl font-black text-primary tabular-nums tracking-tighter">{adults}</span>
                                  <button type="button" onClick={() => { const n = adults + 1; setAdults(n); setResponses(r => ({ ...r, adults: n, children })); }} className="w-12 h-12 rounded-2xl border-2 border-white bg-white shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all font-black text-2xl active:scale-90">+</button>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between pt-8 border-t border-primary/10 group">
                                <div className="space-y-1">
                                  <p className="text-lg font-black text-primary uppercase tracking-tighter italic">Barn</p>
                                  <p className="text-[11px] text-gray-400 font-medium">Under 12 år</p>
                                </div>
                                <div className="flex items-center space-x-6">
                                  <button type="button" onClick={() => { const n = Math.max(0, children - 1); setChildren(n); setResponses(r => ({ ...r, adults, children: n })); }} className="w-12 h-12 rounded-2xl border-2 border-white bg-white shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all font-black text-2xl active:scale-90">−</button>
                                  <span className="w-10 text-center text-3xl font-black text-primary tabular-nums tracking-tighter">{children}</span>
                                  <button type="button" onClick={() => { const n = children + 1; setChildren(n); setResponses(r => ({ ...r, adults, children: n })); }} className="w-12 h-12 rounded-2xl border-2 border-white bg-white shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all font-black text-2xl active:scale-90">+</button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })()}
                  </div>
                  ) : (
                    <div className="space-y-12">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Siste Steg</p>
                        <h2 className="text-4xl font-black text-primary uppercase tracking-tighter leading-tight">
                          Kontakt reiseeksperten
                        </h2>
                      </div>
                      
                      <div className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Fullt Navn</label>
                            <input
                              type="text"
                              required
                              placeholder="Fornavn Etternavn"
                              value={contactInfo.name}
                              onChange={e => setContactInfo({ ...contactInfo, name: e.target.value })}
                              className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-[2rem] px-8 py-5 text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">E-postadresse</label>
                            <input
                              type="email"
                              required
                              placeholder="navn@epost.no"
                              value={contactInfo.email}
                              onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })}
                              className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-[2rem] px-8 py-5 text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Spesielle behov eller spørsmål</label>
                          <textarea
                            rows={6}
                            value={contactInfo.message}
                            onChange={e => setContactInfo({ ...contactInfo, message: e.target.value })}
                            className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-[2.5rem] px-8 py-6 text-sm font-medium focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                            placeholder="Fortell oss gjerne hvis det er noe spesielt vi bør vite om helse, kosthold eller andre preferanser..."
                          />
                        </div>

                        {/* Authentication Quick Access */}
                        <div className="pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-50/50 p-8 rounded-[2.5rem]">
                          <div className="space-y-1 text-center sm:text-left">
                            <p className="text-sm font-black text-primary uppercase tracking-tight italic">Allerede en konto?</p>
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Logg inn for å synkronisere planen</p>
                          </div>
                          <div className="flex flex-wrap justify-center gap-3">
                            <input
                              type="email"
                              placeholder="E‑post"
                              value={loginInfo.email}
                              onChange={e => setLoginInfo({ ...loginInfo, email: e.target.value })}
                              className="px-6 py-3 border-2 border-white bg-white/50 rounded-xl text-xs font-bold focus:outline-none focus:border-primary transition-all w-48 shadow-sm"
                            />
                            <input
                              type="password"
                              placeholder="Passord"
                              value={loginInfo.password}
                              onChange={e => setLoginInfo({ ...loginInfo, password: e.target.value })}
                              className="px-6 py-3 border-2 border-white bg-white/50 rounded-xl text-xs font-bold focus:outline-none focus:border-primary transition-all w-40 shadow-sm"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={async () => {
                                const result = await signIn('credentials', { redirect: false, email: loginInfo.email, password: loginInfo.password });
                                if (result?.ok) {
                                  setError('');
                                  nextStep();
                                } else {
                                  setError('Innlogging mislyktes. Vennligst sjekk detaljene.');
                                }
                              }}
                              className="bg-primary text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-emerald-900 transition-all"
                            >Logg inn</motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Enhanced Navigation */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-gray-100 mt-16">
                <div className="flex items-center space-x-6 order-2 sm:order-1">
                  {currentStepIdx > 0 && (
                    <motion.button
                      whileHover={{ x: -4 }}
                      onClick={() => setCurrentStepIdx(prev => prev - 1)}
                      className="px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-all flex items-center space-x-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Tilbake</span>
                    </motion.button>
                  )}
                </div>
                
                <div className="flex flex-col items-end space-y-4 w-full sm:w-auto order-1 sm:order-2">
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-red-50 border border-red-100 px-6 py-3 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center shadow-sm"
                      >
                        <Info className="w-3.5 h-3.5 mr-2" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextStep}
                    className="w-full sm:w-auto bg-primary text-white px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-900 transition-all flex items-center justify-center space-x-4 group ring-8 ring-primary/5"
                  >
                    <span>{isLastStep ? 'Opprett Reiseplan' : 'Neste Steg'}</span>
                    {isLastStep ? <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> : <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </motion.button>
                </div>
              </div>
            </div>

              {/* Right Column: Summary Card */}
          {/* Right Column: Premium Summary */}
          <aside className="lg:w-80 w-full shrink-0">
            <div className={cn(
              "bg-white rounded-[2.5rem] border-2 border-gray-50 p-10 transition-all duration-500",
              "lg:sticky lg:top-32",
              "mt-12 lg:mt-0 shadow-2xl shadow-primary/5"
            )}>
              <div className="flex items-center space-x-3 mb-10">
                <div className="w-2 h-8 bg-primary rounded-full" />
                <h3 className="text-xl font-black text-primary uppercase tracking-tighter italic">Din Reiseplan</h3>
              </div>

              <div className="space-y-10">
                {questions.map((q, idx) => {
                  const selection = responses[q._id];
                  if (!selection || (Array.isArray(selection) && selection.length === 0)) return null;

                  return (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={q._id} 
                      className="space-y-3 group"
                    >
                      <div className="flex items-center space-x-2 text-gray-300 group-hover:text-primary transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        <p className="text-[10px] font-black uppercase tracking-widest">{q.question}</p>
                      </div>
                      <div className="pl-3.5">
                        {Array.isArray(selection) ? (
                          <div className="flex flex-wrap gap-2">
                            {selection.map(s => (
                              <span key={s} className="text-xs font-black text-primary bg-emerald-50 px-3 py-1 rounded-lg border border-primary/10">{s}</span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm font-black text-primary italic leading-tight">{selection}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Additional Details */}
                <div className="pt-8 border-t border-gray-100 space-y-6">
                  {responses['adults'] && (
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Reisende</p>
                      <p className="text-xs font-black text-primary">{responses['adults']} voksne, {responses['children'] || 0} barn</p>
                    </div>
                  )}
                  {responses['departure_date'] && (
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Periode</p>
                      <p className="text-xs font-black text-primary uppercase tracking-tighter">
                        {new Date(responses['departure_date']).toLocaleDateString('no-NO', { day: '2-digit', month: 'short' })}
                        {responses['return_date'] && ` - ${new Date(responses['return_date']).toLocaleDateString('no-NO', { day: '2-digit', month: 'short' })}`}
                      </p>
                    </div>
                  )}
                  {responses['budget'] && (
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Budsjett</p>
                      <p className="text-xs font-black text-orange-500 uppercase tracking-tighter">NOK {responses['budget']},-</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bottom Decoration */}
              <div className="mt-10 pt-10 border-t border-gray-50 flex items-center justify-center">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Expert" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-4">Nepal-eksperter klare til å hjelpe</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
