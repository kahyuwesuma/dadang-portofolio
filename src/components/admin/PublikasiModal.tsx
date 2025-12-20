'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './TextArea';
import { Select } from './Select';
import { createPublikasi, updatePublikasi } from '@/lib/admin-supabase';
import type { Publikasi } from '@/lib/types';
import type { PublikasiFormData } from '@/lib/admin-types';

interface PublikasiModalProps {
  publikasi: Publikasi | null;
  onClose: (shouldRefresh: boolean) => void;
}

export default function PublikasiModal({ publikasi, onClose }: PublikasiModalProps) {
  const isEdit = !!publikasi;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PublikasiFormData>({
    judul: '',
    kategori: 'buku',
    penulis: '',
    tahun: new Date().getFullYear(),
    deskripsi: '',
    url: '',
    keywords: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (publikasi) {
      setFormData({
        judul: publikasi.judul,
        kategori: publikasi.kategori,
        penulis: publikasi.penulis,
        tahun: publikasi.tahun,
        deskripsi: publikasi.deskripsi || '',
        url: publikasi.url || '',
        keywords: publikasi.keywords || '',
        tags: publikasi.tags || [],
      });
    }
  }, [publikasi]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'tahun' ? parseInt(value) : value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const adminUserId = 'temp-admin-id'; 

    let result;
    if (isEdit && publikasi) {
      result = await updatePublikasi(publikasi.id, formData, adminUserId);
    } else {
      result = await createPublikasi(formData, adminUserId);
    }

    setLoading(false);

    if (result.success) {
      alert(`Publikasi berhasil ${isEdit ? 'diupdate' : 'ditambahkan'}`);
      onClose(true);
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? 'Edit Publikasi' : 'Tambah Publikasi'}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Judul"
            name="judul"
            value={formData.judul}
            onChange={handleChange}
            placeholder="Masukkan judul publikasi"
            required
          />

          <Select
            label="Kategori"
            name="kategori"
            value={formData.kategori}
            onChange={handleChange}
            options={[
              { value: 'buku', label: 'Buku' },
              { value: 'jurnal', label: 'Jurnal' },
              { value: 'op-ed', label: 'Op-ed' },
              { value: 'press', label: 'Press/News' },
            ]}
            required
          />

          <Input
            label="Penulis"
            name="penulis"
            value={formData.penulis}
            onChange={handleChange}
            placeholder="Nama penulis (pisahkan dengan koma)"
            required
            helperText="Contoh: Dr. Dadang, John Doe, Jane Smith"
          />

          <Input
            label="Tahun"
            name="tahun"
            type="number"
            value={formData.tahun}
            onChange={handleChange}
            required
          />

          <Textarea
            label="Deskripsi"
            name="deskripsi"
            value={formData.deskripsi || ''}
            onChange={handleChange}
            placeholder="Deskripsi singkat publikasi..."
            rows={4}
          />

          <Input
            label="URL"
            name="url"
            type="url"
            value={formData.url || ''}
            onChange={handleChange}
            placeholder="https://example.com/publikasi"
            helperText="Link ke publikasi atau artikel"
          />

          <Input
            label="Keywords"
            name="keywords"
            value={formData.keywords || ''}
            onChange={handleChange}
            placeholder="machine learning, AI, deep learning"
            helperText="Pisahkan dengan koma untuk search"
          />

          {/* Tags (untuk jurnal) */}
          {formData.kategori === 'jurnal' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">
                Tags (untuk jurnal)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Tambah tag..."
                  className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <Button type="button" onClick={handleAddTag} size="sm">
                  Add
                </Button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-zinc-800 text-white text-sm rounded-full flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-zinc-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <Button type="button" variant="ghost" onClick={() => onClose(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}