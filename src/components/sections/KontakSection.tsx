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
      `}</style>

      <section
        id="kontak"
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

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 2.5rem' }}>

          {/* Header */}
          <div style={{ marginBottom: '5rem' }}>
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
              fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
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
              fontSize: '1.15rem',
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
              return (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={contact.href.startsWith('http') ? '_blank' : undefined}
                  rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="kontak-link"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '10rem 1fr auto',
                    alignItems: 'center',
                    columnGap: '3rem',
                    padding: '2rem 0',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    borderBottom: i === contacts.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    textDecoration: 'none',
                  }}
                >
                  {/* Index + icon */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 100,
                      fontSize: '0.65rem',
                      letterSpacing: '0.15em',
                      color: 'rgba(255,255,255,0.3)',
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      0{i + 1}
                    </span>
                    <div style={{
                      width: '32px', height: '32px',
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

                  {/* Main value */}
                  <div>
                    <p style={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontWeight: 400,
                      fontSize: '1.25rem',
                      color: 'rgba(255,255,255,0.88)',
                      margin: '0 0 0.2rem',
                      letterSpacing: '0.01em',
                    }}>
                      {contact.value}
                    </p>
                    <p style={{
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
                  <span className="kontak-arrow" style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: '1.3rem',
                    color: 'rgba(255,255,255,0.35)',
                  }}>
                    →
                  </span>
                </a>
              );
            })}
          </div>

          {/* Footer closing */}
          <div style={{
            marginTop: '7rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <p style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.04em',
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