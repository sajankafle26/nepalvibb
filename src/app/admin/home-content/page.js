"use client";

import { useState, useEffect, useRef } from 'react';
import { Save, Layout, Info, Heart, Newspaper, Map, Activity, Compass, MessageSquare, Upload, Image as ImageIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminHomeContentPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/home-content')
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/home-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      if (res.ok) {
        setMessage('Home content updated successfully!');
      } else {
        const errData = await res.json();
        setMessage(`Error: ${errData.error || 'Updating content failed'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Error updating content.');
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileUpload = async (section, field, file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        updateSection(section, field, data.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  const sections = [
    { id: 'destinations', name: 'Destinations Section', icon: Map },
    { id: 'activities', name: 'Activities Section', icon: Activity },
    { id: 'whoWeAre', name: 'Who We Are Section', icon: Info, hasDescription: true, hasYears: true, images: ['image1', 'image2'] },
    { id: 'tours', name: 'Popular Tours Section', icon: Compass },
    { id: 'purpose', name: 'Purpose/CSR Section', icon: Heart, hasDescription: true, hasButton: true, images: ['image'] },
    { id: 'testimonials', name: 'Testimonials Section', icon: MessageSquare },
    { id: 'blog', name: 'Blog/News Section', icon: Newspaper },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-primary uppercase tracking-tighter italic">Home Page Content</h1>
          <p className="text-gray-400 font-medium">Manage all dynamic content and images</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-primary text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-orange-500 transition-all disabled:opacity-50"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {message && (
        <div className={`p-6 rounded-2xl text-sm font-bold uppercase tracking-widest ${message.includes('Error') ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {sections.map((section) => (
          <motion.div 
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gray-50 rounded-2xl text-primary">
                <section.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-primary uppercase tracking-tight italic">{section.name}</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Subtitle / Badge</label>
                <input 
                  type="text" 
                  value={content[section.id]?.subtitle || ''}
                  onChange={e => updateSection(section.id, 'subtitle', e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Main Title</label>
                <input 
                  type="text" 
                  value={content[section.id]?.title || ''}
                  onChange={e => updateSection(section.id, 'title', e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              {section.images?.map(imgField => (
                <div key={imgField} className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">
                    {imgField === 'image' ? 'Background Image' : imgField === 'image1' ? 'First Image' : 'Second Image'}
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-gray-50 p-4 rounded-3xl border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                      {content[section.id]?.[imgField] ? (
                        <img src={content[section.id][imgField]} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      <input 
                        type="text" 
                        value={content[section.id]?.[imgField] || ''}
                        onChange={e => updateSection(section.id, imgField, e.target.value)}
                        className="w-full bg-white border-none rounded-xl px-4 py-2 text-[10px] font-medium focus:ring-1 focus:ring-primary transition-all"
                        placeholder="Image URL"
                      />
                      <div className="flex gap-2">
                        <label className="flex-1 cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center transition-all">
                          <Upload className="w-3.5 h-3.5 mr-2" />
                          Upload Local
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={e => e.target.files?.[0] && handleFileUpload(section.id, imgField, e.target.files[0])}
                          />
                        </label>
                        {content[section.id]?.[imgField] && (
                          <button 
                            onClick={() => updateSection(section.id, imgField, '')}
                            className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {section.hasYears && (
                <div className="space-y-6 pt-4 border-t border-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Years of Experience (Number)</label>
                      <input 
                        type="text" 
                        value={content[section.id]?.yearsOfExperience || ''}
                        onChange={e => updateSection(section.id, 'yearsOfExperience', e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Experience Label (Text)</label>
                      <input 
                        type="text" 
                        value={content[section.id]?.yearsOfExperienceLabel || ''}
                        onChange={e => updateSection(section.id, 'yearsOfExperienceLabel', e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Feature Box 1</h4>
                      <input 
                        placeholder="Title"
                        value={content[section.id]?.feature1Title || ''}
                        onChange={e => updateSection(section.id, 'feature1Title', e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-primary"
                      />
                      <input 
                        placeholder="Description"
                        value={content[section.id]?.feature1Desc || ''}
                        onChange={e => updateSection(section.id, 'feature1Desc', e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Feature Box 2</h4>
                      <input 
                        placeholder="Title"
                        value={content[section.id]?.feature2Title || ''}
                        onChange={e => updateSection(section.id, 'feature2Title', e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-primary"
                      />
                      <input 
                        placeholder="Description"
                        value={content[section.id]?.feature2Desc || ''}
                        onChange={e => updateSection(section.id, 'feature2Desc', e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {section.hasDescription && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Description Text</label>
                  <textarea 
                    rows={4}
                    value={content[section.id]?.description || ''}
                    onChange={e => updateSection(section.id, 'description', e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary transition-all resize-none"
                  />
                </div>
              )}

              {section.hasButton && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Button Text</label>
                  <input 
                    type="text" 
                    value={content[section.id]?.buttonText || ''}
                    onChange={e => updateSection(section.id, 'buttonText', e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
