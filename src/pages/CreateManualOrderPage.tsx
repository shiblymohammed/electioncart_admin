import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  createManualOrder,
  searchCustomers,
  getProductsForOrder,
} from '../services/manualOrderService';
import { getStaffMembers } from '../services/adminService';
import {
  ManualOrderCustomer,
  ManualOrderItem,
  ProductForOrder,
  OrderSource,
  PaymentMethod,
  PaymentStatus,
  OrderPriority,
  CustomerSearchResult,
  CreateManualOrderRequest,
} from '../types/manualOrder';
import { StaffMember } from '../types/order';

type Step = 1 | 2 | 3 | 4;

const CreateManualOrderPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  // Multi-step state
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Customer Information
  const [customerSearch, setCustomerSearch] = useState('');
  const [searchResults, setSearchResults] = useState<CustomerSearchResult[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSearchResult | null>(null);
  const [newCustomer, setNewCustomer] = useState<ManualOrderCustomer>({
    name: '',
    phone: '',
    email: '',
  });
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  // Step 2: Product Selection
  const [products, setProducts] = useState<{ campaigns: ProductForOrder[]; packages: ProductForOrder[] }>({
    campaigns: [],
    packages: [],
  });
  const [selectedTab, setSelectedTab] = useState<'campaign' | 'package'>('campaign');
  const [cart, setCart] = useState<ManualOrderItem[]>([]);

  // Step 3: Order Details
  const [orderSource, setOrderSource] = useState<OrderSource>('phone_call');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('unpaid');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentReference, setPaymentReference] = useState('');
  const [priority, setPriority] = useState<OrderPriority>('normal');
  const [notes, setNotes] = useState('');

  // Step 4: Staff Assignment
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [assignedStaff, setAssignedStaff] = useState<number | null>(null);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Load staff members when reaching step 4
  useEffect(() => {
    if (currentStep === 4) {
      loadStaffMembers();
    }
  }, [currentStep]);

  const loadProducts = async () => {
    try {
      const data = await getProductsForOrder();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      showError('Failed to load products');
    }
  };

  const loadStaffMembers = async () => {
    try {
      const data = await getStaffMembers();
      setStaffMembers(data);
    } catch (error) {
      console.error('Failed to load staff:', error);
    }
  };

  const handleCustomerSearch = async (query: string) => {
    setCustomerSearch(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchCustomers(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const selectCustomer = (customer: CustomerSearchResult) => {
    setSelectedCustomer(customer);
    setIsNewCustomer(false);
    setSearchResults([]);
    setCustomerSearch('');
  };

  const createNewCustomer = () => {
    setIsNewCustomer(true);
    setSelectedCustomer(null);
    setSearchResults([]);
  };

  const addToCart = (product: ProductForOrder) => {
    const existingItem = cart.find(item => item.product_id === product.id && item.product_type === product.type);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.product_id === product.id && item.product_type === product.type
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        product_type: product.type,
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        price: product.price,
      }]);
    }
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(cart.map((item, i) => i === index ? { ...item, quantity } : item));
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        if (isNewCustomer) {
          return newCustomer.name.trim() && newCustomer.phone.trim();
        }
        return selectedCustomer !== null;
      case 2:
        return cart.length > 0;
      case 3:
        if (paymentStatus === 'paid' || paymentStatus === 'partial') {
          return paymentAmount && parseFloat(paymentAmount) > 0;
        }
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const customer: ManualOrderCustomer = isNewCustomer
        ? newCustomer
        : {
            name: selectedCustomer!.name,
            phone: selectedCustomer!.phone,
            email: selectedCustomer!.email,
          };

      const orderData: CreateManualOrderRequest = {
        customer,
        items: cart.map(item => ({
          product_type: item.product_type,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
        order_source: orderSource,
        payment_status: paymentStatus,
        payment_method: paymentStatus !== 'unpaid' ? paymentMethod : undefined,
        payment_amount: paymentStatus !== 'unpaid' ? parseFloat(paymentAmount) : undefined,
        payment_reference: paymentReference || undefined,
        assigned_to: assignedStaff || undefined,
        priority,
        notes: notes || undefined,
      };

      const response = await createManualOrder(orderData);
      showSuccess('Manual order created successfully!');
      navigate(`/orders/${response.order.id}`);
    } catch (error: any) {
      console.error('Failed to create order:', error);
      showError(error.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            currentStep >= step
              ? 'bg-gradient-primary border-primary text-white'
              : 'border-dark-border text-text-muted'
          }`}>
            {step}
          </div>
          {step < 4 && (
            <div className={`w-16 h-0.5 ${
              currentStep > step ? 'bg-primary' : 'bg-dark-border'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <Card>
      <h3 className="text-xl font-semibold text-text mb-6">Customer Information</h3>
      
      {!selectedCustomer && !isNewCustomer && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-muted mb-2">
              Search Existing Customer
            </label>
            <input
              type="text"
              value={customerSearch}
              onChange={(e) => handleCustomerSearch(e.target.value)}
              placeholder="Search by phone or name..."
              className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-text focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {searchResults.length > 0 && (
              <div className="mt-2 bg-dark-card border border-dark-border rounded-lg max-h-48 overflow-y-auto">
                {searchResults.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => selectCustomer(customer)}
                    className="w-full text-left p-3 hover:bg-dark-bg transition-colors border-b border-dark-border last:border-0"
                  >
                    <p className="text-text font-medium">{customer.name}</p>
                    <p className="text-sm text-text-muted">{customer.phone}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="text-center">
            <p className="text-text-muted mb-2">or</p>
            <Button variant="secondary" onClick={createNewCustomer}>
              Create New Customer
            </Button>
          </div>
        </>
      )}

      {selectedCustomer && (
        <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-text font-semibold text-lg">{selectedCustomer.name}</p>
              <p className="text-text-muted">{selectedCustomer.phone}</p>
              {selectedCustomer.email && (
                <p className="text-text-muted text-sm">{selectedCustomer.email}</p>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)}>
              Change
            </Button>
          </div>
        </div>
      )}

      {isNewCustomer && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">
              Customer Name *
            </label>
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              placeholder="John Doe"
              className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-text focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              placeholder="+919876543210"
              className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-text focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              placeholder="john@example.com"
              className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-text focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <Button variant="ghost" onClick={() => setIsNewCustomer(false)}>
            ← Back to Search
          </Button>
        </div>
      )}
    </Card>
  );

  const renderStep2 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <h3 className="text-xl font-semibold text-text mb-6">Select Products</h3>
          
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setSelectedTab('campaign')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                selectedTab === 'campaign'
                  ? 'bg-gradient-primary text-white'
                  : 'bg-dark-bg text-text-muted hover:bg-dark-card'
              }`}
            >
              Campaigns ({products.campaigns.length})
            </button>
            <button
              onClick={() => setSelectedTab('package')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                selectedTab === 'package'
                  ? 'bg-gradient-primary text-white'
                  : 'bg-dark-bg text-text-muted hover:bg-dark-card'
              }`}
            >
              Packages ({products.packages.length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(selectedTab === 'campaign' ? products.campaigns : products.packages).map((product) => (
              <div
                key={product.id}
                className="bg-dark-bg border border-dark-border rounded-lg p-4 hover:border-primary/50 transition-colors"
              >
                <h4 className="text-text font-semibold mb-2">{product.name}</h4>
                <p className="text-text-muted text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold text-lg">₹{product.price.toLocaleString()}</span>
                  <Button size="sm" onClick={() => addToCart(product)}>
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <Card>
          <h3 className="text-lg font-semibold text-text mb-4">Cart ({cart.length})</h3>
          
          {cart.length === 0 ? (
            <p className="text-text-muted text-center py-8">No items in cart</p>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {cart.map((item, index) => (
                  <div key={index} className="bg-dark-bg border border-dark-border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-text font-medium text-sm">{item.product_name}</p>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="w-6 h-6 bg-dark-card rounded flex items-center justify-center hover:bg-dark-border"
                        >
                          -
                        </button>
                        <span className="text-text w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="w-6 h-6 bg-dark-card rounded flex items-center justify-center hover:bg-dark-border"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-text font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-dark-border pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-text font-semibold">Total:</span>
                  <span className="text-primary font-bold text-xl">
                    ₹{getCartTotal().toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <Card>
      <h3 className="text-xl font-semibold text-text mb-6">Order Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Order Source *
          </label>
          <select
            value={orderSource}
            onChange={(e) => setOrderSource(e.target.value as OrderSource)}
            className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-text focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="phone_call">Phone Call</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="walk_in">Walk-in</option>
            <option value="email">Email</option>
            <option value="referral">Referral</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as OrderPriority)}
            className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-text focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Payment Status *
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
            className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-text focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial Payment</option>
            <option value="paid">Fully Paid</option>
            <option value="cod">Cash on Delivery</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {paymentStatus !== 'unpaid' && (
          <>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">
                Payment Method *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-text focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="card">Card</option>
                <option value="cheque">Cheque</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">
                Payment Amount * (Total: ₹{getCartTotal().toLocaleString()})
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="5000"
                className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-text focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">
                Payment Reference (Optional)
              </label>
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="TXN123456 or CASH-001"
                className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-text focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </>
        )}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-text-muted mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Customer wants delivery by Friday..."
            rows={3}
            className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-text focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <h3 className="text-xl font-semibold text-text mb-6">Staff Assignment (Optional)</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Assign to Staff Member
          </label>
          <select
            value={assignedStaff || ''}
            onChange={(e) => setAssignedStaff(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-text focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Leave Unassigned</option>
            {user?.role === 'staff' && (
              <option value={user.id}>Assign to Me</option>
            )}
            {user?.role === 'admin' && staffMembers.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name || staff.phone} ({staff.assigned_orders_count} active orders)
              </option>
            ))}
          </select>
        </div>

        <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
          <h4 className="text-text font-semibold mb-3">Order Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Customer:</span>
              <span className="text-text font-medium">
                {isNewCustomer ? newCustomer.name : selectedCustomer?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Items:</span>
              <span className="text-text font-medium">{cart.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Total Amount:</span>
              <span className="text-primary font-bold">₹{getCartTotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Payment Status:</span>
              <span className="text-text font-medium capitalize">{paymentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Source:</span>
              <span className="text-text font-medium capitalize">{orderSource.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Priority:</span>
              <span className="text-text font-medium uppercase">{priority}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <AppLayout breadcrumbs={[{ label: 'Orders', path: '/orders' }, { label: 'Create Manual Order' }]}>
      <PageHeader
        title="Create Manual Order"
        subtitle="Create an order for offline leads (phone, WhatsApp, walk-in)"
      />

      {renderStepIndicator()}

      <div className="max-w-5xl mx-auto">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        <div className="flex justify-between mt-6">
          <Button
            variant="ghost"
            onClick={() => currentStep > 1 ? setCurrentStep((currentStep - 1) as Step) : navigate('/orders')}
            disabled={loading}
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>

          {currentStep < 4 ? (
            <Button
              variant="primary"
              onClick={() => setCurrentStep((currentStep + 1) as Step)}
              disabled={!canProceedToNextStep()}
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Creating Order...
                </span>
              ) : (
                'Create Order'
              )}
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateManualOrderPage;
