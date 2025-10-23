import './styles.css'

function ConfirmDialog({ 
  isOpen, 
  title, 
  description, 
  variant = 'warning', 
  onConfirm, 
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}) {
  if (!isOpen) return null

  const getVariantStyles = () => {
    switch (variant) {
      case 'delete':
        return {
          icon: '🗑️',
          confirmClass: 'confirm-delete-button',
          headerClass: 'dialog-header-delete'
        }
      case 'warning':
        return {
          icon: '⚠️',
          confirmClass: 'confirm-warning-button',
          headerClass: 'dialog-header-warning'
        }
      case 'info':
        return {
          icon: 'ℹ️',
          confirmClass: 'confirm-info-button',
          headerClass: 'dialog-header-info'
        }
      default:
        return {
          icon: '❓',
          confirmClass: 'confirm-default-button',
          headerClass: 'dialog-header-default'
        }
    }
  }

  const { icon, confirmClass, headerClass } = getVariantStyles()

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className={`dialog-header ${headerClass}`}>
          <div className="dialog-icon">{icon}</div>
          <h3 className="dialog-title">{title}</h3>
        </div>
        <div className="dialog-content">
          <p className="dialog-description">{description}</p>
        </div>
        <div className="dialog-actions">
          <button 
            className="cancel-button"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`confirm-button ${confirmClass}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
