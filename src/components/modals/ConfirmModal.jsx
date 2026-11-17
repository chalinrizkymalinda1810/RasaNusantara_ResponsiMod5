// ---------------------------------------------------------------------------
// ConfirmModal.jsx — Modal Konfirmasi Aksi (Aksesibel & Responsif)
// ---------------------------------------------------------------------------

import { AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react'

export default function ConfirmModal({
  open,
  isOpen,
  title,
  message,
  confirmLabel,
  confirmText,
  cancelLabel,
  cancelText,
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
  onClose,
}) {
  const isVisible = open ?? isOpen ?? false
  const handleCancel = onCancel || onClose
  const actualConfirmText = confirmLabel || confirmText || 'Konfirmasi'
  const actualCancelText = cancelLabel || cancelText || 'Batal'

  if (!isVisible) return null

  return (
    <div className="modal-backdrop" onClick={handleCancel}>
      <div
        className="modal-box"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`modal-icon ${danger ? 'modal-icon--danger' : 'modal-icon--info'}`}>
          {danger ? (
            <AlertTriangle size={32} />
          ) : (
            <CheckCircle2 size={32} />
          )}
        </div>

        <h3 id="confirm-modal-title" className="modal-title">
          {title}
        </h3>

        <p id="confirm-modal-desc" className="modal-message">
          {message}
        </p>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn--outline"
            onClick={handleCancel}
            disabled={loading}
          >
            {actualCancelText}
          </button>
          <button
            type="button"
            className={`btn ${danger ? 'btn--danger' : 'btn--primary'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Memproses...' : actualConfirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
