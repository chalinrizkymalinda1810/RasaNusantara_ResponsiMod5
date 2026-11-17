// ---------------------------------------------------------------------------
// RecipeCard.jsx — Kartu Resep Kuliner Nusantara
// ---------------------------------------------------------------------------

import { Clock, Users, Star, MapPin, Edit3, Trash2 } from 'lucide-react'
import FavoriteButton from '../common/FavoriteButton'
import { formatRupiah, formatTime, truncate } from '../../utils/helpers'

export default function RecipeCard({ recipe, onSelect, onEdit, onDelete }) {
  const imgSrc = recipe.image_url || '/recipes/default.svg'
  const rating = Number(recipe.average_rating) || 5.0
  const reviewCount = recipe.review_count || 0

  const getDifficultyBadge = (diff) => {
    switch ((diff || '').toLowerCase()) {
      case 'mudah':
        return <span className="badge badge--green">Mudah</span>
      case 'sedang':
        return <span className="badge badge--amber">Sedang</span>
      case 'sulit':
        return <span className="badge badge--red">Mahir</span>
      default:
        return <span className="badge badge--gray">Standar</span>
    }
  }

  return (
    <li className="recipe-card">
      <div
        className="recipe-card__clickable"
        onClick={() => onSelect(recipe)}
        role="button"
        tabIndex={0}
      >
        {/* Thumbnail Image with Badges */}
        <div className="recipe-card__media">
          <img
            src={imgSrc}
            alt={recipe.name}
            className="recipe-card__img"
            loading="lazy"
          />
          <div className="recipe-card__media-badges">
            <span className="badge badge--category">{recipe.category || 'Kuliner'}</span>
            {getDifficultyBadge(recipe.difficulty)}
          </div>
        </div>

        {/* Content Body */}
        <div className="recipe-card__body">
          {recipe.origin && (
            <div className="recipe-card__origin">
              <MapPin size={13} className="origin-icon" />
              <span>{recipe.origin}</span>
            </div>
          )}

          <h3 className="recipe-card__title">{recipe.name}</h3>

          <p className="recipe-card__desc">
            {truncate(recipe.description || 'Resep lezat khas Nusantara dengan racikan bumbu rempah tradisional.', 80)}
          </p>

          {/* Key Meta Stats */}
          <div className="recipe-card__meta">
            <div className="meta-item" title="Waktu Memasak">
              <Clock size={14} />
              <span>{formatTime(recipe.cook_time || 30)}</span>
            </div>
            {recipe.servings && (
              <div className="meta-item" title="Porsi">
                <Users size={14} />
                <span>{recipe.servings} Porsi</span>
              </div>
            )}
            <div className="meta-item meta-item--rating" title="Rating Pengguna">
              <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
              <span>{rating.toFixed(1)}</span>
              {reviewCount > 0 && <span className="count-sub">({reviewCount})</span>}
            </div>
          </div>

          {/* Price Footnote */}
          <div className="recipe-card__footer">
            <span className="price-tag">
              {formatRupiah(recipe.price || 25000)}
            </span>
            <span className="price-label">est. belanja</span>
          </div>
        </div>
      </div>

      {/* Floating Action Controls */}
      <div className="recipe-card__floating-actions">
        <FavoriteButton recipeId={recipe.id} />
        {onEdit && (
          <button
            type="button"
            className="card-action-btn"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(recipe)
            }}
            title="Edit Resep"
            aria-label={`Ubah ${recipe.name}`}
          >
            <Edit3 size={15} />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            className="card-action-btn card-action-btn--danger"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(recipe)
            }}
            title="Hapus Resep"
            aria-label={`Hapus ${recipe.name}`}
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </li>
  )
}
