'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('profil');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            const sections = ['profil', 'publikasi', 'pengabdian', 'kontak'];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 200 && rect.bottom >= 200) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLinkClick = (sectionId: string) => {
        setIsMobileMenuOpen(false);
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const navLinks = [
        { id: 'profil', label: 'Profil' },
        { id: 'publikasi', label: 'Publikasi' },
        { id: 'pengabdian', label: 'Pengabdian' },
        { id: 'kontak', label: 'Kontak' },
    ];

    return (
        <nav
            className={`fixed top-0 w-full backdrop-blur-lg z-50 transition-all duration-300 ${isScrolled ? 'nav-scrolled' : ''
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="text-xl font-bold tracking-tight">Dr. Dadang</div>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8 text-sm text-zinc-400">
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => handleLinkClick(link.id)}
                            className={`nav-link hover:text-white ${activeSection === link.id ? 'active' : ''
                                }`}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden text-white"
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
                    <div className="px-6 py-4 flex flex-col gap-4 text-sm text-zinc-400">
                        {navLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => handleLinkClick(link.id)}
                                className="text-left hover:text-white transition-colors"
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