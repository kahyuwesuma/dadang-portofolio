'use client';

import React, { useState, useMemo } from 'react';
import SearchBox from '@/components/ui/SearchBox';
import PengabdianCard from '@/components/cards/PengabdianCard';
import type { PengabdianMasyarakat } from '@/lib/types';

interface PengabdianSectionProps {
  pengabdian: PengabdianMasyarakat[];
}

export default function PengabdianSection({ pengabdian }: PengabdianSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPengabdian = useMemo(() => {
    return pengabdian.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === '' ||
        item.judul.toLowerCase().includes(searchLower) ||
        item.keywords?.toLowerCase().includes(searchLower);

      return matchesSearch;
    });
  }, [pengabdian, searchTerm]);

  return (
    <section id="pengabdian" className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Pengabdian Masyarakat</h2>
          <p className="text-zinc-400 text-lg">
            Kegiatan pengabdian kepada masyarakat dan transfer pengetahuan
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchBox
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Cari kegiatan pengabdian..."
          />
          <div className="text-sm text-zinc-500 mt-4">
            Menampilkan <span id="pengabdianCount">{filteredPengabdian.length}</span> kegiatan
          </div>
        </div>
        
        {/* Pengabdian List */}
        <div className="space-y-6" id="pengabdianList">
          {filteredPengabdian.length > 0 ? (
            filteredPengabdian.map((item) => (
              <PengabdianCard key={item.id} pengabdian={item} />
            ))
          ) : (
            <div className="text-center py-12 text-zinc-500">
              <p>Tidak ada kegiatan pengabdian yang ditemukan.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}