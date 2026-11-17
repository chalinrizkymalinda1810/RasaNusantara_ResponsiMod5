// ---------------------------------------------------------------------------
// helpers.js — Fungsi utilitas umum aplikasi Rasa Nusantara
// ---------------------------------------------------------------------------

/**
 * Format angka ke format mata uang Rupiah (contoh: "Rp 45.000")
 */
export const formatRupiah = (amount) => {
  const num = Number(amount)
  if (Number.isNaN(num) || num === 0) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Format menit ke teks waktu memasak (contoh: "45 mnt" atau "2 jam 30 mnt")
 */
export const formatTime = (minutes) => {
  const m = Number(minutes) || 0
  if (m < 60) return `${m} mnt`
  const hrs = Math.floor(m / 60)
  const rem = m % 60
  return rem > 0 ? `${hrs} jam ${rem} mnt` : `${hrs} jam`
}

/**
 * Pencarian teks case-insensitive pada nama, asal, dan deskripsi resep
 */
export const matchesSearch = (item, query) => {
  if (!query) return true
  const q = query.toLowerCase().trim()
  return (
    (item.name || '').toLowerCase().includes(q) ||
    (item.origin || '').toLowerCase().includes(q) ||
    (item.description || '').toLowerCase().includes(q) ||
    (item.category || '').toLowerCase().includes(q)
  )
}

/**
 * Filter berdasarkan kategori
 */
export const matchesCategory = (item, category) => {
  if (!category || category === 'Semua' || category === 'All') return true
  return (item.category || '').toLowerCase() === category.toLowerCase()
}

/**
 * Filter berdasarkan tingkat kesulitan ('semua', 'mudah', 'sedang', 'sulit')
 */
export const matchesDifficulty = (item, difficulty) => {
  if (!difficulty || difficulty === 'Semua' || difficulty === 'all') return true
  return (item.difficulty || '').toLowerCase() === difficulty.toLowerCase()
}

/**
 * Mengurutkan daftar item berdasarkan atribut
 * @param {'name'|'cook_time'|'price'|'rating'} key
 * @param {'asc'|'desc'} order
 */
export const sortItems = (items, key = 'name', order = 'asc') => {
  const sorted = [...items].sort((a, b) => {
    if (key === 'cook_time') return (Number(a.cook_time) || 0) - (Number(b.cook_time) || 0)
    if (key === 'price') return (Number(a.price) || 0) - (Number(b.price) || 0)
    if (key === 'rating') return (Number(b.average_rating) || 0) - (Number(a.average_rating) || 0)
    return String(a[key] || '').localeCompare(String(b[key] || ''))
  })
  return order === 'desc' && key !== 'rating' ? sorted.reverse() : sorted
}

/**
 * Potong teks string jika melebihi panjang tertentu
 */
export const truncate = (str, max = 100) => {
  if (!str || str.length <= max) return str || ''
  return str.slice(0, max).trimEnd() + '…'
}

/**
 * Ambil daftar kategori unik dari koleksi item
 */
export const extractCategories = (items) => {
  const set = new Set()
  items.forEach((i) => {
    if (i.category) set.add(i.category)
  })
  return ['Semua', ...Array.from(set).sort()]
}

/**
 * Hitung rata-rata rating dari array ulasan
 */
export const averageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0
  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0)
  return Math.round((sum / reviews.length) * 10) / 10
}
