'use client';

import { useEffect, useRef } from 'react';

const romanNumerals = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV'];

const groups = [
    {
        label: 'Academia',
        index: '01',
        entries: [
            `I am a researcher and lecturer specializing in maritime governance, eco-tourism, and the socio-political dynamics of coastal and sea communities in Indonesia, particularly in the Derawan Archipelago.`,
            `I earned my Bachelor's degree (S.Sos.) in International Relations from Universitas Mulawarman in 2011, where I examined aviation liberalization in Southeast Asia under the ASEAN Open Sky Policy. I later completed my Master's degree (M.A.) at Universitas Gadjah Mada, focusing on non-traditional security challenges faced by border communities in the Indonesia–Malaysia region, with a case study of Sebatik Island.`,
            `In 2013, after completing my master's degree, I joined the Department of International Relations at Universitas Mulawarman as a permanent lecturer at the age of 23. My teaching and research focus on maritime studies, multi-track diplomacy, eco-tourism, and border governance. I encourage students to understand international relations from Indonesia's coastal and island perspectives, including the roles of non-state actors in international affairs.`,
            `In 2020, I began my doctoral studies at the National University of Singapore under a competitive five-year research scholarship. I was awarded a Doctor of Philosophy (Ph.D.) in June 2025. My dissertation examines insider–outsider (Orang Dalam and/or Orang Luar) dynamics among maritime communities (Orang Laut/Orang Bajau) in the Derawan Archipelago, contributing to broader discussions on identity, governance, and maritime Southeast Asia.`,
        ],
    },
    {
        label: 'Scholarship',
        index: '02',
        entries: [
            `In addition to teaching and research, I serve as a reviewer for Bhuvana: Journal of Global Studies, managed by Universitas Satya Negara Indonesia, contributing to the peer-review process and interdisciplinary scholarship on environmental governance and global issues.`,
            `I also write for local, national, and international media on topics ranging from local and national politics to environmental conservation. For me, writing is not only academic output; it is a form of public engagement and institutional dialogue, and a way to contribute directly to national development.`,
            `Since 2017, I have conducted sustained research on the Derawan Archipelago—primarily through university grants—on tourism development, community dynamics, and environmental governance. This long-term engagement has resulted in journal articles and books examining the intersection of identity, maritime heritage, eco-tourism, and conservation policy.`,
            `I have contributed to international media and documentary initiatives—such as ABC News and the Global Conservation Channel—focused on environmental governance and marine conservation.`,
        ],
    },
    {
        label: 'Conservation',
        index: '03',
        entries: [
            `After several years of academic work in the Derawan Archipelago, in September 2023, I was invited to join Global Conservation, an international organization dedicated to protecting UNESCO World Heritage Sites from illegal and unsustainable activities. I initially served as Project Director for Derawan before being entrusted with the role of Director of Indonesia in 2024.`,
            `At Global Conservation, I supervise and coordinate marine conservation and community protection initiatives across Indonesia, with a primary mission in the Derawan Archipelago. My work includes strengthening protection mechanisms against illegal fishing and other unlawful activities in marine protected areas through the deployment of technology-based monitoring systems, including the Marine Monitor (M2), while promoting multi-stakeholder engagement to safeguard this critical ecosystem.`,
            `Through this initiative, I work closely with national and provincial authorities, marine police, the Navy, fisheries supervisors, local governments, and community stakeholders to enhance maritime oversight and improve coordination in conservation enforcement. My role bridges institutional engagement, field implementation, and long-term governance planning.`,
            `In recognition of these efforts, Global Conservation included my work as part of its "Heroes Protecting the Planet" initiative.`,
        ],
    },
    {
        label: 'Community',
        index: '04',
        entries: [
            `To strengthen local implementation of conservation initiatives, I established Yayasan Laut Biru Kepulauan Derawan (YLBKD), where I serve as Chairman. Through YLBKD, I focus on community protection by investing in local capacity-building initiatives, including training programs, environmental education, skill-development courses, and support for fishers transitioning to more sustainable fishing practices. I believe conservation must be accompanied by human resource development and long-term community resilience.`,
            `Outside my professional commitments, I maintain an active lifestyle and train regularly at both private and commercial gyms. I have also resumed diving—both as part of my responsibility in marine conservation and as a personal commitment to understanding and appreciating the underwater ecosystems, especially the Derawan Archipelago and beyond.`,
            `I am a husband and father, and I view my work in academia and conservation as part of a broader responsibility toward future generations.`,
        ],
    },
];

export default function DescSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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
    }, []);

    let paraIndex = 0;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@100;200;300;400&display=swap');

                .desc-item {
                    opacity: 0;
                    transform: translateY(28px);
                    transition: opacity 1.2s cubic-bezier(0.16,1,0.3,1),
                                transform 1.2s cubic-bezier(0.16,1,0.3,1);
                }
                .desc-item.desc-visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .desc-para::before {
                    content: '';
                    position: absolute;
                    left: -1.5rem;
                    top: 0;
                    bottom: 0;
                    width: 1px;
                    background: linear-gradient(
                        to bottom,
                        transparent,
                        rgba(255,255,255,0.14) 20%,
                        rgba(255,255,255,0.14) 80%,
                        transparent
                    );
                    transform: scaleY(0);
                    transform-origin: top;
                    transition: transform 0.7s cubic-bezier(0.16,1,0.3,1);
                }
                .desc-para:hover::before { transform: scaleY(1); }
                .desc-para:hover .desc-numeral { color: rgba(255,255,255,0.6) !important; transform: translateY(-2px); }
                .desc-para:hover .desc-text   { color: rgba(255,255,255,0.9) !important; }

                .desc-text    { transition: color 0.6s cubic-bezier(0.16,1,0.3,1); }
                .desc-numeral { transition: color 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1); }

                .group-label-text { position: relative; display: inline-block; }
                .group-label-text::after {
                    content: '';
                    position: absolute;
                    bottom: -3px; left: 0;
                    width: 0; height: 1px;
                    background: rgba(255,255,255,0.35);
                    transition: width 1.4s cubic-bezier(0.16,1,0.3,1) 0.2s;
                }
                .desc-visible .group-label-text::after { width: 100%; }

                .desc-group {
                    display: grid;
                    grid-template-columns: 11rem 1fr;
                    column-gap: 4rem;
                }
                .desc-label-col { display: block; }
                .desc-label-inner { position: sticky; top: 7rem; }

                @media (max-width: 640px) {
                    .desc-group { display: block; }
                    .desc-label-col { margin-bottom: 2rem; }
                    .desc-label-inner { position: static; display: flex; align-items: center; gap: 1rem; }
                    .desc-label-index { font-size: 2.8rem !important; margin-bottom: 0 !important; }
                    .desc-label-divider { display: none !important; }
                    .desc-para-grid { grid-template-columns: 1.6rem 1fr !important; column-gap: 1rem !important; }
                    .desc-para::before { left: -0.8rem; }
                    .desc-text-p { font-size: 1rem !important; line-height: 1.85 !important; }
                    .desc-section-inner { padding: 0 1.4rem !important; }
                    .desc-section-root { padding: 6rem 0 8rem !important; }
                    .desc-group-gap { margin-bottom: 5.5rem !important; }
                    .desc-closing { margin-top: 5rem !important; }
                }

                @media (min-width: 641px) and (max-width: 900px) {
                    .desc-group { grid-template-columns: 8rem 1fr; column-gap: 2.5rem; }
                    .desc-label-index { font-size: 3rem !important; }
                    .desc-text-p { font-size: 1.05rem !important; }
                    .desc-section-inner { padding: 0 2rem !important; }
                }
            `}</style>

            <section
                ref={sectionRef}
                id="deskripsi"
                className="desc-section-root"
                style={{
                    background: '#080806',
                    padding: '11rem 0 13rem',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.55,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px',
                }} />

                <div
                    className="desc-section-inner"
                    style={{ maxWidth: '900px', margin: '0 auto', padding: '0 3rem', position: 'relative', zIndex: 1 }}
                >
                    {groups.map((group, gi) => {
                        const groupStart = paraIndex;
                        paraIndex += group.entries.length;

                        return (
                            <div
                                key={gi}
                                className={`desc-group ${gi < groups.length - 1 ? 'desc-group-gap' : ''}`}
                                style={{ marginBottom: gi < groups.length - 1 ? '9rem' : 0 }}
                            >
                                <div className="desc-label-col">
                                    <div className="desc-item desc-label-inner" style={{ transitionDelay: '0.04s' }}>
                                        <div
                                            className="desc-label-index"
                                            style={{
                                                fontFamily: '"Jost", sans-serif',
                                                fontWeight: 100,
                                                fontSize: '4.5rem',
                                                lineHeight: 1,
                                                color: 'rgba(255,255,255,0.08)',
                                                letterSpacing: '-0.02em',
                                                marginBottom: '1.4rem',
                                                userSelect: 'none',
                                            }}
                                        >
                                            {group.index}
                                        </div>

                                        <div
                                            className="desc-label-divider"
                                            style={{
                                                width: '20px',
                                                height: '1px',
                                                background: 'rgba(255,255,255,0.32)',
                                                marginBottom: '1.1rem',
                                            }}
                                        />

                                        <div
                                            className="group-label-text"
                                            style={{
                                                fontFamily: '"Jost", sans-serif',
                                                fontWeight: 200,
                                                fontSize: '0.56rem',
                                                letterSpacing: '0.38em',
                                                textTransform: 'uppercase',
                                                color: 'rgba(255,255,255,0.5)',
                                            }}
                                        >
                                            {group.label}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    {group.entries.map((text, pi) => {
                                        const absIndex = groupStart + pi;
                                        const delay = `${0.1 + pi * 0.1}s`;

                                        return (
                                            <div
                                                key={pi}
                                                className="desc-item desc-para"
                                                style={{
                                                    position: 'relative',
                                                    display: 'grid',
                                                    gridTemplateColumns: '2.4rem 1fr',
                                                    columnGap: '1.8rem',
                                                    marginBottom: pi < group.entries.length - 1 ? '3.4rem' : 0,
                                                    transitionDelay: delay,
                                                    cursor: 'default',
                                                    paddingLeft: '0.2rem',
                                                }}
                                            >
                                                <div
                                                    className="desc-numeral desc-para-grid"
                                                    style={{
                                                        fontFamily: '"Cormorant Garamond", serif',
                                                        fontWeight: 300,
                                                        fontSize: '0.62rem',
                                                        color: 'rgba(255,255,255,0.38)',
                                                        letterSpacing: '0.08em',
                                                        paddingTop: '0.52rem',
                                                        textAlign: 'right',
                                                        userSelect: 'none',
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    {romanNumerals[absIndex]}
                                                </div>

                                                <p
                                                    className="desc-text desc-text-p"
                                                    style={{
                                                        fontFamily: '"EB Garamond", serif',
                                                        fontWeight: 400,
                                                        fontSize: '1.13rem',
                                                        lineHeight: 2,
                                                        color: 'rgba(255,255,255,0.78)',
                                                        margin: 0,
                                                        letterSpacing: '0.012em',
                                                    }}
                                                >
                                                    {text}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}

                    <div
                        className="desc-item desc-closing"
                        style={{
                            marginTop: '8rem',
                            paddingTop: '3rem',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div style={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontWeight: 300,
                            fontSize: '0.72rem',
                            fontStyle: 'italic',
                            color: 'rgba(255,255,255,0.35)',
                            letterSpacing: '0.06em',
                        }}>
                            Samarinda · East Kalimantan
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                            <div style={{ height: '1px', width: '32px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.22))' }} />
                            <div style={{
                                width: '5px', height: '5px',
                                border: '1px solid rgba(255,255,255,0.3)',
                                transform: 'rotate(45deg)',
                                flexShrink: 0,
                            }} />
                            <div style={{ height: '1px', width: '32px', background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.22))' }} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}