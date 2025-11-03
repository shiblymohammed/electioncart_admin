import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import api from '../services/api';

interface Product {
  id: number;
  name: string;
  price: number;
  is_popular: boolean;
  type: string;
}

const ProductManagementPage = () => {
  const navigate = useNavigate();
  const { showError } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'packages' | 'campaigns'>('packages');

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === 'packages' ? '/packages/' : '/campaigns/';
      const response = await api.get(endpoint);
      setProducts(response.data);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      showError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <LoadingSpinner size="xl" />
            <p className="mt-4 text-text-muted">Loading products...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={[{ label: 'Products' }]}>
      <PageHeader
        title="Product Management"
        subtitle={`Manage packages and campaigns`}
      />

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

      {products.length === 0 ? (
        <EmptyState
          title={`No ${activeTab} found`}
          message={`${activeTab} will appear here once created`}
          actionLabel="Refresh"
          onAction={fetchProducts}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
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
              <p className="text-2xl font-bold text-primary mb-4">₹{product.price.toLocaleString()}</p>
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate(`/products/${activeTab}/${product.id}`)}
              >
                View Details
              </Button>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default ProductManagementPage;
