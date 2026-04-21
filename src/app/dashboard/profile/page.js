"use client";

import { useSession } from "next-auth/react";
import { 
  User, Mail, Calendar, 
  Settings, Shield, LogOut,
  Compass, Heart, Globe
} from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black text-primary uppercase tracking-tighter">Your Profile</h1>
        <p className="text-gray-400 font-medium mt-1">Manage your personal information and account settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
              <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center border-4 border-white shadow-xl relative">
                {session?.user?.image ? (
                  <img src={session.user.image} className="w-full h-full rounded-3xl object-cover" alt="" />
                ) : (
                  <User className="w-10 h-10 text-emerald-500" />
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg">
                  <Settings className="w-4 h-4" />
                </div>
              </div>
              <div className="text-center sm:text-left pt-2">
                <h2 className="text-2xl font-black text-primary uppercase tracking-tight">{session?.user?.name || 'Nepalvibb Traveler'}</h2>
                <p className="text-gray-400 font-medium flex items-center justify-center sm:justify-start mt-1">
                  <Mail className="w-4 h-4 mr-2" /> {session?.user?.email}
                </p>
                <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
                  <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">Explorer</span>
                  <span className="px-4 py-1.5 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-full">Himalaya Pro</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-50">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                <input 
                  type="text" 
                  disabled
                  value={session?.user?.name || ''}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-primary cursor-not-allowed" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                <input 
                  type="email" 
                  disabled
                  value={session?.user?.email || ''}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-primary cursor-not-allowed" 
                />
              </div>
            </div>

            <div className="pt-6">
              <button className="bg-primary text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-emerald-900 transition-all opacity-50 cursor-not-allowed">
                Update Profile
              </button>
              <p className="text-[10px] text-gray-400 font-medium mt-4 italic">* Redigering av profil er for øyeblikket deaktivert under testing.</p>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-primary uppercase tracking-tight flex items-center">
              <Shield className="w-5 h-5 mr-3 text-emerald-500" /> Security & Privacy
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Public Profile</span>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                   <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Two-Factor Auth</span>
                </div>
                <div className="w-12 h-6 bg-primary/20 rounded-full relative">
                   <div className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-primary text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <Compass className="absolute -bottom-10 -right-10 w-40 h-40 text-white/10 rotate-12" />
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">Travel Status</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Trips Taken</span>
                <span className="text-2xl font-black">0</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Miles Covered</span>
                <span className="text-2xl font-black">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Wishlist</span>
                <span className="text-2xl font-black">12</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-primary uppercase tracking-tight">Achievements</h3>
            <div className="flex flex-wrap gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600" title="First Trip Planned">
                <Compass className="w-6 h-6" />
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600" title="Account Verified">
                <Shield className="w-6 h-6" />
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600" title="Profile 100%">
                <Heart className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
