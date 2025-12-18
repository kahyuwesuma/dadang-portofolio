import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dr. Dadang Ilham Kurniawan Mujiono - Portofolio Akademik',
  description: 'Dosen dan peneliti di bidang Ilmu Komputer dengan fokus pada kecerdasan buatan, machine learning, dan pengembangan sistem cerdas untuk solusi industri 4.0.',
  keywords: ['akademisi', 'peneliti', 'machine learning', 'artificial intelligence', 'ilmu komputer'],
  authors: [{ name: 'Dr. Dadang Ilham Kurniawan Mujiono' }],
  openGraph: {
    title: 'Dr. Dadang Ilham Kurniawan Mujiono - Portofolio Akademik',
    description: 'Dosen dan peneliti di bidang Ilmu Komputer dengan fokus pada kecerdasan buatan',
    type: 'website',
  },
};

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