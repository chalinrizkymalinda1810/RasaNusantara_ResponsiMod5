// ---------------------------------------------------------------------------
// recipeService.js — Layanan CRUD Lengkap Resep Kuliner
// Arsitektur Offline-First: Sinkronisasi localStorage + Dukungan REST API
// ---------------------------------------------------------------------------

import { apiClient, BASE_URL } from '../config/api'
import { INITIAL_RECIPES } from '../data/recipes'

const STORAGE_KEY = 'rasa_nusantara_recipes'

// Helper: Membaca database lokal dari localStorage
const readLocalRecipes = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
    // Jika belum ada data di localStorage, inisialisasi dengan data default
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RECIPES))
    return INITIAL_RECIPES
  } catch (err) {
    console.warn('Gagal membaca localStorage, menggunakan INITIAL_RECIPES:', err)
    return INITIAL_RECIPES
  }
}

// Helper: Menyimpan perubahan ke localStorage
const writeLocalRecipes = (recipes) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes))
  } catch (err) {
    console.error('Penyimpanan localStorage gagal:', err)
  }
}

class RecipeService {
  /**
   * Mengambil seluruh daftar resep dengan filter & pagination
   */
  async getRecipes(params = {}) {
    // 1. Coba ambil dari REST API jika endpoint server tersedia
    if (BASE_URL) {
      try {
        const response = await apiClient.get('/api/v1/recipes', { params })
        if (response && response.data) {
          return { success: true, data: response.data, source: 'server' }
        }
      } catch (err) {
        console.info('Server API tidak terjangkau, beralih ke cache lokal:', err.message)
      }
    }

    // 2. Fallback offline: Ambil dari localStorage
    let list = readLocalRecipes()

    if (params.search) {
      const q = params.search.toLowerCase()
      list = list.filter(
        (r) =>
          (r.name && r.name.toLowerCase().includes(q)) ||
          (r.origin && r.origin.toLowerCase().includes(q)) ||
          (r.description && r.description.toLowerCase().includes(q))
      )
    }

    if (params.category && params.category !== 'Semua' && params.category !== 'All') {
      list = list.filter(
        (r) => (r.category || '').toLowerCase() === params.category.toLowerCase()
      )
    }

    if (params.difficulty && params.difficulty !== 'Semua') {
      list = list.filter(
        (r) => (r.difficulty || '').toLowerCase() === params.difficulty.toLowerCase()
      )
    }

    return {
      success: true,
      data: list,
      source: 'local',
      pagination: {
        total: list.length,
        page: params.page || 1,
        limit: params.limit || list.length,
      },
    }
  }

  /**
   * Mengambil satu resep berdasarkan ID
   */
  async getRecipeById(id) {
    if (BASE_URL) {
      try {
        const response = await apiClient.get(`/api/v1/recipes/${id}`)
        if (response && response.data) {
          return { success: true, data: response.data }
        }
      } catch (err) {
        console.info('Gagal ambil dari server, mencari di lokal:', err.message)
      }
    }

    const list = readLocalRecipes()
    const found = list.find((r) => String(r.id) === String(id))
    if (found) {
      return { success: true, data: found }
    }
    throw new Error('Resep kuliner tidak ditemukan.')
  }

  /**
   * CREATE: Menambahkan resep baru ke sistem
   */
  async createRecipe(data) {
    const newId = `resep-${Date.now()}`
    const newRecipe = {
      ...data,
      id: newId,
      created_at: new Date().toISOString(),
      average_rating: data.average_rating || 5.0,
      review_count: data.review_count || 0,
      image_url: data.image_url || '/recipes/default.svg',
    }

    // Simpan ke database lokal
    const current = readLocalRecipes()
    const updated = [newRecipe, ...current]
    writeLocalRecipes(updated)

    // Coba simpan ke server jika terhubung
    if (BASE_URL) {
      try {
        await apiClient.post('/api/v1/recipes', newRecipe)
      } catch (err) {
        console.warn('Gagal sync ke server backend, disimpan di lokal:', err.message)
      }
    }

    return { success: true, data: newRecipe }
  }

  /**
   * UPDATE: Memperbarui resep yang sudah ada
   */
  async updateRecipe(id, data) {
    const list = readLocalRecipes()
    const index = list.findIndex((r) => String(r.id) === String(id))

    if (index === -1) {
      throw new Error('Resep yang ingin diperbarui tidak ditemukan.')
    }

    const existing = list[index]
    const updatedItem = {
      ...existing,
      ...data,
      id: existing.id,
      updated_at: new Date().toISOString(),
    }

    list[index] = updatedItem
    writeLocalRecipes(list)

    if (BASE_URL) {
      try {
        await apiClient.put(`/api/v1/recipes/${id}`, updatedItem)
      } catch (err) {
        console.warn('Gagal sync update ke server backend:', err.message)
      }
    }

    return { success: true, data: updatedItem }
  }

  /**
   * DELETE: Menghapus resep dari sistem
   */
  async deleteRecipe(id) {
    const list = readLocalRecipes()
    const filtered = list.filter((r) => String(r.id) !== String(id))

    if (list.length === filtered.length) {
      throw new Error('Resep tidak ditemukan untuk dihapus.')
    }

    writeLocalRecipes(filtered)

    if (BASE_URL) {
      try {
        await apiClient.delete(`/api/v1/recipes/${id}`)
      } catch (err) {
        console.warn('Gagal sync delete ke server backend:', err.message)
      }
    }

    return { success: true, message: 'Resep berhasil dihapus.' }
  }

  /**
   * Reset data katalog ke resep awal bawaan
   */
  resetToDefault() {
    writeLocalRecipes(INITIAL_RECIPES)
    return INITIAL_RECIPES
  }
}

export default new RecipeService()
