import type { PublikasiFormData } from '@/lib/admin-types'

async function safeJson(response: Response) {
  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

/* =========================
   CREATE
========================= */
export async function createPublikasi(data: PublikasiFormData) {
  try {
    const response = await fetch('/api/publikasi', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create')
    }

    return result
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}


/* =========================
   UPDATE
========================= */
export async function updatePublikasi(
  id: string,
  data: Partial<PublikasiFormData>
) {
  try {
    const response = await fetch(`/api/publikasi/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    const result = await safeJson(response)

    if (!response.ok) {
      return {
        success: false,
        error: result?.error || 'Failed to update publikasi',
      }
    }

    return result ?? { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error',
    }
  }
}

/* =========================
   DELETE
========================= */
export async function deletePublikasi(id: string) {
  try {
    const response = await fetch(`/api/publikasi/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    const result = await safeJson(response)

    if (!response.ok) {
      return {
        success: false,
        error: result?.error || 'Failed to delete publikasi',
      }
    }

    return result ?? { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error',
    }
  }
}
