// src/app/admin/pengabdian/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/admin/Button';
import { getPengabdian } from '@/lib/supabase';
import { deletePengabdian } from '@/lib/admin-supabase';
import type { PengabdianMasyarakat } from '@/lib/types';
import PengabdianModal from '@/components/admin/PengabdianModal';

export default function PengabdianPage() {
  const [pengabdian, setPengabdian] = useState<PengabdianMasyarakat[]>([]);
  const [filteredPengabdian, setFilteredPengabdian] = useState<PengabdianMasyarakat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPengabdian, setSelectedPengabdian] = useState<PengabdianMasyarakat | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadPengabdian();
  }, []);

  useEffect(() => {
    filterPengabdian();
  }, [searchTerm, pengabdian]);

  const loadPengabdian = async () => {
    setLoading(true);
    const data = await getPengabdian();
    setPengabdian(data);
    setFilteredPengabdian(data);
    setLoading(false);
  };

  const filterPengabdian = () => {
    if (!searchTerm) {
      setFilteredPengabdian(pengabdian);
      return;
    }

    const filtered = pengabdian.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.judul.toLowerCase().includes(searchLower) ||
        item.lokasi.toLowerCase().includes(searchLower)
      );
    });

    setFilteredPengabdian(filtered);
  };

  const handleAdd = () => {
    setSelectedPengabdian(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: PengabdianMasyarakat) => {
    setSelectedPengabdian(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: PengabdianMasyarakat) => {
    if (!confirm(`Hapus pengabdian "${item.judul}"?`)) return;

    setIsDeleting(true);
    const adminUserId = 'temp-admin-id';
    const result = await deletePengabdian(item.id, adminUserId);

    if (result.success) {
      alert('Pengabdian berhasil dihapus');
      loadPengabdian();
    } else {
      alert(`Error: ${result.error}`);
    }
    setIsDeleting(false);
  };

  const handleModalClose = (shouldRefresh: boolean) => {
    setIsModalOpen(false);
    setSelectedPengabdian(null);
    if (shouldRefresh) {
      loadPengabdian();
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      selesai: 'bg-green-500/20 text-green-400',
      ongoing: 'bg-blue-500/20 text-blue-400',
      planned: 'bg-amber-500/20 text-amber-400',
    };
    return colors[status] || 'bg-zinc-500/20 text-zinc-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Pengabdian Masyarakat</h1>
          <p className="text-zinc-400">Manage kegiatan pengabdian masyarakat</p>
        </div>
        <Button onClick={handleAdd} icon={Plus}>
          Tambah Pengabdian
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Cari judul atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>
        <div className="text-sm text-zinc-400">
          {filteredPengabdian.length} kegiatan
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-4">
        {filteredPengabdian.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.judul}</h3>
                <p className="text-zinc-400 text-sm">{item.bulan_tahun}</p>
              </div>
              <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </div>

            <p className="text-zinc-300 text-sm mb-4 line-clamp-2">{item.deskripsi}</p>

            <div className="flex items-center justify-between">
              <div className="flex gap-4 text-sm text-zinc-400">
                <span>📍 {item.lokasi}</span>
                {item.jumlah_peserta && <span>👥 {item.jumlah_peserta}</span>}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" icon={Edit2} onClick={() => handleEdit(item)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => handleDelete(item)}
                  disabled={isDeleting}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPengabdian.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          {searchTerm ? 'Tidak ada pengabdian yang ditemukan' : 'Belum ada pengabdian'}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <PengabdianModal
          pengabdian={selectedPengabdian}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

// src/app/admin/statistik/page.tsx
