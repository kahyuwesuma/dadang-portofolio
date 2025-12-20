// src/lib/admin-supabase.ts

import { supabase } from './supabase';
import type {
  AdminUser,
  ActivityLog,
  DashboardStats,
  PublikasiFormData,
  PengabdianFormData,
  StatistikFormData,
} from './admin-types';
import type { Publikasi, PengabdianMasyarakat, Statistik } from './types';

// ============================================
// Dashboard Functions
// ============================================

export async function getDashboardStats(): Promise<DashboardStats | null> {
  const { data, error } = await supabase
    .from('v_admin_dashboard_stats')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }

  return data as DashboardStats;
}

export async function getRecentActivities(limit: number = 10): Promise<ActivityLog[]> {
  const { data, error } = await supabase.rpc('get_recent_activities', {
    limit_count: limit,
  });

  if (error) {
    console.error('Error fetching recent activities:', error);
    return [];
  }

  return data as ActivityLog[];
}

// ============================================
// Publikasi CRUD
// ============================================

export async function createPublikasi(
  data: PublikasiFormData,
  adminUserId: string
): Promise<{ success: boolean; data?: Publikasi; error?: string }> {
  try {
    const { data: publikasi, error: insertError } = await supabase
      .from('publikasi')
      .insert({
        judul: data.judul,
        kategori: data.kategori,
        penulis: data.penulis,
        tahun: data.tahun,
        deskripsi: data.deskripsi,
        url: data.url,
        keywords: data.keywords,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    if (data.tags && data.tags.length > 0 && publikasi) {
      const tagsData = data.tags.map((tag) => ({
        publikasi_id: publikasi.id,
        tag_name: tag,
      }));

      const { error: tagsError } = await supabase
        .from('publikasi_tags')
        .insert(tagsData);

      if (tagsError) console.error('Error inserting tags:', tagsError);
    }

    await logActivity(adminUserId, 'CREATE', 'publikasi', publikasi.id, null, publikasi);

    return { success: true, data: publikasi as Publikasi };
  } catch (error: any) {
    console.error('Error creating publikasi:', error);
    return { success: false, error: error.message };
  }
}

export async function updatePublikasi(
  id: string,
  data: Partial<PublikasiFormData>,
  adminUserId: string
): Promise<{ success: boolean; data?: Publikasi; error?: string }> {
  try {
    const { data: oldData } = await supabase
      .from('publikasi')
      .select('*')
      .eq('id', id)
      .single();

    // Update publikasi
    const { data: publikasi, error: updateError } = await supabase
      .from('publikasi')
      .update({
        judul: data.judul,
        kategori: data.kategori,
        penulis: data.penulis,
        tahun: data.tahun,
        deskripsi: data.deskripsi,
        url: data.url,
        keywords: data.keywords,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    if (data.tags !== undefined) {
      await supabase.from('publikasi_tags').delete().eq('publikasi_id', id);

      // Insert new tags
      if (data.tags.length > 0) {
        const tagsData = data.tags.map((tag) => ({
          publikasi_id: id,
          tag_name: tag,
        }));

        await supabase.from('publikasi_tags').insert(tagsData);
      }
    }

    await logActivity(adminUserId, 'UPDATE', 'publikasi', id, oldData, publikasi);

    return { success: true, data: publikasi as Publikasi };
  } catch (error: any) {
    console.error('Error updating publikasi:', error);
    return { success: false, error: error.message };
  }
}

export async function deletePublikasi(
  id: string,
  adminUserId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: oldData } = await supabase
      .from('publikasi')
      .select('*')
      .eq('id', id)
      .single();

    const { error: deleteError } = await supabase
      .from('publikasi')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    await logActivity(adminUserId, 'DELETE', 'publikasi', id, oldData, null);

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting publikasi:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// Pengabdian CRUD
// ============================================

export async function createPengabdian(
  data: PengabdianFormData,
  adminUserId: string
): Promise<{ success: boolean; data?: PengabdianMasyarakat; error?: string }> {
  try {
    const { data: pengabdian, error: insertError } = await supabase
      .from('pengabdian')
      .insert(data)
      .select()
      .single();

    if (insertError) throw insertError;

    await logActivity(adminUserId, 'CREATE', 'pengabdian', pengabdian.id, null, pengabdian);

    return { success: true, data: pengabdian as PengabdianMasyarakat };
  } catch (error: any) {
    console.error('Error creating pengabdian:', error);
    return { success: false, error: error.message };
  }
}

export async function updatePengabdian(
  id: string,
  data: Partial<PengabdianFormData>,
  adminUserId: string
): Promise<{ success: boolean; data?: PengabdianMasyarakat; error?: string }> {
  try {
    // Get old data
    const { data: oldData } = await supabase
      .from('pengabdian')
      .select('*')
      .eq('id', id)
      .single();

    // Update
    const { data: pengabdian, error: updateError } = await supabase
      .from('pengabdian')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Log activity
    await logActivity(adminUserId, 'UPDATE', 'pengabdian', id, oldData, pengabdian);

    return { success: true, data: pengabdian as PengabdianMasyarakat };
  } catch (error: any) {
    console.error('Error updating pengabdian:', error);
    return { success: false, error: error.message };
  }
}

export async function deletePengabdian(
  id: string,
  adminUserId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: oldData } = await supabase
      .from('pengabdian')
      .select('*')
      .eq('id', id)
      .single();

    // Delete
    const { error: deleteError } = await supabase
      .from('pengabdian')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    // Log activity
    await logActivity(adminUserId, 'DELETE', 'pengabdian', id, oldData, null);

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting pengabdian:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// Statistik CRUD
// ============================================

export async function createStatistik(
  data: StatistikFormData,
  adminUserId: string
): Promise<{ success: boolean; data?: Statistik; error?: string }> {
  try {
    const { data: statistik, error: insertError } = await supabase
      .from('statistik')
      .insert(data)
      .select()
      .single();

    if (insertError) throw insertError;

    await logActivity(adminUserId, 'CREATE', 'statistik', statistik.id, null, statistik);

    return { success: true, data: statistik as Statistik };
  } catch (error: any) {
    console.error('Error creating statistik:', error);
    return { success: false, error: error.message };
  }
}

export async function updateStatistik(
  id: string,
  data: Partial<StatistikFormData>,
  adminUserId: string
): Promise<{ success: boolean; data?: Statistik; error?: string }> {
  try {
    const { data: oldData } = await supabase
      .from('statistik')
      .select('*')
      .eq('id', id)
      .single();

    const { data: statistik, error: updateError } = await supabase
      .from('statistik')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    await logActivity(adminUserId, 'UPDATE', 'statistik', id, oldData, statistik);

    return { success: true, data: statistik as Statistik };
  } catch (error: any) {
    console.error('Error updating statistik:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteStatistik(
  id: string,
  adminUserId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: oldData } = await supabase
      .from('statistik')
      .select('*')
      .eq('id', id)
      .single();

    const { error: deleteError } = await supabase
      .from('statistik')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    await logActivity(adminUserId, 'DELETE', 'statistik', id, oldData, null);

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting statistik:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// Activity Logging
// ============================================

async function logActivity(
  adminUserId: string,
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  tableName: string,
  recordId: string,
  oldData: any,
  newData: any
): Promise<void> {
  try {
    await supabase.rpc('log_activity', {
      p_admin_user_id: adminUserId,
      p_action: action,
      p_table_name: tableName,
      p_record_id: recordId,
      p_old_data: oldData,
      p_new_data: newData,
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

// ============================================
// Admin User Functions
// ============================================

export async function getAdminUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, email, name, role, is_active, last_login, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }

  return data as AdminUser[];
}

export async function getAdminUser(id: string): Promise<AdminUser | null> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, email, name, role, is_active, last_login, created_at')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching admin user:', error);
    return null;
  }

  return data as AdminUser;
}