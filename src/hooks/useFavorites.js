// ---------------------------------------------------------------------------
// useFavorites.js — Hook untuk mengelola daftar favorit resep
// ---------------------------------------------------------------------------

import { useState, useEffect, useCallback } from 'react'
import favoriteService from '../services/favoriteService'

export function useFavorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true)
      const res = await favoriteService.getFavorites()
      if (res.success) {
        setFavorites(res.data || [])
      }
    } catch {
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  const toggleFavorite = async (recipeId) => {
    const res = await favoriteService.toggleFavorite(recipeId)
    if (res.success) {
      setFavorites(res.data)
      return res.is_favorited
    }
    return false
  }

  const isFavorited = (recipeId) => {
    return favorites.includes(String(recipeId))
  }

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorited,
    refetch: fetchFavorites,
  }
}
