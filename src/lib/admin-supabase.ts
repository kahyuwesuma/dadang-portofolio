// src/lib/admin-supabase.ts (UPDATED VERSION)

import { supabase } from './supabase';
import { getCurrentAdminUser } from './supabase-auth';
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
// Helper: Get Admin User ID from current session
// ============================================

async function getAdminUserId(): Promise<string | null> {
  const adminUser = await getCurrentAdminUser();
  return adminUser?.id || null;
}

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
  data: PublikasiFormData
): Promise<{ success: boolean; data?: Publikasi; error?: string }> {
  try {
    const adminUserId = await getAdminUserId();
    if (!adminUserId) throw new Error('Not authenticated');

    // Insert publikasi
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

    // Insert tags if any
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

    // Log activity
    if (adminUserId) {
      await logActivity(adminUserId, 'CREATE', 'publikasi', publikasi.id, null, publikasi);
    }

    return { success: true, data: publikasi as Publikasi };
  } catch (error: any) {
    console.error('Error creating publikasi:', error);
    return { success: false, error: error.message };
  }
}

export async function updatePublikasi(
  id: string,
  data: Partial<PublikasiFormData>
): Promise<{ success: boolean; data?: Publikasi; error?: string }> {
  try {
    const adminUserId = await getAdminUserId();
    if (!adminUserId) throw new Error('Not authenticated');

    // Get old data first
    const { data: oldData } = await supabase
      .from('publikasi')
      .select('*')
      .eq('id', id)
      .single();

    // Build update object with only defined fields
    const updateData: any = {};
    if (data.judul !== undefined) updateData.judul = data.judul;
    if (data.kategori !== undefined) updateData.kategori = data.kategori;
    if (data.penulis !== undefined) updateData.penulis = data.penulis;
    if (data.tahun !== undefined) updateData.tahun = data.tahun;
    if (data.deskripsi !== undefined) updateData.deskripsi = data.deskripsi;
    if (data.url !== undefined) updateData.url = data.url;
    if (data.keywords !== undefined) updateData.keywords = data.keywords;

    // Update publikasi
    const { data: publikasi, error: updateError } = await supabase
      .from('publikasi')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Update tags if provided
    if (data.tags !== undefined) {
      // Delete old tags
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

    // Log activity
    if (adminUserId) {
      await logActivity(adminUserId, 'UPDATE', 'publikasi', id, oldData, publikasi);
    }

    return { success: true, data: publikasi as Publikasi };
  } catch (error: any) {
    console.error('Error updating publikasi:', error);
    return { success: false, error: error.message };
  }
}

export async function deletePublikasi(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminUserId = await getAdminUserId();
    if (!adminUserId) throw new Error('Not authenticated');

    // Get data before delete for logging
    const { data: oldData } = await supabase
      .from('publikasi')
      .select('*')
      .eq('id', id)
      .single();

    // Delete (cascade will handle tags)
    const { error: deleteError } = await supabase
      .from('publikasi')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    // Log activity
    if (adminUserId) {
      await logActivity(adminUserId, 'DELETE', 'publikasi', id, oldData, null);
    }

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
  data: PengabdianFormData
): Promise<{ success: boolean; data?: PengabdianMasyarakat; error?: string }> {
  try {
    const adminUserId = await getAdminUserId();
    if (!adminUserId) throw new Error('Not authenticated');

    const { data: pengabdian, error: insertError } = await supabase
      .from('pengabdian')
      .insert(data)
      .select()
      .single();

    if (insertError) throw insertError;

    // Log activity
    await logActivity(adminUserId, 'CREATE', 'pengabdian', pengabdian.id, null, pengabdian);

    return { success: true, data: pengabdian as PengabdianMasyarakat };
  } catch (error: any) {
    console.error('Error creating pengabdian:', error);
    return { success: false, error: error.message };
  }
}

export async function updatePengabdian(
  id: string,
  data: Partial<PengabdianFormData>
): Promise<{ success: boolean; data?: PengabdianMasyarakat; error?: string }> {
  try {
    const adminUserId = await getAdminUserId();
    if (!adminUserId) throw new Error('Not authenticated');

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
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminUserId = await getAdminUserId();
    if (!adminUserId) throw new Error('Not authenticated');

    // Get data before delete
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
  data: StatistikFormData
): Promise<{ success: boolean; data?: Statistik; error?: string }> {
  try {
    const adminUserId = await getAdminUserId();
    if (!adminUserId) throw new Error('Not authenticated');

    const { data: statistik, error: insertError } = await supabase
      .from('statistik')
      .insert(data)
      .select()
      .single();

    if (insertError) throw insertError;

    // Log activity
    await logActivity(adminUserId, 'CREATE', 'statistik', statistik.id, null, statistik);

    return { success: true, data: statistik as Statistik };
  } catch (error: any) {
    console.error('Error creating statistik:', error);
    return { success: false, error: error.message };
  }
}

export async function updateStatistik(
  id: string,
  data: Partial<StatistikFormData>
): Promise<{ success: boolean; data?: Statistik; error?: string }> {
  try {
    const adminUserId = await getAdminUserId();
    if (!adminUserId) throw new Error('Not authenticated');

    // Get old data
    const { data: oldData } = await supabase
      .from('statistik')
      .select('*')
      .eq('id', id)
      .single();

    // Update
    const { data: statistik, error: updateError } = await supabase
      .from('statistik')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Log activity
    await logActivity(adminUserId, 'UPDATE', 'statistik', id, oldData, statistik);

    return { success: true, data: statistik as Statistik };
  } catch (error: any) {
    console.error('Error updating statistik:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteStatistik(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminUserId = await getAdminUserId();
    if (!adminUserId) throw new Error('Not authenticated');

    // Get data before delete
    const { data: oldData } = await supabase
      .from('statistik')
      .select('*')
      .eq('id', id)
      .single();

    // Delete
    const { error: deleteError } = await supabase
      .from('statistik')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    // Log activity
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
    .select('id, auth_user_id, email, name, role, is_active, last_login, created_at')
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
    .select('id, auth_user_id, email, name, role, is_active, last_login, created_at')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching admin user:', error);
    return null;
  }

  return data as AdminUser;
}