'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleLinkClick = (label: string) => {
    setActiveLink(label);
    setIsMobileMenuOpen(false);
    const element = document.getElementById('publikasi');
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const navLinks = [
    { label: 'Theses' },
    { label: 'Books' },
    { label: 'Journals' },
    { label: 'Op-eds' },
    { label: 'Media Appearance' },
  ];

  // Transparan di atas hero: putih + drop shadow agar terbaca di foto outdoor
  // Scrolled: putih di atas frosted dark navbar
  const desktopLinkColor = 'rgba(255,255,255,0.88)';
  const desktopLinkHover = 'rgba(255,255,255,1)';
  const desktopTextShadow = '0 1px 6px rgba(0,0,0,0.55), 0 0px 20px rgba(0,0,0,0.3)';

  return (
    <>
      <style>{`
        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawerItemFade {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .nav-link-desktop {
          position: relative;
          padding-bottom: 2px;
        }
        .nav-link-desktop::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: currentColor;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-link-desktop:hover::after,
        .nav-link-desktop.active::after { width: 100%; }

        .hamburger-line {
          display: block;
          width: 22px;
          height: 1.5px;
          background: currentColor;
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.25s ease,
                      width 0.3s ease;
          transform-origin: center;
        }
        .hamburger-open .line-top    { transform: translateY(5.5px) rotate(45deg); }
        .hamburger-open .line-middle { opacity: 0; width: 0; }
        .hamburger-open .line-bottom { transform: translateY(-5.5px) rotate(-45deg); }

        .drawer-item {
          animation: drawerItemFade 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
      `}</style>

      <nav
        ref={menuRef}
        className="fixed top-0 w-full z-50"
        style={{
          animation: 'navSlideDown 0.6s cubic-bezier(0.16,1,0.3,1) both',
          transition: 'background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease',
          background: isScrolled ? 'rgba(10,10,10,0.72)' : 'linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, transparent 100%)',
          backdropFilter: isScrolled ? 'blur(18px) saturate(1.4)' : 'blur(8px)',
          WebkitBackdropFilter: isScrolled ? 'blur(18px) saturate(1.4)' : 'blur(8px)',
          boxShadow: isScrolled ? '0 1px 0 rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <div
          className="max-w-7xl mx-auto px-6 lg:px-10 flex justify-end items-center"
          style={{ height: '64px' }}
        >
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.label)}
                className={`nav-link-desktop ${activeLink === link.label ? 'active' : ''}`}
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: desktopLinkColor,
                  textShadow: desktopTextShadow,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px 0',
                  transition: 'color 0.3s ease, text-shadow 0.3s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = desktopLinkHover)}
                onMouseLeave={e => (e.currentTarget.style.color = activeLink === link.label ? desktopLinkHover : desktopLinkColor)}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Hamburger — mobile only */}
          <button
            className={`md:hidden flex flex-col justify-center items-center gap-[4px] ${isMobileMenuOpen ? 'hamburger-open' : ''}`}
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
            style={{
              width: '36px',
              height: '36px',
              color: 'rgba(255,255,255,0.95)',
              filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.6))',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'color 0.3s ease, filter 0.3s ease',
            }}
          >
            <span className="hamburger-line line-top" />
            <span className="hamburger-line line-middle" />
            <span className="hamburger-line line-bottom" />
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(4px)',
            animation: 'overlayFadeIn 0.3s ease',
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className="fixed top-0 right-0 h-full z-50 md:hidden"
        style={{
          width: 'min(300px, 85vw)',
          background: 'rgba(8,8,8,0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '80px',
          paddingLeft: '32px',
          paddingRight: '32px',
          paddingBottom: '40px',
        }}
      >
        <p style={{
          fontSize: '0.6rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.28)',
          marginBottom: '28px',
          fontFamily: 'var(--font-sans, sans-serif)',
        }}>
          Navigation
        </p>

        <nav className="flex flex-col gap-1">
          {navLinks.map((link, i) => (
            <button
              key={link.label}
              onClick={() => handleLinkClick(link.label)}
              className="drawer-item text-left"
              style={{
                animationDelay: isMobileMenuOpen ? `${i * 55 + 80}ms` : '0ms',
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: '0.9rem',
                fontWeight: 400,
                letterSpacing: '0.06em',
                color: activeLink === link.label ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.6)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '10px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                transition: 'color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.95)')}
              onMouseLeave={e => (e.currentTarget.style.color = activeLink === link.label ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.6)')}
            >
              {link.label}
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
                0{i + 1}
              </span>
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <p style={{
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.18)',
            letterSpacing: '0.1em',
            fontFamily: 'var(--font-sans, sans-serif)',
          }}>
            Academic · Conservationist
          </p>
        </div>
      </div>
    </>
  );
}