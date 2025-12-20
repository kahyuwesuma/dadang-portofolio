'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { createStatistik, updateStatistik } from '@/lib/admin-supabase';
import type { Statistik } from '@/lib/types';
import type { StatistikFormData } from '@/lib/admin-types';

interface StatistikModalProps {
  statistik: Statistik | null;
  onClose: (shouldRefresh: boolean) => void;
}

export default function StatistikModal({ statistik, onClose }: StatistikModalProps) {
  const isEdit = !!statistik;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<StatistikFormData>({
    label: '',
    nilai: '',
    deskripsi: '',
    sub_deskripsi: '',
    urutan: 1,
  });

  useEffect(() => {
    if (statistik) {
      setFormData({
        label: statistik.label,
        nilai: statistik.nilai,
        deskripsi: statistik.deskripsi || '',
        sub_deskripsi: statistik.sub_deskripsi || '',
        urutan: statistik.urutan,
      });
    }
  }, [statistik]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'urutan' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const adminUserId = 'temp-admin-id'; // TODO: Get from auth session

    let result;
    if (isEdit && statistik) {
      result = await updateStatistik(statistik.id, formData, adminUserId);
    } else {
      result = await createStatistik(formData, adminUserId);
    }

    setLoading(false);

    if (result.success) {
      alert(`Statistik berhasil ${isEdit ? 'diupdate' : 'ditambahkan'}`);
      onClose(true);
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-lg">
        {/* Header */}
        <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? 'Edit Statistik' : 'Tambah Statistik'}
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
            label="Label"
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="Total Publikasi"
            required
          />

          <Input
            label="Nilai"
            name="nilai"
            value={formData.nilai}
            onChange={handleChange}
            placeholder="32 atau 20+"
            required
            helperText="Bisa berupa angka atau text"
          />

          <Input
            label="Deskripsi"
            name="deskripsi"
            value={formData.deskripsi || ''}
            onChange={handleChange}
            placeholder="Semua Kategori"
            helperText="Optional - keterangan singkat"
          />

          <Input
            label="Sub Deskripsi"
            name="sub_deskripsi"
            value={formData.sub_deskripsi || ''}
            onChange={handleChange}
            placeholder="Nasional & Internasional"
            helperText="Optional - keterangan tambahan"
          />

          <Input
            label="Urutan"
            name="urutan"
            type="number"
            value={formData.urutan}
            onChange={handleChange}
            required
            helperText="Urutan tampilan di hero section (1, 2, 3, ...)"
          />

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