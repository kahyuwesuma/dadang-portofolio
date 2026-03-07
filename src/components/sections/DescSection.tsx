'use client';

import { useEffect, useRef } from 'react';

const romanNumerals = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV'];

const groups = [
    {
        label: 'Academia',
        entries: [
            `I am a researcher and lecturer specializing in maritime governance, eco-tourism, and the socio-political dynamics of coastal and sea communities in Indonesia, particularly in the Derawan Archipelago.`,
            `I earned my Bachelor's degree (S.Sos.) in International Relations from Universitas Mulawarman in 2011, where I examined aviation liberalization in Southeast Asia under the ASEAN Open Sky Policy. I later completed my Master's degree (M.A.) at Universitas Gadjah Mada, focusing on non-traditional security challenges faced by border communities in the Indonesia–Malaysia region, with a case study of Sebatik Island.`,
            `In 2013, after completing my master's degree, I joined the Department of International Relations at Universitas Mulawarman as a permanent lecturer at the age of 23. My teaching and research focus on maritime studies, multi-track diplomacy, eco-tourism, and border governance. I encourage students to understand international relations from Indonesia's coastal and island perspectives, including the roles of non-state actors in international affairs.`,
            `In 2020, I began my doctoral studies at the National University of Singapore under a competitive five-year research scholarship. I was awarded a Doctor of Philosophy (Ph.D.) in June 2025. My dissertation examines insider–outsider (Orang Dalam and/or Orang Luar) dynamics among maritime communities (Orang Laut/Orang Bajau) in the Derawan Archipelago, contributing to broader discussions on identity, governance, and maritime Southeast Asia.`,
        ],
    },
    {
        label: 'Scholarship',
        entries: [
            `In addition to teaching and research, I serve as a reviewer for Bhuvana: Journal of Global Studies, managed by Universitas Satya Negara Indonesia, contributing to the peer-review process and interdisciplinary scholarship on environmental governance and global issues.`,
            `I also write for local, national, and international media on topics ranging from local and national politics to environmental conservation. For me, writing is not only academic output; it is a form of public engagement and institutional dialogue, and a way to contribute directly to national development.`,
            `Since 2017, I have conducted sustained research on the Derawan Archipelago—primarily through university grants—on tourism development, community dynamics, and environmental governance. This long-term engagement has resulted in journal articles and books examining the intersection of identity, maritime heritage, eco-tourism, and conservation policy.`,
            `I have contributed to international media and documentary initiatives—such as ABC News and the Global Conservation Channel—focused on environmental governance and marine conservation.`,
        ],
    },
    {
        label: 'Conservation',
        entries: [
            `After several years of academic work in the Derawan Archipelago, in September 2023, I was invited to join Global Conservation, an international organization dedicated to protecting UNESCO World Heritage Sites from illegal and unsustainable activities. I initially served as Project Director for Derawan before being entrusted with the role of Director of Indonesia in 2024.`,
            `At Global Conservation, I supervise and coordinate marine conservation and community protection initiatives across Indonesia, with a primary mission in the Derawan Archipelago. My work includes strengthening protection mechanisms against illegal fishing and other unlawful activities in marine protected areas through the deployment of technology-based monitoring systems, including the Marine Monitor (M2), while promoting multi-stakeholder engagement to safeguard this critical ecosystem.`,
            `Through this initiative, I work closely with national and provincial authorities, marine police, the Navy, fisheries supervisors, local governments, and community stakeholders to enhance maritime oversight and improve coordination in conservation enforcement. My role bridges institutional engagement, field implementation, and long-term governance planning.`,
            `In recognition of these efforts, Global Conservation included my work as part of its "Heroes Protecting the Planet" initiative.`,
        ],
    },
    {
        label: 'Community',
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
            { threshold: 0.08 }
        );

        items.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    let paraIndex = 0;

    return (
        <>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Cormorant+Garamond:wght@300;400&family=Jost:wght@200;300;400&display=swap');

                .desc-item {
                    opacity: 0;
                    transform: translateY(26px);
                    transition: opacity 1s cubic-bezier(0.16,1,0.3,1),
                                transform 1s cubic-bezier(0.16,1,0.3,1);
                }
                .desc-item.desc-visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .desc-para:hover .desc-numeral {
                    opacity: 0.7 !important;
                }
                .desc-para:hover .desc-text {
                    color: rgba(255,255,255,0.88) !important;
                }
                .desc-text {
                    transition: color 0.4s ease;
                }
                .desc-numeral {
                    transition: opacity 0.4s ease;
                }
            `}</style>

            <section
                ref={sectionRef}
                id="deskripsi"
                style={{
                    background: '#060606',
                    padding: '8rem 0 10rem',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Subtle vignette */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                    background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 70%)',
                }} />

                {/* Noise grain */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.4,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
                    backgroundSize: '160px 160px',
                }} />

                <div style={{ maxWidth: '820px', margin: '0 auto', padding: '0 2.5rem', position: 'relative', zIndex: 1 }}>

                    {/* ── Opening ornament ── */}
                    <div className="desc-item" style={{ textAlign: 'center', marginBottom: '5.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', justifyContent: 'center' }}>
                            <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.12))' }} />
                            <span style={{
                                fontFamily: '"Cormorant Garamond", serif',
                                fontWeight: 300,
                                fontSize: '0.65rem',
                                letterSpacing: '0.45em',
                                textTransform: 'uppercase',
                                color: 'rgba(255,255,255,0.22)',
                            }}>
                                Curriculum Vitae
                            </span>
                            <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.12))' }} />
                        </div>
                    </div>

                    {/* ── Groups ── */}
                    {groups.map((group, gi) => {
                        const groupStart = paraIndex;
                        paraIndex += group.entries.length;

                        return (
                            <div key={gi} style={{ marginBottom: gi < groups.length - 1 ? '7rem' : 0 }}>

                                {/* Group header */}
                                <div
                                    className="desc-item"
                                    style={{ marginBottom: '3.2rem', transitionDelay: '0.04s' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
                                        {/* Vertical tick */}
                                        <div style={{
                                            width: '1px',
                                            height: '28px',
                                            background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)',
                                            flexShrink: 0,
                                        }} />
                                        <span style={{
                                            fontFamily: '"Jost", sans-serif',
                                            fontWeight: 200,
                                            fontSize: '0.58rem',
                                            letterSpacing: '0.42em',
                                            textTransform: 'uppercase',
                                            color: 'rgba(255,255,255,0.28)',
                                        }}>
                                            {group.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Paragraphs */}
                                {group.entries.map((text, pi) => {
                                    const absIndex = groupStart + pi;
                                    const delay = `${0.08 + pi * 0.08}s`;

                                    return (
                                        <div
                                            key={pi}
                                            className="desc-item desc-para"
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '2.8rem 1fr',
                                                columnGap: '2rem',
                                                marginBottom: pi < group.entries.length - 1 ? '2.8rem' : 0,
                                                transitionDelay: delay,
                                                cursor: 'default',
                                            }}
                                        >
                                            {/* Roman numeral */}
                                            <div
                                                className="desc-numeral"
                                                style={{
                                                    fontFamily: '"Cormorant Garamond", serif',
                                                    fontWeight: 300,
                                                    fontSize: '0.68rem',
                                                    color: 'rgba(255,255,255,0.18)',
                                                    letterSpacing: '0.06em',
                                                    paddingTop: '0.38rem',
                                                    textAlign: 'right',
                                                    userSelect: 'none',
                                                    lineHeight: 1,
                                                }}
                                            >
                                                {romanNumerals[absIndex]}
                                            </div>

                                            {/* Paragraph text */}
                                            <p
                                                className="desc-text"
                                                style={{
                                                    fontFamily: '"Cormorant", serif',
                                                    fontWeight: 300,
                                                    fontSize: '1.1rem',
                                                    lineHeight: 1.95,
                                                    color: 'rgba(255,255,255,0.52)',
                                                    margin: 0,
                                                    letterSpacing: '0.014em',
                                                }}
                                            >
                                                {text}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}

                    {/* ── Closing ornament ── */}
                    <div className="desc-item" style={{ marginTop: '6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.2rem' }}>
                        <div style={{ height: '1px', width: '50px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1))' }} />
                        <div style={{
                            width: '4px', height: '4px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            transform: 'rotate(45deg)',
                            flexShrink: 0,
                        }} />
                        <div style={{ height: '1px', width: '50px', background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.1))' }} />
                    </div>

                </div>
            </section>
        </>
    );
}