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
      setMessage('Hero content saved successfully');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setStatus('error');
      setMessage('Failed to save hero content');
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
          
          // Max width 1920px for hero
          const MAX_WIDTH = 1920;
          if (width > MAX_WIDTH) {
            height = (MAX_WIDTH / width) * height;
            width = MAX_WIDTH;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to WebP (much lighter) with 0.8 quality
          resolve(canvas.toDataURL('image/webp', 0.8));
        };
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side check for 4MB
    if (file.size > 4 * 1024 * 1024) {
      setStatus('error');
      setMessage('File too large. Maximum size is 4MB.');
      setTimeout(() => setStatus('idle'), 4000);
      return;
    }

    setUploading(true);
    setStatus('idle');

    try {
      // Optimize image BEFORE sending to server
      const optimizedBase64 = await compressImage(file);
      
      // Since we already have the base64, we can update local state immediately
      // and just send it to the hero-content API when user clicks Save.
      // Or we can still use the upload API but send the compressed version.
      
      // Let's send the optimized version to the upload API
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64: optimizedBase64, type: 'image/webp' }),
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.error || 'Upload failed');
      }

      if (json.url) {
        setData(prev => ({ ...prev, image_url: json.url }));
        setStatus('success');
        setMessage('Image optimized & uploaded');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (err: any) {
      console.error('Upload failed', err);
      setStatus('error');
      setMessage(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        <p className="text-zinc-500 text-sm">Loading hero data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Hero Section Editor</h1>
        <p className="text-zinc-400">Manage the main photo and text on your landing page.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Hero Image</label>
            <div className="relative group aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900 border-2 border-dashed border-zinc-800 hover:border-zinc-700 transition-colors">
              {data.image_url ? (
                <>
                  <Image
                    src={data.image_url}
                    alt="Hero preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Change Photo
                      <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                  </div>
                </>
              ) : (
                <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-3">
                  <ImageIcon className="w-10 h-10 text-zinc-700" />
                  <span className="text-zinc-500 text-sm">Click to upload photo</span>
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
              )}
            </div>
            <p className="text-xs text-zinc-500">Recommended: High resolution landscape image (min 1920x1080).</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Full Name</label>
              <input
                type="text"
                value={data.title}
                onChange={e => setData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Dr. Dadang I K Mujiono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Subtitle / Role</label>
              <input
                type="text"
                value={data.subtitle}
                onChange={e => setData(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Academic | Conservationist"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Changes
            </button>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="sticky top-8 space-y-4">
            <label className="text-sm font-medium text-zinc-300">Live Preview</label>
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black shadow-2xl">
              {data.image_url && (
                <Image
                  src={data.image_url}
                  alt="Hero preview"
                  fill
                  className="object-cover opacity-60"
                />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <h2 className="text-white text-2xl font-serif mb-2">{data.title || 'Your Name'}</h2>
                <p className="text-white/70 text-[0.6rem] tracking-[0.2em] uppercase">{data.subtitle || 'Your Role'}</p>
              </div>
            </div>
            <p className="text-xs text-zinc-500 text-center italic">This is a simplified preview. Changes will be applied to the actual hero section after saving.</p>
          </div>
        </div>
      </div>

      {/* Modern Toast Notification - Fixed at bottom center for best visibility */}
      {status !== 'idle' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className={`
            flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border
            ${status === 'success' 
              ? 'bg-emerald-500/90 text-white border-emerald-400/20' 
              : 'bg-red-500/90 text-white border-red-400/20'}
          `}>
            {status === 'success' ? (
              <div className="bg-white/20 p-1 rounded-full">
                <Check className="w-5 h-5" />
              </div>
            ) : (
              <div className="bg-white/20 p-1 rounded-full">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}
            <span className="font-medium text-sm whitespace-nowrap">{message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
