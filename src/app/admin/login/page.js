"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="text-4xl font-black tracking-tighter inline-block">
            <span className="text-primary">NEPAL</span><span className="text-orange-500">VIBB</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Admin Console Secure Login</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@nepalvibb.com"
                  className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500 text-center bg-red-50 py-3 rounded-xl">{error}</p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-xl hover:bg-emerald-900 flex items-center justify-center space-x-3 group"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Secure encryption enabled. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
