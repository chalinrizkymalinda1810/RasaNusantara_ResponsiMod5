// ---------------------------------------------------------------------------
// CreateRecipePage.jsx — Halaman Pembuatan Resep Baru (CRUD - CREATE)
// Dilengkapi auto-save draft, pemilih ilustrasi, bahan & langkah dinamis
// ---------------------------------------------------------------------------

import { useState, useEffect, useCallback } from 'react'
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
  Image,
  Sparkles,
} from 'lucide-react'
import recipeService from '../services/recipeService'
import {
  saveDraft,
  loadDraft,
  deleteDraft,
  hasDraft,
  getDraftTimestamp,
  formatDraftTime,
} from '../utils/draftStorage'
import ConfirmModal from '../components/modals/ConfirmModal'

const PRESET_IMAGES = [
  { label: 'Rendang Sapi', url: '/recipes/rendang.jpg' },
  { label: 'Soto Betawi', url: '/recipes/soto.jpg' },
  { label: 'Sate Madura', url: '/recipes/sate.jpg' },
  { label: 'Es Cendol Dawet', url: '/recipes/cendol.jpg' },
  { label: 'Nasi Goreng', url: '/recipes/nasigoreng.jpg' },
  { label: 'Gado-Gado', url: '/recipes/gadogado.jpg' },
  { label: 'Aneka Masakan', url: '/recipes/default.jpg' },
]

export default function CreateRecipePage({ onBack, onSuccess }) {
  const [currentStep, setCurrentStep] = useState('form') // 'media' | 'form'

  const [formData, setFormData] = useState({
    name: '',
    category: 'Makanan Utama',
    origin: '',
    difficulty: 'mudah',
    prep_time: 20,
    cook_time: 45,
    price: 40000,
    servings: 4,
    description: '',
    is_featured: false,
    image_url: '/recipes/rendang.jpg',
  })

  // Dynamic Ingredients state
  const [ingredients, setIngredients] = useState([
    { name: 'Bahan Utama', quantity: '500 gram' },
    { name: 'Bawang Merah & Putih', quantity: '6 & 4 siung' },
    { name: 'Garam & Penyedap Rasa', quantity: 'Secukupnya' },
  ])

  // Dynamic Steps state
  const [steps, setSteps] = useState([
    'Siapkan dan cuci bersih seluruh bahan masakan.',
    'Haluskan bumbu rempah lalu tumis hingga harum berminyak.',
    'Masukkan bahan utama, masak hingga bumbu meresap sempurna.',
  ])

  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Draft management
  const [showDraftModal, setShowDraftModal] = useState(() => hasDraft('create'))
  const [draftTimestamp, setDraftTimestamp] = useState(() => getDraftTimestamp('create'))

  // Save draft helper
  const handleSaveDraft = useCallback((notify = true) => {
    const draftData = {
      formData,
      ingredients,
      steps,
    }
    const saved = saveDraft(draftData, 'create')
    if (saved) {
      const ts = getDraftTimestamp('create')
      setDraftTimestamp(ts)
      if (notify) {
        setSuccessMsg(`Draft resep berhasil disimpan otomatis (${formatDraftTime(ts)})`)
        setTimeout(() => setSuccessMsg(''), 3000)
      }
    }
  }, [formData, ingredients, steps])

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleSaveDraft(false)
    }, 30000)
    return () => clearInterval(interval)
  }, [handleSaveDraft])

  // Restore draft
  const handleLoadDraft = () => {
    const draft = loadDraft('create')
    if (draft) {
      if (draft.formData) setFormData(draft.formData)
      if (draft.ingredients) setIngredients(draft.ingredients)
      if (draft.steps) setSteps(draft.steps)
      setShowDraftModal(false)
      setSuccessMsg('Draft resep sebelumnya berhasil dipulihkan!')
      setTimeout(() => setSuccessMsg(''), 4000)
    }
  }

  const handleDiscardDraft = () => {
    deleteDraft('create')
    setShowDraftModal(false)
    setDraftTimestamp(null)
  }

  // Handle local image file upload (converts to base64 for offline storage)
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) {
      setError('Ukuran file foto maksimal 3MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, image_url: event.target.result }))
      setSuccessMsg('Foto ilustrasi berhasil dipasang.')
      setTimeout(() => setSuccessMsg(''), 3000)
    }
    reader.readAsDataURL(file)
  }

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Ingredients handlers
  const handleIngredientChange = (index, field, value) => {
    setIngredients((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { name: '', quantity: '' }])
  }

  const removeIngredient = (index) => {
    if (ingredients.length <= 1) return
    setIngredients((prev) => prev.filter((_, i) => i !== index))
  }

  // Steps handlers
  const handleStepChange = (index, value) => {
    setSteps((prev) => {
      const copy = [...prev]
      copy[index] = value
      return copy
    })
  }

  const addStep = () => {
    setSteps((prev) => [...prev, ''])
  }

  const removeStep = (index) => {
    if (steps.length <= 1) return
    setSteps((prev) => prev.filter((_, i) => i !== index))
  }

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      setError('Nama resep masakan minimal 3 karakter.')
      return
    }

    const cleanIngredients = ingredients
      .filter((item) => item.name.trim())
      .map((item, idx) => ({
        id: `ing-${Date.now()}-${idx}`,
        name: item.name.trim(),
        quantity: item.quantity.trim() || 'Secukupnya',
      }))

    if (cleanIngredients.length === 0) {
      setError('Mohon masukkan setidaknya satu bahan masakan.')
      return
    }

    const cleanSteps = steps
      .filter((s) => s.trim())
      .map((s) => s.trim())

    if (cleanSteps.length === 0) {
      setError('Mohon masukkan setidaknya satu langkah memasak.')
      return
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      origin: formData.origin.trim() || 'Nusantara, Indonesia',
      difficulty: formData.difficulty,
      prep_time: Number(formData.prep_time) || 15,
      cook_time: Number(formData.cook_time) || 30,
      price: Number(formData.price) || 25000,
      servings: Number(formData.servings) || 4,
      description:
        formData.description.trim() ||
        `${formData.name} khas ${formData.origin || 'Indonesia'} yang lezat dan kaya rempah.`,
      image_url: formData.image_url || '/recipes/default.jpg',
      is_featured: Boolean(formData.is_featured),
      ingredients: cleanIngredients,
      steps: cleanSteps,
    }

    try {
      setCreating(true)
      const res = await recipeService.createRecipe(payload)
      if (res.success) {
        deleteDraft('create')
        if (onSuccess) {
          onSuccess(res.data)
        } else if (onBack) {
          onBack()
        }
      }
    } catch (err) {
      setError(err.message || 'Gagal menyimpan resep ke sistem.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="form-page">
      {/* Header bar */}
      <div className="form-head">
        <button type="button" className="btn-back" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Batal &amp; Kembali</span>
        </button>

        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={() => handleSaveDraft(true)}
          title="Simpan draft ke penyimpanan lokal"
        >
          <Save size={15} /> Simpan Draft
        </button>
      </div>

      <div className="form-title-group">
        <h1 className="display-title">Tambah Resep Baru</h1>
        <p className="form-lede">
          Daftarkan kreasi masakan atau warisan kuliner keluarga ke dalam katalog Rasa Nusantara. Data tersimpan secara persisten di penyimpanan browser lokal.
        </p>
      </div>

      {/* Notifications */}
      {error && (
        <div className="toast toast--error">
          <AlertCircle size={18} /> {error}
        </div>
      )}
      {successMsg && (
        <div className="toast toast--success">
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="recipe-form">
        {/* Section 1: Foto Masakan */}
        <div className="form-card">
          <h2 className="form-card-title">Foto Masakan</h2>
          <p className="form-card-desc">
            Pilih foto dari pilihan masakan di bawah atau unggah foto masakan Anda sendiri:
          </p>

          <div className="image-selector-wrap">
            <div className="current-image-preview">
              <img src={formData.image_url} alt="Pratinjau Foto Masakan" />
              <div className="preview-status-pill">Foto Terpilih</div>
            </div>

            <div className="image-options">
              <span className="options-title">Pilihan Foto Masakan:</span>
              <div className="preset-pills-grid">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    className={`preset-pill ${formData.image_url === preset.url ? 'preset-pill--active' : ''}`}
                    onClick={() => setFormData((p) => ({ ...p, image_url: preset.url }))}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="upload-and-url-group">
                <label htmlFor="custom-recipe-file" className="btn btn--outline btn--sm">
                  <Upload size={14} /> Unggah Foto dari Perangkat
                </label>
                <input
                  id="custom-recipe-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden-file-input"
                />

                <input
                  type="url"
                  placeholder="Atau tempel link URL foto (https://...)"
                  value={formData.image_url.startsWith('data:') || formData.image_url.startsWith('/recipes/') ? '' : formData.image_url}
                  onChange={(e) => {
                    if (e.target.value.trim()) {
                      setFormData((p) => ({ ...p, image_url: e.target.value.trim() }))
                    }
                  }}
                  className="input-text input-text--sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Data Utama Resep */}
        <div className="form-card">
          <h2 className="form-card-title">Informasi Utama Resep</h2>

          <div className="form-grid-2">
            <div className="field-group">
              <label htmlFor="name" className="field-label">
                Nama Resep Kuliner <span className="req">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Contoh: Ayam Betutu Khas Gilimanuk"
                className="input-text"
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="origin" className="field-label">
                Asal Daerah / Kota Asal <span className="req">*</span>
              </label>
              <input
                id="origin"
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleFormChange}
                placeholder="Contoh: Denpasar, Bali"
                className="input-text"
                required
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="field-group">
              <label htmlFor="category" className="field-label">
                Kategori Masakan <span className="req">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="select-box"
              >
                <option value="Makanan Utama">Makanan Utama</option>
                <option value="Minuman Tradisional">Minuman Tradisional</option>
                <option value="Cemilan & Jajanan">Cemilan &amp; Jajanan</option>
                <option value="Dessert">Dessert &amp; Manisan</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="difficulty" className="field-label">
                Tingkat Kesulitan <span className="req">*</span>
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleFormChange}
                className="select-box"
              >
                <option value="mudah">Mudah (Pemula)</option>
                <option value="sedang">Sedang (Menengah)</option>
                <option value="sulit">Sulit (Mahir / Butuh Waktu)</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="servings" className="field-label">
                Porsi (Orang) <span className="req">*</span>
              </label>
              <input
                id="servings"
                type="number"
                name="servings"
                value={formData.servings}
                onChange={handleFormChange}
                min="1"
                className="input-text"
                required
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="field-group">
              <label htmlFor="prep_time" className="field-label">
                Waktu Persiapan (Menit) <span className="req">*</span>
              </label>
              <input
                id="prep_time"
                type="number"
                name="prep_time"
                value={formData.prep_time}
                onChange={handleFormChange}
                min="1"
                className="input-text"
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="cook_time" className="field-label">
                Waktu Memasak (Menit) <span className="req">*</span>
              </label>
              <input
                id="cook_time"
                type="number"
                name="cook_time"
                value={formData.cook_time}
                onChange={handleFormChange}
                min="1"
                className="input-text"
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="price" className="field-label">
                Estimasi Biaya Bahan (Rp) <span className="req">*</span>
              </label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
                min="0"
                step="500"
                className="input-text"
                required
              />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="description" className="field-label">
              Deskripsi &amp; Filosofi Rasa
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Ceritakan cita rasa, aroma khas, atau rekomendasi penyajian..."
              className="input-textarea"
            />
          </div>
        </div>

        {/* Section 3: Dynamic Ingredients */}
        <div className="form-card">
          <div className="card-head-flex">
            <div>
              <h2 className="form-card-title">Daftar Bahan &amp; Takaran</h2>
              <p className="form-card-desc">Tuliskan takaran bumbu dan bahan yang dibutuhkan.</p>
            </div>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={addIngredient}
            >
              <Plus size={14} /> Tambah Bahan
            </button>
          </div>

          <div className="dynamic-list">
            {ingredients.map((item, idx) => (
              <div key={idx} className="dynamic-row">
                <input
                  type="text"
                  placeholder="Nama Bahan (misal: Daging Sapi, Santan Kental)"
                  value={item.name}
                  onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                  className="input-text"
                />
                <input
                  type="text"
                  placeholder="Takaran (misal: 500 gram, 2 sdm)"
                  value={item.quantity}
                  onChange={(e) => handleIngredientChange(idx, 'quantity', e.target.value)}
                  className="input-text"
                />
                <button
                  type="button"
                  className="btn-delete-row"
                  onClick={() => removeIngredient(idx)}
                  disabled={ingredients.length <= 1}
                  title="Hapus baris bahan"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Dynamic Steps */}
        <div className="form-card">
          <div className="card-head-flex">
            <div>
              <h2 className="form-card-title">Langkah-Langkah Memasak</h2>
              <p className="form-card-desc">Tahapan memasak berurutan dari persiapan hingga siap saji.</p>
            </div>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={addStep}
            >
              <Plus size={14} /> Tambah Langkah
            </button>
          </div>

          <div className="dynamic-list">
            {steps.map((step, idx) => (
              <div key={idx} className="step-input-row">
                <span className="step-badge-num">{idx + 1}</span>
                <input
                  type="text"
                  placeholder={`Instruksi langkah ke-${idx + 1}...`}
                  value={step}
                  onChange={(e) => handleStepChange(idx, e.target.value)}
                  className="input-text"
                />
                <button
                  type="button"
                  className="btn-delete-row"
                  onClick={() => removeStep(idx)}
                  disabled={steps.length <= 1}
                  title="Hapus langkah"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Showcase Checkbox */}
        <div className="checkbox-field-wrap">
          <input
            id="is_featured"
            type="checkbox"
            name="is_featured"
            checked={formData.is_featured}
            onChange={handleFormChange}
            className="checkbox-input"
          />
          <label htmlFor="is_featured" className="checkbox-text">
            Jadikan Resep Pilihan Utama (Tampilkan badge rekomendasi khusus)
          </label>
        </div>

        {/* Submit Actions */}
        <div className="form-bottom-actions">
          <button
            type="button"
            className="btn btn--outline"
            onClick={onBack}
            disabled={creating}
          >
            Batal
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={creating}
          >
            {creating ? 'Menyimpan Resep...' : 'Simpan Resep ke Katalog'}
          </button>
        </div>
      </form>

      {/* Modal Pulihkan Draft Sebelumnya */}
      <ConfirmModal
        open={showDraftModal}
        title="Lanjutkan Draft Resep Sebelumnya?"
        message={`Ditemukan draf resep yang belum selesai disimpan pada ${draftTimestamp ? formatDraftTime(draftTimestamp) : 'sebelumnya'}. Apakah Anda ingin memulihkan draf tersebut?`}
        confirmLabel="Pulihkan Draft"
        cancelLabel="Buang Draft"
        onConfirm={handleLoadDraft}
        onCancel={handleDiscardDraft}
      />
    </div>
  )
}
