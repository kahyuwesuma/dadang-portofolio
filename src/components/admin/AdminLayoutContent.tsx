'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import {
  LayoutDashboard,
  BookOpen,
  Heart,
  BarChart3,
  LogOut,
  Menu,
  X,
  Settings,
  Activity,
  Loader2,
} from 'lucide-react'

interface AdminLayoutContentProps {
  children: React.ReactNode
}

export default function AdminLayoutContent({ children }: AdminLayoutContentProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, signOut } = useAuth()

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.replace('/admin/login')
    }

    if (!loading && user && pathname === '/admin/login') {
      router.replace('/admin')
    }
  }, [loading, user, pathname, router])

  const handleLogout = async () => {
    await signOut()
    router.replace('/admin/login')
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: BookOpen, label: 'Publikasi', href: '/admin/publikasi' },
    { icon: Heart, label: 'Pengabdian', href: '/admin/pengabdian' },
    { icon: BarChart3, label: 'Statistik', href: '/admin/statistik' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-zinc-400">Loading admin...</p>
        </div>
      </div>
    )
  }

  // 🔓 Login page tidak pakai layout admin
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // 🛑 Belum login → tunggu redirect
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-zinc-800">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <p className="text-sm text-zinc-400 mt-1">Portofolio Akademik</p>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                      ? 'bg-white text-black'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="p-4 border-t border-zinc-800 space-y-2">
            <div className="px-4 py-2 text-sm">
              <p className="text-white font-medium">{user.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <span className="text-sm text-zinc-400">
              Welcome, <span className="text-white font-medium">{user.email}</span>
            </span>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
