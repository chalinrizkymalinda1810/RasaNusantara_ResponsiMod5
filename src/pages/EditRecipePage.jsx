// ---------------------------------------------------------------------------
// EditRecipePage.jsx — Halaman Edit Resep Kuliner (CRUD - UPDATE)
// ---------------------------------------------------------------------------

import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
  Loader,
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
  { label: 'Rendang Sapi', url: '/recipes/rendang.svg' },
  { label: 'Soto Betawi', url: '/recipes/soto.svg' },
  { label: 'Sate Madura', url: '/recipes/sate.svg' },
  { label: 'Es Cendol Dawet', url: '/recipes/cendol.svg' },
  { label: 'Nasi Goreng', url: '/recipes/nasigoreng.svg' },
  { label: 'Gado-Gado', url: '/recipes/gadogado.svg' },
  { label: 'Koleksi Masakan', url: '/recipes/default.svg' },
]

export default function EditRecipePage({ recipe, recipeId, onBack, onSuccess }) {
  const targetId = recipeId || recipe?.id

  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    category: 'Makanan Utama',
    origin: '',
    difficulty: 'mudah',
    prep_time: 15,
    cook_time: 30,
    price: 30000,
    servings: 4,
    description: '',
    is_featured: false,
    image_url: '/recipes/default.svg',
  })

  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }])
  const [steps, setSteps] = useState([''])

  // Draft state
  const [showDraftModal, setShowDraftModal] = useState(() => (targetId ? hasDraft(targetId) : false))
  const [draftTimestamp, setDraftTimestamp] = useState(() => (targetId ? getDraftTimestamp(targetId) : null))

  // Fetch initial recipe details
  useEffect(() => {
    const fetchTargetRecipe = async () => {
      try {
        setLoading(true)
        setError('')
        let data = recipe
        if (!data || !data.ingredients || !data.steps) {
          if (targetId) {
            const res = await recipeService.getRecipeById(targetId)
            if (res.success && res.data) {
              data = res.data
            }
          }
        }

        if (data) {
          setFormData({
            name: data.name || '',
            category: data.category || 'Makanan Utama',
            origin: data.origin || 'Nusantara',
            difficulty: data.difficulty || 'mudah',
            prep_time: data.prep_time || 15,
            cook_time: data.cook_time || 30,
            price: data.price || 30000,
            servings: data.servings || 4,
            description: data.description || '',
            is_featured: Boolean(data.is_featured),
            image_url: data.image_url || '/recipes/default.svg',
          })

          if (data.ingredients && data.ingredients.length > 0) {
            setIngredients(
              data.ingredients.map((ing) => ({
                name: ing.name || '',
                quantity: ing.quantity || '',
              }))
            )
          }

          if (data.steps && data.steps.length > 0) {
            setSteps(data.steps.map((st) => (typeof st === 'string' ? st : st.instruction || '')))
          }
        } else {
          setError('Data resep tidak ditemukan untuk diedit.')
        }
      } catch (err) {
        setError(err.message || 'Gagal memuat data resep.')
      } finally {
        setLoading(false)
      }
    }

    fetchTargetRecipe()
  }, [targetId, recipe])

  // Draft operations
  const handleLoadDraft = () => {
    const draft = loadDraft(targetId)
    if (draft) {
      if (draft.formData) setFormData(draft.formData)
      if (draft.ingredients) setIngredients(draft.ingredients)
      if (draft.steps) setSteps(draft.steps)
      setShowDraftModal(false)
      setSuccessMsg('Perubahan draf yang tersimpan berhasil dipulihkan.')
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  const handleDiscardDraft = () => {
    deleteDraft(targetId)
    setShowDraftModal(false)
    setDraftTimestamp(null)
  }

  const handleManualSaveDraft = () => {
    const draftData = { formData, ingredients, steps }
    const saved = saveDraft(draftData, targetId)
    if (saved) {
      const ts = getDraftTimestamp(targetId)
      setDraftTimestamp(ts)
      setSuccessMsg(`Draft resep berhasil disimpan (${formatDraftTime(ts)})`)
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, image_url: event.target.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleIngredientChange = (index, field, value) => {
    setIngredients((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  const addIngredient = () => setIngredients((p) => [...p, { name: '', quantity: '' }])
  const removeIngredient = (index) => {
    if (ingredients.length <= 1) return
    setIngredients((p) => p.filter((_, i) => i !== index))
  }

  const handleStepChange = (index, value) => {
    setSteps((prev) => {
      const copy = [...prev]
      copy[index] = value
      return copy
    })
  }

  const addStep = () => setSteps((p) => [...p, ''])
  const removeStep = (index) => {
    if (steps.length <= 1) return
    setSteps((p) => p.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      setError('Nama resep minimal 3 karakter.')
      return
    }

    const cleanIngredients = ingredients
      .filter((i) => i.name.trim())
      .map((i, idx) => ({
        id: `ing-${Date.now()}-${idx}`,
        name: i.name.trim(),
        quantity: i.quantity.trim() || 'Secukupnya',
      }))

    const cleanSteps = steps.filter((s) => s.trim()).map((s) => s.trim())

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      origin: formData.origin.trim() || 'Nusantara',
      difficulty: formData.difficulty,
      prep_time: Number(formData.prep_time) || 15,
      cook_time: Number(formData.cook_time) || 30,
      price: Number(formData.price) || 25000,
      servings: Number(formData.servings) || 4,
      description: formData.description.trim(),
      image_url: formData.image_url,
      is_featured: Boolean(formData.is_featured),
      ingredients: cleanIngredients,
      steps: cleanSteps,
    }

    try {
      setUpdating(true)
      const res = await recipeService.updateRecipe(targetId, payload)
      if (res.success) {
        deleteDraft(targetId)
        if (onSuccess) {
          onSuccess(res.data)
        } else if (onBack) {
          onBack()
        }
      }
    } catch (err) {
      setError(err.message || 'Gagal memperbarui resep.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="state-box">
        <Loader size={32} className="spin-icon" />
        <p>Memuat rincian resep untuk diedit...</p>
      </div>
    )
  }

  return (
    <div className="form-page">
      <div className="form-head">
        <button type="button" className="btn-back" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </button>

        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={handleManualSaveDraft}
        >
          <Save size={14} /> Simpan Draft
        </button>
      </div>

      <div className="form-title-group">
        <h1 className="display-title">Perbarui Resep Masakan</h1>
        <p className="form-lede">
          Mengubah resep: <strong>{formData.name}</strong>
        </p>
      </div>

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

      <form onSubmit={handleSubmit} className="recipe-form">
        {/* Foto / Ilustrasi Masakan */}
        <div className="form-card">
          <h2 className="form-card-title">Ilustrasi &amp; Foto Masakan</h2>
          <div className="image-selector-wrap">
            <div className="current-image-preview">
              <img src={formData.image_url} alt="Pratinjau Resep" />
            </div>

            <div className="image-options">
              <span className="options-title">Ganti dengan Preset Vektor:</span>
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

              <div className="upload-file-option">
                <label htmlFor="edit-custom-file" className="btn btn--outline btn--sm">
                  <Upload size={14} /> Pilih Foto Baru dari Perangkat
                </label>
                <input
                  id="edit-custom-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden-file-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info Utama */}
        <div className="form-card">
          <h2 className="form-card-title">Rincian Resep</h2>
          <div className="form-grid-2">
            <div className="field-group">
              <label htmlFor="edit-name" className="field-label">Nama Resep <span className="req">*</span></label>
              <input
                id="edit-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="input-text"
                required
              />
            </div>
            <div className="field-group">
              <label htmlFor="edit-origin" className="field-label">Asal Daerah <span className="req">*</span></label>
              <input
                id="edit-origin"
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleFormChange}
                className="input-text"
                required
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="field-group">
              <label htmlFor="edit-cat" className="field-label">Kategori <span className="req">*</span></label>
              <select
                id="edit-cat"
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
              <label htmlFor="edit-diff" className="field-label">Tingkat Kesulitan <span className="req">*</span></label>
              <select
                id="edit-diff"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleFormChange}
                className="select-box"
              >
                <option value="mudah">Mudah (Pemula)</option>
                <option value="sedang">Sedang (Menengah)</option>
                <option value="sulit">Sulit (Mahir)</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="edit-serv" className="field-label">Porsi (Orang) <span className="req">*</span></label>
              <input
                id="edit-serv"
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
              <label htmlFor="edit-prep" className="field-label">Waktu Persiapan (Menit) <span className="req">*</span></label>
              <input
                id="edit-prep"
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
              <label htmlFor="edit-cook" className="field-label">Waktu Masak (Menit) <span className="req">*</span></label>
              <input
                id="edit-cook"
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
              <label htmlFor="edit-price" className="field-label">Biaya Bahan (Rp) <span className="req">*</span></label>
              <input
                id="edit-price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
                min="0"
                className="input-text"
                required
              />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="edit-desc" className="field-label">Deskripsi Masakan</label>
            <textarea
              id="edit-desc"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleFormChange}
              className="input-textarea"
            />
          </div>
        </div>

        {/* Bahan-bahan */}
        <div className="form-card">
          <div className="card-head-flex">
            <div>
              <h2 className="form-card-title">Bahan &amp; Takaran</h2>
              <p className="form-card-desc">Perbarui daftar bumbu dan bahan yang digunakan.</p>
            </div>
            <button type="button" className="btn btn--outline btn--sm" onClick={addIngredient}>
              <Plus size={14} /> Tambah Bahan
            </button>
          </div>

          <div className="dynamic-list">
            {ingredients.map((item, idx) => (
              <div key={idx} className="dynamic-row">
                <input
                  type="text"
                  placeholder="Nama Bahan"
                  value={item.name}
                  onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                  className="input-text"
                />
                <input
                  type="text"
                  placeholder="Takaran"
                  value={item.quantity}
                  onChange={(e) => handleIngredientChange(idx, 'quantity', e.target.value)}
                  className="input-text"
                />
                <button
                  type="button"
                  className="btn-delete-row"
                  onClick={() => removeIngredient(idx)}
                  disabled={ingredients.length <= 1}
                  title="Hapus bahan"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Langkah-langkah */}
        <div className="form-card">
          <div className="card-head-flex">
            <div>
              <h2 className="form-card-title">Langkah-Langkah Memasak</h2>
              <p className="form-card-desc">Tahapan instruksi memasak berurutan.</p>
            </div>
            <button type="button" className="btn btn--outline btn--sm" onClick={addStep}>
              <Plus size={14} /> Tambah Langkah
            </button>
          </div>

          <div className="dynamic-list">
            {steps.map((step, idx) => (
              <div key={idx} className="step-input-row">
                <span className="step-badge-num">{idx + 1}</span>
                <input
                  type="text"
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

        {/* Featured */}
        <div className="checkbox-field-wrap">
          <input
            id="edit_is_featured"
            type="checkbox"
            name="is_featured"
            checked={formData.is_featured}
            onChange={handleFormChange}
            className="checkbox-input"
          />
          <label htmlFor="edit_is_featured" className="checkbox-text">
            Jadikan Resep Pilihan Utama
          </label>
        </div>

        <div className="form-bottom-actions">
          <button type="button" className="btn btn--outline" onClick={onBack} disabled={updating}>
            Batal
          </button>
          <button type="submit" className="btn btn--primary" disabled={updating}>
            {updating ? 'Menyimpan Perubahan...' : 'Simpan Perubahan Resep'}
          </button>
        </div>
      </form>

      <ConfirmModal
        open={showDraftModal}
        title="Pulihkan Perubahan Draf?"
        message={`Ada draf perubahan untuk resep ini yang tersimpan pada ${draftTimestamp ? formatDraftTime(draftTimestamp) : 'sebelumnya'}. Apakah Anda ingin memulihkannya?`}
        confirmLabel="Pulihkan"
        cancelLabel="Buang"
        onConfirm={handleLoadDraft}
        onCancel={handleDiscardDraft}
      />
    </div>
  )
}
