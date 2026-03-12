'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import PublikasiCard from '@/components/cards/PublikasiCard';
import type { Publikasi, PublikasiKategori } from '@/lib/types';

interface PublikasiSectionProps {
  publikasi: Publikasi[];
}

type FilterKategori = 'all' | PublikasiKategori;

const FILTERS: { label: string; filter: FilterKategori }[] = [
  { label: 'Semua',            filter: 'all'              },
  { label: 'Jurnal',           filter: 'Jurnal'           },
  { label: 'Buku',             filter: 'Buku'             },
  { label: 'Op-ed',            filter: 'Op-ed'            },
  { label: 'Media Appearance', filter: 'Media Appearance' },
  { label: 'Theses',           filter: 'Theses'           },
];

export default function PublikasiSection({ publikasi }: PublikasiSectionProps) {
  const [searchTerm, setSearchTerm]     = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKategori>('all');
  const [isFocused, setIsFocused]       = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  const filteredPublikasi = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return publikasi.filter(pub => {
      const matchesFilter = activeFilter === 'all' || pub.kategori === activeFilter;
      const matchesSearch = !searchTerm ||
        pub.judul.toLowerCase().includes(q) ||
        pub.penulis.toLowerCase().includes(q) ||
        (pub.keywords  && pub.keywords.toLowerCase().includes(q)) ||
        (pub.deskripsi && pub.deskripsi.toLowerCase().includes(q));
      return matchesFilter && matchesSearch;
    });
  }, [publikasi, searchTerm, activeFilter]);

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: publikasi.length };
    publikasi.forEach(p => { m[p.kategori] = (m[p.kategori] || 0) + 1; });
    return m;
  }, [publikasi]);

  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll('.pub-item');
    if (!items) return;
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = '1';
          (e.target as HTMLElement).style.transform = 'none';
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.04 }
    );
    items.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [filteredPublikasi]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Cormorant:ital,wght@0,300;1,300&family=Jost:wght@100;200;300&display=swap');

        .pub-item {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1),
                      transform 0.9s cubic-bezier(0.16,1,0.3,1);
        }

        .pub-filter-btn {
          position: relative;
          transition: color 0.35s ease;
        }
        .pub-filter-btn::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 1px;
          background: rgba(255,255,255,0.75);
          transition: width 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        .pub-filter-btn.active::after,
        .pub-filter-btn:hover::after { width: 100%; }

        .pub-search-input::placeholder {
          color: rgba(255,255,255,0.45);
          font-style: italic;
        }
        .pub-search-input:focus { outline: none; }

        @keyframes pubFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }
        .pub-header   { animation: pubFadeIn 1s cubic-bezier(0.16,1,0.3,1) both; }
        .pub-controls { animation: pubFadeIn 1s cubic-bezier(0.16,1,0.3,1) 0.15s both; }

        .pub-filter-bar {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 0;
          border-bottom: 1px solid rgba(255,255,255,0.18);
          padding-bottom: 1.2rem;
          row-gap: 0.5rem;
        }

        @media (max-width: 768px) {
          .pub-section-root  { padding: 7rem 0 9rem !important; }
          .pub-inner         { padding: 0 2rem !important; }
          .pub-header-wrap   { margin-bottom: 3.8rem !important; }
          .pub-controls-wrap { margin-bottom: 3rem !important; }
          .pub-search-wrap   { margin-bottom: 2.2rem !important; max-width: 100% !important; }
        }

        @media (max-width: 480px) {
          .pub-section-root  { padding: 5.5rem 0 7rem !important; }
          .pub-inner         { padding: 0 1.25rem !important; }
          .pub-header-wrap   { margin-bottom: 3rem !important; }
          .pub-controls-wrap { margin-bottom: 2.5rem !important; }
          .pub-search-wrap   { margin-bottom: 2rem !important; }
          .pub-filter-bar    { row-gap: 0.35rem; }
          .pub-filter-btn    { font-size: 0.92rem !important; }
          .pub-count-badge   { width: 100%; margin-top: 0.6rem; text-align: right; }
          .pub-empty-wrap    { padding: 4rem 0 !important; }
        }

        @media (max-width: 360px) {
          .pub-inner       { padding: 0 1rem !important; }
          .pub-filter-btn  { font-size: 0.86rem !important; }
          .pub-search-text { font-size: 0.95rem !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="publikasi"
        className="pub-section-root"
        style={{ background: '#080806', padding: '9rem 0 12rem', position: 'relative' }}
      >
        <div className="pub-inner" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 2.5rem' }}>

          {/* ── Header ── */}
          <div className="pub-header pub-header-wrap" style={{ marginBottom: '5rem' }}>
            <p style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 200,        /* was 100 */
              fontSize: '0.6rem',     /* was 0.58rem */
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.72)', /* was 0.45 */
              marginBottom: '1.2rem',
            }}>
              Karya Akademik & Intelektual
            </p>

            <h2 style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 300,
              fontSize: 'clamp(2.6rem, 7vw, 5rem)',
              color: '#ffffff',
              lineHeight: 1,
              letterSpacing: '-0.01em',
              margin: '0 0 1.8rem',
            }}>
              Publikasi
            </h2>

            {/* Diamond ornament — brighter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, rgba(255,255,255,0.22), transparent)' }} /> {/* was 0.10 */}
              <div style={{ width: '4px', height: '4px', border: '1px solid rgba(255,255,255,0.6)', transform: 'rotate(45deg)' }} /> {/* was 0.35 */}
              <div style={{ height: '1px', width: '40px', background: 'rgba(255,255,255,0.22)' }} /> {/* was 0.12 */}
            </div>
          </div>

          {/* ── Controls ── */}
          <div className="pub-controls pub-controls-wrap" style={{ marginBottom: '4rem' }}>

            {/* Search */}
            <div
              className="pub-search-wrap"
              style={{
                position: 'relative',
                borderBottom: `1px solid ${isFocused ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.28)'}`, /* was 0.40 / 0.15 */
                transition: 'border-color 0.3s ease',
                marginBottom: '3rem',
                paddingBottom: '0.1rem',
                maxWidth: '480px',
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Cari judul, penulis, kata kunci…"
                className="pub-search-input pub-search-text"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  fontFamily: '"Cormorant Garamond", serif',
                  fontWeight: 300,
                  fontStyle: searchTerm ? 'normal' : 'italic',
                  fontSize: '1.05rem',
                  letterSpacing: '0.02em',
                  color: 'rgba(255,255,255,0.92)', /* was 0.75 */
                  padding: '0.4rem 1.8rem 0.4rem 0',
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => { setSearchTerm(''); inputRef.current?.focus(); }}
                  style={{
                    position: 'absolute', right: 0, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: '1.1rem',
                    color: 'rgba(255,255,255,0.65)', /* was 0.45 */
                    lineHeight: 1,
                    padding: '0.2rem',
                    minWidth: '2rem', minHeight: '2rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="pub-filter-bar">
              {FILTERS.map(({ label, filter }, i) => {
                const isActive = activeFilter === filter;
                const count = counts[filter] ?? 0;
                return (
                  <React.Fragment key={filter}>
                    {i > 0 && (
                      <span style={{
                        color: 'rgba(255,255,255,0.38)', /* was 0.25 */
                        fontFamily: '"Cormorant Garamond", serif',
                        fontSize: '0.9rem',
                        padding: '0 0.5rem',
                        userSelect: 'none',
                      }}>·</span>
                    )}
                    <button
                      onClick={() => setActiveFilter(filter)}
                      className={`pub-filter-btn${isActive ? ' active' : ''}`}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: '"Cormorant Garamond", serif',
                        fontWeight: isActive ? 500 : 300,
                        fontStyle: isActive ? 'normal' : 'italic',
                        fontSize: '1rem',
                        letterSpacing: '0.03em',
                        color: isActive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.68)', /* was 0.95 / 0.52 */
                        padding: '0.1rem 0',
                        display: 'inline-flex', alignItems: 'baseline', gap: '0.3rem',
                        minHeight: '2.2rem',
                      }}
                    >
                      {label}
                      <sup style={{
                        fontFamily: '"Jost", sans-serif',
                        fontWeight: 200,
                        fontSize: '0.5rem',
                        letterSpacing: '0.05em',
                        color: isActive ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.45)', /* was 0.50 / 0.30 */
                        verticalAlign: 'super',
                        lineHeight: 0,
                      }}>
                        {count}
                      </sup>
                    </button>
                  </React.Fragment>
                );
              })}

              {/* Result count */}
              <span
                className="pub-count-badge"
                style={{
                  marginLeft: 'auto',
                  fontFamily: '"Jost", sans-serif',
                  fontWeight: 100,
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.55)', /* was 0.35 */
                  alignSelf: 'center',
                }}
              >
                {filteredPublikasi.length} entri
              </span>
            </div>
          </div>

          {/* ── List ── */}
          <div>
            {filteredPublikasi.length > 0 ? (
              filteredPublikasi.map((pub, i) => (
                <div
                  key={pub.id}
                  className="pub-item"
                  style={{ transitionDelay: `${Math.min(i, 6) * 0.07}s` }}
                >
                  <PublikasiCard publikasi={pub} />
                </div>
              ))
            ) : (
              <div className="pub-item pub-empty-wrap" style={{ padding: '6rem 0', textAlign: 'center' }}>
                <p style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                  color: 'rgba(255,255,255,0.6)', /* was 0.4 */
                  marginBottom: '1.5rem',
                }}>
                  Tidak ada publikasi ditemukan
                </p>
                {(searchTerm || activeFilter !== 'all') && (
                  <button
                    onClick={() => { setSearchTerm(''); setActiveFilter('all'); }}
                    style={{
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 200,
                      fontSize: '0.65rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.65)', /* was 0.45 */
                      background: 'none',
                      border: '1px solid rgba(255,255,255,0.3)', /* was 0.18 */
                      borderRadius: '2px',
                      padding: '0.6rem 1.4rem',
                      cursor: 'pointer',
                      minHeight: '2.4rem',
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
}