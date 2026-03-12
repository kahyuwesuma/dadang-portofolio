'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, BookOpen, FileText, Newspaper, PenSquare, LayoutGrid, List, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/admin/Button';
import { getPublikasiWithTags } from '@/lib/supabase';
import type { Publikasi, PublikasiKategori } from '@/lib/types';
import PublikasiModal from '@/components/admin/PublikasiModal';

const CATEGORY_CONFIG: Record<PublikasiKategori, {
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  dot: string;
}> = {
  'Buku':             { label: 'Buku',             icon: BookOpen,      color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' },
  'Jurnal':           { label: 'Jurnal',            icon: FileText,      color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20',       dot: 'bg-blue-400'    },
  'Op-ed':            { label: 'Op-ed',             icon: PenSquare,     color: 'text-purple-400',  bg: 'bg-purple-500/10 border-purple-500/20',   dot: 'bg-purple-400'  },
  'Media Appearance': { label: 'Media Appearance',  icon: Newspaper,     color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20',     dot: 'bg-amber-400'   },
  'Theses':           { label: 'Theses',            icon: GraduationCap, color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/20',       dot: 'bg-rose-400'    },
};

const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG) as PublikasiKategori[];

export default function PublikasiPage() {
  const [publikasi, setPublikasi] = useState<Publikasi[]>([]);
  const [filteredPublikasi, setFilteredPublikasi] = useState<Publikasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<PublikasiKategori | 'Semua'>('Semua');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedPublikasi, setSelectedPublikasi] = useState<Publikasi | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { loadPublikasi(); }, []);

  useEffect(() => {
    let result = [...publikasi];
    if (activeFilter !== 'Semua') result = result.filter(p => p.kategori === activeFilter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.judul.toLowerCase().includes(q) ||
        p.penulis.toLowerCase().includes(q) ||
        p.kategori.toLowerCase().includes(q)
      );
    }
    setFilteredPublikasi(result);
  }, [searchTerm, activeFilter, publikasi]);

  const loadPublikasi = async () => {
    setLoading(true);
    const data = await getPublikasiWithTags();
    setPublikasi(data);
    setFilteredPublikasi(data);
    setLoading(false);
  };

  const handleAdd = () => { setSelectedPublikasi(null); setIsModalOpen(true); };
  const handleEdit = (pub: Publikasi) => { setSelectedPublikasi(pub); setIsModalOpen(true); };

  const handleDelete = (pub: Publikasi) => {
    toast.error(`Hapus "${pub.judul}"?`, {
      description: 'Tindakan ini tidak dapat dibatalkan.',
      action: { label: 'Hapus', onClick: () => performDelete(pub) },
      cancel: { label: 'Batal', onClick: () => toast.info('Dibatalkan') },
      duration: 5000,
    });
  };

  const performDelete = async (pub: Publikasi) => {
    setIsDeleting(true);
    const loadingToast = toast.loading('Menghapus...');
    try {
      const res = await fetch(`/api/publikasi/${pub.id}`, { method: 'DELETE' });
      const result = await res.json();
      toast.dismiss(loadingToast);
      if (res.ok) {
        toast.success('Berhasil dihapus!');
        loadPublikasi();
      } else {
        toast.error('Gagal menghapus', { description: result.error });
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error('Terjadi kesalahan koneksi');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalClose = (shouldRefresh: boolean) => {
    setIsModalOpen(false);
    setSelectedPublikasi(null);
    if (shouldRefresh) loadPublikasi();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Memuat publikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Publikasi</h1>
          <p className="text-zinc-500 text-sm mt-0.5">{publikasi.length} total karya akademik</p>
        </div>
        <Button onClick={handleAdd} icon={Plus}>Tambah Publikasi</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {ALL_CATEGORIES.map((cat) => {
          const cfg = CATEGORY_CONFIG[cat];
          const Icon = cfg.icon;
          const count = publikasi.filter(p => p.kategori === cat).length;
          const isActive = activeFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(isActive ? 'Semua' : cat)}
              className={`relative p-4 rounded-xl border transition-all text-left ${
                isActive
                  ? `${cfg.bg}`
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded-lg ${isActive ? cfg.bg : 'bg-zinc-800'}`}>
                  <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                </div>
                <span className={`text-xl font-bold ${isActive ? cfg.color : 'text-white'}`}>
                  {count}
                </span>
              </div>
              <p className="text-zinc-400 text-[11px] font-medium truncate">{cfg.label}</p>
              {isActive && (
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl ${cfg.dot}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Search + Filter + View toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari judul, penulis, atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-lg leading-none">×</button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1 flex-wrap">
          <button
            onClick={() => setActiveFilter('Semua')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeFilter === 'Semua' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Semua
          </button>
          {ALL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(activeFilter === cat ? 'Semua' : cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeFilter === cat ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {CATEGORY_CONFIG[cat].label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
          <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white'}`}>
            <List className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white'}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        <span className="text-zinc-600 text-sm shrink-0">{filteredPublikasi.length} hasil</span>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Publikasi</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Kategori</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Penulis</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Tahun</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredPublikasi.map((pub) => {
                  const cfg = CATEGORY_CONFIG[pub.kategori];
                  const Icon = cfg?.icon ?? BookOpen;
                  return (
                    <tr key={pub.id} className="group hover:bg-zinc-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3 max-w-lg">
                          <div className={`mt-0.5 p-1.5 rounded-md shrink-0 ${cfg?.bg ?? 'bg-zinc-800'}`}>
                            <Icon className={`w-3.5 h-3.5 ${cfg?.color ?? 'text-zinc-400'}`} />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium line-clamp-2 leading-snug">{pub.judul}</p>
                            {pub.tags && pub.tags.length > 0 && (
                              <div className="flex gap-1 mt-1.5 flex-wrap">
                                {pub.tags.slice(0, 4).map((tag, idx) => (
                                  <span key={idx} className="px-1.5 py-0.5 bg-zinc-800 text-zinc-500 text-[10px] rounded">{tag}</span>
                                ))}
                                {pub.tags.length > 4 && (
                                  <span className="text-zinc-600 text-[10px] py-0.5">+{pub.tags.length - 4}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg?.bg ?? ''} ${cfg?.color ?? ''}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg?.dot ?? 'bg-zinc-400'}`} />
                          {cfg?.label ?? pub.kategori}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-zinc-300 text-sm">{pub.penulis}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-md font-mono">{pub.tahun}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(pub)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-md transition-colors">
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button onClick={() => handleDelete(pub)} disabled={isDeleting} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredPublikasi.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-5 h-5 text-zinc-600" />
              </div>
              <p className="text-zinc-500 text-sm">{searchTerm ? `Tidak ada hasil untuk "${searchTerm}"` : 'Belum ada publikasi'}</p>
              {searchTerm && <button onClick={() => setSearchTerm('')} className="mt-2 text-xs text-zinc-600 hover:text-zinc-400 underline">Hapus pencarian</button>}
            </div>
          )}
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPublikasi.map((pub) => {
            const cfg = CATEGORY_CONFIG[pub.kategori];
            const Icon = cfg?.icon ?? BookOpen;
            return (
              <div key={pub.id} className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 transition-all flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg?.bg ?? ''} ${cfg?.color ?? ''}`}>
                    <Icon className="w-3 h-3" />
                    {cfg?.label ?? pub.kategori}
                  </span>
                  <span className="text-zinc-600 text-xs font-mono shrink-0">{pub.tahun}</span>
                </div>
                <p className="text-white text-sm font-medium leading-snug line-clamp-3 flex-1">{pub.judul}</p>
                <p className="text-zinc-500 text-xs">{pub.penulis}</p>
                {pub.tags && pub.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {pub.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-zinc-800 text-zinc-500 text-[10px] rounded">{tag}</span>
                    ))}
                    {pub.tags.length > 3 && <span className="text-zinc-600 text-[10px] py-0.5">+{pub.tags.length - 3}</span>}
                  </div>
                )}
                <div className="flex items-center gap-2 pt-1 border-t border-zinc-800">
                  <button onClick={() => handleEdit(pub)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(pub)} disabled={isDeleting} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                </div>
              </div>
            );
          })}
          {filteredPublikasi.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-5 h-5 text-zinc-600" />
              </div>
              <p className="text-zinc-500 text-sm">{searchTerm ? `Tidak ada hasil untuk "${searchTerm}"` : 'Belum ada publikasi'}</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <PublikasiModal publikasi={selectedPublikasi} onClose={handleModalClose} />
      )}
    </div>
  );
}