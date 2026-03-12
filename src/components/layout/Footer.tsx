import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Jost:wght@100;200&display=swap');
      `}</style>

      <footer
        style={{
          background: '#080806',
          padding: '4rem 0 3.5rem',
          position: 'relative',
        }}
      >
        {/* Top ruled line with diamond */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: '1rem',
          width: '100%', maxWidth: '960px', padding: '0 2.5rem',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06))' }} />
          <div style={{ width: '3px', height: '3px', border: '1px solid rgba(255,255,255,0.12)', transform: 'rotate(45deg)', flexShrink: 0 }} />
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.06))' }} />
        </div>

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 2.5rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>

          {/* Left: name */}
          <div>
            <p style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.55)',
              margin: '0 0 0.3rem',
              letterSpacing: '0.02em',
            }}>
              Dr. Dadang Ilham Kurniawan Mujiono
            </p>
            <p style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 100,
              fontSize: '0.58rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
            }}>
              Universitas Mulawarman · Fakultas Ilmu Sosial dan Ilmu Politik
            </p>
          </div>

          {/* Right: copyright */}
          <p style={{
            fontFamily: '"Jost", sans-serif',
            fontWeight: 100,
            fontSize: '0.58rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.28)',
          }}>
            © {currentYear} All rights reserved
          </p>

        </div>
      </footer>
    </>
  );
}