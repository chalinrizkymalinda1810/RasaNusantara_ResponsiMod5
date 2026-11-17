// ---------------------------------------------------------------------------
// useRecipes.js — Custom hook untuk state resep & integrasi API/localStorage
// ---------------------------------------------------------------------------

import { useState, useEffect, useCallback } from 'react'
import recipeService from '../services/recipeService'

export function useRecipes(params = {}) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState(null)

  const paramKey = JSON.stringify(params)

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await recipeService.getRecipes(params)
      if (res.success) {
        setRecipes(res.data || [])
        setPagination(res.pagination || null)
      } else {
        setError(res.message || 'Gagal memuat resep.')
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memuat resep.')
      setRecipes([])
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramKey])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  return { recipes, loading, error, pagination, refetch: fetchRecipes }
}

export function useRecipeById(id) {
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRecipe = useCallback(async () => {
    if (!id) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const res = await recipeService.getRecipeById(id)
      if (res.success) {
        setRecipe(res.data)
      } else {
        setError(res.message || 'Resep tidak ditemukan.')
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat detail resep.')
      setRecipe(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchRecipe()
  }, [fetchRecipe])

  return { recipe, loading, error, refetch: fetchRecipe }
}
