'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
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
        keywords: '',
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
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
      ];
      const bulanTahun = `${months[date.getMonth()]} ${date.getFullYear()}`;
      setFormData((prev) => ({ ...prev, bulan_tahun: bulanTahun }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.judul.trim() || !formData.lokasi.trim() || !formData.deskripsi.trim()) {
      toast.error('Data tidak lengkap', {
        description: 'Judul, lokasi, dan deskripsi wajib diisi.',
      });
      return;
    }

    setLoading(true);

    // Show loading toast
    const loadingToast = toast.loading(
      isEdit ? 'Memperbarui pengabdian...' : 'Menambahkan pengabdian...'
    );

    try {
      let result;
      if (isEdit && pengabdian) {
        result = await updatePengabdian(pengabdian.id, formData);
      } else {
        result = await createPengabdian(formData);
      }

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(
          isEdit ? 'Pengabdian berhasil diperbarui!' : 'Pengabdian berhasil ditambahkan!',
          {
            description: `"${formData.judul}" telah ${isEdit ? 'diperbarui' : 'ditambahkan'}.`,
            duration: 4000,
          }
        );
        onClose(true);
      } else {
        toast.error('Terjadi kesalahan', {
          description: result.error || 'Tidak dapat menyimpan pengabdian.',
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
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose(false);
        }
      }}
    >
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? 'Edit Pengabdian' : 'Tambah Pengabdian'}
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
            <Input
              label="Judul"
              name="judul"
              value={formData.judul}
              onChange={handleChange}
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
              rows={4}
              required
            />

            <Input
              label="Lokasi"
              name="lokasi"
              value={formData.lokasi}
              onChange={handleChange}
              required
            />

            <Input
              label="Jumlah Peserta"
              name="jumlah_peserta"
              value={formData.jumlah_peserta ?? ''}
              onChange={handleChange}
              helperText="Optional"
            />
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 px-6 py-4 flex gap-3">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-white hover:bg-zinc-200 text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}