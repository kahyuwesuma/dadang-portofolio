'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/admin/Button';
import { getStatistik } from '@/lib/supabase';
import { deleteStatistik, updateStatistik } from '@/lib/admin-supabase';
import type { Statistik } from '@/lib/types';
import StatistikModal from '@/components/admin/StatistikModal';

export default function StatistikPage() {
  const [statistik, setStatistik] = useState<Statistik[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatistik, setSelectedStatistik] = useState<Statistik | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadStatistik();
  }, []);

  const loadStatistik = async () => {
    setLoading(true);
    const data = await getStatistik();
    setStatistik(data);
    setLoading(false);
  };

  const handleAdd = () => {
    setSelectedStatistik(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Statistik) => {
    setSelectedStatistik(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: Statistik) => {
    if (!confirm(`Hapus statistik "${item.label}"?`)) return;

    setIsDeleting(true);
    const result = await deleteStatistik(item.id);


    if (result.success) {
      alert('Statistik berhasil dihapus');
      loadStatistik();
    } else {
      alert(`Error: ${result.error}`);
    }
    setIsDeleting(false);
  };

  const handleModalClose = (shouldRefresh: boolean) => {
    setIsModalOpen(false);
    setSelectedStatistik(null);
    if (shouldRefresh) {
      loadStatistik();
    }
  };

  // TODO: Implement drag and drop reorder
  const handleReorder = (fromIndex: number, toIndex: number) => {
    // Implement reorder logic
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
          <h1 className="text-3xl font-bold text-white mb-2">Statistik</h1>
          <p className="text-zinc-400">Manage statistik untuk hero section</p>
        </div>
        <Button onClick={handleAdd} icon={Plus}>
          Tambah Statistik
        </Button>
      </div>

      {/* Cards */}
      <div className="grid gap-4">
        {statistik.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center gap-4">
              <button className="text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing">
                <GripVertical className="w-5 h-5" />
              </button>

              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-4xl font-bold text-white">{item.nilai}</span>
                  <span className="text-zinc-400 text-sm">Urutan: {item.urutan}</span>
                </div>
                <p className="text-white font-medium">{item.label}</p>
                {item.deskripsi && (
                  <p className="text-zinc-400 text-sm mt-1">{item.deskripsi}</p>
                )}
                {item.sub_deskripsi && (
                  <p className="text-zinc-500 text-xs mt-1">{item.sub_deskripsi}</p>
                )}
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

      {statistik.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          Belum ada statistik
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <StatistikModal
          statistik={selectedStatistik}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}