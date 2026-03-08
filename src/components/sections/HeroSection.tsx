'use client';

import Image from 'next/image';

export default function HeroSection() {
    return (
        <section id="profil" className="relative w-full overflow-hidden" style={{ height: '100vh', minHeight: '620px' }}>

            {/* ── Full-width Photo ── */}
            <div className="absolute inset-0">
                <Image
                    src="/images/profile2.2.png"
                    alt="Dr. Dadang I K Mujiono"
                    fill
                    sizes="100vw"
                    priority
                    className="object-cover"
                    style={{ objectPosition: 'center 18%' }}
                />

                {/* Gradient — light on top, heavy at bottom like the Word design */}
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

            {/* ── Name & Title — bottom center ── */}
            <div
                className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center text-center"
                style={{
                    paddingBottom: '3.2rem',
                    animation: 'heroFadeUp 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s both',
                }}
            >
                <h1
                    style={{
                        fontFamily: '"Dancing Script", cursive',
                        fontWeight: 600,
                        fontSize: 'clamp(2.8rem, 6vw, 5rem)',
                        color: '#ffffff',
                        letterSpacing: '0.01em',
                        lineHeight: 1.1,
                        marginBottom: '0.45rem',
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
                    }}
                >
                    Academic &nbsp;|&nbsp; Conservationist
                </p>
            </div>

            {/* ── Google Font import + keyframe ── */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap');

                @keyframes heroFadeUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
}