// ---------------------------------------------------------------------------
// Header.jsx — Header Navigasi Utama Aplikasi Rasa Nusantara
// ---------------------------------------------------------------------------

import { UtensilsCrossed, Plus, Heart, User, BookOpen, Info } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'

const NAV_ITEMS = [
  { id: 'Catalog', label: 'Katalog Resep', icon: UtensilsCrossed },
  { id: 'Favorites', label: 'Favorit', icon: Heart, hasBadge: true },
  { id: 'Create', label: 'Tambah Resep', icon: Plus },
  { id: 'Profile', label: 'Profil Mahasiswa', icon: User },
  { id: 'About', label: 'Tentang PWA', icon: Info },
]

export default function Header({ tab, onTab, onNavigateCreate }) {
  const { favorites } = useFavorites()
  const favCount = favorites ? favorites.length : 0

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand / Logo */}
        <div
          className="header-brand"
          onClick={() => onTab('Catalog')}
          role="button"
          tabIndex={0}
          title="Kembali ke Beranda"
        >
          <div className="brand-logo-icon">
            <img src="/icons/icon.svg" alt="Rasa Nusantara" className="brand-img" />
          </div>
          <div className="brand-titles">
            <span className="brand-main">Rasa Nusantara</span>
            <span className="brand-sub">KULINER &amp; RESEP PWA</span>
          </div>
        </div>

        {/* Desktop & Mobile Navigation */}
        <nav className="header-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = tab === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${isActive ? 'nav-item--active' : ''}`}
                onClick={() => {
                  if (item.id === 'Create' && onNavigateCreate) {
                    onNavigateCreate()
                  } else {
                    onTab(item.id)
                  }
                }}
              >
                <Icon size={16} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {item.hasBadge && favCount > 0 && (
                  <span className="nav-counter">{favCount}</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Action Button */}
        {onNavigateCreate && (
          <button
            type="button"
            className="btn btn--primary btn--sm header-cta"
            onClick={onNavigateCreate}
            title="Tambah resep kuliner baru"
          >
            <Plus size={16} /> Resep Baru
          </button>
        )}
      </div>
    </header>
  )
}
