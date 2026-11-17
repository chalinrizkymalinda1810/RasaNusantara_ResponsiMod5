// ---------------------------------------------------------------------------
// About.jsx — Halaman Informasi Teknologi PWA & Dokumentasi Modul
// ---------------------------------------------------------------------------

import { Layers, Smartphone, WifiOff, Database, Code2, Globe } from 'lucide-react'

export default function About() {
  return (
    <div className="about-page">
      <section className="catalog-masthead">
        <h1 className="display-title">Tentang Rasa Nusantara PWA</h1>
        <p className="masthead-lede">
          Aplikasi Progressive Web App (PWA) modern yang dibangun untuk mendemonstrasikan keandalan aplikasi web masa kini yang dapat diinstal, bekerja luring (offline), dan memiliki performa setara aplikasi native.
        </p>
      </section>

      {/* Grid Fitur Utama PWA */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon-box">
            <Smartphone size={24} color="#ea580c" />
          </div>
          <h3 className="feature-title">Dapat Di-install (Installable)</h3>
          <p className="feature-desc">
            Menggunakan Web App Manifest standar sehingga pengguna dapat memasang aplikasi langsung ke layar utama Android, iOS, maupun desktop tanpa melalui app store.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-box">
            <WifiOff size={24} color="#ea580c" />
          </div>
          <h3 className="feature-title">Bekerja Offline (Offline-First)</h3>
          <p className="feature-desc">
            Didukung oleh Service Worker dan Cache Storage yang menyimpan seluruh aset JavaScript, CSS, HTML, dan gambar vektor secara otomatis untuk akses seketika meski tanpa jaringan internet.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-box">
            <Database size={24} color="#ea580c" />
          </div>
          <h3 className="feature-title">CRUD &amp; Data Persistence</h3>
          <p className="feature-desc">
            Fitur Create, Read, Update, dan Delete (CRUD) fungsional dengan sinkronisasi ke Web Storage (localStorage) dan integrasi RESTful API menggunakan Axios.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-box">
            <Layers size={24} color="#ea580c" />
          </div>
          <h3 className="feature-title">Single Page Application (SPA)</h3>
          <p className="feature-desc">
            Dibangun dengan React Hooks, State Management modular, dialog modal interaktif, dan auto-save draft formulir untuk menjaga pengalaman pengguna yang mulus tanpa reload halaman.
          </p>
        </div>
      </div>

      {/* Technical Architecture Specs */}
      <div className="tech-spec-card">
        <div className="tech-spec-head">
          <Code2 size={22} color="#ea580c" />
          <h2>Spesifikasi Tumpukan Teknologi (Tech Stack)</h2>
        </div>

        <div className="tech-table">
          <div className="tech-row">
            <span className="tech-col-label">Frontend Framework</span>
            <span className="tech-col-val">React JS 18 (Declarative UI &amp; Custom Hooks)</span>
          </div>
          <div className="tech-row">
            <span className="tech-col-label">Build Tool &amp; Bundler</span>
            <span className="tech-col-val">Vite 5 (Native ES Modules &amp; Fast HMR)</span>
          </div>
          <div className="tech-row">
            <span className="tech-col-label">PWA Engine</span>
            <span className="tech-col-val">vite-plugin-pwa (Workbox Pre-caching &amp; Auto-Update)</span>
          </div>
          <div className="tech-row">
            <span className="tech-col-label">HTTP Client</span>
            <span className="tech-col-val">Axios (Interceptors, Error Normalization &amp; Offline Fallback)</span>
          </div>
          <div className="tech-row">
            <span className="tech-col-label">Iconography</span>
            <span className="tech-col-val">Lucide React Icons</span>
          </div>
          <div className="tech-row">
            <span className="tech-col-label">Penyimpanan Data</span>
            <span className="tech-col-val">HTML5 LocalStorage API &amp; Cache Storage API</span>
          </div>
          <div className="tech-row">
            <span className="tech-col-label">Deployment Target</span>
            <span className="tech-col-val">Vercel Cloud Platform (HTTPS &amp; CDN Caching)</span>
          </div>
        </div>
      </div>

      {/* Academic Credits */}
      <div className="academic-card">
        <h3>Informasi Tugas Praktikum</h3>
        <p>
          Aplikasi ini dirancang dan dikembangkan sebagai tugas praktikum mata kuliah:
        </p>
        <p className="academic-highlight">
          <strong>Praktikum Pengembangan Perangkat Bergerak (PPB)</strong><br />
          Departemen Teknik Komputer &bull; Fakultas Teknik &bull; Universitas Diponegoro
        </p>
        <div className="academic-author-box">
          <div><strong>Nama Praktikan:</strong> Chalin Rizky Malinda</div>
          <div><strong>NIM:</strong> 21120124120029</div>
          <div><strong>Kelompok:</strong> 35</div>
        </div>
      </div>
    </div>
  )
}
