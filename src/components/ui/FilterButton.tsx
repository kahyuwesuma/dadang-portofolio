'use client';

import React from 'react';
import type { FilterButtonProps } from '@/lib/types';

export default function FilterButton({ label, filter, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`filter-btn px-6 py-3 rounded-lg text-sm font-medium ${
        isActive ? 'active' : ''
      }`}
      data-filter={filter}
    >
      {label}
    </button>
  );
}