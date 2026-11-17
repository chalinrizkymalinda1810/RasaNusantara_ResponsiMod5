// ---------------------------------------------------------------------------
// App.jsx — Komponen Utama Aplikasi Rasa Nusantara PWA
// ---------------------------------------------------------------------------

import { useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Catalog from './pages/Catalog.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import CreateRecipePage from './pages/CreateRecipePage.jsx'
import EditRecipePage from './pages/EditRecipePage.jsx'
import RecipeDetail from './components/recipe/RecipeDetail.jsx'
import About from './pages/About.jsx'
import PWABadge from './components/PWABadge.jsx'
import ConfirmModal from './components/modals/ConfirmModal.jsx'
import SplashScreen from './components/common/SplashScreen.jsx'
import recipeService from './services/recipeService.js'
import './App.css'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [tab, setTab] = useState('Catalog')
  const [mode, setMode] = useState('list') // 'list' | 'create' | 'edit' | 'detail'
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Unified navigation handler
  const handleNavigate = (target, payload) => {
    if (target === 'Create') {
      setMode('create')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (target === 'Edit') {
      setEditingRecipe(payload)
      setMode('edit')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (target === 'Detail') {
      setSelectedRecipe(payload)
      setMode('detail')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Tab change
      setTab(target)
      setMode('list')
      setSelectedRecipe(null)
      setEditingRecipe(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBackToList = () => {
    setMode('list')
    setSelectedRecipe(null)
    setEditingRecipe(null)
  }

  return (
    <div className="app-shell">
      {/* Animated Splash Screen */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Navigation Header */}
      <Header
        tab={mode === 'list' ? tab : ''}
        onTab={(newTab) => handleNavigate(newTab)}
        onNavigateCreate={() => handleNavigate('Create')}
      />

      {/* Main View Area */}
      <main className="app-main">
        {/* Sub-page: Tambah Resep (CREATE) */}
        {mode === 'create' && (
          <CreateRecipePage
            onBack={handleBackToList}
            onSuccess={() => {
              handleBackToList()
              setTab('Catalog')
            }}
          />
        )}

        {/* Sub-page: Edit Resep (UPDATE) */}
        {mode === 'edit' && (
          <EditRecipePage
            recipe={editingRecipe}
            recipeId={editingRecipe?.id}
            onBack={handleBackToList}
            onSuccess={() => {
              handleBackToList()
              setTab('Catalog')
            }}
          />
        )}

        {/* Sub-page: Detail Resep (READ) */}
        {mode === 'detail' && selectedRecipe && (
          <RecipeDetail
            recipe={selectedRecipe}
            onBack={handleBackToList}
            onEdit={(r) => handleNavigate('Edit', r)}
            onDelete={(r) => setDeleteTarget(r)}
          />
        )}

        {/* Top-level Tabs */}
        {mode === 'list' && (
          <>
            {tab === 'Catalog' && (
              <Catalog
                onNavigate={(destination, payload) => handleNavigate(destination, payload)}
              />
            )}
            {tab === 'Favorites' && (
              <FavoritesPage
                onSelectRecipe={(r) => handleNavigate('Detail', r)}
                onNavigateCatalog={() => setTab('Catalog')}
              />
            )}
            {tab === 'Profile' && (
              <ProfilePage onReplaySplash={() => setShowSplash(true)} />
            )}
            {tab === 'About' && <About />}
          </>
        )}
      </main>

      {/* Global Delete Confirmation Modal */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Resep Masakan"
        message={`Apakah Anda yakin ingin menghapus "${deleteTarget?.name}"? Data resep ini akan dihapus dari penyimpanan lokal Anda.`}
        confirmLabel="Hapus Resep"
        cancelLabel="Batal"
        danger
        loading={deleting}
        onConfirm={async () => {
          if (!deleteTarget) return
          try {
            setDeleting(true)
            await recipeService.deleteRecipe(deleteTarget.id)
            setDeleteTarget(null)
            handleBackToList()
            setTab('Catalog')
          } catch (err) {
            alert(err.message || 'Gagal menghapus resep.')
          } finally {
            setDeleting(false)
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* PWA Offline & Install Notification Banner */}
      <PWABadge />

      {/* App Footer */}
      <Footer />
    </div>
  )
}
