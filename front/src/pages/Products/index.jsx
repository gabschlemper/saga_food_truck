import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchProducts, deleteProduct, createProduct, updateProduct } from '../../store/slices/productsSlice'
import Sidebar from '../../components/Sidebar'
import ConfirmDialog from '../../components/ConfirmDialog'
import ProductModal from '../../components/ProductModal'
import './styles.css'

function Products() {
  const dispatch = useAppDispatch()
  const productsState = useAppSelector((state) => state.products)
  const { products = [], loading = false, error = null } = productsState || {}
  const [showModal, setShowModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Disponível':
        return 'status-available'
      case 'Estoque Baixo':
        return 'status-low'
      case 'Sem Estoque':
        return 'status-out'
      default:
        return 'status-available'
    }
  }

  const handleDeleteClick = (product) => {
    setProductToDelete(product)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete.id))
      setShowDeleteDialog(false)
      setProductToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteDialog(false)
    setProductToDelete(null)
  }

  const handleEditClick = (product) => {
    setEditingProduct(product)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleAddClick = () => {
    setEditingProduct(null)
    setIsEditing(false)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingProduct(null)
    setIsEditing(false)
  }

  const handleModalSubmit = async (productData) => {
    if (isEditing) {
      await dispatch(updateProduct({ id: editingProduct.id, productData }))
    } else {
      await dispatch(createProduct(productData))
    }
  }

  const lowStockCount = products.filter(product => 
    product.status === 'Estoque Baixo' || product.status === 'Sem Estoque'
  ).length

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <div className="dashboard-content">
        <header className="page-header">
          <div>
            <h1 className="page-title">Produtos</h1>
            <p className="page-subtitle">Gerencie seu cardápio e controle o estoque</p>
          </div>
          <button 
            className="new-product-button"
            onClick={handleAddClick}
          >
            + Novo Produto
          </button>
        </header>

        {lowStockCount > 0 && (
          <div className="alert-banner">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <strong>Atenção: {lowStockCount} produto(s) com estoque baixo</strong>
              <p>Alguns produtos precisam de reposição urgente</p>
            </div>
          </div>
        )}

        <div className="products-section">
          <div className="section-header">
            <h2 className="section-title">Lista de Produtos</h2>
            <p className="section-subtitle">{products.length} produtos cadastrados</p>
          </div>

          {loading ? (
            <div className="loading-state">
              🔄 Carregando produtos...
            </div>
          ) : error ? (
            <div className="error-state">
              ❌ Erro ao carregar produtos: {error}
            </div>
          ) : (
            <div className="products-table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Preço</th>
                    <th>Estoque</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="product-cell">
                        <div className="product-info">
                          <h4 className="product-name">{product.name}</h4>
                          <p className="product-description">{product.description}</p>
                        </div>
                      </td>
                      <td className="price-cell">
                        R$ {product.price.toFixed(2)}
                      </td>
                      <td className="stock-cell">
                        <div className="stock-info">
                          <span className="stock-quantity">{product.stock} unidades</span>
                          <span className="stock-minimum">Mínimo: {product.minimumStock}</span>
                        </div>
                      </td>
                      <td className="status-cell">
                        <span className={`status-badge ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button 
                            className="action-button edit-button"
                            onClick={() => handleEditClick(product)}
                          >
                            📝 Editar
                          </button>
                          <button 
                            className="action-button delete-button"
                            onClick={() => handleDeleteClick(product)}
                          >
                            🗑️ Remover
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <ProductModal
          isOpen={showModal}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          product={editingProduct}
          isEditing={isEditing}
        />

        <ConfirmDialog
          isOpen={showDeleteDialog}
          title="Confirmar Remoção"
          description={`Tem certeza que deseja remover o produto "${productToDelete?.name}"? Esta ação não pode ser desfeita.`}
          variant="delete"
          confirmText="Sim, Remover"
          cancelText="Cancelar"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </div>
  )
}

export default Products
