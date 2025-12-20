'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { updatePassword } from '@/lib/supabase-auth';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Check if we have the recovery token
    useEffect(() => {
        const accessToken = searchParams.get('access_token');
        const type = searchParams.get('type');

        if (!accessToken || type !== 'recovery') {
            setError('Invalid or expired reset link');
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        // Validate password length
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            setLoading(false);
            return;
        }

        try {
            const result = await updatePassword(password);

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/admin/login');
                }, 3000);
            } else {
                setError(result.error || 'Failed to update password');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">Set New Password</h2>
                        <p className="text-zinc-400 text-sm">
                            Enter your new password below
                        </p>
                    </div>

                    {success ? (
                        <div className="text-center py-8">
                            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Password Updated!</h3>
                            <p className="text-zinc-400 text-sm mb-6">
                                Redirecting to login...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="New Password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                helperText="Minimum 8 characters"
                            />

                            <Input
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full justify-center"
                                icon={loading ? Loader2 : Lock}
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}