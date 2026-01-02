'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import type { Publikasi } from '@/lib/types';

interface PublikasiModalProps {
  publikasi: Publikasi | null;
  onClose: (shouldRefresh: boolean) => void;
}

export default function PublikasiModal({ publikasi, onClose }: PublikasiModalProps) {
  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'Buku',
    penulis: '',
    tahun: new Date().getFullYear(),
    url: '',
    deskripsi: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when modal opens
  useEffect(() => {
    if (publikasi) {
      setFormData({
        judul: publikasi.judul || '',
        kategori: publikasi.kategori || 'Buku',
        penulis: publikasi.penulis || '',
        tahun: publikasi.tahun || new Date().getFullYear(),
        url: publikasi.url || '',
        deskripsi: publikasi.deskripsi || '',
        tags: publikasi.tags || [],
      });
    }
  }, [publikasi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.judul.trim() || !formData.penulis.trim()) {
      toast.error('Data tidak lengkap', {
        description: 'Judul dan penulis wajib diisi.',
      });
      return;
    }

    setIsSubmitting(true);

    // Show loading toast
    const loadingToast = toast.loading(
      publikasi ? 'Memperbarui publikasi...' : 'Menambahkan publikasi...'
    );

    try {
      const method = publikasi ? 'PUT' : 'POST';
      const url = publikasi ? `/api/publikasi/${publikasi.id}` : '/api/publikasi';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (res.ok) {
        toast.success(
          publikasi ? 'Publikasi berhasil diperbarui!' : 'Publikasi berhasil ditambahkan!',
          {
            description: `"${formData.judul}" telah ${publikasi ? 'diperbarui' : 'ditambahkan'}.`,
            duration: 4000,
          }
        );
        onClose(true); // Refresh data
      } else {
        toast.error('Terjadi kesalahan', {
          description: result.error || 'Tidak dapat menyimpan publikasi.',
          duration: 5000,
        });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Gagal terhubung ke server', {
        description: 'Periksa koneksi internet Anda dan coba lagi.',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose(false);
        }
      }}
    >
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {publikasi ? 'Edit Publikasi' : 'Tambah Publikasi'}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="text-zinc-400 hover:text-white transition-colors"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* Judul */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Judul <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Masukkan judul publikasi"
                required
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Kategori <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                required
              >
                <option value="Buku">Buku</option>
                <option value="Jurnal">Jurnal</option>
                <option value="Op-ed">Op-ed</option>
                <option value="Press/News">Press/News</option>
              </select>
            </div>

            {/* Penulis */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Penulis <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.penulis}
                onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Nama penulis"
                required
              />
            </div>

            {/* Tahun & URL */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Tahun
                </label>
                <input
                  type="number"
                  value={formData.tahun}
                  onChange={(e) => setFormData({ ...formData, tahun: parseInt(e.target.value) || new Date().getFullYear() })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Deskripsi
              </label>
              <textarea
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 min-h-[100px] resize-y"
                placeholder="Deskripsi singkat publikasi"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Tags (Kata Kunci)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="Tambah tag (tekan Enter)"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded-lg transition-colors"
                >
                  Tambah
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {formData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded-full flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 px-6 py-4 flex gap-3">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-white hover:bg-zinc-200 text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : publikasi ? 'Perbarui' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}