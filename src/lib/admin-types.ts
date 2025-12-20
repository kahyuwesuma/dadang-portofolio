export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
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
  activities_this_week: number;
}

export interface PublikasiFormData {
  judul: string;
  kategori: 'buku' | 'jurnal' | 'op-ed' | 'press';
  penulis: string;
  tahun: number;
  deskripsi?: string;
  url?: string;
  keywords?: string;
  tags?: string[];
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