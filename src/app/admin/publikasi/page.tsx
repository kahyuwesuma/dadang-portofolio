'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { getPublikasiWithTags } from '@/lib/supabase';
import { deletePublikasi } from '@/lib/admin-supabase';
import type { Publikasi } from '@/lib/types';
import PublikasiModal from '@/components/admin/PublikasiModal';

export default function PublikasiPage() {
  const [publikasi, setPublikasi] = useState<Publikasi[]>([]);
  const [filteredPublikasi, setFilteredPublikasi] = useState<Publikasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPublikasi, setSelectedPublikasi] = useState<Publikasi | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadPublikasi();
  }, []);

  useEffect(() => {
    filterPublikasi();
  }, [searchTerm, publikasi]);

  const loadPublikasi = async () => {
    setLoading(true);
    const data = await getPublikasiWithTags();
    setPublikasi(data);
    setFilteredPublikasi(data);
    setLoading(false);
  };

  const filterPublikasi = () => {
    if (!searchTerm) {
      setFilteredPublikasi(publikasi);
      return;
    }

    const filtered = publikasi.filter((pub) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        pub.judul.toLowerCase().includes(searchLower) ||
        pub.penulis.toLowerCase().includes(searchLower) ||
        pub.kategori.toLowerCase().includes(searchLower)
      );
    });

    setFilteredPublikasi(filtered);
  };

  const handleAdd = () => {
    setSelectedPublikasi(null);
    setIsModalOpen(true);
  };

  const handleEdit = (pub: Publikasi) => {
    setSelectedPublikasi(pub);
    setIsModalOpen(true);
  };

  const handleDelete = (pub: Publikasi) => {
    // Gunakan toast dengan action button untuk konfirmasi
    toast.error(`Hapus publikasi "${pub.judul}"?`, {
      description: 'Tindakan ini tidak dapat dibatalkan.',
      action: {
        label: 'Hapus',
        onClick: () => performDelete(pub),
      },
      cancel: {
        label: 'Batal',
        onClick: () => {
          toast.info('Penghapusan dibatalkan');
        },
      },
      duration: 5000,
    });
  };

  const performDelete = async (pub: Publikasi) => {
    setIsDeleting(true);

    // Show loading toast
    const loadingToast = toast.loading('Menghapus publikasi...');

    try {
      const res = await fetch(`/api/publikasi/${pub.id}`, {
        method: 'DELETE',
      });

      const result = await res.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (res.ok) {
        toast.success('Publikasi berhasil dihapus!', {
          description: `"${pub.judul}" telah dihapus dari database.`,
        });
        loadPublikasi();
      } else {
        toast.error('Gagal menghapus publikasi', {
          description: result.error || 'Terjadi kesalahan saat menghapus publikasi.',
        });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Terjadi kesalahan', {
        description: 'Tidak dapat terhubung ke server. Silakan coba lagi.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalClose = (shouldRefresh: boolean) => {
    setIsModalOpen(false);
    setSelectedPublikasi(null);
    if (shouldRefresh) {
      loadPublikasi();
    }
  };

  const getCategoryColor = (kategori: string) => {
    const colors: Record<string, string> = {
      buku: 'bg-emerald-500/20 text-emerald-400',
      jurnal: 'bg-blue-500/20 text-blue-400',
      'op-ed': 'bg-purple-500/20 text-purple-400',
      press: 'bg-amber-500/20 text-amber-400',
    };
    return colors[kategori] || 'bg-zinc-500/20 text-zinc-400';
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
          <h1 className="text-3xl font-bold text-white mb-2">Publikasi</h1>
          <p className="text-zinc-400">Manage publikasi (buku, jurnal, op-ed, press)</p>
        </div>
        <Button onClick={handleAdd} icon={Plus}>
          Tambah Publikasi
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Cari judul, penulis, atau kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>
        <div className="text-sm text-zinc-400">
          {filteredPublikasi.length} publikasi
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-800/50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-zinc-300">
                  Judul
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-zinc-300">
                  Kategori
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-zinc-300">
                  Penulis
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-zinc-300">
                  Tahun
                </th>
                <th className="text-right px-6 py-3 text-sm font-medium text-zinc-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredPublikasi.map((pub) => (
                <tr key={pub.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <p className="text-white font-medium line-clamp-2">{pub.judul}</p>
                      {pub.tags && pub.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {pub.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(
                        pub.kategori
                      )}`}
                    >
                      {pub.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-zinc-300 text-sm">{pub.penulis}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-zinc-300 text-sm">{pub.tahun}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit2}
                        onClick={() => handleEdit(pub)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(pub)}
                        disabled={isDeleting}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPublikasi.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            {searchTerm ? 'Tidak ada publikasi yang ditemukan' : 'Belum ada publikasi'}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <PublikasiModal
          publikasi={selectedPublikasi}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}