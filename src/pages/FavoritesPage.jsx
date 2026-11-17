// ---------------------------------------------------------------------------
// FavoritesPage.jsx — Halaman Resep Favorit Tersimpan
// ---------------------------------------------------------------------------

import { useMemo } from 'react'
import { Heart, Loader, ArrowRight, Utensils } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { useRecipes } from '../hooks/useRecipes'
import RecipeCard from '../components/recipe/RecipeCard'

export default function FavoritesPage({ onSelectRecipe, onNavigateCatalog }) {
  const { favorites, loading: favLoading } = useFavorites()
  const { recipes: allRecipes, loading: recLoading } = useRecipes()

  // Cocokkan id favorit dengan koleksi resep
  const favoriteRecipes = useMemo(() => {
    if (!favorites || favorites.length === 0) return []
    const favSet = new Set(favorites.map(String))
    return allRecipes.filter((r) => favSet.has(String(r.id)))
  }, [favorites, allRecipes])

  const isLoading = favLoading || recLoading

  return (
    <div className="favorites-page">
      <section className="catalog-masthead">
        <h1 className="display-title">Resep Favorit Saya</h1>
        <p className="masthead-lede">
          Kumpulan resep masakan yang telah Anda tandai sebagai favorit. Tersimpan secara persisten di penyimpanan perangkat Anda dan dapat diakses sewaktu-waktu tanpa koneksi internet.
        </p>
      </section>

      <div className="catalog-list-head">
        <div className="list-head-title-wrap">
          <h2>Koleksi Tersimpan</h2>
          <span className="count-pill">
            {favoriteRecipes.length} Resep Ditandai
          </span>
        </div>
      </div>

      {isLoading && (
        <div className="state-box">
          <Loader size={32} className="spin-icon" />
          <p>Memuat resep favorit Anda...</p>
        </div>
      )}

      {!isLoading && favoriteRecipes.length === 0 && (
        <div className="state-box">
          <Heart size={44} className="empty-fav-icon" />
          <h3>Belum Ada Resep Favorit</h3>
          <p>
            Anda belum menandai resep apa pun. Buka katalog masakan dan klik ikon hati (&hearts;) pada kartu resep yang ingin Anda simpan ke daftar ini.
          </p>
          {onNavigateCatalog && (
            <button
              type="button"
              className="btn btn--primary"
              onClick={onNavigateCatalog}
              style={{ marginTop: '12px' }}
            >
              Jelajahi Katalog Resep <ArrowRight size={16} />
            </button>
          )}
        </div>
      )}

      {!isLoading && favoriteRecipes.length > 0 && (
        <ul className="recipes-grid">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={onSelectRecipe}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
