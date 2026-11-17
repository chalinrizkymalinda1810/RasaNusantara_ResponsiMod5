// ---------------------------------------------------------------------------
// Catalog.jsx — Halaman Eksplorasi Katalog Resep Kuliner Nusantara
// ---------------------------------------------------------------------------

import { useState, useMemo } from 'react'
import { Plus, RefreshCw, Loader, AlertCircle, Utensils, Sparkles } from 'lucide-react'
import { useRecipes } from '../hooks/useRecipes'
import RecipeCard from '../components/recipe/RecipeCard'
import RecipeDetail from '../components/recipe/RecipeDetail'
import AdvancedFilter from '../components/common/AdvancedFilter'
import ConfirmModal from '../components/modals/ConfirmModal'
import recipeService from '../services/recipeService'
import {
  matchesSearch,
  matchesCategory,
  matchesDifficulty,
  sortItems,
  extractCategories,
} from '../utils/helpers'

export default function Catalog({ onNavigate }) {
  const { recipes, loading, error, refetch } = useRecipes()

  // Filter & sort states
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [activeDifficulty, setActiveDifficulty] = useState('Semua')
  const [sortKey, setSortKey] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  // Selected recipe for detail view
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  // Dynamically extract categories from current recipes
  const categories = useMemo(() => extractCategories(recipes), [recipes])

  // Filter and sort the recipe collection
  const filteredRecipes = useMemo(() => {
    let result = recipes.filter(
      (r) =>
        matchesSearch(r, search) &&
        matchesCategory(r, activeCategory) &&
        matchesDifficulty(r, activeDifficulty)
    )
    return sortItems(result, sortKey, sortOrder)
  }, [recipes, search, activeCategory, activeDifficulty, sortKey, sortOrder])

  // Handle recipe deletion
  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      setDeleteError('')
      await recipeService.deleteRecipe(deleteTarget.id)
      setDeleteTarget(null)
      refetch()
    } catch (err) {
      setDeleteError(err.message || 'Gagal menghapus resep.')
    } finally {
      setDeleting(false)
    }
  }

  // Jika sedang membuka detail resep
  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
        onEdit={(r) => onNavigate && onNavigate('Edit', r)}
        onDelete={(r) => {
          setSelectedRecipe(null)
          setDeleteTarget(r)
        }}
      />
    )
  }

  return (
    <div className="catalog-page">
      {/* Hero Masthead Banner */}
      <section className="catalog-masthead">
        <div className="masthead-badge">
          <Sparkles size={14} color="#ea580c" />
          <span>Koleksi Kuliner Warisan Tradisi Indonesia</span>
        </div>
        <h1 className="display-title">Cita Rasa Asli Nusantara</h1>
        <p className="masthead-lede">
          Jelajahi resep masakan tradisional dari Sabang sampai Merauke. Lengkap dengan takaran bumbu, panduan memasak langkah demi langkah, dan estimasi biaya belanja.
        </p>
      </section>

      {/* Advanced Filter, Search & Sorting */}
      <AdvancedFilter
        search={search}
        onSearch={setSearch}
        categories={categories}
        activeCategory={activeCategory}
        onCategory={setActiveCategory}
        activeDifficulty={activeDifficulty}
        onDifficulty={setActiveDifficulty}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={({ key, order }) => {
          setSortKey(key)
          setSortOrder(order)
        }}
      />

      {/* List Header & Counter */}
      <div className="catalog-list-head">
        <div className="list-head-title-wrap">
          <h2>Daftar Koleksi Resep</h2>
          <span className="count-pill">
            {filteredRecipes.length} Resep Terdaftar
          </span>
        </div>

        {onNavigate && (
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => onNavigate('Create')}
          >
            <Plus size={16} /> Tambah Resep
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="state-box">
          <Loader size={32} className="spin-icon" />
          <p>Sedang memuat resep nusantara...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="state-box state-box--error">
          <AlertCircle size={32} />
          <p>{error}</p>
          <button type="button" className="btn btn--outline" onClick={refetch}>
            <RefreshCw size={15} /> Muat Ulang
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredRecipes.length === 0 && (
        <div className="state-box">
          <Utensils size={40} className="empty-icon" />
          <h3>Tidak ada resep yang cocok</h3>
          <p>
            Coba gunakan kata kunci pencarian lain atau pilih kategori yang berbeda.
          </p>
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => {
              setSearch('')
              setActiveCategory('Semua')
              setActiveDifficulty('Semua')
            }}
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* Recipe Card Grid */}
      {!loading && filteredRecipes.length > 0 && (
        <ul className="recipes-grid">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={setSelectedRecipe}
              onEdit={onNavigate ? (r) => onNavigate('Edit', r) : undefined}
              onDelete={setDeleteTarget}
            />
          ))}
        </ul>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Resep Masakan"
        message={`Apakah Anda yakin ingin menghapus resep "${deleteTarget?.name}" dari katalog? Tindakan ini akan menghapus data dari penyimpanan lokal.`}
        confirmLabel="Ya, Hapus Resep"
        cancelLabel="Batal"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteTarget(null)
          setDeleteError('')
        }}
      />

      {deleteError && (
        <div className="toast toast--error">{deleteError}</div>
      )}
    </div>
  )
}
