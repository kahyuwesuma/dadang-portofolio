export type PublikasiKategori = 'Buku' | 'Jurnal' | 'Op-ed' | 'Press';

export interface Publikasi {
  id: string;
  judul: string;
  kategori: PublikasiKategori; 
  penulis: string;
  tahun: number;
  deskripsi?: string;
  url?: string;
  keywords?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface PengabdianMasyarakat {
  id: string;
  judul: string;
  tanggal: string;
  bulan_tahun: string;
  status: 'selesai' | 'ongoing' | 'planned';
  deskripsi: string;
  lokasi: string;
  jumlah_peserta?: string;
  keywords?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Statistik {
  id: string;
  label: string;
  nilai: string;
  deskripsi?: string;
  sub_deskripsi?: string;
  urutan: number;
  created_at?: string;
  updated_at?: string;
}

export type FilterKategori = 'all' | PublikasiKategori;

export interface CategoryBadgeProps {
  kategori: PublikasiKategori;
}

export interface FilterButtonProps {
  label: string;
  filter: FilterKategori;
  isActive: boolean;
  onClick: () => void;
}

export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}