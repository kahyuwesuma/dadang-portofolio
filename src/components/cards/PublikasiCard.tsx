'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { Publikasi, PublikasiKategori } from '@/lib/types';

interface PublikasiCardProps {
  publikasi: Publikasi;
}

const CATEGORY_CONFIG: Record<PublikasiKategori, { label: string; color: string }> = {
  'Buku':             { label: 'Buku',            color: 'rgba(52,211,153,0.92)'  }, // was 0.70
  'Jurnal':           { label: 'Jurnal',           color: 'rgba(96,165,250,0.92)'  }, // was 0.70
  'Op-ed':            { label: 'Op-ed',            color: 'rgba(167,139,250,0.92)' }, // was 0.70
  'Media Appearance': { label: 'Media Appearance', color: 'rgba(251,191,36,0.92)'  }, // was 0.70
  'Theses':           { label: 'Theses',           color: 'rgba(251,113,133,0.92)' }, // was 0.70
};

export default function PublikasiCard({ publikasi }: PublikasiCardProps) {
  const cfg   = CATEGORY_CONFIG[publikasi.kategori];
  const label = cfg?.label ?? publikasi.kategori;
  const color = cfg?.color ?? 'rgba(161,161,170,0.92)';

  const handleClick = () => {
    if (publikasi.url) window.open(publikasi.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <style>{`
        .pub-card {
          border-top: 1px solid rgba(255,255,255,0.12); /* was 0.06 */
          padding: 2.4rem 0;
          display: grid;
          grid-template-columns: 10rem 1fr;
          column-gap: 3rem;
          transition: opacity 0.2s ease;
        }
        .pub-card[role="button"]:hover { opacity: 0.72; }
        .pub-card[role="button"]:focus-visible {
          outline: 1px solid rgba(255,255,255,0.4); /* was 0.25 */
          outline-offset: 4px;
          border-radius: 2px;
        }

        @media (max-width: 768px) {
          .pub-card {
            grid-template-columns: 7rem 1fr;
            column-gap: 1.8rem;
            padding: 2rem 0;
          }
        }

        @media (max-width: 540px) {
          .pub-card {
            display: block;
            padding: 1.8rem 0;
          }
          .pub-card-meta {
            display: flex !important;
            flex-direction: row !important;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.85rem !important;
            padding-top: 0 !important;
          }
          .pub-card-meta-category { margin-bottom: 0 !important; }
          .pub-card-meta-year     { font-size: 0.82rem !important; }
          .pub-card-title         { font-size: 1.08rem !important; }
          .pub-card-author        { font-size: 0.88rem !important; }
          .pub-card-desc          { font-size: 0.9rem !important; }
        }

        @media (max-width: 360px) {
          .pub-card-title { font-size: 1rem !important; }
          .pub-card-desc  { font-size: 0.86rem !important; }
        }
      `}</style>

      <div
        className="pub-card"
        onClick={handleClick}
        role={publikasi.url ? 'button' : undefined}
        tabIndex={publikasi.url ? 0 : undefined}
        onKeyDown={e => {
          if (publikasi.url && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleClick();
          }
        }}
        style={{ cursor: publikasi.url ? 'pointer' : 'default' }}
      >
        {/* ── Left: meta ── */}
        <div
          className="pub-card-meta"
          style={{ paddingTop: '0.25rem', display: 'flex', flexDirection: 'column' }}
        >
          <span
            className="pub-card-meta-category"
            style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 300,      /* was 200 */
              fontSize: '0.63rem',  /* was 0.62rem */
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color,
              display: 'block',
              marginBottom: '0.6rem',
            }}
          >
            {label}
          </span>

          <span
            className="pub-card-meta-year"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 300,
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.55)', /* was 0.25 */
              letterSpacing: '0.04em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {publikasi.tahun}
          </span>
        </div>

        {/* ── Right: content ── */}
        <div>
          {/* Title row */}
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', gap: '1rem',
            marginBottom: '0.75rem',
          }}>
            <h3
              className="pub-card-title"
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontWeight: 400,
                fontSize: 'clamp(1.08rem, 2vw, 1.45rem)',
                color: 'rgba(255,255,255,0.97)', /* was 0.88 */
                lineHeight: 1.3,
                letterSpacing: '0.01em',
                margin: 0,
              }}
            >
              {publikasi.judul}
            </h3>
            {publikasi.url && (
              <ExternalLink style={{
                width: '14px', height: '14px',
                color: 'rgba(255,255,255,0.45)', /* was 0.20 */
                flexShrink: 0,
                marginTop: '0.3rem',
              }} />
            )}
          </div>

          {/* Author */}
          <p
            className="pub-card-author"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: '0.92rem',
              color: 'rgba(255,255,255,0.60)', /* was 0.35 */
              margin: '0 0 0.9rem',
              letterSpacing: '0.02em',
            }}
          >
            {publikasi.penulis}
          </p>

          {/* Description */}
          {publikasi.deskripsi && (
            <p
              className="pub-card-desc"
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontWeight: 300,
                fontSize: '0.95rem',
                lineHeight: 1.75,
                color: 'rgba(255,255,255,0.65)', /* was 0.42 */
                margin: '0 0 1rem',
                letterSpacing: '0.01em',
              }}
            >
              {publikasi.deskripsi}
            </p>
          )}

          {/* Tags */}
          {publikasi.tags && publikasi.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              {publikasi.tags.map((tag, i) => (
                <span key={i} style={{
                  fontFamily: '"Jost", sans-serif',
                  fontWeight: 200,
                  fontSize: '0.58rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.45)',   /* was 0.20 */
                  border: '1px solid rgba(255,255,255,0.18)', /* was 0.08 */
                  borderRadius: '2px',
                  padding: '0.2rem 0.55rem',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}