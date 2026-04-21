"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import {
  Calendar, Users, MapPin, Compass,
  Send, ChevronRight, ChevronLeft, CheckCircle2,
  Mountain, Landmark, Heart, Sparkles, Layout, Mail, User, MessageSquare, Globe, Zap,
  MessageCircle, ArrowUp, ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

const IconMap = {
  MapPin, Mountain, Landmark, Heart, Sparkles, Calendar, Users, Send, Mail, User, MessageSquare, Globe, Zap, Compass
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
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-60 pb-32 max-w-xl mx-auto px-6 text-center space-y-8">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h1 className="text-4xl font-black text-primary uppercase tracking-tighter italic">Reiseplan Mottatt!</h1>
        <p className="text-gray-500 font-medium italic text-lg leading-relaxed">
          Takk for at du valgte Nepalvibb. Din personlige reisespesialist har allerede sendt deg en melding i din chat-portal.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link href={`/plan-your-trip/chat/${createdTripId}`} className="bg-primary text-white px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-emerald-900 transition-all flex items-center justify-center space-x-3">
            <MessageSquare className="w-4 h-4" />
            <span>Gå til Chat</span>
          </Link>
          <Link href="/" className="border-2 border-gray-100 text-primary px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-primary transition-all">Hjem</Link>
        </div>
      </div>
    </div>
  );

  const stepLabels = [
    "Gruppestørrelse",
    "Reisedatoer",
    "Reiseinformasjon",
    "Turdetaljer",
    "Kontakt reiseekspert"
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />


      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-emerald-900 transition-all"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 pt-40 pb-32">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-primary uppercase tracking-tighter italic leading-none">La oss planlegge din reise</h1>
        </div>

        {/* Stepper */}
        <div className="max-w-5xl mx-auto mb-12 md:mb-20 relative px-4 overflow-hidden">
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-100 z-0 mx-10 hidden sm:block"></div>
          <div className="flex items-start justify-between relative z-10 gap-2 overflow-x-auto pb-4 no-scrollbar">
            {stepLabels.slice(0, totalSteps).map((label, i) => {
              const isActive = currentStepIdx === i;
              const isCompleted = currentStepIdx > i;
              return (
                <div key={i} className="flex flex-col items-center group shrink-0 w-16 sm:w-32">
                  <div className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-xs sm:text-sm transition-all duration-300 border-2",
                    isActive ? "bg-primary border-primary text-white scale-110 shadow-lg" :
                      isCompleted ? "bg-primary border-primary text-white" :
                        "bg-white border-gray-200 text-gray-300"
                  )}>
                    {i + 1}
                  </div>
                  <span className={cn(
                    "mt-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-tight text-center leading-tight hidden sm:block",
                    isActive ? "text-primary" : isCompleted ? "text-gray-900" : "text-gray-400"
                  )}>
                    {label}
                  </span>
                  {isActive && (
                    <span className="mt-2 text-[8px] font-black uppercase text-primary sm:hidden">
                      {label.split(' ')[0]}
                    </span>
                  )}
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
                    <h2 className="text-2xl font-black text-primary uppercase tracking-tight">{currentQuestion.question}</h2>

                    {/* Specialized Rendering */}
                    {currentQuestion.question?.toLowerCase().includes('date') ||
                      currentQuestion.question?.toLowerCase().includes('when') ||
                      currentQuestion.question?.toLowerCase().includes('reisedato') ? (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Avreisedato</label>
                            <input
                              type="date"
                              value={responses['departure_date'] || ''}
                              min={new Date().toISOString().split('T')[0]}
                              onChange={e => { setError(''); setResponses(r => ({ ...r, departure_date: e.target.value })); }}
                              className="w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium text-gray-800 focus:outline-none focus:border-primary transition-all cursor-pointer"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Returdato</label>
                            <input
                              type="date"
                              value={responses['return_date'] || ''}
                              min={responses['departure_date'] || new Date().toISOString().split('T')[0]}
                              onChange={e => { setError(''); setResponses(r => ({ ...r, return_date: e.target.value })); }}
                              className="w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium text-gray-800 focus:outline-none focus:border-primary transition-all cursor-pointer"
                            />
                          </div>
                        </div>
                        <label className="flex items-center space-x-3 cursor-pointer group pt-2">
                          <div
                            onClick={() => { setError(''); setResponses(r => ({ ...r, flexible_dates: !r.flexible_dates })); }}
                            className={cn(
                              "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0",
                              responses['flexible_dates'] ? "bg-primary border-primary" : "border-gray-200 group-hover:border-primary"
                            )}
                          >
                            {responses['flexible_dates'] && <span className="text-white text-[10px] font-black">✓</span>}
                          </div>
                          <span className="text-sm font-bold text-gray-500">Datoene mine er fleksible (±3 dager)</span>
                        </label>
                      </div>
                    ) : currentQuestion.question === 'Tour details' ? (
                      <div className="space-y-10">
                        {/* 1. Destination */}
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase text-gray-500">Velg destinasjon</label>
                          <div className="relative">
                            <select
                              value={responses['destination'] || ''}
                              onChange={(e) => setResponses({ ...responses, destination: e.target.value })}
                              className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-primary appearance-none pr-12 relative z-10 cursor-pointer"
                            >
                              <option value="">Velg destinasjon</option>
                              {destinations.length > 0 ? destinations.map(d => (
                                <option key={d._id} value={d.slug}>{d.title}</option>
                              )) : (
                                <option disabled>Ingen destinasjoner funnet</option>
                              )}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-0 pointer-events-none" />
                          </div>
                        </div>

                        {/* 2. Activities */}
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase text-gray-500">Velg aktiviteter</label>
                          <div className="relative">
                            <select
                              value={responses['activities'] || ''}
                              onChange={(e) => setResponses({ ...responses, activities: e.target.value })}
                              className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-primary appearance-none pr-12 relative z-10 cursor-pointer"
                            >
                              <option value="">Velg aktiviteter</option>
                              {activities.length > 0 ? activities.map(a => (
                                <option key={a._id} value={a.slug}>{a.title}</option>
                              )) : (
                                <option disabled>Ingen aktiviteter funnet</option>
                              )}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-0 pointer-events-none" />
                          </div>
                        </div>

                        {/* 3. Tour */}
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase text-gray-500">Velg turer</label>
                          <div className="relative">
                            <select
                              value={responses['tour'] || ''}
                              onChange={(e) => setResponses({ ...responses, tour: e.target.value })}
                              className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-primary appearance-none pr-12 relative z-10 cursor-pointer"
                            >
                              <option value="">Velg en tur</option>
                              {tours.length > 0 ? tours.map(t => (
                                <option key={t._id} value={t.slug}>{t.title}</option>
                              )) : (
                                <option disabled>Ingen turer funnet</option>
                              )}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-0 pointer-events-none" />
                          </div>
                        </div>


                        {/* 4. Accommodation */}
                        <div className="space-y-6">
                          <label className="text-[11px] font-black uppercase text-gray-500">Hvilke overnattingsalternativer? *</label>
                          <div className="space-y-6">
                            {(currentQuestion.options || []).map(opt => (
                              <label key={opt.value} className="flex items-start space-x-4 cursor-pointer group">
                                <div className="pt-1">
                                  <div className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                    responses['accommodation'] === opt.value ? "border-primary bg-primary" : "border-gray-200 group-hover:border-primary"
                                  )}>
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                  </div>
                                  <input
                                    type="radio"
                                    className="hidden"
                                    name="accommodation"
                                    onChange={() => setResponses({ ...responses, accommodation: opt.value })}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{opt.label}</p>
                                  <p className="text-[11px] text-gray-400 font-medium leading-normal">{opt.description}</p>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* 5. Budget */}
                        <div className="space-y-8 pt-6 border-t border-gray-50">
                          <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-gray-500">Ditt estimerte budsjett</label>
                            <input
                              type="text"
                              placeholder="eg:1500"
                              value={responses['budget'] || ''}
                              onChange={e => setResponses({ ...responses, 'budget': e.target.value })}
                              className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-gray-500">Er budsjettet ditt fleksibelt? *</label>
                            <div className="relative">
                              <select
                                value={responses['budget_flexible'] || ''}
                                onChange={e => setResponses({ ...responses, 'budget_flexible': e.target.value })}
                                className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary appearance-none pr-12"
                              >
                                <option value="">Velg</option>
                                <option value="yes">Ja</option>
                                <option value="no">Nei</option>
                                <option value="enough">TILSTREKKELIG</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        {/* 6. Title & Description */}
                        <div className="space-y-8 pt-6 border-t border-gray-50">
                          <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-gray-500">Gi din reise en kort tittel</label>
                            <input
                              type="text"
                              placeholder="Short tour title"
                              value={responses['trip_title'] || ''}
                              onChange={e => setResponses({ ...responses, 'trip_title': e.target.value })}
                              className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-gray-500">Beskriv din reise</label>
                            <textarea
                              rows={6}
                              value={responses['trip_description'] || ''}
                              onChange={e => setResponses({ ...responses, 'trip_description': e.target.value })}
                              className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary resize-none"
                              placeholder="Fortell oss mer om dine planer..."
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Default Fallback (Cards) */
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {currentQuestion.type === 'text' ? (
                            <textarea
                              rows={8}
                              value={responses[currentQuestion._id]?.[0] || ''}
                              onChange={e => setResponses({ ...responses, [currentQuestion._id]: [e.target.value] })}
                              className="w-full bg-gray-50 border-none rounded-2xl px-8 py-6 text-sm font-medium focus:ring-2 focus:ring-primary resize-none shadow-inner col-span-2"
                              placeholder="Skriv ditt svar her..."
                            />
                          ) : (
                            currentQuestion.options.map(opt => {
                              const Icon = IconMap[opt.icon] || Layout;
                              const isSelected = (responses[currentQuestion._id] || []).includes(opt.value);
                              return (
                                <button
                                  key={opt.value}
                                  onClick={() => handleOptionToggle(currentQuestion._id, opt.value, currentQuestion.type === 'multi-select')}
                                  className={cn(
                                    "p-6 rounded-2xl border-2 transition-all flex items-center space-x-5 group text-left",
                                    isSelected ? "border-primary bg-emerald-50/30" : "border-gray-50 hover:border-gray-200"
                                  )}
                                >
                                  <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all flex-shrink-0",
                                    isSelected ? "bg-primary text-white" : "bg-gray-50 text-gray-300"
                                  )}>
                                    <Icon className="w-6 h-6" />
                                  </div>
                                  <span className={cn(
                                    "text-sm font-bold uppercase tracking-tight",
                                    isSelected ? "text-primary" : "text-gray-400"
                                  )}>{opt.label}</span>
                                </button>
                              );
                            })
                          )}
                        </div>

                        {/* Adults & Children Counter - shown when Family or Group selected */}
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
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-6 p-8 rounded-3xl border-2 border-primary/10 bg-emerald-50/30 space-y-6"
                            >
                              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Gruppedetaljer</h3>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-black text-gray-800 uppercase tracking-tight">Antall voksne</p>
                                  <p className="text-[11px] text-gray-400 font-medium">12 år og eldre</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <button type="button" onClick={() => { const n = Math.max(1, adults - 1); setAdults(n); setResponses(r => ({ ...r, adults: n, children })); }} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-all font-black text-lg">−</button>
                                  <span className="w-8 text-center text-xl font-black text-primary">{adults}</span>
                                  <button type="button" onClick={() => { const n = adults + 1; setAdults(n); setResponses(r => ({ ...r, adults: n, children })); }} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-all font-black text-lg">+</button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                                <div>
                                  <p className="text-sm font-black text-gray-800 uppercase tracking-tight">Antall barn</p>
                                  <p className="text-[11px] text-gray-400 font-medium">Under 12 år</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <button type="button" onClick={() => { const n = Math.max(0, children - 1); setChildren(n); setResponses(r => ({ ...r, adults, children: n })); }} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-all font-black text-lg">−</button>
                                  <span className="w-8 text-center text-xl font-black text-primary">{children}</span>
                                  <button type="button" onClick={() => { const n = children + 1; setChildren(n); setResponses(r => ({ ...r, adults, children: n })); }} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-all font-black text-lg">+</button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })()}
                      </>
                    )}
                  </div>
                ) : (
                  /* Contact Step */
                  <div className="space-y-10">
                    <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Ta kontakt med reiseeksperten</h2>
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase text-gray-500">Navn</label>
                          <input
                            type="text"
                            required
                            value={contactInfo.name}
                            onChange={e => setContactInfo({ ...contactInfo, name: e.target.value })}
                            className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase text-gray-500">E-post</label>
                          <input
                            type="email"
                            required
                            value={contactInfo.email}
                            onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })}
                            className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase text-gray-500">Melding / Spesielle behov</label>
                        <textarea
                          rows={5}
                          value={contactInfo.message}
                          onChange={e => setContactInfo({ ...contactInfo, message: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary resize-none"
                        />
                      </div>
                    </div>
                    <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                      <p className="text-xs text-gray-400 font-medium">Har du allerede en konto?</p>
                      <Link
                        href="/login"
                        className="text-xs font-black uppercase tracking-widest text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        Logg inn her
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="pt-6"
                >
                  <p className="text-sm font-bold text-red-500 flex items-center">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" />
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-6 pt-8 border-t border-gray-100 mt-8">
              {currentStepIdx > 0 && (
                <button
                  onClick={() => setCurrentStepIdx(prev => prev - 1)}
                  className="px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-all flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Tilbake</span>
                </button>
              )}
              <button
                onClick={nextStep}
                className="bg-primary text-white px-10 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-emerald-900 transition-all flex items-center space-x-3"
              >
                <span>{isLastStep ? 'Send forespørsel' : 'Neste'}</span>
                {isLastStep ? <Send className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Right Column: Summary Card */}
          <aside className="lg:w-80 w-full shrink-0">
            <div className={cn(
              "bg-white rounded-3xl border-2 border-[#E5F1FF] p-6 md:p-8 shadow-sm transition-all duration-500",
              "lg:sticky lg:top-32",
              "mt-8 lg:mt-0"
            )}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-primary uppercase tracking-tight">Din reiseplan</h3>
                <div className="lg:hidden w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-8 gap-y-6">
                {questions.map((q, idx) => {
                  const selection = responses[q._id];
                  if (!selection || (Array.isArray(selection) && selection.length === 0)) return null;

                  return (
                    <div key={q._id} className="pt-4 lg:pt-4 border-t border-gray-50 flex flex-col space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{q.question}</p>
                      <p className="text-sm font-bold text-primary truncate">
                        {Array.isArray(selection) ? selection.join(', ') : selection}
                      </p>
                    </div>
                  );
                })}

                {responses['destination'] && (
                  <div className="pt-4 border-t border-gray-50 flex flex-col space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Destinasjon</p>
                    <p className="text-sm font-bold text-primary truncate">
                      {destinations.find(d => d.slug === responses['destination'])?.title || responses['destination']}
                    </p>
                  </div>
                )}
                {responses['activities'] && (
                  <div className="pt-4 border-t border-gray-50 flex flex-col space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Aktivitet</p>
                    <p className="text-sm font-bold text-primary truncate">
                      {activities.find(a => a.slug === responses['activities'])?.title || responses['activities']}
                    </p>
                  </div>
                )}
                {responses['tour'] && (
                  <div className="pt-4 border-t border-gray-50 flex flex-col space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Valgt tur</p>
                    <p className="text-sm font-bold text-primary truncate">
                      {tours.find(t => t.slug === responses['tour'])?.title || responses['tour']}
                    </p>
                  </div>
                )}
                {responses['accommodation'] && (
                  <div className="pt-4 border-t border-gray-50 flex flex-col space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Overnatting</p>
                    <p className="text-sm font-bold text-primary truncate">
                      {responses['accommodation']}
                    </p>
                  </div>
                )}

                {responses['budget'] && (
                  <div className="pt-4 border-t border-gray-50 flex flex-col space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Budsjett</p>
                    <p className="text-sm font-bold text-primary">{responses['budget']} USD</p>
                  </div>
                )}
                {responses['departure_date'] && (
                  <div className="pt-4 border-t border-gray-50 flex flex-col space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Reisedatoer</p>
                    <p className="text-sm font-bold text-primary">
                      {new Date(responses['departure_date']).toLocaleDateString('no-NO')}
                      {responses['return_date'] && ` → ${new Date(responses['return_date']).toLocaleDateString('no-NO')}`}
                      {responses['flexible_dates'] && ' (fleksibel)'}
                    </p>
                  </div>
                )}
                {responses['adults'] !== undefined && (
                  <div className="pt-4 border-t border-gray-50 flex flex-col space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Gruppedetaljer</p>
                    <p className="text-sm font-bold text-primary">{responses['adults']} voksne · {responses['children'] ?? 0} barn</p>
                  </div>
                )}
                {responses['trip_title'] && (
                  <div className="pt-4 border-t border-gray-50 flex flex-col space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Reisetittel</p>
                    <p className="text-sm font-bold text-primary truncate">{responses['trip_title']}</p>
                  </div>
                )}
              </div>

              {Object.keys(responses).length === 0 && (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <Layout className="w-6 h-6 text-gray-200" />
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ingen planer ennå</p>
                </div>
              )}
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
