import { useState } from 'react';
import { User, updateUserRole } from '../../../services/userService';

interface EditUserRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User;
}

const EditUserRoleModal = ({ isOpen, onClose, onSuccess, user }: EditUserRoleModalProps) => {
  const [role, setRole] = useState<'user' | 'staff' | 'admin'>(user.role);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      await updateUserRole(user.id, { role });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-dark-surface border border-dark-border rounded-xl shadow-xl max-w-md w-full mx-4 animate-fade-in-up">
        <div className="px-6 py-4 border-b border-dark-border">
          <h2 className="text-2xl font-bold text-text">Update User Role</h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          {error && (
            <div className="mb-4 bg-danger/20 border border-danger rounded-lg text-danger px-4 py-3">
              {error}
            </div>
          )}

          {/* User Info */}
          <div className="mb-4 p-4 bg-dark-hover rounded-lg">
            <p className="text-sm text-text-muted">User</p>
            <p className="text-lg font-semibold text-text">{user.username}</p>
            <p className="text-sm text-text-muted">{user.phone_number}</p>
          </div>

          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-2">
              New Role <span className="text-danger">*</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'staff' | 'admin')}
              className="w-full px-4 py-2 bg-dark border border-dark-border rounded-lg text-text focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="user">User</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
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
            {loading ? 'Updating...' : 'Update Role'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserRoleModal;
