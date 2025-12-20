'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LogIn, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/admin/Button'
import { Input } from '@/components/admin/Input'
import { signIn } from '@/lib/supabase-auth'
import { useAuth } from '@/components/providers/AuthProvider'

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user, loading: authLoading } = useAuth()

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState('')

    useEffect(() => {
        if (!authLoading && user) {
            router.replace('/admin')
        }
    }, [authLoading, user, router])

    useEffect(() => {
        const urlError = searchParams.get('error')
        if (urlError === 'unauthorized') {
            setError('You are not authorized to access the admin panel.')
        }
    }, [searchParams])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const result = await signIn(formData.email, formData.password)

        if (!result.success) {
            setError(result.error || 'Failed to sign in')
            setLoading(false)
            return
        }

        router.replace('/admin')
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
                    <p className="text-zinc-400">Portofolio Akademik</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
                    <h2 className="text-xl font-semibold text-white mb-6">Sign In</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex gap-2">
                                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full justify-center"
                            icon={loading ? Loader2 : LogIn}
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>
                </div>

                <p className="text-center text-zinc-500 text-sm mt-6">
                    &copy; 2025 Portofolio Akademik
                </p>
            </div>
        </div>
    )
}
