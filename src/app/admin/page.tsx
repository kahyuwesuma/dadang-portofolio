'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Heart, BarChart3, Activity } from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { getDashboardStats, getRecentActivities } from '@/lib/admin-supabase';
import type { DashboardStats, ActivityLog } from '@/lib/admin-types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [statsData, activitiesData] = await Promise.all([
      getDashboardStats(),
      getRecentActivities(10),
    ]);
    setStats(statsData);
    setActivities(activitiesData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-zinc-400">Selamat datang di Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          title="Buku Diterbitkan"
          value={stats?.total_buku || 0}
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="Activity This Week"
          value={stats?.activities_this_week || 0}
          icon={Activity}
          color="amber"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Publikasi Breakdown */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Publikasi by Category</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Buku</span>
              <span className="text-white font-medium">{stats?.total_buku || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Jurnal</span>
              <span className="text-white font-medium">{stats?.total_jurnal || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Op-ed</span>
              <span className="text-white font-medium">{stats?.total_oped || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Press/News</span>
              <span className="text-white font-medium">{stats?.total_press || 0}</span>
            </div>
          </div>
        </div>

        {/* Pengabdian Status */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Pengabdian Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Selesai</span>
              <span className="text-green-400 font-medium">
                {stats?.pengabdian_selesai || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Ongoing</span>
              <span className="text-blue-400 font-medium">
                {stats?.pengabdian_ongoing || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Total</span>
              <span className="text-white font-medium">{stats?.total_pengabdian || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Activities</h2>
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
              >
                <div>
                  <p className="text-white font-medium">
                    {activity.admin_name || 'Unknown'}{' '}
                    <span className="text-zinc-400">
                      {activity.action.toLowerCase()}d{' '}
                    </span>
                    <span className="text-white">{activity.table_name}</span>
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">
                    {new Date(activity.created_at).toLocaleString('id-ID')}
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    activity.action === 'CREATE'
                      ? 'bg-green-500/20 text-green-400'
                      : activity.action === 'UPDATE'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {activity.action}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 text-center py-8">No recent activities</p>
        )}
      </div>
    </div>
  );
}