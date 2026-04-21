"use client";

import { useState, useEffect } from 'react';
import { 
  Users, Map, Compass, TrendingUp, 
  MessageSquare, DollarSign, Calendar, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [data, setData] = useState({ tours: [], requests: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toursRes, requestsRes] = await Promise.all([
          fetch('/api/admin/trips'),
          fetch('/api/admin/requests')
        ]);
        const [tours, requests] = await Promise.all([
          toursRes.json(),
          requestsRes.json()
        ]);
        setData({ 
          tours: Array.isArray(tours) ? tours : [], 
          requests: Array.isArray(requests) ? requests : [] 
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Active Tours', value: data.tours.length, icon: Compass, trend: '+2 new', color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Trip Requests', value: data.requests.length, icon: MessageSquare, trend: '+8 today', color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Featured Tours', value: data.tours.filter(t => t.isFeatured).length, icon: TrendingUp, trend: '+12.5%', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Total Travelers', value: data.requests.length * 2, icon: Users, trend: '+5.2%', color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const recentRequests = data.requests.slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-black text-primary uppercase tracking-tighter">Velkommen tilbake, Admin!</h1>
        <p className="text-sm text-gray-400 font-medium">Here is what is happening with Nepalvibb today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black bg-gray-50 text-gray-400 px-3 py-1 rounded-full">{stat.trend}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Trip Requests */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-black text-primary uppercase tracking-tight">Recent Trip Requests</h2>
            </div>
            <Link href="/admin/requests" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center">
              View All <ArrowUpRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="py-10 text-center text-gray-400 text-xs animate-pulse">Loading recent inquiries...</div>
            ) : recentRequests.map((req) => (
              <div key={req._id} className="flex items-center justify-between p-5 rounded-2xl bg-gray-50/50 border border-gray-50 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center font-black text-primary text-xs uppercase">
                    {req.name ? req.name.split(' ').map(n => n[0]).join('') : 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-black text-primary uppercase tracking-tight">{req.name || 'Anonymous'}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{req.destination || 'Nepal'} • {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${req.status === 'active' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
           <div className="bg-primary rounded-[2.5rem] p-8 text-white space-y-6 shadow-xl shadow-primary/20">
            <h2 className="text-lg font-black uppercase tracking-tight">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/admin/trips/new" className="bg-white/10 hover:bg-white/20 px-6 py-4 rounded-2xl flex items-center space-x-3 transition-all">
                <Compass className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Create Tour</span>
              </Link>
              <Link href="/admin/destinations" className="bg-white/10 hover:bg-white/20 px-6 py-4 rounded-2xl flex items-center space-x-3 transition-all">
                <Map className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Add Destination</span>
              </Link>
              <button className="bg-white/10 hover:bg-white/20 px-6 py-4 rounded-2xl flex items-center space-x-3 transition-all text-left">
                <TrendingUp className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">View Reports</span>
              </button>
            </div>
          </div>

          <div className="bg-orange-50 rounded-[2.5rem] p-8 border border-orange-100">
            <h3 className="text-sm font-black text-orange-950 uppercase tracking-tight mb-2">System Status</h3>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">API Online</span>
            </div>
            <p className="text-[11px] text-orange-800 leading-relaxed font-medium">
              Your server is running smoothly. There are 3 new messages in the specialist chat waiting for a response.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
