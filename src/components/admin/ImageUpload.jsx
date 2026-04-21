"use client";

import { useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ImageUpload({ value, onChange, label = "Upload Image" }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">{label}</label>
      
      {value ? (
        <div className="relative group w-full h-48 rounded-2xl overflow-hidden border-2 border-gray-100">
          <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <button 
              type="button"
              onClick={() => onChange('')}
              className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <input 
            type="file" 
            accept="image/*"
            onChange={handleUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={uploading}
          />
          <div className={cn(
            "w-full h-48 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center space-y-3 transition-all",
            uploading ? "bg-gray-50/50" : "hover:border-primary hover:bg-primary/5"
          )}>
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Uploading to server...</p>
              </>
            ) : (
              <>
                <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-white transition-colors">
                  <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Click or drag to upload</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
