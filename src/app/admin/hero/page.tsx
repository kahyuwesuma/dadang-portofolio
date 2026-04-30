'use client';

import { useState, useEffect } from 'react';
import { Save, Upload, Loader2, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface HeroData {
  image_url: string;
  title: string;
  subtitle: string;
}

export default function HeroEditorPage() {
  const [data, setData] = useState<HeroData>({
    image_url: '',
    title: '',
    subtitle: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const res = await fetch('/api/hero-content');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to fetch hero data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus('idle');
    try {
      const res = await fetch('/api/hero-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setMessage('Profile photo updated successfully');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setStatus('error');
      setMessage('Failed to update photo');
    } finally {
      setSaving(false);
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new (window as any).Image();
        img.src = e.target?.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_WIDTH = 1920;
          if (width > MAX_WIDTH) {
            height = (MAX_WIDTH / width) * height;
            width = MAX_WIDTH;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/webp', 0.8));
        };
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setStatus('error');
      setMessage('File too large. Maximum size is 4MB.');
      setTimeout(() => setStatus('idle'), 4000);
      return;
    }

    setUploading(true);
    setStatus('idle');

    try {
      const optimizedBase64 = await compressImage(file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64: optimizedBase64, type: 'image/webp' }),
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');

      if (json.url) {
        setData(prev => ({ ...prev, image_url: json.url }));
        setStatus('success');
        setMessage('Image optimized & ready to save');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (err: any) {
      console.error('Upload failed', err);
      setStatus('error');
      setMessage(err.message || 'Failed to process image');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        <p className="text-zinc-500 text-sm font-medium">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto min-h-[calc(100vh-12rem)] flex flex-col justify-center py-4 px-4">
      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] lg:grid-cols-[1.2fr_0.8fr]">
          
          {/* Left Side: Large Portrait Preview */}
          <div className="relative p-6 md:p-10 flex items-center justify-center bg-black/20 border-b md:border-b-0 md:border-r border-zinc-800/50">
            <div className="relative w-full aspect-[4/5] max-h-[65vh] rounded-[2rem] overflow-hidden bg-zinc-950 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
              {data.image_url ? (
                <>
                  <Image
                    src={data.image_url}
                    alt="Profile Portrait"
                    fill
                    className="object-cover transition-all duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                    <label className="cursor-pointer bg-white text-black px-7 py-3.5 rounded-2xl font-bold flex items-center gap-3 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-zinc-200">
                      <Upload className="w-5 h-5" />
                      Replace Image
                      <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                  </div>
                </>
              ) : (
                <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-5 hover:bg-zinc-900 transition-all duration-300">
                  <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-inner">
                    <ImageIcon className="w-12 h-12 text-zinc-600" />
                  </div>
                  <div className="text-center">
                    <span className="text-white font-semibold text-lg block mb-1">Upload Portrait</span>
                    <span className="text-zinc-500 text-sm">Best result with 4:5 ratio</span>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              )}

              {uploading && (
                <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl flex flex-col items-center justify-center gap-4 z-30">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-xl bg-white/10 animate-pulse" />
                    <Loader2 className="w-12 h-12 animate-spin text-white relative z-10" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-white font-bold tracking-tight">AI Optimizing</p>
                    <p className="text-zinc-500 text-xs">Converting to WebP...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Controls & Info */}
          <div className="p-8 md:p-12 flex flex-col justify-center space-y-8">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Hero <span className="text-zinc-500">Portrait</span>
              </h1>
              <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed">
                Update the main visual on your portfolio. 
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-5 bg-zinc-950/50 border border-zinc-800/80 rounded-3xl flex gap-4 items-start shadow-inner">
                <div className="mt-1 bg-zinc-800/50 p-1.5 rounded-lg border border-zinc-700/50">
                  <AlertCircle className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-zinc-300">Tip</p>
                  <p className="text-xs text-zinc-500 leading-relaxed italic">
                    Choose a portrait shot with good lighting. The focal point should be slightly above the center.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving || uploading}
                  className="w-full flex items-center justify-center gap-3 bg-white text-black px-8 py-5 rounded-[1.25rem] font-black text-lg hover:bg-zinc-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] active:scale-[0.98]"
                >
                  {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Toast Notification */}
      {status !== 'idle' && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className={`
            flex items-center gap-3 px-8 py-4 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl border
            ${status === 'success' 
              ? 'bg-emerald-500/90 text-white border-emerald-400/30' 
              : 'bg-red-500/90 text-white border-red-400/30'}
          `}>
            <div className="bg-white/20 p-1.5 rounded-full">
              {status === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
            <span className="font-semibold text-sm tracking-wide">{message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
