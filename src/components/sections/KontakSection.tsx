import React from 'react';
import { Mail, BookOpen, Briefcase } from 'lucide-react';

export default function KontakSection() {
  const contacts = [
    {
      icon: Mail,
      label: 'Email',
      value: 'dadang@fisip.unmul.ac.id',
      href: 'mailto:dadang@fisip.unmul.ac.id',
    },
    {
      icon: BookOpen,
      label: 'Google Scholar',
      value: 'Profil Akademik',
      href: 'https://scholar.google.com/citations?user=7c93ypcAAAAJ&hl=id',
    },
    {
      icon: Briefcase,
      label: 'LinkedIn',
      value: 'Jaringan Profesional',
      href: 'https://linkedin.com',
    },
  ];

  return (
    <section id="kontak" className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Mari Berkolaborasi</h2>
          <p className="text-zinc-400 text-lg mb-12">
            Tertarik untuk berkolaborasi dalam penelitian, penulisan, atau proyek pengabdian
            masyarakat? Hubungi saya melalui kontak di bawah ini.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contacts.map((contact) => {
              const Icon = contact.icon;
              return (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={contact.href.startsWith('http') ? '_blank' : undefined}
                  rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="card-hover p-6 rounded-xl text-center"
                >
                  <Icon className="w-8 h-8 mx-auto mb-3 text-zinc-400" />
                  <div className="text-sm text-zinc-500 mb-1">{contact.label}</div>
                  <div className="text-sm">{contact.value}</div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}