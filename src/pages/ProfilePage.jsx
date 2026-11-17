// ---------------------------------------------------------------------------
// ProfilePage.jsx — Halaman Profil Pengembang / Mahasiswa Praktikan
// Menampilkan identitas wajib: Nama, NIM, dan Kelompok
// ---------------------------------------------------------------------------

import { useState } from 'react'
import {
  User,
  GraduationCap,
  Copy,
  Check,
  Save,
  Heart,
  BookOpen,
  Camera,
  Play,
  RotateCcw,
  Trash2,
  Sparkles,
  Wifi,
  ShieldCheck,
} from 'lucide-react'
import userService from '../services/userService'
import { useFavorites } from '../hooks/useFavorites'
import { useRecipes } from '../hooks/useRecipes'
import { getAllDraftIds, clearAllDrafts } from '../utils/draftStorage'
import recipeService from '../services/recipeService'
import ConfirmModal from '../components/modals/ConfirmModal'

export default function ProfilePage({ onReplaySplash }) {
  const [profile, setProfile] = useState(() => userService.getUserProfile())
  const [bio, setBio] = useState(profile.bio || '')
  const [avatar, setAvatar] = useState(profile.avatar || null)
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState('')

  const { favorites } = useFavorites()
  const { recipes, refetch: refetchRecipes } = useRecipes()
  const [draftCount, setDraftCount] = useState(() => getAllDraftIds().length)

  // Reset modal state
  const [showResetModal, setShowResetModal] = useState(false)
  const [showClearDraftModal, setShowClearDraftModal] = useState(false)

  const handleCopyId = () => {
    if (profile.userId) {
      navigator.clipboard.writeText(profile.userId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setFeedback('Ukuran file foto profil maksimal 2MB.')
      setTimeout(() => setFeedback(''), 3000)
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target.result
      setAvatar(base64)
      userService.updateAvatar(base64)
      setFeedback('Foto profil praktikan berhasil diperbarui.')
      setTimeout(() => setFeedback(''), 3000)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveBio = (e) => {
    e.preventDefault()
    const updated = {
      ...profile,
      bio: bio.trim(),
      avatar,
    }
    const res = userService.saveUserProfile(updated)
    if (res.success) {
      setProfile(res.data)
      setFeedback('Catatan profil praktikan berhasil disimpan!')
      setTimeout(() => setFeedback(''), 3000)
    }
  }

  const handleResetCatalog = () => {
    recipeService.resetToDefault()
    refetchRecipes()
    setShowResetModal(false)
    setFeedback('Katalog resep berhasil di-reset ke data bawaan modul praktikum.')
    setTimeout(() => setFeedback(''), 3000)
  }

  const handleClearDrafts = () => {
    clearAllDrafts()
    setDraftCount(0)
    setShowClearDraftModal(false)
    setFeedback('Semua draf tersimpan berhasil dibersihkan.')
    setTimeout(() => setFeedback(''), 3000)
  }

  return (
    <div className="profile-page">
      {/* Top Masthead */}
      <section className="catalog-masthead">
        <div className="masthead-flex-between">
          <div>
            <div className="masthead-badge">
              <GraduationCap size={14} color="#ea580c" />
              <span>Profil Pengembang &bull; Praktikum PPB 2026</span>
            </div>
            <h1 className="display-title">Profil Mahasiswa</h1>
            <p className="masthead-lede">
              Informasi identitas pengembang aplikasi Progressive Web App (PWA) Rasa Nusantara beserta statistik data dan pengelolaan sistem penyimpanan.
            </p>
          </div>

          {onReplaySplash && (
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={onReplaySplash}
              title="Putar ulang animasi intro splash screen"
            >
              <Play size={14} /> Putar Ulang Splash
            </button>
          )}
        </div>
      </section>

      {feedback && (
        <div className="toast toast--success">
          <Check size={18} /> {feedback}
        </div>
      )}

      {/* Main Identity Profile Card (Mandatory Requirements) */}
      <div className="profile-hero-card">
        <div className="profile-top-row">
          {/* Avatar with upload button */}
          <div className="profile-avatar-container">
            {avatar ? (
              <img src={avatar} alt={profile.name} className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-fallback">
                <User size={48} stroke="#ea580c" />
              </div>
            )}
            <label
              htmlFor="profile-avatar-input"
              className="avatar-change-btn"
              title="Ganti Foto Profil"
            >
              <Camera size={14} />
              <input
                id="profile-avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden-file-input"
              />
            </label>
          </div>

          {/* Student Identifiers */}
          <div className="profile-info-group">
            <div className="profile-badge-row">
              <span className="badge badge--primary">Praktikan PPB</span>
              <span className="badge badge--kelompok">Kelompok: {profile.kelompok}</span>
            </div>

            <h2 className="profile-student-name">{profile.name}</h2>

            <div className="profile-details-table">
              <div className="detail-row">
                <span className="detail-key">Nama Lengkap:</span>
                <strong className="detail-val">{profile.name}</strong>
              </div>
              <div className="detail-row">
                <span className="detail-key">Nomor Induk Mahasiswa (NIM):</span>
                <strong className="detail-val mono-text">{profile.nim}</strong>
              </div>
              <div className="detail-row">
                <span className="detail-key">Kelompok Praktikum:</span>
                <strong className="detail-val">{profile.kelompok}</strong>
              </div>
              <div className="detail-row">
                <span className="detail-key">Program Studi:</span>
                <span className="detail-val">{profile.institution}</span>
              </div>
            </div>

            <div className="user-id-box">
              <span className="user-id-label">Device Client ID:</span>
              <code className="user-id-code">{profile.userId}</code>
              <button
                type="button"
                className="copy-btn"
                onClick={handleCopyId}
                title="Salin ID Perangkat"
              >
                {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Live Statistics Counters */}
        <div className="profile-stats-grid">
          <div className="stat-card">
            <BookOpen size={24} className="stat-icon stat-icon--book" />
            <div className="stat-number">{recipes.length}</div>
            <div className="stat-name">Resep di Katalog</div>
          </div>

          <div className="stat-card">
            <Heart size={24} className="stat-icon stat-icon--heart" />
            <div className="stat-number">{favorites.length}</div>
            <div className="stat-name">Resep Favorit</div>
          </div>

          <div className="stat-card">
            <Sparkles size={24} className="stat-icon stat-icon--sparkle" />
            <div className="stat-number">{draftCount}</div>
            <div className="stat-name">Draft Autosave</div>
          </div>
        </div>
      </div>

      {/* Bio & Catatan Mahasiswa Form */}
      <form onSubmit={handleSaveBio} className="profile-form-card">
        <h3 className="section-head-title">Catatan Pengembang &amp; Bio Praktikan</h3>
        <p className="section-head-desc">
          Catatan singkat mengenai eksplorasi teknologi PWA, pembuatan komponen React, atau dokumentasi praktikum.
        </p>

        <div className="field-group">
          <label htmlFor="student-bio" className="field-label">Catatan / Bio:</label>
          <textarea
            id="student-bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="input-textarea"
            placeholder="Tuliskan catatan teknis atau deskripsi diri..."
          />
        </div>

        <button type="submit" className="btn btn--primary" style={{ alignSelf: 'flex-start' }}>
          <Save size={15} /> Simpan Catatan Profil
        </button>
      </form>

      {/* PWA & System Storage Diagnostics */}
      <div className="profile-form-card">
        <h3 className="section-head-title">Status Sistem &amp; Diagnostik PWA</h3>

        <div className="system-status-grid">
          <div className="status-item">
            <div className="status-label-wrap">
              <ShieldCheck size={18} color="#16a34a" />
              <span className="status-title">Service Worker &amp; PWA</span>
            </div>
            <span className="badge badge--green">Aktif &amp; Terdaftar</span>
          </div>

          <div className="status-item">
            <div className="status-label-wrap">
              <Wifi size={18} color="#ea580c" />
              <span className="status-title">Status Jaringan Perangkat</span>
            </div>
            <span className={`badge ${navigator.onLine ? 'badge--green' : 'badge--amber'}`}>
              {navigator.onLine ? 'Terkoneksi (Online)' : 'Bekerja Offline'}
            </span>
          </div>
        </div>

        <div className="danger-zone-box">
          <h4 className="danger-zone-title">Manajemen Penyimpanan Data</h4>
          <p className="danger-zone-desc">
            Kelola data localStorage aplikasi untuk kebutuhan pengujian CRUD atau pengembalian data awal.
          </p>

          <div className="danger-zone-actions">
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => setShowResetModal(true)}
            >
              <RotateCcw size={14} /> Reset Resep ke Bawaan
            </button>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => setShowClearDraftModal(true)}
            >
              <Trash2 size={14} /> Bersihkan Semua Draft
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modals */}
      <ConfirmModal
        open={showResetModal}
        title="Reset Katalog Resep?"
        message="Tindakan ini akan mengembalikan daftar resep ke kumpulan data awal praktikum dan menghapus resep kustom baru. Resep favorit Anda akan tetap aman."
        confirmLabel="Ya, Reset Data"
        cancelLabel="Batal"
        danger
        onConfirm={handleResetCatalog}
        onCancel={() => setShowResetModal(false)}
      />

      <ConfirmModal
        open={showClearDraftModal}
        title="Bersihkan Semua Draf?"
        message="Seluruh draf pembuatan atau edit resep yang belum sempat disimpan akan dihapus dari penyimpanan browser."
        confirmLabel="Bersihkan Draf"
        cancelLabel="Batal"
        danger
        onConfirm={handleClearDrafts}
        onCancel={() => setShowClearDraftModal(false)}
      />
    </div>
  )
}
