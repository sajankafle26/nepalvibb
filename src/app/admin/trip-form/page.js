"use client";

import { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit3, Save, X, 
  ChevronUp, ChevronDown, Layout,
  CheckSquare, Type, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function AdminTripFormPage() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  
  const [formData, setFormData] = useState({
    step: 1,
    title: '',
    subtitle: '',
    type: 'selection',
    multiSelect: false,
    options: [],
    isActive: true
  });

  const fetchSteps = async () => {
    try {
      const res = await fetch('/api/trip-form');
      const data = await res.json();
      setSteps(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSteps();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = isEditing && isEditing !== 'new' ? 'PUT' : 'POST';
    const url = isEditing && isEditing !== 'new' ? `/api/admin/trip-form/${isEditing._id}` : '/api/trip-form';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsEditing(null);
        fetchSteps();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { label: '', value: '', icon: 'Mountain' }]
    });
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index][field] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const removeOption = (index) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index)
    });
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
          <h1 className="text-4xl font-black text-primary uppercase tracking-tighter italic">Form Builder</h1>
          <p className="text-gray-400 font-medium">Design the "Plan Your Trip" experience</p>
        </div>
        <button 
          onClick={() => {
            setIsEditing('new');
            setFormData({
              step: steps.length + 1,
              title: '', subtitle: '', type: 'selection',
              multiSelect: false, options: [], isActive: true
            });
          }}
          className="bg-primary text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-orange-500 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Step</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Steps List */}
        <div className="lg:col-span-1 space-y-6">
          {steps.map((step) => (
            <div 
              key={step._id} 
              className={cn(
                "p-8 rounded-[2.5rem] bg-white border-2 transition-all cursor-pointer group",
                isEditing?._id === step._id ? "border-primary shadow-2xl" : "border-gray-50 hover:border-primary/20 shadow-sm"
              )}
              onClick={() => {
                setIsEditing(step);
                setFormData(step);
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-[10px] font-black text-primary border border-gray-100">
                  {step.step}
                </span>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button className="p-2 text-gray-400 hover:text-primary"><Edit3 className="w-4 h-4" /></button>
                  <button className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <h3 className="text-lg font-black text-primary uppercase tracking-tight">{step.title}</h3>
              <div className="mt-4 flex items-center space-x-3">
                {step.type === 'selection' && <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />}
                {step.type === 'text' && <Type className="w-3.5 h-3.5 text-blue-500" />}
                {step.type === 'contact' && <UserCheck className="w-3.5 h-3.5 text-orange-500" />}
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{step.type}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div 
                key="editor"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-primary/5 border border-gray-50"
              >
                <form onSubmit={handleSave} className="space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Step Order</label>
                      <input 
                        type="number" 
                        value={formData.step}
                        onChange={e => setFormData({...formData, step: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Question Type</label>
                      <select 
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary"
                      >
                        <option value="selection">Selection (Cards)</option>
                        <option value="text">Detailed Text</option>
                        <option value="contact">Contact Details</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Question Title</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Where would you like to go?"
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {formData.type === 'selection' && (
                    <div className="space-y-8 pt-8 border-t border-gray-50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-primary uppercase tracking-tight">Answer Options</h3>
                        <div className="flex items-center space-x-6">
                           <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.multiSelect}
                              onChange={e => setFormData({...formData, multiSelect: e.target.checked})}
                              className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                            />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Allow Multiple</span>
                          </label>
                          <button 
                            type="button" 
                            onClick={addOption}
                            className="text-primary hover:text-orange-500 transition-all flex items-center space-x-2"
                          >
                            <Plus className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Add Option</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {formData.options.map((opt, i) => (
                          <div key={i} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-2xl group">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 flex-shrink-0">
                               <Layout className="w-4 h-4 text-gray-400" />
                            </div>
                            <input 
                              placeholder="Option Label"
                              value={opt.label}
                              onChange={e => updateOption(i, 'label', e.target.value)}
                              className="bg-transparent border-none text-sm font-bold focus:ring-0 flex-1"
                            />
                            <button 
                              type="button" 
                              onClick={() => removeOption(i)}
                              className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end space-x-6 pt-10 border-t border-gray-50">
                    <button type="button" onClick={() => setIsEditing(null)} className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">Cancel</button>
                    <button type="submit" className="bg-emerald-500 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>Save Step</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <div className="h-[400px] bg-gray-50 rounded-[3.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center space-y-4 text-gray-400">
                <Layout className="w-12 h-12 opacity-20" />
                <p className="text-xs font-black uppercase tracking-widest">Select a step to edit or add a new one</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
