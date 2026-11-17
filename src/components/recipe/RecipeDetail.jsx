// ---------------------------------------------------------------------------
// RecipeDetail.jsx — Tampilan Detail Lengkap Resep & Interaksi Memasak
// ---------------------------------------------------------------------------

import { useState } from 'react'
import {
  ArrowLeft,
  Clock,
  Users,
  MapPin,
  Star,
  Send,
  Edit,
  Trash2,
  CheckCircle,
  ChefHat,
  Sparkles,
  ShoppingBag,
} from 'lucide-react'
import FavoriteButton from '../common/FavoriteButton'
import { useReviews, useCreateReview } from '../../hooks/useReviews'
import userService from '../../services/userService'
import { formatRupiah, formatTime } from '../../utils/helpers'

export default function RecipeDetail({ recipe, onBack, onEdit, onDelete }) {
  const profile = userService.getUserProfile()
  const imgSrc = recipe.image_url || '/recipes/default.svg'

  // Checklist state for ingredients (local interactive state)
  const [checkedIngredients, setCheckedIngredients] = useState({})

  const toggleIngredient = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }))
  }

  // Reviews hook
  const { reviews, loading: reviewsLoading, refetch: refetchReviews } = useReviews(recipe.id)
  const { createReview, loading: submitting } = useCreateReview()

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviewerName, setReviewerName] = useState(profile.name || 'Pencinta Kuliner')
  const [feedback, setFeedback] = useState('')

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setFeedback('')
    if (!comment.trim()) {
      setFeedback('Mohon tuliskan pesan ulasan Anda.')
      return
    }

    const res = await createReview(recipe.id, {
      user_name: reviewerName.trim(),
      rating,
      comment: comment.trim(),
    })

    if (res) {
      setFeedback('Ulasan berhasil ditambahkan! Terima kasih atas apresiasinya.')
      setComment('')
      setRating(5)
      refetchReviews()
      setTimeout(() => setFeedback(''), 4000)
    }
  }

  return (
    <div className="recipe-detail">
      {/* Navigation & Actions Top Bar */}
      <div className="recipe-detail__top-nav">
        <button type="button" className="btn-back" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Kembali ke Katalog</span>
        </button>

        <div className="top-nav-actions">
          <FavoriteButton recipeId={recipe.id} />
          {onEdit && (
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => onEdit(recipe)}
            >
              <Edit size={14} /> Edit Resep
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={() => onDelete(recipe)}
            >
              <Trash2 size={14} /> Hapus
            </button>
          )}
        </div>
      </div>

      {/* Hero Showcase Section */}
      <section className="recipe-detail__hero">
        <div className="hero-media-wrap">
          <img src={imgSrc} alt={recipe.name} className="hero-img" />
        </div>

        <div className="hero-content">
          <div className="hero-badges">
            <span className="badge badge--category">{recipe.category || 'Kuliner'}</span>
            <span className="badge badge--amber">{recipe.difficulty || 'Standar'}</span>
            {recipe.origin && (
              <span className="badge badge--neutral">
                <MapPin size={12} /> {recipe.origin}
              </span>
            )}
          </div>

          <h1 className="hero-title">{recipe.name}</h1>

          <p className="hero-description">{recipe.description}</p>

          <div className="hero-spec-grid">
            <div className="spec-item">
              <span className="spec-label">Persiapan</span>
              <span className="spec-value">{formatTime(recipe.prep_time || 15)}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Memasak</span>
              <span className="spec-value">{formatTime(recipe.cook_time || 30)}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Porsi</span>
              <span className="spec-value">{recipe.servings || 4} Orang</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Est. Belanja</span>
              <span className="spec-value spec-value--price">
                {formatRupiah(recipe.price || 30000)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Ingredients Checklist & Steps */}
      <div className="detail-layout">
        {/* Kolom Kiri: Bahan-bahan dengan checklist */}
        <section className="detail-card">
          <div className="section-head">
            <div className="section-head-title">
              <ShoppingBag size={20} className="sec-icon" />
              <h2>Bahan &amp; Rempah Pilihan</h2>
            </div>
            <span className="section-counter">
              {recipe.ingredients ? recipe.ingredients.length : 0} Item
            </span>
          </div>
          <p className="section-subtitle">
            Klik pada bahan untuk menandai belanjaan yang telah siap:
          </p>

          <ul className="ingredients-checklist">
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ing, i) => {
                const isChecked = Boolean(checkedIngredients[i])
                return (
                  <li
                    key={ing.id || i}
                    className={`ingredient-item ${isChecked ? 'ingredient-item--checked' : ''}`}
                    onClick={() => toggleIngredient(i)}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleIngredient(i)}
                      className="custom-checkbox"
                    />
                    <div className="ing-info">
                      <span className="ing-name">{ing.name}</span>
                      <span className="ing-qty">{ing.quantity}</span>
                    </div>
                  </li>
                )
              })
            ) : (
              <li className="empty-notice">Belum ada daftar bahan yang dicatat.</li>
            )}
          </ul>
        </section>

        {/* Kolom Kanan: Panduan Langkah Memasak */}
        <section className="detail-card">
          <div className="section-head">
            <div className="section-head-title">
              <ChefHat size={20} className="sec-icon" />
              <h2>Langkah &amp; Proses Memasak</h2>
            </div>
            <span className="section-counter">
              {recipe.steps ? recipe.steps.length : 0} Tahap
            </span>
          </div>
          <p className="section-subtitle">
            Ikuti instruksi memasak berurutan untuk hasil rasa terbaik:
          </p>

          <ol className="steps-list">
            {recipe.steps && recipe.steps.length > 0 ? (
              recipe.steps.map((step, i) => (
                <li key={i} className="step-item">
                  <div className="step-number">{i + 1}</div>
                  <div className="step-text">{step}</div>
                </li>
              ))
            ) : (
              <li className="empty-notice">Belum ada instruksi langkah memasak.</li>
            )}
          </ol>
        </section>
      </div>

      {/* Customer Reviews & Feedback Section */}
      <section className="detail-card reviews-card">
        <div className="section-head">
          <div className="section-head-title">
            <Star size={20} className="sec-icon star-active" />
            <h2>Ulasan &amp; Penilaian Masakan</h2>
          </div>
          <span className="section-counter">{reviews.length} Ulasan</span>
        </div>

        {feedback && (
          <div className="toast toast--success">
            <CheckCircle size={18} /> {feedback}
          </div>
        )}

        {/* Form Tambah Ulasan */}
        <form onSubmit={handleReviewSubmit} className="review-submit-form">
          <h3 className="form-sub-title">Bagikan Pengalaman Rasa Anda</h3>

          <div className="form-row-grid">
            <div className="form-field">
              <label htmlFor="rev-author" className="field-label">Nama Pengulas:</label>
              <input
                id="rev-author"
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Nama Anda..."
                className="input-text"
                required
              />
            </div>

            <div className="form-field">
              <label className="field-label">Tingkat Kepuasan (Rating):</label>
              <div className="star-picker">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className="star-pick-btn"
                    onClick={() => setRating(num)}
                    title={`${num} Bintang`}
                  >
                    <Star
                      size={22}
                      fill={num <= rating ? '#f59e0b' : 'none'}
                      stroke={num <= rating ? '#f59e0b' : '#94a3b8'}
                    />
                  </button>
                ))}
                <span className="star-picker-val">{rating} dari 5 Bintang</span>
              </div>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="rev-comment" className="field-label">Komentar &amp; Ulasan Rasa:</label>
            <textarea
              id="rev-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Bagikan tips memasak, aroma, atau kelezatan resep ini kepada yang lain..."
              className="input-textarea"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary"
            disabled={submitting}
          >
            {submitting ? 'Mengirim Ulasan...' : (
              <>
                <Send size={15} /> Kirim Ulasan
              </>
            )}
          </button>
        </form>

        {/* Existing Reviews List */}
        <div className="existing-reviews">
          {reviewsLoading ? (
            <p className="loading-text">Memuat ulasan...</p>
          ) : reviews.length > 0 ? (
            <ul className="reviews-list">
              {reviews.map((rev) => (
                <li key={rev.id} className="review-card">
                  <div className="review-card__head">
                    <div className="review-user-wrap">
                      <div className="review-avatar">
                        {rev.user_name ? rev.user_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="review-user-info">
                        <strong className="review-username">{rev.user_name}</strong>
                        <span className="review-date">
                          {new Date(rev.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="review-stars-show">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < rev.rating ? '#f59e0b' : 'none'}
                          stroke={i < rev.rating ? '#f59e0b' : '#cbd5e1'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="review-body">{rev.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-reviews-text">
              Belum ada ulasan untuk resep ini. Jadilah yang pertama memberikan ulasan!
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
