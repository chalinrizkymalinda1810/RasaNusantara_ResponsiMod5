// ---------------------------------------------------------------------------
// PWABadge.jsx — Indikator Offline & Prompt Instalasi PWA
// ---------------------------------------------------------------------------

import { useState, useEffect } from 'react'
import { Download, WifiOff, X, Check } from 'lucide-react'

export default function PWABadge() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [installed, setInstalled] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    const handleAppInstalled = () => {
      setInstalled(true)
      setInstallPrompt(null)
    }

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
    }
    setInstallPrompt(null)
  }

  if (dismissed) return null

  // Offline status banner
  if (isOffline) {
    return (
      <aside className="pwa-badge pwa-badge--offline" role="status" aria-live="polite">
        <div className="pwa-badge-content">
          <WifiOff size={18} className="pwa-icon-offline" />
          <span>
            <strong>Mode Offline Aktif</strong> — Katalog resep & fitur CRUD tetap berjalan lancar via Cache Storage.
          </span>
        </div>
        <button
          type="button"
          className="icon-btn-ghost"
          onClick={() => setDismissed(true)}
          aria-label="Tutup"
        >
          <X size={14} />
        </button>
      </aside>
    )
  }

  // PWA Install prompt banner
  if (installPrompt && !installed) {
    return (
      <aside className="pwa-badge" role="region" aria-label="Instal Aplikasi PWA">
        <div className="pwa-badge-content">
          <div className="pwa-badge-icon-box">
            <Download size={18} />
          </div>
          <div className="pwa-badge-text">
            <strong>Pasang Aplikasi Rasa Nusantara</strong>
            <span>Akses resep favorit tanpa kuota & buka langsung dari layar utama.</span>
          </div>
        </div>
        <div className="pwa-badge-actions">
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={handleInstallClick}
          >
            <Download size={14} /> Pasang
          </button>
          <button
            type="button"
            className="icon-btn-ghost"
            onClick={() => setDismissed(true)}
            aria-label="Tutup pesan instalasi"
          >
            <X size={14} />
          </button>
        </div>
      </aside>
    )
  }

  return null
}
