'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById('publikasi');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { label: 'Theses' },
    { label: 'Books' },
    { label: 'Journals' },
    { label: 'Op-eds' },
    { label: 'Media Appearance' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex justify-end items-center">

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={handleLinkClick}
              className={`nav-link transition-colors duration-300 ${
                isScrolled
                  ? 'text-white/80 hover:text-white'
                  : 'text-black/80 hover:text-black'
              }`}
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden transition-colors duration-300 ${
            isScrolled ? 'text-white' : 'text-black'
          }`}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-zinc-800">
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={handleLinkClick}
                className="text-left text-zinc-300 hover:text-white transition-colors duration-200"
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}