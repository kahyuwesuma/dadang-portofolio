// src/components/sections/DescSection.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

const romanNumerals = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV'];

interface DescGroup {
  label: string;
  index: string;
  entries: string[];
}

export default function DescSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [groups, setGroups] = useState<DescGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/desc-content.json')
      .then(r => r.json())
      .then(data => {
        setGroups(data.groups ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || groups.length === 0) return;
    const items = sectionRef.current?.querySelectorAll('.desc-item');
    if (!items) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('desc-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06 }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, groups]);

  let paraIndex = 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@100;200;300;400&display=swap');

        .desc-item {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1);
        }
        .desc-item.desc-visible { opacity: 1; transform: translateY(0); }

        .desc-para::before {
          content: '';
          position: absolute;
          left: -1.5rem; top: 0; bottom: 0;
          width: 1.5px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.55) 20%, rgba(255,255,255,0.55) 80%, transparent);
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 0.7s cubic-bezier(0.16,1,0.3,1);
        }
        .desc-para:hover::before { transform: scaleY(1); }
        .desc-para:hover .desc-numeral { color: rgba(255,255,255,0.95) !important; transform: translateY(-2px); }
        .desc-para:hover .desc-text   { color: rgba(255,255,255,1) !important; }
        .desc-text    { transition: color 0.6s cubic-bezier(0.16,1,0.3,1); }
        .desc-numeral { transition: color 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1); }

        .group-label-text { position: relative; display: inline-block; }
        .group-label-text::after {
          content: '';
          position: absolute;
          bottom: -3px; left: 0;
          width: 0; height: 1px;
          background: rgba(255,255,255,0.65);
          transition: width 1.4s cubic-bezier(0.16,1,0.3,1) 0.2s;
        }
        .desc-visible .group-label-text::after { width: 100%; }

        .desc-group { display: grid; grid-template-columns: 11rem 1fr; column-gap: 4rem; }
        .desc-label-col { display: block; }
        .desc-label-inner { position: sticky; top: 7rem; }

        @media (min-width: 641px) and (max-width: 900px) {
          .desc-section-root  { padding: 7rem 0 9rem !important; }
          .desc-section-inner { padding: 0 2.2rem !important; }
          .desc-group { grid-template-columns: 8rem 1fr; column-gap: 2.5rem; }
          .desc-label-inner   { position: sticky; top: 5rem; }
          .desc-label-index   { font-size: 3.2rem !important; margin-bottom: 1rem !important; }
          .desc-label-divider { margin-bottom: 0.8rem !important; }
          .desc-group-gap     { margin-bottom: 6.5rem !important; }
          .desc-text-p { font-size: 1.05rem !important; line-height: 1.95 !important; }
          .desc-para-gap { margin-bottom: 2.8rem !important; }
        }

        @media (max-width: 640px) {
          .desc-section-root  { padding: 5rem 0 7rem !important; }
          .desc-section-inner { padding: 0 1.25rem !important; }
          .desc-group { display: block; }
          .desc-label-col { margin-bottom: 1.6rem; }
          .desc-label-inner { position: static; display: flex; align-items: center; gap: 0.85rem; }
          .desc-label-index { font-size: 2.6rem !important; margin-bottom: 0 !important; line-height: 1 !important; }
          .desc-label-divider { display: none !important; }
          .desc-label-tag { display: flex; align-items: center; gap: 0.6rem; }
          .desc-label-tag::before { content: ''; display: inline-block; width: 14px; height: 1px; background: rgba(255,255,255,0.55); flex-shrink: 0; }
          .desc-para { grid-template-columns: 1.8rem 1fr !important; column-gap: 1rem !important; }
          .desc-para::before { left: -0.6rem; }
          .desc-text-p { font-size: 0.97rem !important; line-height: 1.88 !important; }
          .desc-numeral-text { font-size: 0.58rem !important; padding-top: 0.42rem !important; }
          .desc-para-gap { margin-bottom: 2.4rem !important; }
          .desc-group-gap { margin-bottom: 4.5rem !important; }
          .desc-closing { margin-top: 4.5rem !important; padding-top: 2rem !important; }
          .desc-closing-loc { font-size: 0.65rem !important; }
        }

        @media (max-width: 360px) {
          .desc-section-inner { padding: 0 1rem !important; }
          .desc-text-p { font-size: 0.92rem !important; line-height: 1.82 !important; }
          .desc-label-index { font-size: 2.2rem !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="deskripsi"
        className="desc-section-root"
        style={{ background: '#080806', padding: '11rem 0 13rem', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.55,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }} />

        <div className="desc-section-inner" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 3rem', position: 'relative', zIndex: 1 }}>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {[1,2,3].map(i => (
                <div key={i} style={{
                  height: '1.1rem',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '2px',
                  width: i === 2 ? '70%' : '100%',
                  animation: 'pulse 2s ease-in-out infinite',
                }} />
              ))}
              <style>{`@keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }`}</style>
            </div>
          ) : (
            groups.map((group, gi) => {
              const groupStart = paraIndex;
              paraIndex += group.entries.length;

              return (
                <div
                  key={gi}
                  className={`desc-group${gi < groups.length - 1 ? ' desc-group-gap' : ''}`}
                  style={{ marginBottom: gi < groups.length - 1 ? '9rem' : 0 }}
                >
                  <div className="desc-label-col">
                    <div className="desc-item desc-label-inner" style={{ transitionDelay: '0.04s' }}>

                      {/* Index number — bolder */}
                      <div className="desc-label-index" style={{
                        fontFamily: '"Jost", sans-serif',
                        fontWeight: 100,
                        fontSize: '4.5rem',
                        lineHeight: 1,
                        color: 'rgba(255,255,255,0.65)', /* was 0.08 */
                        letterSpacing: '-0.02em',
                        marginBottom: '1.4rem',
                        userSelect: 'none',
                      }}>
                        {group.index}
                      </div>

                      {/* Divider — brighter */}
                      <div className="desc-label-divider" style={{
                        width: '20px', height: '1px',
                        background: 'rgba(255,255,255,0.55)', /* was 0.32 */
                        marginBottom: '1.1rem',
                      }} />

                      {/* Section label — brighter, slightly heavier */}
                      <div className="desc-label-tag">
                        <span className="group-label-text" style={{
                          fontFamily: '"Jost", sans-serif',
                          fontWeight: 300, /* was 200 */
                          fontSize: '0.58rem',
                          letterSpacing: '0.36em',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.72)', /* was 0.50 */
                        }}>
                          {group.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {group.entries.map((text, pi) => {
                      const absIndex = groupStart + pi;
                      const isLast = pi === group.entries.length - 1;
                      return (
                        <div
                          key={pi}
                          className={`desc-item desc-para${!isLast ? ' desc-para-gap' : ''}`}
                          style={{
                            position: 'relative',
                            display: 'grid',
                            gridTemplateColumns: '2.4rem 1fr',
                            columnGap: '1.8rem',
                            marginBottom: !isLast ? '3.4rem' : 0,
                            transitionDelay: `${0.1 + pi * 0.1}s`,
                            cursor: 'default',
                            paddingLeft: '0.2rem',
                          }}
                        >
                          {/* Roman numeral — bolder */}
                          <div className="desc-numeral desc-numeral-text" style={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontWeight: 400, /* was 300 */
                            fontSize: '0.68rem', /* was 0.62rem */
                            color: 'rgba(255,255,255,0.55)', /* was 0.38 */
                            letterSpacing: '0.08em',
                            paddingTop: '0.52rem',
                            textAlign: 'right',
                            userSelect: 'none',
                            lineHeight: 1,
                          }}>
                            {romanNumerals[absIndex]}
                          </div>

                          {/* Body text — much brighter */}
                          <p className="desc-text desc-text-p" style={{
                            fontFamily: '"EB Garamond", serif',
                            fontWeight: 400,
                            fontSize: '1.13rem',
                            lineHeight: 2,
                            color: 'rgba(255,255,255,0.92)', /* was 0.78 */
                            margin: 0,
                            letterSpacing: '0.012em',
                          }}>
                            {text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}

          {/* Closing ornament */}
        </div>
      </section>
    </>
  );
}