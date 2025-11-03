import { useEffect, useState } from 'react';
import { getStaffMembers } from '../services/adminService';
import { StaffMember } from '../types/order';
import { useToast } from '../hooks/useToast';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import StaffCard from '../components/features/staff/StaffCard';

const StaffListPage = () => {
  const { showError } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const staffData = await getStaffMembers();
      setStaff(staffData);
    } catch (err: any) {
      console.error('Error fetching staff:', err);
      showError('Failed to load staff members');
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
            <p className="mt-4 text-text-muted">Loading staff...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={[{ label: 'Staff' }]}>
      <PageHeader
        title="Staff Management"
        subtitle={`${staff.length} staff members`}
      />

      {staff.length === 0 ? (
        <EmptyState
          title="No staff members"
          message="Staff members will appear here once added"
          actionLabel="Refresh"
          onAction={fetchStaff}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member) => (
            <StaffCard key={member.id} staff={member} />
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default StaffListPage;
