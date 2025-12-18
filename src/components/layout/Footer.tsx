// src/components/layout/Footer.tsx
import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center text-zinc-500 text-sm">
          <p>&copy; {currentYear} Dr. Dadang Ilham Kurniawan Mujiono. All rights reserved.</p>
          <p className="mt-2">Universitas Mulawarman - Fakultas Ilmu Sosial dan Politik</p>
        </div>
      </div>
    </footer>
  );
}