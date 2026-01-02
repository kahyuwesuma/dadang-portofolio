'use client'

import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/providers/AuthProvider'
import AdminLayoutContent from '@/components/admin/AdminLayoutContent'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
      
      {/* Sonner Toaster with custom styling */}
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        closeButton
        toastOptions={{
          style: {
            background: '#18181b',
            border: '1px solid #27272a',
            color: '#fff',
          },
          className: 'sonner-toast',
          descriptionClassName: 'sonner-description',
        }}
        theme="dark"
      />
    </AuthProvider>
  )
}