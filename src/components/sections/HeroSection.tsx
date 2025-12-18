import React from 'react';
import { ChevronDown } from 'lucide-react';
import StatCard from '@/components/cards/StatCard';
import type { Statistik } from '@/lib/types';

interface HeroSectionProps {
    statistik: Statistik[];
}

export default function HeroSection({ statistik }: HeroSectionProps) {
    return (
        <section id="profil" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            <div className="hero-gradient" style={{ top: '10%', left: '-10%' }} />
            <div className="hero-gradient" style={{ bottom: '10%', right: '-10%' }} />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
                <div className="mb-12 fade-in">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent to-white" />
                        <div className="text-zinc-500 text-xs tracking-widest uppercase">
                            Akademisi & Peneliti
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 gradient-text leading-tight">
                        Dr. Dadang Ilham Kurniawan Mujiono,<br />
                        S.Sos., M.A.
                    </h1>

                    <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl leading-relaxed">
                        Dosen dan peneliti di bidang{' '}
                        <span className="text-white font-medium">Ilmu Komputer</span> dengan fokus pada{' '}
                        <span className="text-white font-medium">kecerdasan buatan</span>, machine learning,
                        dan pengembangan sistem cerdas untuk solusi industri 4.0.
                    </p>
                </div>

                {statistik.length > 0 && (
                    <div
                        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 fade-in"
                        style={{ animationDelay: '0.2s' }}
                    >
                        {statistik.map((stat) => (
                            <StatCard key={stat.id} stat={stat} />
                        ))}
                    </div>
                )}

                <div
                    className="mt-12 flex flex-wrap gap-4 fade-in"
                    style={{ animationDelay: '0.4s' }}
                >
                    <a
                        href="#publikasi"
                        className="px-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-all"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('publikasi')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        Lihat Publikasi
                    </a>
                    <a
                        href="#kontak"
                        className="px-8 py-4 bg-zinc-900 border border-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-800 transition-all"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        Hubungi Saya
                    </a>
                </div>
            </div>

            <div className="scroll-indicator">
                <ChevronDown className="w-6 h-6 text-zinc-600" />
            </div>
        </section>
    );
}