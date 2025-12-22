'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

import { Button } from './Button'
import { Input } from './Input'
import { Textarea } from './TextArea'
import { Select } from './Select'

import { createPublikasi, updatePublikasi } from '@/lib/api-client'
import { PUBLIKASI_KATEGORI } from '@/lib/admin-types'

import type { Publikasi } from '@/lib/types'
import type { PublikasiFormData } from '@/lib/admin-types'
import type { PublikasiKategori } from '@/lib/types'

interface PublikasiModalProps {
  publikasi: Publikasi | null
  onClose: (shouldRefresh: boolean) => void
}

export default function PublikasiModal({
  publikasi,
  onClose,
}: PublikasiModalProps) {
  const isEdit = Boolean(publikasi?.id)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<PublikasiFormData & { id?: string }>({
    id: publikasi?.id,
    judul: '',
    kategori: 'Buku',
    penulis: '',
    tahun: new Date().getFullYear(),
    deskripsi: '',
    url: '',
    keywords: '',
    tags: [],
  })

  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (!publikasi) return

    setFormData({
      id: publikasi.id,
      judul: publikasi.judul,
      kategori: publikasi.kategori as PublikasiKategori,
      penulis: publikasi.penulis,
      tahun: publikasi.tahun,
      deskripsi: publikasi.deskripsi ?? '',
      url: publikasi.url ?? '',
      keywords: publikasi.keywords ?? '',
      tags: publikasi.tags ?? [],
    })
  }, [publikasi])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'tahun' ? Number(value) : value,
    }))
  }

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (!tag || formData.tags.includes(tag)) return

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }))
    setTagInput('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isEdit && !formData.id) {
      alert('ID publikasi tidak valid atau belum tersedia')
      return
    }

    setLoading(true)

    try {
      const result = isEdit
        ? await updatePublikasi(formData.id!, formData)
        : await createPublikasi(formData)

      if (result?.success) {
        onClose(true)
      } else {
        console.error(result?.error)
        alert('Gagal menyimpan publikasi')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-6 py-4">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? 'Edit Publikasi' : 'Tambah Publikasi'}
          </h2>
          <button onClick={() => onClose(false)}>
            <X className="h-5 w-5 text-zinc-400 hover:text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <Input
            label="Judul"
            name="judul"
            value={formData.judul}
            onChange={handleChange}
            required
          />

          <Select
            label="Kategori"
            name="kategori"
            value={formData.kategori}
            onChange={handleChange}
            options={PUBLIKASI_KATEGORI}
            required
          />

          <Input
            label="Penulis"
            name="penulis"
            value={formData.penulis}
            onChange={handleChange}
            required
          />

          <Input
            label="Tahun"
            name="tahun"
            type="number"
            value={formData.tahun}
            onChange={handleChange}
            required
          />

          <Textarea
            label="Deskripsi"
            name="deskripsi"
            value={formData.deskripsi || ''}
            onChange={handleChange}
          />

          <Input
            label="URL"
            name="url"
            type="url"
            value={formData.url || ''}
            onChange={handleChange}
          />

          <Input
            label="Keywords"
            name="keywords"
            value={formData.keywords || ''}
            onChange={handleChange}
          />

          {formData.kategori === 'Jurnal' && (
            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Tags</label>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-white"
                />
                <Button type="button" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
            <Button type="button" variant="ghost" onClick={() => onClose(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
