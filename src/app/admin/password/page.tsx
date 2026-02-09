'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';
import { Mail, ArrowLeft, AlertCircle, Clock, CheckCircle } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Check if there's a cooldown in localStorage
  useState(() => {
    const lastRequest = localStorage.getItem('last_password_reset_request');
    if (lastRequest) {
      const timeSince = Date.now() - parseInt(lastRequest);
      const remainingCooldown = Math.max(0, 60000 - timeSince); // 60 seconds cooldown
      if (remainingCooldown > 0) {
        setCooldown(Math.ceil(remainingCooldown / 1000));
        const interval = setInterval(() => {
          setCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Email tidak valid');
      toast.error('Email tidak valid', {
        description: 'Masukkan alamat email yang benar.',
      });
      return;
    }

    if (cooldown > 0) {
      toast.error('Tunggu sebentar', {
        description: `Anda bisa request lagi dalam ${cooldown} detik.`,
      });
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Mengirim link reset password...');

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/password`,
      });

      toast.dismiss(loadingToast);

      if (resetError) {
        console.error('Reset error:', resetError);

        // Handle rate limit error
        if (resetError.message.includes('rate limit') || resetError.message.includes('Email rate limit exceeded')) {
          setError('Terlalu banyak permintaan. Silakan tunggu beberapa menit.');
          toast.error('Rate limit exceeded', {
            description: 'Anda telah mengirim terlalu banyak request. Tunggu 5-10 menit dan coba lagi.',
            duration: 8000,
          });
          
          // Set 5 minute cooldown
          setCooldown(300);
          localStorage.setItem('last_password_reset_request', Date.now().toString());
          
          const interval = setInterval(() => {
            setCooldown((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setError(resetError.message);
          toast.error('Gagal mengirim email', {
            description: resetError.message,
          });
        }
      } else {
        setSuccess(true);
        toast.success('Email terkirim!', {
          description: 'Cek inbox atau spam folder Anda untuk link reset password.',
          duration: 6000,
        });

        // Set normal cooldown (60 seconds)
        setCooldown(60);
        localStorage.setItem('last_password_reset_request', Date.now().toString());
        
        const interval = setInterval(() => {
          setCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      toast.dismiss(loadingToast);
      setError('Terjadi kesalahan tidak terduga');
      toast.error('Error', {
        description: 'Silakan coba lagi nanti.',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${secs}s`;
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center">
            <Mail className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Lupa Password?</h1>
          <p className="text-zinc-400">
            Masukkan email Anda untuk menerima link reset password
          </p>
        </div>

        {/* Success State */}
        {success ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Email Terkirim!
              </h2>
              <p className="text-zinc-400 text-sm mb-6">
                Kami telah mengirim link reset password ke <strong className="text-white">{email}</strong>
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-6">
              <p className="text-zinc-300 text-sm mb-3 font-medium">Langkah selanjutnya:</p>
              <ol className="space-y-2 text-zinc-400 text-sm">
                <li className="flex gap-2">
                  <span className="text-white font-medium">1.</span>
                  <span>Buka email Anda (cek folder spam jika tidak ada di inbox)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-white font-medium">2.</span>
                  <span>Klik link reset password dalam email</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-white font-medium">3.</span>
                  <span>Masukkan password baru Anda</span>
                </li>
              </ol>
            </div>

            {/* Cooldown Timer */}
            {cooldown > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4 flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-blue-400 text-sm">
                    Kirim ulang tersedia dalam <strong>{formatTime(cooldown)}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Resend Button */}
            <button
              onClick={() => {
                setSuccess(false);
                setEmail('');
              }}
              disabled={cooldown > 0}
              className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cooldown > 0 ? `Tunggu ${formatTime(cooldown)}` : 'Kirim Ulang'}
            </button>

            <button
              onClick={() => router.push('/admin/login')}
              className="w-full px-4 py-3 bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white font-medium rounded-lg transition-colors border border-zinc-700"
            >
              Kembali ke Login
            </button>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
            {/* Rate Limit Warning */}
            {cooldown > 0 && (
              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-400 text-sm font-medium mb-1">
                    Cooldown Active
                  </p>
                  <p className="text-amber-400/80 text-xs">
                    Tunggu <strong>{formatTime(cooldown)}</strong> sebelum request lagi untuk menghindari spam.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                  required
                  disabled={loading || cooldown > 0}
                />
              </div>

              {/* Important Info */}
              <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-400 text-xs font-medium mb-1">Penting!</p>
                    <ul className="space-y-1 text-xs text-zinc-400">
                      <li>• Link reset password hanya valid selama 1 jam</li>
                      <li>• Link hanya dapat digunakan 1 kali</li>
                      <li>• Tunggu 60 detik sebelum request ulang</li>
                      <li>• Jika terlalu sering, akan ada cooldown 5-10 menit</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || cooldown > 0}
                className="w-full px-4 py-3 bg-white hover:bg-zinc-200 text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                {loading ? 'Mengirim...' : cooldown > 0 ? `Tunggu ${formatTime(cooldown)}` : 'Kirim Link Reset'}
              </button>

              {/* Back to Login */}
              <button
                type="button"
                onClick={() => router.push('/admin/login')}
                className="w-full px-4 py-3 bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white font-medium rounded-lg transition-colors border border-zinc-700 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Login
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-zinc-500 text-sm mt-6">
          Butuh bantuan? Hubungi administrator
        </p>
      </div>
    </div>
  );
}