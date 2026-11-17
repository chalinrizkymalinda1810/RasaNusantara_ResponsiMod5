// ---------------------------------------------------------------------------
// favoriteService.js — Manajemen Resep Favorit Pengguna
// ---------------------------------------------------------------------------

const FAVORITES_KEY = 'rasa_nusantara_favorites'

const readFavs = () => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    return raw ? JSON.parse(raw) : ['resep-1', 'resep-2']
  } catch {
    return ['resep-1', 'resep-2']
  }
}

const writeFavs = (ids) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
  } catch {
    // silently fail
  }
}

class FavoriteService {
  async getFavorites() {
    const list = readFavs()
    return { success: true, data: list }
  }

  async toggleFavorite(recipeId) {
    const strId = String(recipeId)
    const list = readFavs()
    const index = list.indexOf(strId)
    let isFavorited = false

    if (index === -1) {
      list.push(strId)
      isFavorited = true
    } else {
      list.splice(index, 1)
      isFavorited = false
    }

    writeFavs(list)
    return { success: true, is_favorited: isFavorited, data: list }
  }

  async isFavorited(recipeId) {
    const list = readFavs()
    return list.includes(String(recipeId))
  }
}

export default new FavoriteService()
