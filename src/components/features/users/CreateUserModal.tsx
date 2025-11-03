import { useState } from 'react';
import { createUser, CreateUserRequest } from '../../../services/userService';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateUserModal = ({ isOpen, onClose, onSuccess }: CreateUserModalProps) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: '',
    phone_number: '',
    role: 'user',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.username.trim() || formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^\+91\d{10}$/;
    if (!phoneRegex.test(formData.phone_number)) {
      setError('Phone number must be in format +91XXXXXXXXXX');
      return;
    }

    // Password validation (if provided)
    if (formData.password && formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);
      await createUser(formData);
      onSuccess();
      // Reset form
      setFormData({
        username: '',
        phone_number: '',
        role: 'user',
        password: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-dark-surface border border-dark-border rounded-xl shadow-xl max-w-md w-full mx-4 animate-fade-in-up">
        <div className="px-6 py-4 border-b border-dark-border">
          <h2 className="text-2xl font-bold text-text">Create New User</h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          {error && (
            <div className="mb-4 bg-danger/20 border border-danger rounded-lg text-danger px-4 py-3">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-2">
              Username <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 bg-dark border border-dark-border rounded-lg text-text placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              required
              minLength={3}
            />
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-2">
              Phone Number <span className="text-danger">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              placeholder="+919876543210"
              className="w-full px-4 py-2 bg-dark border border-dark-border rounded-lg text-text placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              required
            />
            <p className="mt-1 text-xs text-text-muted">Format: +91XXXXXXXXXX</p>
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-2">
              Role <span className="text-danger">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'staff' | 'admin' })}
              className="w-full px-4 py-2 bg-dark border border-dark-border rounded-lg text-text focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="user">User</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-2">
              Password <span className="text-text-muted">(optional)</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Leave blank for random password"
              className="w-full px-4 py-2 bg-dark border border-dark-border rounded-lg text-text placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              minLength={8}
            />
            <p className="mt-1 text-xs text-text-muted">Minimum 8 characters if provided</p>
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
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
