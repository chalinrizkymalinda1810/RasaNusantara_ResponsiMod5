// ---------------------------------------------------------------------------
// AdvancedFilter.jsx — Pencarian, Filter Kategori, & Pengurutan
// ---------------------------------------------------------------------------

import { Search, SlidersHorizontal, X } from 'lucide-react'

export default function AdvancedFilter({
  search,
  onSearch,
  categories,
  activeCategory,
  onCategory,
  activeDifficulty,
  onDifficulty,
  sortKey,
  sortOrder,
  onSort,
}) {
  return (
    <div className="adv-filter">
      {/* Search Input Bar */}
      <div className="adv-filter__search-box">
        <Search size={18} className="adv-filter__search-icon" />
        <input
          type="search"
          placeholder="Cari resep (contoh: Rendang, Soto, Padang, santan)..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="adv-filter__input"
          aria-label="Cari resep kuliner"
        />
        {search && (
          <button
            type="button"
            className="adv-filter__clear-btn"
            onClick={() => onSearch('')}
            aria-label="Bersihkan pencarian"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category Pills Bar */}
      <div className="adv-filter__pills">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`pill ${activeCategory === cat ? 'pill--active' : ''}`}
            onClick={() => onCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Extra Filters: Difficulty & Sort Controls */}
      <div className="adv-filter__sub-controls">
        {/* Difficulty Filter */}
        <div className="filter-select-group">
          <label htmlFor="difficulty-filter" className="filter-label">Tingkat:</label>
          <select
            id="difficulty-filter"
            value={activeDifficulty}
            onChange={(e) => onDifficulty(e.target.value)}
            className="filter-select"
          >
            <option value="Semua">Semua Tingkat</option>
            <option value="mudah">Mudah (Pemula)</option>
            <option value="sedang">Sedang (Menengah)</option>
            <option value="sulit">Sulit (Mahir)</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="filter-select-group">
          <SlidersHorizontal size={14} className="filter-label-icon" />
          <label htmlFor="sort-select" className="filter-label">Urutkan:</label>
          <select
            id="sort-select"
            value={`${sortKey}_${sortOrder}`}
            onChange={(e) => {
              const [key, order] = e.target.value.split('_')
              onSort({ key, order })
            }}
            className="filter-select"
            aria-label="Urutkan daftar resep"
          >
            <option value="name_asc">Nama (A &rarr; Z)</option>
            <option value="name_desc">Nama (Z &rarr; A)</option>
            <option value="rating_desc">Rating Tertinggi &starf;</option>
            <option value="cook_time_asc">Waktu Tercepat</option>
            <option value="price_asc">Biaya Terhemat</option>
          </select>
        </div>
      </div>
    </div>
  )
}
