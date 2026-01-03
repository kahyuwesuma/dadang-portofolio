// src/lib/supabase-auth.ts

import { createBrowserClient } from '@supabase/ssr';
import type { AdminUser } from './admin-types';

export const supabaseAuth = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// ============================================
// Authentication Functions
// ============================================

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Update last login
    if (data.user) {
      await supabaseAuth.rpc('update_admin_last_login');
    }

    return { success: true, user: data.user, session: data.session };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
}

export async function signUp(email: string, password: string, name: string) {
  try {
    const { data, error } = await supabaseAuth.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });

    if (error) throw error;

    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return { success: false, error: error.message };
  }
}

export async function signOut() {
  try {
    const { error } = await supabaseAuth.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabaseAuth.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Reset password error:', error);
    return { success: false, error: error.message };
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabaseAuth.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Update password error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// Session Management
// ============================================

export async function getSession() {
  try {
    const { data, error } = await supabaseAuth.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

export async function getUser() {
  try {
    const { data, error } = await supabaseAuth.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

// ============================================
// Admin User Functions
// ============================================

export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  try {
    const { data, error } = await supabaseAuth.rpc('get_current_admin_user');

    if (error) throw error;
    if (!data || data.length === 0) return null;

    return data[0] as AdminUser;
  } catch (error) {
    console.error('Get current admin user error:', error);
    return null;
  }
}

export async function checkAdminPermission(requiredRole?: 'admin' ): Promise<boolean> {
  try {
    const adminUser = await getCurrentAdminUser();
    
    if (!adminUser || !adminUser.is_active) return false;
    
    return true; // User is admin or super_admin
  } catch (error) {
    console.error('Check admin permission error:', error);
    return false;
  }
}

// ============================================
// Auth State Listener
// ============================================

export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabaseAuth.auth.onAuthStateChange(callback);
}

// ============================================
// Email Verification
// ============================================

export async function resendVerificationEmail() {
  try {
    const user = await getUser();
    if (!user?.email) throw new Error('No user email found');

    const { error } = await supabaseAuth.auth.resend({
      type: 'signup',
      email: user.email,
    });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Resend verification error:', error);
    return { success: false, error: error.message };
  }
}