'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { Publikasi } from '@/lib/types';

interface PublikasiCardProps {
  publikasi: Publikasi;
}

// Normalize function to handle any case from database
const normalizeKategori = (kategori: string): string => {
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
};

// Map to display colors
const categoryColors: Record<string, string> = {
  'buku': 'text-emerald-400',
  'jurnal': 'text-blue-400',
  'op-ed': 'text-purple-400',
  'press': 'text-amber-400',
};

// Map to display labels
const categoryLabels: Record<string, string> = {
  'buku': 'Buku',
  'jurnal': 'Jurnal',
  'op-ed': 'Op-ed',
  'press': 'Press/News',
};

export default function PublikasiCard({ publikasi }: PublikasiCardProps) {
  const handleClick = () => {
    if (publikasi.url) {
      window.open(publikasi.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Normalize kategori from database
  const normalizedKategori = normalizeKategori(publikasi.kategori);

  // Get color and label with fallback
  const categoryColor = categoryColors[normalizedKategori] || 'text-zinc-400';
  const categoryLabel = categoryLabels[normalizedKategori] || publikasi.kategori;

  return (
    <div
      className="card-hover publication-card p-8 rounded-xl"
      data-category={normalizedKategori}
      data-title={publikasi.judul.toLowerCase()}
      data-author={publikasi.penulis.toLowerCase()}
      data-keywords={publikasi.keywords?.toLowerCase() || ''}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`category-badge ${categoryColor} text-sm font-medium`}>
          {categoryLabel}
        </div>
        {publikasi.url && (
          <div className="external-link-icon">
            <ExternalLink className="w-5 h-5 text-zinc-500" />
          </div>
        )}
      </div>

      <h3 className="text-2xl font-semibold mb-3 hover:text-zinc-300 transition-colors">
        {publikasi.judul}
      </h3>

      <div className="text-zinc-500 text-sm mb-4">
        <span className="text-zinc-400">Penulis:</span> {publikasi.penulis}
        {publikasi.tahun && (
          <>
            {' • '}
            <span className="text-zinc-400">Tahun:</span> {publikasi.tahun}
          </>
        )}
      </div>

      {publikasi.deskripsi && (
        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
          {publikasi.deskripsi}
        </p>
      )}

      {publikasi.tags && publikasi.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {publikasi.tags.map((tag, index) => (
            <span key={index} className="tag text-xs px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}