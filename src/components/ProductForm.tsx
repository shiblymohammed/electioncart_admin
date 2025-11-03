import { useState, useEffect } from 'react';
import { Product, ProductFormData, Package, Campaign } from '../types/product';
import {
  createPackage,
  createCampaign,
  updatePackage,
  updateCampaign,
  getPackage,
  getCampaign,
} from '../services/productService';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductForm = ({ product, onClose, onSuccess }: ProductFormProps) => {
  const [productType, setProductType] = useState<'package' | 'campaign'>(
    product?.type || 'package'
  );
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    features: [''],
    deliverables: [''],
    unit: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);

  useEffect(() => {
    if (product) {
      loadProductDetails();
    }
  }, [product]);

  const loadProductDetails = async () => {
    if (!product) return;

    try {
      setLoadingProduct(true);
      let productDetails: Package | Campaign;

      if (product.type === 'package') {
        productDetails = await getPackage(product.id);
      } else {
        productDetails = await getCampaign(product.id);
      }

      setFormData({
        name: productDetails.name,
        description: productDetails.description,
        price: productDetails.price,
        features: productDetails.features.length > 0 ? productDetails.features : [''],
        deliverables: productDetails.deliverables.length > 0 ? productDetails.deliverables : [''],
        unit: productDetails.type === 'campaign' ? productDetails.unit : '',
      });
      setProductType(productDetails.type);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load product details');
    } finally {
      setLoadingProduct(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (formData.price <= 0) {
      setError('Price must be greater than zero');
      return;
    }
    if (productType === 'campaign' && !formData.unit?.trim()) {
      setError('Unit is required for campaigns');
      return;
    }

    // Filter out empty features and deliverables
    const cleanedData = {
      ...formData,
      features: formData.features.filter((f) => f.trim() !== ''),
      deliverables: formData.deliverables.filter((d) => d.trim() !== ''),
    };

    try {
      setLoading(true);

      if (product) {
        // Update existing product
        if (productType === 'package') {
          await updatePackage(product.id, cleanedData);
        } else {
          await updateCampaign(product.id, cleanedData);
        }
      } else {
        // Create new product
        if (productType === 'package') {
          await createPackage(cleanedData);
        } else {
          await createCampaign(cleanedData);
        }
      }

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleArrayFieldChange = (
    field: 'features' | 'deliverables',
    index: number,
    value: string
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field: 'features' | 'deliverables') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayField = (field: 'features' | 'deliverables', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray.length > 0 ? newArray : [''] });
  };

  if (loadingProduct) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-dark-surface border border-dark-border rounded-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-muted">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-dark-surface border border-dark-border rounded-xl shadow-xl max-w-2xl w-full mx-4 my-8">
        <div className="px-6 py-4 border-b border-dark-border">
          <h2 className="text-2xl font-bold text-text">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {error && (
            <div className="mb-4 bg-danger/20 border border-danger rounded-lg text-danger px-4 py-3">
              {error}
            </div>
          )}

          {/* Product Type */}
          {!product && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-text mb-2">
                Product Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center text-text cursor-pointer">
                  <input
                    type="radio"
                    value="package"
                    checked={productType === 'package'}
                    onChange={(e) => setProductType(e.target.value as 'package')}
                    className="mr-2 accent-primary"
                  />
                  Package
                </label>
                <label className="flex items-center text-text cursor-pointer">
                  <input
                    type="radio"
                    value="campaign"
                    checked={productType === 'campaign'}
                    onChange={(e) => setProductType(e.target.value as 'campaign')}
                    className="mr-2 accent-primary"
                  />
                  Campaign
                </label>
              </div>
            </div>
          )}

          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-2">
              Product Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-dark border border-dark-border rounded-lg text-text placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-2">
              Description <span className="text-danger">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-dark border border-dark-border rounded-lg text-text placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              required
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-2">
              Price (₹) <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 bg-dark border border-dark-border rounded-lg text-text placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              required
            />
          </div>

          {/* Unit (for campaigns only) */}
          {productType === 'campaign' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-text mb-2">
                Unit <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g., per 1000 voters"
                className="w-full px-4 py-2 bg-dark border border-dark-border rounded-lg text-text placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                required
              />
            </div>
          )}

          {/* Features */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-2">Features</label>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleArrayFieldChange('features', index, e.target.value)}
                  placeholder="Enter feature"
                  className="flex-1 px-4 py-2 bg-dark border border-dark-border rounded-lg text-text placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('features', index)}
                    className="ml-2 px-3 py-2 text-danger hover:bg-danger/20 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('features')}
              className="text-primary hover:text-primary/80 text-sm transition-colors"
            >
              + Add Feature
            </button>
          </div>

          {/* Deliverables */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-2">Deliverables</label>
            {formData.deliverables.map((deliverable, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={deliverable}
                  onChange={(e) => handleArrayFieldChange('deliverables', index, e.target.value)}
                  placeholder="Enter deliverable"
                  className="flex-1 px-4 py-2 bg-dark border border-dark-border rounded-lg text-text placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
                {formData.deliverables.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('deliverables', index)}
                    className="ml-2 px-3 py-2 text-danger hover:bg-danger/20 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('deliverables')}
              className="text-primary hover:text-primary/80 text-sm transition-colors"
            >
              + Add Deliverable
            </button>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-dark-border flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-text bg-dark-hover border border-dark-border rounded-lg hover:bg-dark-border transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90 disabled:bg-primary/50 transition-colors shadow-glow-primary"
          >
            {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
