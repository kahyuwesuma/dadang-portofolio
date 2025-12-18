import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import PublikasiSection from '@/components/sections/PublikasiSection';
import PengabdianSection from '@/components/sections/PengabdianSection';
import KontakSection from '@/components/sections/KontakSection';
import SectionDivider from '@/components/ui/SectionDivider';
import { getPublikasiWithTags, getPengabdian, getStatistik } from '@/lib/supabase';

export const revalidate = 60; 

export default async function Home() {
  
  const [publikasi, pengabdian, statistik] = await Promise.all([
    getPublikasiWithTags(),
    getPengabdian(),
    getStatistik()
    
  ]);

  return (
    <>
      <HeroSection statistik={statistik} />

      <SectionDivider />

      <PublikasiSection publikasi={publikasi} />

      <SectionDivider />

      <PengabdianSection pengabdian={pengabdian} />

      <SectionDivider />

      <KontakSection />
    </>
  );
}