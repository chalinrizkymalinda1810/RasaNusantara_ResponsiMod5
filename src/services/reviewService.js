// ---------------------------------------------------------------------------
// reviewService.js — Layanan Ulasan & Rating Resep
// ---------------------------------------------------------------------------

const REVIEWS_KEY = 'rasa_nusantara_reviews'

const INITIAL_REVIEWS = {
  'resep-1': [
    {
      id: 'rev-1',
      recipe_id: 'resep-1',
      user_name: 'Budi Santoso',
      rating: 5,
      comment: 'Bumbu rendangnya meresap sampai ke serat terdalam! Gurih pekat dan otentik sekali khas Minang.',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'rev-2',
      recipe_id: 'resep-1',
      user_name: 'Siti Rahmawati',
      rating: 5,
      comment: 'Panduan langkah memasaknya sangat jelas. Mengaduk santan perlahan benar-benar kunci agar tidak pecah.',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ],
  'resep-2': [
    {
      id: 'rev-3',
      recipe_id: 'resep-2',
      user_name: 'Agus Pratama',
      rating: 5,
      comment: 'Kuah susu dan santannya pas sekali, tidak bikin enek. Sangat nikmat disajikan panas dengan emping.',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  ],
  'resep-5': [
    {
      id: 'rev-4',
      recipe_id: 'resep-5',
      user_name: 'Dewi Lestari',
      rating: 5,
      comment: 'Segar luar biasa di siang hari! Gula arennya kental dan wangi daun pandannya semerbak.',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
}

const readReviews = () => {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY)
    if (raw) return JSON.parse(raw)
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(INITIAL_REVIEWS))
    return INITIAL_REVIEWS
  } catch {
    return INITIAL_REVIEWS
  }
}

const writeReviews = (data) => {
  try {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(data))
  } catch {
    // fail silently
  }
}

class ReviewService {
  async getReviews(recipeId) {
    const all = readReviews()
    const list = all[recipeId] || []
    return { success: true, data: list }
  }

  async createReview(recipeId, reviewData) {
    const all = readReviews()
    const currentList = all[recipeId] || []
    const newReview = {
      id: `rev-${Date.now()}`,
      recipe_id: recipeId,
      user_name: reviewData.user_name || 'Penikmat Kuliner',
      rating: Number(reviewData.rating) || 5,
      comment: reviewData.comment || '',
      created_at: new Date().toISOString(),
    }

    all[recipeId] = [newReview, ...currentList]
    writeReviews(all)
    return { success: true, data: newReview }
  }
}

export default new ReviewService()
