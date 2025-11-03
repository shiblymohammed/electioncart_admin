import { useEffect, useState } from 'react';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import CreateUserModal from '../components/features/users/CreateUserModal';
import EditUserRoleModal from '../components/features/users/EditUserRoleModal';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import { getUsers, deleteUser, User } from '../services/userService';

const UserManagementPage = () => {
  const { showError, showSuccess } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; user: User | null }>({
    show: false,
    user: null,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (roleFilter) params.role = roleFilter;
      if (searchTerm) params.search = searchTerm;
      
      const data = await getUsers(params);
      setUsers(data);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      showError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    fetchUsers();
    setShowCreateModal(false);
    showSuccess('User created successfully');
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
  };

  const handleEditSuccess = () => {
    fetchUsers();
    setEditingUser(null);
    showSuccess('User role updated successfully');
  };

  const handleDeleteClick = (user: User) => {
    // Prevent deleting self
    if (currentUser && user.id === currentUser.id) {
      showError('You cannot delete your own account');
      return;
    }
    setDeleteConfirm({ show: true, user });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.user) return;

    try {
      await deleteUser(deleteConfirm.user.id);
      showSuccess('User deleted successfully');
      fetchUsers();
      setDeleteConfirm({ show: false, user: null });
    } catch (err: any) {
      showError(err.response?.data?.error || err.response?.data?.message || 'Failed to delete user');
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'staff':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <LoadingSpinner size="xl" />
            <p className="mt-4 text-text-muted">Loading users...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={[{ label: 'Users' }]}>
      <div className="flex justify-between items-center mb-6">
        <PageHeader
          title="User Management"
          subtitle={`${users.length} total users`}
        />
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
        >
          + Create User
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by username or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-dark border border-dark-border rounded-lg text-text placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">Filter by Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 bg-dark border border-dark-border rounded-lg text-text focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || roleFilter) && (
          <div className="mt-4 pt-4 border-t border-dark-border">
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('');
              }}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </Card>

      {users.length === 0 ? (
        <EmptyState
          title="No users found"
          message={searchTerm || roleFilter ? "No users match your filters" : "Users will appear here once registered"}
          actionLabel={searchTerm || roleFilter ? "Clear Filters" : "Create User"}
          onAction={searchTerm || roleFilter ? () => { setSearchTerm(''); setRoleFilter(''); } : () => setShowCreateModal(true)}
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Username</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Joined</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-dark-border hover:bg-dark-hover transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-text">
                      {user.username}
                      {currentUser && user.id === currentUser.id && (
                        <span className="ml-2 text-xs text-primary">(You)</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-muted">
                      {user.phone_number}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge variant={getRoleBadgeVariant(user.role) as any}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-muted">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-primary hover:text-primary/80 mr-4 transition-colors"
                      >
                        Edit Role
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="text-danger hover:text-danger/80 transition-colors"
                        disabled={!!(currentUser && user.id === currentUser.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit User Role Modal */}
      {editingUser && (
        <EditUserRoleModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={handleEditSuccess}
          user={editingUser}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.show && deleteConfirm.user && (
        <DeleteConfirmationDialog
          isOpen={deleteConfirm.show}
          onClose={() => setDeleteConfirm({ show: false, user: null })}
          onConfirm={handleDeleteConfirm}
          title="Delete User"
          message={`Are you sure you want to delete user "${deleteConfirm.user.username}"? This action cannot be undone.`}
          itemName={deleteConfirm.user.username}
        />
      )}
    </AppLayout>
  );
};

export default UserManagementPage;
