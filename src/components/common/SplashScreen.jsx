// ---------------------------------------------------------------------------
// SplashScreen.jsx — Splash Screen Animasi Pembuka Rasa Nusantara
// ---------------------------------------------------------------------------

import { useState, useEffect, useCallback, useRef } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import './SplashScreen.css'

export default function SplashScreen({ onFinish, duration = 3800 }) {
  const [isFading, setIsFading] = useState(false)
  const dismissedRef = useRef(false)

  const handleDismiss = useCallback(() => {
    if (dismissedRef.current) return
    dismissedRef.current = true
    setIsFading(true)
    setTimeout(() => {
      if (onFinish) onFinish()
    }, 600)
  }, [onFinish])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss()
    }, duration)

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleDismiss()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [duration, handleDismiss])

  return (
    <main
      className={`splash-overlay ${isFading ? 'splash-overlay--fading' : ''}`}
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
      aria-label="Rasa Nusantara Intro"
    >
      <div className="splash-center">
        <img
          src="/icons/icon.svg"
          alt="Rasa Nusantara Logo"
          className="splash-emblem"
        />

        <div className="splash-brand">
          <h1 className="splash-brand-title">Rasa Nusantara</h1>
          <div className="splash-brand-subtitle">Eksplorasi Kuliner Indonesia</div>
          <div className="splash-badge-info">
            <Sparkles size={14} color="#fde047" />
            <span>Chalin Rizky Malinda &bull; Kelompok 35</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="splash-skip-btn"
        onClick={(e) => {
          e.stopPropagation()
          handleDismiss()
        }}
      >
        <span>Masuk ke Dapur Rasa</span>
        <ArrowRight size={14} />
      </button>
    </main>
  )
}
