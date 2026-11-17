// ---------------------------------------------------------------------------
// FavoriteButton.jsx — Tombol favorit interaktif dengan animasi
// ---------------------------------------------------------------------------

import { Heart } from 'lucide-react'
import { useFavorites } from '../../hooks/useFavorites'

export default function FavoriteButton({ recipeId, onToggle }) {
  const { isFavorited, toggleFavorite, loading } = useFavorites()
  const active = isFavorited(recipeId)

  const handleClick = async (e) => {
    e.stopPropagation()
    const result = await toggleFavorite(recipeId)
    if (onToggle) onToggle(result)
  }

  return (
    <button
      type="button"
      className={`fav-btn ${active ? 'fav-btn--active' : ''}`}
      onClick={handleClick}
      disabled={loading}
      aria-label={active ? 'Hapus dari resep favorit' : 'Simpan ke resep favorit'}
      title={active ? 'Hapus dari favorit' : 'Simpan ke favorit'}
    >
      <Heart
        size={18}
        fill={active ? '#dc2626' : 'none'}
        stroke={active ? '#dc2626' : 'currentColor'}
      />
    </button>
  )
}
