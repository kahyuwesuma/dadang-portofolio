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

                /* Desktop: crop ke area tengah-atas (landscape foto) */
                .hero-image {
                    object-position: center 18%;
                }

                /* Tablet portrait (≤ 900px) */
                @media (max-width: 900px) {
                    .hero-image {
                        object-position: 30% 12%;
                    }
                }

                /* Mobile (≤ 600px): wajah di sisi kiri — tarik ke kiri */
                @media (max-width: 600px) {
                    .hero-image {
                        object-position: 18% 15%;
                    }
                }

                /* Tiny phones (≤ 400px) */
                @media (max-width: 400px) {
                    .hero-image {
                        object-position: 12% 15%;
                    }
                }

                .hero-title {
                    font-size: clamp(2.2rem, 7vw, 5rem);
                }

                .hero-sub {
                    font-size: clamp(0.68rem, 2.5vw, 0.82rem);
                    letter-spacing: 0.18em;
                }

                /* Tighten bottom padding on small screens */
                @media (max-width: 600px) {
                    .hero-content {
                        padding-bottom: 2rem !important;
                    }
                    .hero-title {
                        font-size: clamp(1.9rem, 9vw, 2.8rem) !important;
                    }
                }
            `}</style>

            <section
                id="profil"
                className="relative w-full overflow-hidden"
                style={{ height: '100svh', minHeight: '580px' }}
            >
                <div className="absolute inset-0">
                    <Image
                        src="/images/profile4.jpeg"
                        alt="Dr. Dadang I K Mujiono"
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 900px) 100vw, 100vw"
                        priority
                        quality={90}
                        className="hero-image object-cover"
                    />

                    {/* Gradient — lebih gelap di bawah agar teks terbaca */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(
                                to bottom,
                                rgba(0,0,0,0.08)  0%,
                                rgba(0,0,0,0.02) 25%,
                                rgba(0,0,0,0.18) 52%,
                                rgba(0,0,0,0.70) 78%,
                                rgba(0,0,0,0.86) 100%
                            )`,
                        }}
                    />
                </div>

                <div
                    className="hero-content absolute inset-x-0 bottom-0 z-10 flex flex-col items-center text-center"
                    style={{
                        paddingBottom: '3.2rem',
                        paddingLeft: '1.25rem',
                        paddingRight: '1.25rem',
                        animation: 'heroFadeUp 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s both',
                    }}
                >
                    <h1
                        className={`${charmonman.className} hero-title`}
                        style={{
                            fontWeight: 700,
                            color: '#ffffff',
                            letterSpacing: '0.01em',
                            lineHeight: 1.12,
                            marginBottom: 0,
                            textShadow: '0 2px 28px rgba(0,0,0,0.55)',
                        }}
                    >
                        Dr. Dadang I K Mujiono
                    </h1>

                    <p
                        className="hero-sub"
                        style={{
                            fontFamily: 'var(--font-sans, sans-serif)',
                            fontWeight: 300,
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.72)',
                            marginTop: '1.4rem',
                        }}
                    >
                        Academic &nbsp;|&nbsp; Conservationist
                    </p>
                </div>
            </section>
        </>
    );
}