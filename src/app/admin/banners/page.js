"use client";

import { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit3, Image as ImageIcon, 
  ExternalLink, Eye, EyeOff, GripVertical, Save 
} from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import { cn } from '@/lib/utils';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    highlightText: '',
    badgeText: '',
    image: '',
    buttonText: 'TA EN TUR',
    buttonLink: '/trips',
    videoLink: '',
    order: 0,
    isActive: true
  });

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners');
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/banners/${isEditing._id}` : '/api/banners';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsEditing(null);
        setFormData({
          title: '', subtitle: '', highlightText: '', badgeText: '',
          image: '', buttonText: 'TA EN TUR', buttonLink: '/trips',
          videoLink: '', order: banners.length, isActive: true
        });
        fetchBanners();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBanner = async (id) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleActive = async (banner) => {
    try {
      await fetch(`/api/banners/${banner._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...banner, isActive: !banner.isActive })
      });
      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-primary uppercase tracking-tighter italic">Homepage Slider</h1>
          <p className="text-gray-400 font-medium">Manage your high-impact hero banners</p>
        </div>
        <button 
          onClick={() => {
            setIsEditing('new');
            setFormData({
              title: '', subtitle: '', highlightText: '', badgeText: '',
              image: '', buttonText: 'TA EN TUR', buttonLink: '/trips',
              videoLink: '', order: banners.length, isActive: true
            });
          }}
          className="flex items-center space-x-2 bg-primary text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-orange-500 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Slide</span>
        </button>
      </div>

      {isEditing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[3rem] border-2 border-primary/10 shadow-2xl shadow-primary/5"
        >
          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 md:col-span-2">
                <ImageUpload 
                  value={formData.image} 
                  onChange={url => setFormData({...formData, image: url})} 
                  label="Banner Image" 
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Badge Text</label>
                <input 
                  type="text" 
                  value={formData.badgeText}
                  onChange={e => setFormData({...formData, badgeText: e.target.value})}
                  placeholder="e.g. Discover the magic"
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Title (Top Line)</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Highlighted (Stroke)</label>
                <input 
                  type="text" 
                  value={formData.highlightText}
                  onChange={e => setFormData({...formData, highlightText: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Subtitle (Bottom Line)</label>
                <input 
                  type="text" 
                  value={formData.subtitle}
                  onChange={e => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Button Text</label>
                <input 
                  type="text" 
                  value={formData.buttonText}
                  onChange={e => setFormData({...formData, buttonText: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Button Link</label>
                <input 
                  type="text" 
                  value={formData.buttonLink}
                  onChange={e => setFormData({...formData, buttonLink: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Video URL (Optional)</label>
                <input 
                  type="text" 
                  value={formData.videoLink}
                  onChange={e => setFormData({...formData, videoLink: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-6 pt-6">
              <button 
                type="button" 
                onClick={() => setIsEditing(null)}
                className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex items-center space-x-2 bg-emerald-500 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Banner</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {banners.map((banner) => (
          <div key={banner._id} className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm flex items-center gap-8 group">
            <div className="w-48 h-28 rounded-2xl overflow-hidden flex-shrink-0 relative">
              <img src={banner.image} className="w-full h-full object-cover" alt="" />
              {!banner.isActive && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                  <EyeOff className="w-5 h-5 text-white/60" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-1">{banner.badgeText}</p>
              <h3 className="text-lg font-black text-primary uppercase tracking-tight">{banner.title} {banner.highlightText} {banner.subtitle}</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">{banner.buttonText} → {banner.buttonLink}</p>
            </div>

            <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => toggleActive(banner)}
                className={cn(
                  "p-3 rounded-xl transition-all",
                  banner.isActive ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white" : "bg-gray-50 text-gray-400 hover:bg-primary hover:text-white"
                )}
              >
                {banner.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => {
                  setIsEditing(banner);
                  setFormData(banner);
                }}
                className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
              >
                <Edit3 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => deleteBanner(banner._id)}
                className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
