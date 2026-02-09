'use client';

import React, { useState, useMemo } from 'react';
import SearchBox from '@/components/ui/SearchBox';
import FilterButton from '@/components/ui/FilterButton';
import PublikasiCard from '@/components/cards/PublikasiCard';
import type { Publikasi, FilterKategori } from '@/lib/types';

interface PublikasiSectionProps {
  publikasi: Publikasi[];
}

// Normalize function to handle any case from database
function normalizeKategori(kategori: string | undefined): string {
  if (!kategori) return '';
  const lower = kategori.toLowerCase().trim();
  
  // Map variations to standard values
  const mapping: Record<string, string> = {
    'buku': 'buku',
    'book': 'buku',
    'jurnal': 'jurnal',
    'journal': 'jurnal',
    'op-ed': 'op-ed',
    'oped': 'op-ed',
    'press': 'press',
    'press/news': 'press',
    'news': 'press',
  };
  
  return mapping[lower] || lower;
}

export default function PublikasiSection({ publikasi }: PublikasiSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKategori>('all');

  const filteredPublikasi = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    return publikasi.filter((pub) => {
      // Normalize kategori from database
      const kategoriNormalized = normalizeKategori(pub.kategori);

      // Check filter match
      const matchesFilter =
        activeFilter === 'all' || kategoriNormalized === activeFilter;

      // Check search match
      const matchesSearch =
        searchTerm === '' ||
        pub.judul.toLowerCase().includes(searchLower) ||
        pub.penulis.toLowerCase().includes(searchLower) ||
        (pub.keywords && pub.keywords.toLowerCase().includes(searchLower)) ||
        (pub.deskripsi && pub.deskripsi.toLowerCase().includes(searchLower));

      return matchesFilter && matchesSearch;
    });
  }, [publikasi, searchTerm, activeFilter]);

  const filterButtons = [
    { label: 'Semua', filter: 'all' as FilterKategori },
    { label: 'Buku', filter: 'buku' as FilterKategori },
    { label: 'Jurnal', filter: 'jurnal' as FilterKategori },
    { label: 'Op-ed', filter: 'op-ed' as FilterKategori },
    { label: 'Press/News', filter: 'press' as FilterKategori },
  ];

  return (
    <section id="publikasi" className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Publikasi</h2>
          <p className="text-zinc-400 text-lg">
            Karya ilmiah, buku, opini, dan liputan media
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          <SearchBox
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Cari berdasarkan judul, author, atau kata kunci..."
          />

          <div className="flex gap-3 flex-wrap">
            {filterButtons.map((button) => (
              <FilterButton
                key={button.filter}
                label={button.label}
                filter={button.filter}
                isActive={activeFilter === button.filter}
                onClick={() => setActiveFilter(button.filter)}
              />
            ))}
          </div>

          <div className="text-sm text-zinc-500">
            Menampilkan <span id="resultCount">{filteredPublikasi.length}</span> publikasi
          </div>
        </div>

        {/* Publications List */}
        <div className="space-y-6" id="publikasiList">
          {filteredPublikasi.length > 0 ? (
            filteredPublikasi.map((pub) => (
              <PublikasiCard key={pub.id} publikasi={pub} />
            ))
          ) : (
            <div className="text-center py-12 text-zinc-500">
              <p>Tidak ada publikasi yang ditemukan.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}