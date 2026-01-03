import type { PublikasiKategori } from './types';

export interface AdminUser {
  id: string;
  auth_user_id?: string;
  email: string;
  name: string;
  role: 'admin';
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at?: string;
}

export interface ActivityLog {
  id: string;
  admin_user_id?: string;
  admin_name?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  table_name: string;
  record_id?: string;
  old_data?: any;
  new_data?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface DashboardStats {
  total_publikasi: number;
  total_buku: number;
  total_jurnal: number;
  total_oped: number;
  total_press: number;
  total_pengabdian: number;
  pengabdian_selesai: number;
  pengabdian_ongoing: number;
  pengabdian_planned: number;
}

export interface PublikasiFormData {
  judul: string;
  kategori: PublikasiKategori;
  penulis: string;
  tahun: number;
  deskripsi?: string;
  url?: string;
  keywords?: string;
  tags: string[];
}

export interface PengabdianFormData {
  judul: string;
  tanggal: string;
  bulan_tahun: string;
  status: 'selesai' | 'ongoing' | 'planned';
  deskripsi: string;
  lokasi: string;
  jumlah_peserta?: string;
  keywords?: string;
}

export interface StatistikFormData {
  label: string;
  nilai: string;
  deskripsi?: string;
  sub_deskripsi?: string;
  urutan: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  user: AdminUser;
  token: string;
  expiresAt: number;
}

export type TableName = 'publikasi' | 'pengabdian' | 'statistik' | 'publikasi_tags';

export const PUBLIKASI_KATEGORI: Array<{ value: PublikasiKategori; label: string }> = [
  { value: 'Buku', label: 'Buku' },
  { value: 'Jurnal', label: 'Jurnal' },
  { value: 'Op-ed', label: 'Op-ed' },
  { value: 'Press', label: 'Press/News' },
];

export function getKategoriLabel(kategori: PublikasiKategori): string {
  const item = PUBLIKASI_KATEGORI.find((k) => k.value === kategori);
  return item?.label || kategori;
}

export function getKategoriColor(kategori: PublikasiKategori): string {
  const colors: Record<PublikasiKategori, string> = {
    'Buku': 'bg-emerald-500/20 text-emerald-400',
    'Jurnal': 'bg-blue-500/20 text-blue-400',
    'Op-ed': 'bg-purple-500/20 text-purple-400',
    'Press': 'bg-amber-500/20 text-amber-400',
  };
  return colors[kategori] || 'bg-zinc-500/20 text-zinc-400';
}

export function isValidKategori(value: string): value is PublikasiKategori {
  return ['buku', 'jurnal', 'op-ed', 'press'].includes(value);
}