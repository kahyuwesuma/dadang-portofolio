import React from 'react';
import type { Statistik } from '@/lib/types';

interface StatCardProps {
  stat: Statistik;
}

export default function StatCard({ stat }: StatCardProps) {
  return (
    <div className="stat-card p-8 rounded-xl">
      <div className="text-5xl font-bold mb-2">{stat.nilai}</div>
      <div className="text-zinc-400 text-sm">{stat.deskripsi}</div>
      {stat.sub_deskripsi && (
        <div className="text-zinc-600 text-xs mt-1">{stat.sub_deskripsi}</div>
      )}
    </div>
  );
}