'use client';

import Image from 'next/image';

export default function HeroSection() {
    return (
        <section id="profil" className="relative h-screen flex items-center overflow-hidden bg-black">
            {/* Left Half: Image with Gradient Overlay */}
            <div className="absolute inset-0 w-1/2 left-0">
                {/* Dummy Image */}
                <div className="w-full h-full relative">
                    {/* Sophisticated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black">
                        {/* Subtle pattern overlay */}
                        <div className="absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                                backgroundSize: '50px 50px'
                            }}
                        />
                    </div>

                    {/* Portrait silhouette */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                            {/* Large circular avatar */}
                            <div className="w-96 h-96 rounded-full bg-gradient-to-br from-zinc-700/50 to-zinc-800/50 backdrop-blur-sm flex items-center justify-center border border-zinc-600/20 relative overflow-hidden">
                                {/* Animated rings */}
                                <div className="absolute inset-0 rounded-full border-2 border-white/5 animate-[spin_20s_linear_infinite]" />
                                <div className="absolute inset-8 rounded-full border border-white/5 animate-[spin_15s_linear_infinite_reverse]" />

                                <Image
                                    src="/images/profile.png"
                                    alt="Profile photo"
                                    fill
                                    className="object-cover rounded-full"
                                />

                            </div>

                            {/* Floating orbs */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/5 blur-3xl animate-pulse" />
                            <div className="absolute -bottom-20 -left-20 w-32 h-32 rounded-full bg-white/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                        </div>
                    </div>
                </div>

                {/* Gradient fade to right */}
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-black" />
            </div>

            {/* Right Half: Content with Fade-in Effect */}
            <div className="relative w-full h-full flex items-center">
                <div className="w-1/2 ml-auto px-12 lg:px-16 xl:px-20">
                    {/* Animated line */}
                    <div className="flex items-center gap-4 mb-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
                        <div className="h-px w-16 bg-gradient-to-r from-white/60 to-transparent" />
                        <span className="text-zinc-500 text-xs tracking-[0.3em] uppercase font-light">
                            Academic and Conservationist
                        </span>
                    </div>

                    {/* Name with staggered animation */}
                    <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-[1.1] opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]">
                        <span className="block bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
                            Dr. Dadang
                        </span>
                        <span className="block bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
                            I K Mujiono
                        </span>
                    </h1>

                    {/* Description with fade */}
                    <div className="space-y-4 mb-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]">
                        <p className="text-zinc-400 text-base lg:text-lg leading-relaxed max-w-xl">
                            Researcher and lecturer specializing in{' '}
                            <span className="text-white font-medium relative inline-block">
                                maritime governance
                                <span className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-white/60 to-transparent" />
                            </span>
                            ,{' '}
                            <span className="text-white font-medium relative inline-block">
                                eco-tourism
                                <span className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-white/60 to-transparent" />
                            </span>
                            , and socio-political dynamics of coastal communities in Indonesia.
                        </p>
                    </div>

                    {/* Key achievements - minimal design */}
                    <div className="space-y-3 mb-10 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.8s_forwards]">
                        <div className="flex items-start gap-4 group">
                            <div className="w-1 h-1 rounded-full bg-white mt-2.5 group-hover:scale-150 transition-transform" />
                            <p className="text-zinc-300 text-sm lg:text-base">
                                <span className="text-white font-semibold">Ph.D.</span> from National University of Singapore
                            </p>
                        </div>
                        <div className="flex items-start gap-4 group">
                            <div className="w-1 h-1 rounded-full bg-white mt-2.5 group-hover:scale-150 transition-transform" />
                            <p className="text-zinc-300 text-sm lg:text-base">
                                Director of Indonesia at <span className="text-white font-semibold">Global Conservation</span>
                            </p>
                        </div>
                        <div className="flex items-start gap-4 group">
                            <div className="w-1 h-1 rounded-full bg-white mt-2.5 group-hover:scale-150 transition-transform" />
                            <p className="text-zinc-300 text-sm lg:text-base">
                                Chairman of <span className="text-white font-semibold">Yayasan Laut Biru Kepulauan Derawan</span>
                            </p>
                        </div>
                    </div>

                    {/* CTA Buttons - minimal & elegant */}
                    <div className="flex gap-4 opacity-0 animate-[fadeInUp_0.8s_ease-out_1s_forwards]">
                        <a
                            href="#publikasi"
                            className="group relative px-8 py-3.5 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white transition-transform group-hover:scale-105" />
                            <span className="relative text-black font-medium text-sm tracking-wide">
                                View Publications
                            </span>
                        </a>
                        <a
                            href="#kontak"
                            className="group relative px-8 py-3.5 overflow-hidden border border-white/20"
                        >
                            <div className="absolute inset-0 bg-white/0 transition-all group-hover:bg-white/10" />
                            <span className="relative text-white font-medium text-sm tracking-wide">
                                Contact
                            </span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-[fadeIn_0.8s_ease-out_1.5s_forwards]">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-zinc-600 text-xs tracking-widest">SCROLL</span>
                    <svg className="w-5 h-5 text-zinc-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
        </section>
    );
}