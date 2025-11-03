import { useEffect, useState } from 'react';
import { useToast } from '../hooks/useToast';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import api from '../services/api';

interface User {
  id: number;
  username: string;
  phone_number: string;
  role: string;
  created_at: string;
}

const UserManagementPage = () => {
  const { showError } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/users/');
      setUsers(response.data);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      showError('Failed to load users');
    } finally {
      setLoading(false);
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
      <PageHeader
        title="User Management"
        subtitle={`${users.length} total users`}
      />

      {users.length === 0 ? (
        <EmptyState
          title="No users found"
          message="Users will appear here once registered"
          actionLabel="Refresh"
          onAction={fetchUsers}
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
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-dark-border hover:bg-dark-hover transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-text">
                      {user.username}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </AppLayout>
  );
};

export default UserManagementPage;
