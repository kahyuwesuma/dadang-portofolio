'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Heart, FileText, Newspaper, Users, TrendingUp, Calendar, CheckCircle, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { StatCard } from '@/components/admin/StatCard';
import { getDashboardStats } from '@/lib/admin-supabase';
import type { DashboardStats } from '@/lib/admin-types';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = await getDashboardStats();
      setStats(statsData);
    } catch (error) {
      toast.error('Gagal memuat data dashboard', {
        description: 'Terjadi kesalahan saat memuat data.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          <div className="text-zinc-400">Memuat dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-zinc-400 text-sm">Overview & Statistics</p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link
          href="/admin/password"
          className="flex items-center gap-3 px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
        >
          <div className="p-2 bg-zinc-800 rounded-md">
            <KeyRound className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Ganti Password</p>
            <p className="text-zinc-400 text-xs">Keamanan akun admin</p>
          </div>
        </Link>
      </div>

      {/* Main Stats Grid - 4 Columns */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Publikasi"
          value={stats?.total_publikasi || 0}
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Total Pengabdian"
          value={stats?.total_pengabdian || 0}
          icon={Heart}
          color="green"
        />
        <StatCard
          title="Buku"
          value={stats?.total_buku || 0}
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="Jurnal"
          value={stats?.total_jurnal || 0}
          icon={FileText}
        />
      </div>

      {/* Detailed Grid - 2 Columns */}
      <div className="grid grid-cols-2 gap-4">
        {/* Publikasi Breakdown */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Publikasi by Category</h2>
            <Link
              href="/admin/publikasi"
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Manage →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-zinc-300 text-sm">Buku</span>
              </div>
              <span className="text-white font-semibold">{stats?.total_buku || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="text-zinc-300 text-sm">Jurnal</span>
              </div>
              <span className="text-white font-semibold">{stats?.total_jurnal || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span className="text-zinc-300 text-sm">Op-ed</span>
              </div>
              <span className="text-white font-semibold">{stats?.total_oped || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <span className="text-zinc-300 text-sm">Press/News</span>
              </div>
              <span className="text-white font-semibold">{stats?.total_press || 0}</span>
            </div>
          </div>
        </div>

        {/* Pengabdian Status */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Pengabdian Status</h2>
            <Link
              href="/admin/pengabdian"
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Manage →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-zinc-300 text-sm">Selesai</span>
              </div>
              <span className="text-green-400 font-semibold">{stats?.pengabdian_selesai || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-zinc-300 text-sm">Berjalan</span>
              </div>
              <span className="text-blue-400 font-semibold">{stats?.pengabdian_ongoing || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span className="text-zinc-300 text-sm">Planned</span>
              </div>
              <span className="text-amber-400 font-semibold">{stats?.pengabdian_planned || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-zinc-800 to-zinc-800/50 rounded-lg border border-zinc-700">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-white" />
                <span className="text-white font-medium text-sm">Total</span>
              </div>
              <span className="text-white font-bold text-lg">{stats?.total_pengabdian || 0}</span>
            </div>
          </div>
        </div>
      </div>


      {/* Summary Stats Row */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-900 border border-zinc-800 rounded-lg p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm mb-1">Total Output Akademik</p>
            <p className="text-4xl font-bold text-white">
              {(stats?.total_publikasi || 0) + (stats?.total_pengabdian || 0)}
            </p>
          </div>
          <div className="flex gap-8">
            <div className="text-right">
              <p className="text-zinc-400 text-xs mb-1">Publikasi</p>
              <p className="text-2xl font-bold text-blue-400">{stats?.total_publikasi || 0}</p>
            </div>
            <div className="h-12 w-px bg-zinc-800"></div>
            <div className="text-right">
              <p className="text-zinc-400 text-xs mb-1">Pengabdian</p>
              <p className="text-2xl font-bold text-green-400">{stats?.total_pengabdian || 0}</p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}