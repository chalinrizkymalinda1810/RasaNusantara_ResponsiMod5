// ---------------------------------------------------------------------------
// useReviews.js — Hook untuk membaca dan mengirim ulasan resep
// ---------------------------------------------------------------------------

import { useState, useEffect, useCallback } from 'react'
import reviewService from '../services/reviewService'

export function useReviews(recipeId) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = useCallback(async () => {
    if (!recipeId) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const res = await reviewService.getReviews(recipeId)
      if (res.success) {
        setReviews(res.data || [])
      }
    } catch {
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [recipeId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  return { reviews, loading, refetch: fetchReviews }
}

export function useCreateReview() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const createReview = async (recipeId, reviewData) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)
      const res = await reviewService.createReview(recipeId, reviewData)
      if (res.success) {
        setSuccess(true)
        return res.data
      }
      throw new Error('Gagal mengirim ulasan.')
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengirim ulasan.')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createReview, loading, error, success }
}
