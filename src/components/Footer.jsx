// ---------------------------------------------------------------------------
// Footer.jsx — Footer Informasi Aplikasi & Hak Cipta
// ---------------------------------------------------------------------------

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-title">Rasa Nusantara PWA</span>
            <p className="footer-desc">
              Aplikasi Progressive Web App (PWA) berbasis React dan Vite untuk preservasi, eksplorasi, dan manajemen resep kuliner khas Indonesia. Bekerja penuh secara offline.
            </p>
          </div>
          <div className="footer-student">
            <span className="footer-student-label">Informasi Praktikan:</span>
            <p className="footer-student-name">
              <strong>Nama:</strong> Chalin Rizky Malinda
            </p>
            <p className="footer-student-info">
              <strong>NIM:</strong> 21120124120029 &bull; <strong>Kelompok:</strong> 35
            </p>
            <p className="footer-student-course">
              Praktikum Pengembangan Perangkat Bergerak &bull; Teknik Komputer UNDIP
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Rasa Nusantara PWA &bull; Dibuat untuk Modul Praktikum PPB.</p>
          <div className="tech-tags">
            <span className="tag">React 18</span>
            <span className="tag">Vite</span>
            <span className="tag">vite-plugin-pwa</span>
            <span className="tag">LocalStorage Persistence</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
