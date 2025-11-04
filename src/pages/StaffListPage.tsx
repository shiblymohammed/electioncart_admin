import { useEffect } from 'react';
import { getStaffMembers } from '../services/adminService';
import { StaffMember } from '../types/order';
import { useToast } from '../hooks/useToast';
import { useCachedData } from '../hooks/useCachedData';
import { CACHE_KEYS, CACHE_DURATION } from '../utils/cacheManager';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import StaleDataIndicator from '../components/ui/StaleDataIndicator';
import StaffCard from '../components/features/staff/StaffCard';

const StaffListPage = () => {
  const { showError } = useToast();

  // Use cached data for staff
  const {
    data: staff,
    loading,
    error,
    cacheStatus,
    refresh: fetchStaff,
  } = useCachedData<StaffMember[]>(
    CACHE_KEYS.STAFF_LIST,
    getStaffMembers,
    CACHE_DURATION.STAFF
  );

  // Show errors if any
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

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
        subtitle={`${staff?.length || 0} staff members`}
        actions={
          <div className="flex items-center gap-3">
            {cacheStatus && <StaleDataIndicator cacheStatus={cacheStatus} />}
          </div>
        }
      />

      {!staff || staff.length === 0 ? (
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
