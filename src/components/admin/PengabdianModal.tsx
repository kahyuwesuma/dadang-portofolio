'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './TextArea';
import { Select } from './Select';
import { createPengabdian, updatePengabdian } from '@/lib/admin-supabase';
import type { PengabdianMasyarakat } from '@/lib/types';
import type { PengabdianFormData } from '@/lib/admin-types';

interface PengabdianModalProps {
  pengabdian: PengabdianMasyarakat | null;
  onClose: (shouldRefresh: boolean) => void;
}

export default function PengabdianModal({ pengabdian, onClose }: PengabdianModalProps) {
  const isEdit = !!pengabdian;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PengabdianFormData>({
    judul: '',
    tanggal: new Date().toISOString().split('T')[0],
    bulan_tahun: '',
    status: 'planned',
    deskripsi: '',
    lokasi: '',
    jumlah_peserta: '',
    keywords: '',
  });

  useEffect(() => {
    if (pengabdian) {
      setFormData({
        judul: pengabdian.judul,
        tanggal: pengabdian.tanggal,
        bulan_tahun: pengabdian.bulan_tahun,
        status: pengabdian.status,
        deskripsi: pengabdian.deskripsi,
        lokasi: pengabdian.lokasi,
        jumlah_peserta: pengabdian.jumlah_peserta || '',
        keywords: pengabdian.keywords || '',
      });
    }
  }, [pengabdian]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'tanggal') {
      const date = new Date(value);
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const bulanTahun = `${months[date.getMonth()]} ${date.getFullYear()}`;
      setFormData((prev) => ({ ...prev, bulan_tahun: bulanTahun }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const adminUserId = 'temp-admin-id'; 

    let result;
    if (isEdit && pengabdian) {
      result = await updatePengabdian(pengabdian.id, formData, adminUserId);
    } else {
      result = await createPengabdian(formData, adminUserId);
    }

    setLoading(false);

    if (result.success) {
      alert(`Pengabdian berhasil ${isEdit ? 'diupdate' : 'ditambahkan'}`);
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
            {isEdit ? 'Edit Pengabdian' : 'Tambah Pengabdian'}
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
            placeholder="Masukkan judul kegiatan"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tanggal"
              name="tanggal"
              type="date"
              value={formData.tanggal}
              onChange={handleChange}
              required
            />

            <Input
              label="Bulan & Tahun"
              name="bulan_tahun"
              value={formData.bulan_tahun}
              onChange={handleChange}
              placeholder="Desember 2024"
              required
              helperText="Auto-generated dari tanggal"
            />
          </div>

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'planned', label: 'Direncanakan' },
              { value: 'ongoing', label: 'Sedang Berjalan' },
              { value: 'selesai', label: 'Selesai' },
            ]}
            required
          />

          <Textarea
            label="Deskripsi"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            placeholder="Deskripsi kegiatan pengabdian..."
            rows={4}
            required
          />

          <Input
            label="Lokasi"
            name="lokasi"
            value={formData.lokasi}
            onChange={handleChange}
            placeholder="Depok, Jawa Barat"
            required
          />

          <Input
            label="Jumlah Peserta"
            name="jumlah_peserta"
            value={formData.jumlah_peserta ?? ''}
            onChange={handleChange}
            placeholder="50 peserta atau 200+ peserta"
            helperText="Optional"
          />

          <Input
            label="Keywords"
            name="keywords"
            value={formData.jumlah_peserta ?? ''}
            onChange={handleChange}
            placeholder="digital marketing, umkm, training"
            helperText="Pisahkan dengan koma untuk search"
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
