"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Shield, Lock, CheckCircle, Mountain,
  Clock, Users, Calendar, ArrowLeft, CreditCard, Info,
  ChevronRight, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

function PaymentContent() {
  const searchParams = useSearchParams();
  const tripId = searchParams.get('tripId');
  const initialAmount = searchParams.get('amount') || '1800';

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('idle'); 
  const [transaction, setTransaction] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paypal'); 
  
  const [bookingDetails, setBookingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/chat?id=${tripId}`);
        const data = await res.json();
        if (data) {
          setTrip(data);
          setBookingDetails(prev => ({
            ...prev,
            firstName: data.name?.split(' ')[0] || '',
            lastName: data.name?.split(' ').slice(1).join(' ') || '',
            email: data.email || '',
            phone: data.phone || '',
            startDate: data.departure_date || '',
            endDate: data.return_date || ''
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [tripId]);

  const totalAmount = parseFloat(trip?.price || initialAmount);
  const currency = "USD";

  const createOrder = useCallback(async () => {
    setStatus('processing');
    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount.toFixed(2),
          currency: currency,
          tripTitle: trip?.trip_title || trip?.destination || "Skreddersydd eventyr",
          tripId: tripId,
          bookingDetails
        }),
      });
      const data = await res.json();
      if (!data.orderId) throw new Error('No orderId returned');
      return data.orderId;
    } catch (err) {
      setStatus('error');
      setErrorMsg('Kunne ikke opprette betaling. Vennligst prøv igjen.');
      throw err;
    }
  }, [totalAmount, trip, tripId, bookingDetails]);

  const onApprove = useCallback(async (data) => {
    setStatus('processing');
    try {
      const res = await fetch('/api/payment/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: data.orderID,
          tripId: tripId,
          bookingDetails
        }),
      });
      const result = await res.json();
      if (result.success) {
        setTransaction(result);
        setStatus('success');
      } else {
        throw new Error('Capture failed');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Betalingen ble ikke fullført. Vennligst kontakt kundeservice.');
    }
  }, [tripId, bookingDetails]);

  const onError = useCallback((err) => {
    setStatus('error');
    setErrorMsg('Det oppsto en feil med betalingsleverandøren. Vennligst prøv igjen.');
    console.error('Payment Error:', err);
  }, []);

  const onCancel = useCallback(() => {
    setStatus('idle');
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (status === 'success' && transaction) {
    return <SuccessScreen transaction={transaction} />;
  }

  return (
    <PayPalScriptProvider options={{
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb",
      currency: currency,
      intent: 'capture',
    }}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-[60]">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-xl font-black tracking-tighter">
              <span className="text-primary">NEPAL</span><span className="text-orange-500">VIBB</span>
            </Link>
            <div className="flex items-center space-x-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span>Sikker betaling</span>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-12">

            <div className="lg:w-[60%] space-y-8">
              <div>
                <Link href="/plan-your-trip" className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors mb-6">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Tilbake til planlegging
                </Link>
                <h1 className="text-3xl font-black text-primary uppercase tracking-tighter mb-2">Fullfør din bestilling</h1>
                <p className="text-gray-400 font-medium">Vennligst bekreft detaljene nedenfor for å sikre din reise.</p>
              </div>

              {/* Step 1: Dates */}
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Steg 1: Reisedatoer</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Startdato</label>
                    <input 
                      type="date" 
                      value={bookingDetails.startDate}
                      onChange={e => setBookingDetails({ ...bookingDetails, startDate: e.target.value })}
                      className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary focus:bg-white outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Sluttdato</label>
                    <input 
                      type="date" 
                      value={bookingDetails.endDate}
                      onChange={e => setBookingDetails({ ...bookingDetails, endDate: e.target.value })}
                      className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary focus:bg-white outline-none transition-all" 
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Traveler Info */}
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Steg 2: Reiseinformasjon</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Fornavn</label>
                    <input 
                      type="text" 
                      value={bookingDetails.firstName}
                      onChange={e => setBookingDetails({ ...bookingDetails, firstName: e.target.value })}
                      className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary focus:bg-white outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Etternavn</label>
                    <input 
                      type="text" 
                      value={bookingDetails.lastName}
                      onChange={e => setBookingDetails({ ...bookingDetails, lastName: e.target.value })}
                      className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary focus:bg-white outline-none transition-all" 
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">E-post</label>
                    <input 
                      type="email" 
                      value={bookingDetails.email}
                      onChange={e => setBookingDetails({ ...bookingDetails, email: e.target.value })}
                      className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary focus:bg-white outline-none transition-all" 
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Payment */}
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Steg 3: Betalingsmetode</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setPaymentMethod('paypal')}
                    className={cn(
                      "p-6 rounded-2xl border-2 transition-all flex flex-col items-center space-y-3",
                      paymentMethod === 'paypal' ? "border-primary bg-emerald-50/30" : "border-gray-50 hover:border-gray-200"
                    )}
                  >
                    <img src="https://www.svgrepo.com/show/303247/paypal-logo.svg" className="h-6 w-auto" alt="PayPal" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">PayPal / Kort</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('stripe')}
                    className={cn(
                      "p-6 rounded-2xl border-2 transition-all flex flex-col items-center space-y-3",
                      paymentMethod === 'stripe' ? "border-primary bg-emerald-50/30" : "border-gray-50 hover:border-gray-200"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                       <CreditCard className="w-6 h-6 text-primary" />
                       <span className="font-black italic text-primary">Kort</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Direkte betaling</span>
                  </button>
                </div>

                <div className="pt-6 border-t border-gray-50">
                  {status === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold uppercase tracking-widest text-center flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 mr-2" /> {errorMsg}
                    </div>
                  )}

                  {paymentMethod === 'paypal' ? (
                    <div className="space-y-4">
                      <PayPalButtons
                        style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 55 }}
                        disabled={!bookingDetails.startDate || !bookingDetails.endDate || !bookingDetails.email}
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                        onCancel={onCancel}
                      />
                      {!bookingDetails.startDate && (
                        <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest text-center">Vennligst velg reisedatoer for å aktivere betaling</p>
                      )}
                    </div>
                  ) : (
                    <Elements stripe={stripePromise}>
                      <StripeForm 
                        amount={totalAmount} 
                        tripId={tripId} 
                        details={bookingDetails} 
                        onSuccess={(tx) => { setTransaction(tx); setStatus('success'); }} 
                        onError={(msg) => { setErrorMsg(msg); setStatus('error'); }}
                        disabled={!bookingDetails.startDate || !bookingDetails.endDate || !bookingDetails.email}
                      />
                    </Elements>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: Summary */}
            <aside className="lg:w-[40%]">
              <div className="sticky top-32 space-y-6">
                <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm p-1">
                  <div className="relative h-48 rounded-[2.5rem] overflow-hidden m-2">
                    <img 
                      src={trip?.trip_image || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"} 
                      className="w-full h-full object-cover" 
                      alt="" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent flex items-end p-8">
                      <div>
                        <p className="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{trip?.destination || 'Nepal'}</p>
                        <h3 className="text-white font-black text-xl uppercase tracking-tighter leading-tight">
                          {trip?.trip_title || trip?.destination || "Himalaya-reise"}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Varighet</p>
                        <div className="flex items-center space-x-2 text-primary font-bold text-sm">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span>{trip?.duration || '10'} Dager</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Reisende</p>
                        <div className="flex items-center space-x-2 text-primary font-bold text-sm">
                          <Users className="w-4 h-4 text-orange-500" />
                          <span>{trip?.group || 'Skreddersydd'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-gray-50 space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 font-medium italic">Grunnpris</span>
                        <span className="font-black text-primary">${totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 font-medium italic">Bestillingsgebyr</span>
                        <span className="font-bold text-emerald-500 uppercase">Gratis</span>
                      </div>
                      <div className="pt-4 border-t-2 border-dashed border-gray-100 flex items-center justify-between">
                        <span className="text-lg font-black text-primary uppercase tracking-tight italic">Totalt</span>
                        <span className="text-3xl font-black text-primary tracking-tighter">${totalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 space-y-3">
                      <div className="flex items-center space-x-3 text-primary">
                        <Shield className="w-5 h-5 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Nepalvibb-beskyttelse</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic">
                        Din betaling er beskyttet. Full refusjon ved avbestilling 30 dager før avreise.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}

function StripeForm({ amount, tripId, details, onSuccess, onError, disabled }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || disabled) return;

    setProcessing(true);
    try {
      const res = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, tripId, details }),
      });
      const { clientSecret } = await res.json();

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: `${details.firstName} ${details.lastName}`, email: details.email },
        },
      });

      if (error) {
        onError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tripId, paymentIntentId: paymentIntent.id }),
        });

        onSuccess({
          transactionId: paymentIntent.id,
          payerName: `${details.firstName} ${details.lastName}`,
          payerEmail: details.email,
          amount: amount,
          currency: 'USD',
          status: 'COMPLETED',
          tripId
        });
      }
    } catch (err) {
      onError("Tilkobling til Stripe mislyktes.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border-2 border-gray-100 rounded-2xl bg-gray-50/50">
        <CardElement options={{
          style: {
            base: { fontSize: '16px', color: '#1a3a3a', '::placeholder': { color: '#9ca3af' } },
          },
        }} />
      </div>
      <button
        type="submit"
        disabled={processing || !stripe || disabled}
        className={cn(
          "w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center space-x-3 shadow-xl",
          (processing || disabled) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-primary text-white hover:bg-emerald-900"
        )}
      >
        {processing ? (
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Shield className="w-4 h-4" />
            <span>Betal nå med kort</span>
          </>
        )}
      </button>
    </form>
  );
}

function SuccessScreen({ transaction }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white border-b border-gray-100 py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter italic text-primary">NEPALVIBB</Link>
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50/50">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full text-center space-y-10"
        >
          <div className="space-y-4">
            <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl rotate-12 mb-6">
               <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black text-primary uppercase tracking-tighter italic">Bestilling bekreftet!</h1>
            <p className="text-gray-500 font-medium italic">Takk, {transaction.payerName.split(' ')[0]}. Ditt eventyr starter nå! 🙏</p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl text-left grid grid-cols-2 gap-6">
            <div className="col-span-2 flex items-center justify-between border-b border-gray-50 pb-4">
               <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Transaksjonsinfo</span>
               <span className="text-[10px] font-black uppercase px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">Suksess</span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Transaksjons-ID</p>
              <p className="text-xs font-black text-primary">{transaction.transactionId?.slice(0, 15)}...</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Totalbetalt</p>
              <p className="text-xs font-black text-primary">{transaction.currency} {transaction.amount}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link 
              href={`/plan-your-trip/chat/${transaction.tripId}`} 
              className="flex-1 bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-emerald-900 transition-all flex items-center justify-center"
            >
              Melding til spesialist <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
            <Link 
              href="/dashboard" 
              className="flex-1 border-2 border-gray-100 text-primary py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-primary transition-all"
            >
              Min oversikt
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>}>
      <PaymentContent />
    </Suspense>
  );
}
