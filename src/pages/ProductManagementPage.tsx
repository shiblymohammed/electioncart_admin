import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import ProductForm from '../components/ProductForm';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import { PopularToggleButton } from '../components/PopularToggleButton';
import ProductCardSkeleton from '../components/ui/skeletons/ProductCardSkeleton';
import { getAllProducts, deletePackage, deleteCampaign, toggleProductStatus, togglePackagePopular, toggleCampaignPopular } from '../services/productService';
import { Product } from '../types/product';

const ProductManagementPage = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'packages' | 'campaigns'>('packages');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; product: Product | null }>({
    show: false,
    product: null,
  });
  const [togglingPopular, setTogglingPopular] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      showError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    fetchProducts();
    handleFormClose();
    showSuccess(editingProduct ? 'Product updated successfully' : 'Product created successfully');
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteConfirm({ show: true, product });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.product) return;

    try {
      if (deleteConfirm.product.type === 'package') {
        await deletePackage(deleteConfirm.product.id);
      } else {
        await deleteCampaign(deleteConfirm.product.id);
      }
      showSuccess('Product deleted successfully');
      fetchProducts();
      setDeleteConfirm({ show: false, product: null });
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      await toggleProductStatus(product.type, product.id);
      showSuccess(`Product ${product.is_active ? 'deactivated' : 'activated'} successfully`);
      fetchProducts();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to toggle product status');
    }
  };

  const handleTogglePopular = async (product: Product) => {
    try {
      setTogglingPopular(product.id);
      
      if (product.type === 'package') {
        await togglePackagePopular(product.id);
      } else {
        await toggleCampaignPopular(product.id);
      }
      
      showSuccess(`Product ${product.is_popular ? 'unmarked' : 'marked'} as popular`);
      fetchProducts();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to toggle popular status';
      showError(errorMessage);
    } finally {
      setTogglingPopular(null);
    }
  };

  // Apply filters
  const filteredProducts = products.filter(p => {
    // Type filter
    const matchesType = activeTab === 'packages' ? p.type === 'package' : p.type === 'campaign';
    
    // Search filter
    const matchesSearch = searchTerm === '' || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && p.is_active) ||
      (statusFilter === 'inactive' && !p.is_active);
    
    return matchesType && matchesSearch && matchesStatus;
  });

  // Count popular products per type
  const popularPackageCount = products.filter(p => p.type === 'package' && p.is_popular).length;
  const popularCampaignCount = products.filter(p => p.type === 'campaign' && p.is_popular).length;

  if (loading) {
    return (
      <AppLayout breadcrumbs={[{ label: 'Products' }]}>
        <div className="flex justify-between items-center mb-6">
          <PageHeader
            title="Product Management"
            subtitle="Manage packages and campaigns"
          />
        </div>
        
        {/* Skeleton Loaders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={[{ label: 'Products' }]}>
      <div className="flex justify-between items-center mb-6">
        <PageHeader
          title="Product Management"
          subtitle={`Manage packages and campaigns`}
        />
        <Button
          variant="primary"
          onClick={handleAddProduct}
        >
          + Add Product
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('packages')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'packages'
              ? 'bg-primary text-primary-content shadow-glow-primary'
              : 'bg-dark-surface text-text-muted hover:text-text'
          }`}
        >
          Packages
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'campaigns'
              ? 'bg-primary text-primary-content shadow-glow-primary'
              : 'bg-dark-surface text-text-muted hover:text-text'
          }`}
        >
          Campaigns
        </button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-dark border border-dark-border rounded-lg text-text placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="w-full px-4 py-2 bg-dark border border-dark-border rounded-lg text-text focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || statusFilter !== 'all') && (
          <div className="mt-4 pt-4 border-t border-dark-border">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </Card>

      {filteredProducts.length === 0 ? (
        <EmptyState
          title={`No ${activeTab} found`}
          message={`${activeTab} will appear here once created`}
          actionLabel="Add Product"
          onAction={handleAddProduct}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} hoverable glowOnHover>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-text">{product.name}</h3>
                {product.is_popular && (
                  <Badge variant="warning">
                    <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Popular
                  </Badge>
                )}
              </div>
              <p className="text-sm text-text-muted mb-2 line-clamp-2">{product.description}</p>
              <p className="text-2xl font-bold text-primary mb-4">₹{product.price.toLocaleString()}</p>
              
              {/* Status Badge */}
              <div className="mb-4">
                <button
                  onClick={() => handleToggleStatus(product)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    product.is_active
                      ? 'bg-success/20 text-success hover:bg-success/30'
                      : 'bg-dark-border text-text-muted hover:bg-dark-hover'
                  }`}
                >
                  {product.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>

              {/* Popular Toggle */}
              <div className="mb-4">
                <PopularToggleButton
                  isPopular={product.is_popular || false}
                  popularOrder={product.popular_order}
                  onToggle={() => handleTogglePopular(product)}
                  disabled={
                    !product.is_popular && 
                    ((product.type === 'package' && popularPackageCount >= 3) ||
                     (product.type === 'campaign' && popularCampaignCount >= 3))
                  }
                  loading={togglingPopular === product.id}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/products/${product.type}/${product.id}`)}
                  className="flex-1"
                >
                  View
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEditProduct(product)}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteClick(product)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.show && deleteConfirm.product && (
        <DeleteConfirmationDialog
          isOpen={deleteConfirm.show}
          onClose={() => setDeleteConfirm({ show: false, product: null })}
          onConfirm={handleDeleteConfirm}
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteConfirm.product.name}"? This action cannot be undone.`}
          itemName={deleteConfirm.product.name}
        />
      )}
    </AppLayout>
  );
};

export default ProductManagementPage;
