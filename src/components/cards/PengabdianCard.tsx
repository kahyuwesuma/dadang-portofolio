'use client';

import React from 'react';
import { MapPin, Users } from 'lucide-react';
import type { PengabdianMasyarakat } from '@/lib/types';

interface PengabdianCardProps {
  pengabdian: PengabdianMasyarakat;
}

const statusColors = {
  selesai: 'bg-green-900/30 text-green-400',
  ongoing: 'bg-blue-900/30 text-blue-400',
  planned: 'bg-amber-900/30 text-amber-400',
};

const statusLabels = {
  selesai: 'Selesai',
  ongoing: 'Sedang Berjalan',
  planned: 'Direncanakan',
};

export default function PengabdianCard({ pengabdian }: PengabdianCardProps) {
  return (
    <div
      className="timeline-item card-hover p-8 rounded-xl pengabdian-card"
      data-title={pengabdian.judul.toLowerCase()}
      data-keywords={pengabdian.keywords?.toLowerCase() || ''}
    >
      <div className="flex flex-col md:flex-row justify-between md:items-start mb-4 gap-3">
        <div className="text-zinc-500 text-sm">{pengabdian.bulan_tahun}</div>
        <div className={`${statusColors[pengabdian.status]} px-4 py-1.5 rounded-full text-xs font-medium`}>
          {statusLabels[pengabdian.status]}
        </div>
      </div>
      
      <h3 className="text-2xl font-semibold mb-3">{pengabdian.judul}</h3>
      
      <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
        {pengabdian.deskripsi}
      </p>
      
      <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{pengabdian.lokasi}</span>
        </div>
        
        {pengabdian.jumlah_peserta && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{pengabdian.jumlah_peserta}</span>
          </div>
        )}
      </div>
    </div>
  );
}