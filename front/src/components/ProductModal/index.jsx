import { useState, useEffect } from 'react'
import './styles.css'

function ProductModal({ isOpen, onClose, onSubmit, product, isEditing = false }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    minimumStock: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (isEditing && product) {
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          stock: product.stock?.toString() || '',
          minimumStock: product.minimumStock?.toString() || ''
        })
      } else {
        setFormData({
          name: '',
          description: '',
          price: '',
          stock: '',
          minimumStock: ''
        })
      }
      setErrors({})
    }
  }, [isOpen, isEditing, product])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do produto é obrigatório'
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Preço deve ser maior que 0'
    }

    if (formData.stock === '' || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Estoque não pode ser negativo'
    }

    if (formData.minimumStock === '' || parseInt(formData.minimumStock) < 0) {
      newErrors.minimumStock = 'Estoque mínimo não pode ser negativo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        minimumStock: parseInt(formData.minimumStock)
      }

      await onSubmit(productData)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Editar Produto' : 'Adicionar Produto'}
          </h2>
          <button 
            className="modal-close-button"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-subtitle">
            {isEditing ? 'Atualize as informações do produto' : 'Cadastre um novo produto no seu cardápio'}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Nome do Produto *
              </label>
              <input
                type="text"
                id="name"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Ex: Hambúrguer Artesanal"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Descrição
              </label>
              <textarea
                id="description"
                className="form-textarea"
                placeholder="Ex: Hambúrguer com carne 150g..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price" className="form-label">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  id="price"
                  className={`form-input ${errors.price ? 'error' : ''}`}
                  placeholder="18.50"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="stock" className="form-label">
                  Estoque *
                </label>
                <input
                  type="number"
                  id="stock"
                  className={`form-input ${errors.stock ? 'error' : ''}`}
                  placeholder="10"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                />
                {errors.stock && <span className="error-message">{errors.stock}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="minimumStock" className="form-label">
                  Mínimo
                </label>
                <input
                  type="number"
                  id="minimumStock"
                  className={`form-input ${errors.minimumStock ? 'error' : ''}`}
                  placeholder="5"
                  min="0"
                  value={formData.minimumStock}
                  onChange={(e) => handleChange('minimumStock', e.target.value)}
                />
                {errors.minimumStock && <span className="error-message">{errors.minimumStock}</span>}
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="button-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="button-primary"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (isEditing ? 'Atualizando...' : 'Adicionando...') 
                  : (isEditing ? 'Atualizar Produto' : 'Adicionar Produto')
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductModal
