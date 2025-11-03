import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, Campaign } from '../types/product';
import { getPackage, getCampaign } from '../services/productService';
import ResourceFieldBuilder from '../components/ResourceFieldBuilder';
import ChecklistTemplateBuilder from '../components/ChecklistTemplateBuilder';
import ImageGalleryManager from '../components/ImageGalleryManager';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

const ProductDetailPage = () => {
  const { type, id } = useParams<{ type: 'package' | 'campaign'; id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Package | Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'images' | 'fields' | 'checklist'>(
    'details'
  );

  useEffect(() => {
    if (type && id) {
      fetchProduct();
    }
  }, [type, id]);

  const fetchProduct = async () => {
    if (!type || !id) return;

    try {
      setLoading(true);
      let data: Package | Campaign;

      if (type === 'package') {
        data = await getPackage(parseInt(id));
      } else {
        data = await getCampaign(parseInt(id));
      }

      setProduct(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load product');
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
            <p className="mt-4 text-text-muted">Loading product...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !product || !type || !id) {
    return (
      <AppLayout>
        <Card>
          <div className="text-center py-12">
            <div className="mb-4 p-4 bg-danger/20 border border-danger rounded-lg inline-block">
              <p className="text-danger">{error || 'Product not found'}</p>
            </div>
            <div className="mt-6">
              <Button variant="primary" onClick={() => navigate('/products')}>
                ← Back to Products
              </Button>
            </div>
          </div>
        </Card>
      </AppLayout>
    );
  }

  const breadcrumbs = [
    { label: 'Products', path: '/products' },
    { label: product.name }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <PageHeader
        title={product.name}
        subtitle={product.description}
        actions={
          <div className="flex flex-wrap gap-2">
            <span
              className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                product.type === 'package'
                  ? 'bg-primary/20 text-primary'
                  : 'bg-purple-500/20 text-purple-400'
              }`}
            >
              {product.type}
            </span>
            <span
              className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                product.is_active
                  ? 'bg-success/20 text-success'
                  : 'bg-dark-border text-text-muted'
              }`}
            >
              {product.is_active ? 'Active' : 'Inactive'}
            </span>
            {product.is_popular && (
              <span className="px-3 py-1.5 text-sm font-medium rounded-lg bg-warning/20 text-warning flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Popular
              </span>
            )}
            <Button variant="ghost" onClick={() => navigate('/products')}>
              ← Back
            </Button>
          </div>
        }
      />

      {/* Tabs - Mobile Friendly */}
      <div className="mb-6">
        <div className="bg-dark-surface border border-dark-border rounded-xl p-2">
          <nav className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-3 px-3 md:px-4 rounded-lg font-medium text-xs md:text-sm transition-all ${
                activeTab === 'details'
                  ? 'bg-primary text-primary-content shadow-glow-primary'
                  : 'text-text-muted hover:text-text hover:bg-dark-hover'
              }`}
            >
              <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">Details</span>
                <span className="sm:hidden">Info</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`py-3 px-3 md:px-4 rounded-lg font-medium text-xs md:text-sm transition-all ${
                activeTab === 'images'
                  ? 'bg-primary text-primary-content shadow-glow-primary'
                  : 'text-text-muted hover:text-text hover:bg-dark-hover'
              }`}
            >
              <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Images</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('fields')}
              className={`py-3 px-3 md:px-4 rounded-lg font-medium text-xs md:text-sm transition-all ${
                activeTab === 'fields'
                  ? 'bg-primary text-primary-content shadow-glow-primary'
                  : 'text-text-muted hover:text-text hover:bg-dark-hover'
              }`}
            >
              <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden sm:inline">Resource Fields</span>
                <span className="sm:hidden">Fields</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`py-3 px-3 md:px-4 rounded-lg font-medium text-xs md:text-sm transition-all ${
                activeTab === 'checklist'
                  ? 'bg-primary text-primary-content shadow-glow-primary'
                  : 'text-text-muted hover:text-text hover:bg-dark-hover'
              }`}
            >
              <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span className="hidden sm:inline">Checklist</span>
                <span className="sm:hidden">Tasks</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'details' && (
          <Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-base md:text-lg font-semibold text-text mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Basic Information
                </h3>
                <dl className="space-y-3">
                  <div className="bg-dark-hover rounded-lg p-4 border border-dark-border">
                    <dt className="text-xs md:text-sm font-medium text-text-muted mb-1">Price</dt>
                    <dd className="text-xl md:text-2xl font-bold text-primary">
                      ₹{product.price.toLocaleString()}
                    </dd>
                  </div>
                  {product.type === 'campaign' && (
                    <div className="bg-dark-hover rounded-lg p-4 border border-dark-border">
                      <dt className="text-xs md:text-sm font-medium text-text-muted mb-1">Unit</dt>
                      <dd className="text-base md:text-lg text-text">{product.unit}</dd>
                    </div>
                  )}
                  <div className="bg-dark-hover rounded-lg p-3 md:p-4 border border-dark-border">
                    <dt className="text-xs md:text-sm font-medium text-text-muted mb-1">Created</dt>
                    <dd className="text-xs md:text-sm text-text">
                      {new Date(product.created_at).toLocaleString()}
                    </dd>
                  </div>
                  <div className="bg-dark-hover rounded-lg p-3 md:p-4 border border-dark-border">
                    <dt className="text-xs md:text-sm font-medium text-text-muted mb-1">Last Updated</dt>
                    <dd className="text-xs md:text-sm text-text">
                      {new Date(product.updated_at).toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Features & Deliverables */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Features
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm md:text-base text-text">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-base md:text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Deliverables
                  </h3>
                  <ul className="space-y-2">
                    {product.deliverables.map((deliverable, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm md:text-base text-text">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-warning flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'images' && (
          <ImageGalleryManager productType={type} productId={parseInt(id)} />
        )}

        {activeTab === 'fields' && (
          <ResourceFieldBuilder productType={type} productId={parseInt(id)} />
        )}

        {activeTab === 'checklist' && (
          <ChecklistTemplateBuilder productType={type} productId={parseInt(id)} />
        )}
      </div>
    </AppLayout>
  );
};

export default ProductDetailPage;
