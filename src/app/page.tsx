import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import DescSection from '@/components/sections/DescSection';
import PublikasiSection from '@/components/sections/PublikasiSection';
import KontakSection from '@/components/sections/KontakSection';
import SectionDivider from '@/components/ui/SectionDivider';
import { getPublikasiWithTags, getPengabdian, getStatistik, getHeroContent, getDescContent } from '@/lib/supabase';

export const revalidate = 60;

export default async function Home() {

  const [publikasi, pengabdian, statistik, heroData, descData] = await Promise.all([
    getPublikasiWithTags(),
    getPengabdian(),
    getStatistik(),
    getHeroContent(),
    getDescContent()
  ]);

  return (
    <>
      <HeroSection initialData={heroData} />

      <SectionDivider />

      <DescSection initialData={descData} />

      <SectionDivider />

      <PublikasiSection publikasi={publikasi} />

      <SectionDivider />

      <KontakSection />
    </>
  );
}