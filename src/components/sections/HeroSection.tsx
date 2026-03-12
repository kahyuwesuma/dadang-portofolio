'use client';

import Image from 'next/image';
import { Charmonman } from 'next/font/google';

const charmonman = Charmonman({
    subsets: ['latin'],
    weight: ['700'],
    display: 'swap',
});

export default function HeroSection() {
    return (
        <>
            <style>{`
                @keyframes heroFadeUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .hero-image {
                    object-position: center 18%;
                }
                @media (max-width: 768px) {
                    .hero-image {
                        object-position: 65% 15%;
                    }
                }
            `}</style>

            <section
                id="profil"
                className="relative w-full overflow-hidden"
                style={{ height: '100vh', minHeight: '620px' }}
            >
                <div className="absolute inset-0">
                    <Image
                        src="/images/profile5.jpeg"
                        alt="Dr. Dadang I K Mujiono"
                        fill
                        sizes="(max-width: 768px) 100vw, 100vw"
                        priority
                        quality={90}
                        className="hero-image object-cover"
                    />

                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(
                                to bottom,
                                rgba(0,0,0,0.10)  0%,
                                rgba(0,0,0,0.02) 30%,
                                rgba(0,0,0,0.15) 55%,
                                rgba(0,0,0,0.65) 78%,
                                rgba(0,0,0,0.82) 100%
                            )`,
                        }}
                    />
                </div>

                <div
                    className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center text-center"
                    style={{
                        paddingBottom: '3.2rem',
                        animation: 'heroFadeUp 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s both',
                    }}
                >
                    <h1
                        className={charmonman.className}
                        style={{
                            fontWeight: 700,
                            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
                            color: '#ffffff',
                            letterSpacing: '0.01em',
                            lineHeight: 1.1,
                            marginBottom: '0',
                            textShadow: '0 2px 24px rgba(0,0,0,0.5)',
                        }}
                    >
                        Dr. Dadang I K Mujiono
                    </h1>

                    <p
                        style={{
                            fontFamily: 'var(--font-sans, sans-serif)',
                            fontWeight: 300,
                            fontSize: '0.82rem',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.72)',
                            marginTop: '1.5rem',
                        }}
                    >
                        Academic &nbsp;|&nbsp; Conservationist
                    </p>
                </div>
            </section>
        </>
    );
}