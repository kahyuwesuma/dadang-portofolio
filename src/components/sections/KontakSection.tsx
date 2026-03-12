'use client';

import React from 'react';
import { Mail, BookOpen, Linkedin } from 'lucide-react';

const contacts = [
  {
    icon: Mail,
    label: 'Email',
    value: 'dadang@fisip.unmul.ac.id',
    href: 'mailto:dadang@fisip.unmul.ac.id',
    note: 'Korespondensi akademik',
  },
  {
    icon: BookOpen,
    label: 'Google Scholar',
    value: 'Profil Akademik',
    href: 'https://scholar.google.com/citations?user=7c93ypcAAAAJ&hl=id',
    note: 'Publikasi & sitasi',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'Jaringan Profesional',
    href: 'https://linkedin.com',
    note: 'Koneksi profesional',
  },
];

export default function KontakSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@100;200;300&display=swap');

        .kontak-link {
          transition: opacity 0.3s ease;
        }
        .kontak-link:hover {
          opacity: 0.6;
        }
        .kontak-link:hover .kontak-arrow {
          transform: translateX(4px);
        }
        .kontak-arrow {
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
          display: inline-block;
        }

        /* ── Contact row: desktop 3-col grid ── */
        .kontak-row {
          display: grid;
          grid-template-columns: 10rem 1fr auto;
          align-items: center;
          column-gap: 3rem;
          padding: 2rem 0;
          border-top: 1px solid rgba(255,255,255,0.08);
          text-decoration: none;
        }
        .kontak-row-last {
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        /* ── Footer closing ── */
        .kontak-footer {
          margin-top: 7rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        /* ── Tablet (≤ 768px) ── */
        @media (max-width: 768px) {
          .kontak-section-root { padding: 7rem 0 8rem !important; }
          .kontak-inner        { padding: 0 2rem !important; }
          .kontak-header       { margin-bottom: 3.5rem !important; }

          .kontak-row {
            grid-template-columns: 1fr auto;
            grid-template-rows: auto auto;
            row-gap: 0.6rem;
            column-gap: 1.5rem;
            padding: 1.6rem 0;
          }
          /* Label col spans full width on first row */
          .kontak-meta  { grid-column: 1; grid-row: 1; }
          .kontak-value { grid-column: 1; grid-row: 2; }
          .kontak-arrow-wrap { grid-column: 2; grid-row: 1 / 3; align-self: center; }

          .kontak-footer { margin-top: 5rem; }
        }

        /* ── Mobile (≤ 480px) ── */
        @media (max-width: 480px) {
          .kontak-section-root { padding: 5.5rem 0 6.5rem !important; }
          .kontak-inner        { padding: 0 1.25rem !important; }
          .kontak-header       { margin-bottom: 3rem !important; }

          .kontak-row {
            padding: 1.4rem 0;
            column-gap: 1rem;
          }
          .kontak-value-text { font-size: 1.08rem !important; }
          .kontak-note-text  { font-size: 0.78rem !important; }
          .kontak-footer     { margin-top: 4rem; }
          .kontak-footer-loc { font-size: 0.68rem !important; }
        }

        /* ── Tiny (≤ 360px) ── */
        @media (max-width: 360px) {
          .kontak-inner { padding: 0 1rem !important; }
          .kontak-value-text { font-size: 1rem !important; }
        }
      `}</style>

      <section
        id="kontak"
        className="kontak-section-root"
        style={{
          background: '#080806',
          padding: '9rem 0 10rem',
          position: 'relative',
        }}
      >
        {/* Top ornament */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: '1rem',
          width: '100%', maxWidth: '960px', padding: '0 2.5rem',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.07))' }} />
          <div style={{ width: '4px', height: '4px', border: '1px solid rgba(255,255,255,0.2)', transform: 'rotate(45deg)', flexShrink: 0 }} />
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.07))' }} />
        </div>

        <div className="kontak-inner" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 2.5rem' }}>

          {/* Header */}
          <div className="kontak-header" style={{ marginBottom: '5rem' }}>
            <p style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 100,
              fontSize: '0.58rem',
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '1.2rem',
            }}>
              Hubungi Saya
            </p>

            <h2 style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 300,
              fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
              color: '#ffffff',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: '0 0 2rem',
              maxWidth: '600px',
            }}>
              Mari Berkolaborasi
            </h2>

            <p style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.58)',
              maxWidth: '520px',
              letterSpacing: '0.01em',
            }}>
              Tertarik untuk berkolaborasi dalam penelitian, penulisan, atau proyek
              pengabdian masyarakat? Hubungi saya melalui kanal di bawah ini.
            </p>
          </div>

          {/* Contact list */}
          <div>
            {contacts.map((contact, i) => {
              const Icon = contact.icon;
              const isLast = i === contacts.length - 1;
              return (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={contact.href.startsWith('http') ? '_blank' : undefined}
                  rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`kontak-link kontak-row${isLast ? ' kontak-row-last' : ''}`}
                >
                  {/* Meta: index + icon + label */}
                  <div className="kontak-meta" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span style={{
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 100,
                      fontSize: '0.65rem',
                      letterSpacing: '0.15em',
                      color: 'rgba(255,255,255,0.3)',
                      fontVariantNumeric: 'tabular-nums',
                      flexShrink: 0,
                    }}>
                      0{i + 1}
                    </span>
                    <div style={{
                      width: '30px', height: '30px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon style={{ width: '13px', height: '13px', color: 'rgba(255,255,255,0.5)' }} />
                    </div>
                    <span style={{
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 200,
                      fontSize: '0.62rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.45)',
                    }}>
                      {contact.label}
                    </span>
                  </div>

                  {/* Main value + note */}
                  <div className="kontak-value">
                    <p className="kontak-value-text" style={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontWeight: 400,
                      fontSize: '1.25rem',
                      color: 'rgba(255,255,255,0.88)',
                      margin: '0 0 0.2rem',
                      letterSpacing: '0.01em',
                      wordBreak: 'break-word',
                    }}>
                      {contact.value}
                    </p>
                    <p className="kontak-note-text" style={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontWeight: 300,
                      fontStyle: 'italic',
                      fontSize: '0.85rem',
                      color: 'rgba(255,255,255,0.4)',
                      margin: 0,
                    }}>
                      {contact.note}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="kontak-arrow-wrap">
                    <span className="kontak-arrow" style={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: '1.3rem',
                      color: 'rgba(255,255,255,0.35)',
                    }}>
                      →
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Footer closing */}
          <div className="kontak-footer">
            <p className="kontak-footer-loc" style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.04em',
              margin: 0,
            }}>
              Samarinda · East Kalimantan · Indonesia
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
              <div style={{ height: '1px', width: '28px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15))' }} />
              <div style={{ width: '4px', height: '4px', border: '1px solid rgba(255,255,255,0.2)', transform: 'rotate(45deg)', flexShrink: 0 }} />
              <div style={{ height: '1px', width: '28px', background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.15))' }} />
            </div>
          </div>

        </div>
      </section>
    </>
  );
}