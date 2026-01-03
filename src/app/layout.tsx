import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Dadang — Portofolio Akademik & Profesional',
    template: '%s | Dadang',
  },
  description:
    'Portofolio akademik dan profesional Dadang yang memuat publikasi, pengabdian kepada masyarakat, serta aktivitas riset dan keilmuan.',
  metadataBase: new URL('https://dadang-portofolios.vercel.app'),

  keywords: [
    'portofolio akademik',
    'publikasi ilmiah',
    'pengabdian masyarakat',
    'riset',
    'penelitian',
    'opini',
    'buku',
  ],

  authors: [
    { name: 'Dadang' },
  ],

  openGraph: {
    title: 'Dadang — Portofolio Akademik & Profesional',
    description:
      'Publikasi, pengabdian masyarakat, dan aktivitas akademik dalam satu portofolio.',
    url: 'https://dadang-portofolios.vercel.app',
    siteName: 'Portofolio Dadang',
    locale: 'id_ID',
    type: 'website',
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: 'https://dadang-portofolios.vercel.app',
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}