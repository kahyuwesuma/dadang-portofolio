'use client';

import React from 'react';
import type { SearchBoxProps } from '@/lib/types';

export default function SearchBox({ value, onChange, placeholder }: SearchBoxProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="search-box w-full px-6 py-4 rounded-lg text-white"
    />
  );
}