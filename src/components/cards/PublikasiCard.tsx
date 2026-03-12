'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { Publikasi, PublikasiKategori } from '@/lib/types';

interface PublikasiCardProps {
  publikasi: Publikasi;
}

const CATEGORY_CONFIG: Record<PublikasiKategori, { label: string; color: string }> = {
  'Buku':             { label: 'Buku',             color: 'rgba(52,211,153,0.7)'  },
  'Jurnal':           { label: 'Jurnal',            color: 'rgba(96,165,250,0.7)'  },
  'Op-ed':            { label: 'Op-ed',             color: 'rgba(167,139,250,0.7)' },
  'Media Appearance': { label: 'Media Appearance',  color: 'rgba(251,191,36,0.7)'  },
  'Theses':           { label: 'Theses',            color: 'rgba(251,113,133,0.7)' },
};

export default function PublikasiCard({ publikasi }: PublikasiCardProps) {
  const cfg = CATEGORY_CONFIG[publikasi.kategori];
  const label = cfg?.label ?? publikasi.kategori;
  const color = cfg?.color ?? 'rgba(161,161,170,0.7)';

  const handleClick = () => {
    if (publikasi.url) window.open(publikasi.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleClick}
      role={publikasi.url ? 'button' : undefined}
      tabIndex={publikasi.url ? 0 : undefined}
      onKeyDown={e => { if (publikasi.url && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); handleClick(); } }}
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '2.4rem 0',
        cursor: publikasi.url ? 'pointer' : 'default',
        display: 'grid',
        gridTemplateColumns: '10rem 1fr',
        columnGap: '3rem',
        transition: 'opacity 0.2s ease',
      }}
      onMouseEnter={e => { if (publikasi.url) (e.currentTarget as HTMLElement).style.opacity = '0.72'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
    >
      {/* Left: meta column */}
      <div style={{ paddingTop: '0.25rem' }}>
        <span style={{
          fontFamily: '"Jost", sans-serif',
          fontWeight: 200,
          fontSize: '0.62rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color,
          display: 'block',
          marginBottom: '0.6rem',
        }}>
          {label}
        </span>

        <span style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontWeight: 300,
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.04em',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {publikasi.tahun}
        </span>
      </div>

      {/* Right: content */}
      <div>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '0.75rem' }}>
          <h3 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 400,
            fontSize: 'clamp(1.15rem, 2vw, 1.45rem)',
            color: 'rgba(255,255,255,0.88)',
            lineHeight: 1.3,
            letterSpacing: '0.01em',
            margin: 0,
          }}>
            {publikasi.judul}
          </h3>
          {publikasi.url && (
            <ExternalLink style={{
              width: '14px', height: '14px',
              color: 'rgba(255,255,255,0.2)',
              flexShrink: 0,
              marginTop: '0.3rem',
            }} />
          )}
        </div>

        {/* Author */}
        <p style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: '0.92rem',
          color: 'rgba(255,255,255,0.35)',
          margin: '0 0 0.9rem',
          letterSpacing: '0.02em',
        }}>
          {publikasi.penulis}
        </p>

        {/* Description */}
        {publikasi.deskripsi && (
          <p style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 300,
            fontSize: '0.95rem',
            lineHeight: 1.75,
            color: 'rgba(255,255,255,0.42)',
            margin: '0 0 1rem',
            letterSpacing: '0.01em',
          }}>
            {publikasi.deskripsi}
          </p>
        )}

        {/* Tags */}
        {publikasi.tags && publikasi.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {publikasi.tags.map((tag, i) => (
              <span key={i} style={{
                fontFamily: '"Jost", sans-serif',
                fontWeight: 200,
                fontSize: '0.58rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '2px',
                padding: '0.2rem 0.6rem',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}