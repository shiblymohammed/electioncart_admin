import { useEffect, useState } from 'react';
import { useToast } from '../hooks/useToast';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import api from '../services/api';

interface AnalyticsData {
  total_revenue: number;
  total_orders: number;
  avg_order_value: number;
  completion_rate: number;
}

const AnalyticsDashboardPage = () => {
  const { showError } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/analytics/');
      setAnalytics(response.data);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      showError('Failed to load analytics');
      // Set mock data for demo
      setAnalytics({
        total_revenue: 125000,
        total_orders: 45,
        avg_order_value: 2778,
        completion_rate: 87,
      });
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
            <p className="mt-4 text-text-muted">Loading analytics...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={[{ label: 'Analytics' }]}>
      <PageHeader
        title="Analytics Dashboard"
        subtitle="Business metrics and insights"
        actions={
          <Button variant="ghost" onClick={fetchAnalytics}>
            Refresh
          </Button>
        }
      />

      {analytics && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Total Revenue"
              value={analytics.total_revenue}
              color="success"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              trend={{ value: 12, isPositive: true }}
            />

            <StatCard
              label="Total Orders"
              value={analytics.total_orders}
              color="primary"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              trend={{ value: 8, isPositive: true }}
            />

            <StatCard
              label="Avg Order Value"
              value={analytics.avg_order_value}
              color="info"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
              trend={{ value: 5, isPositive: true }}
            />

            <StatCard
              label="Completion Rate"
              value={analytics.completion_rate}
              color="warning"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              trend={{ value: 3, isPositive: true }}
            />
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-text mb-4">Revenue Trend</h3>
              <div className="h-64 flex items-center justify-center bg-dark-surface rounded-lg">
                <p className="text-text-muted">Chart visualization coming soon</p>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-text mb-4">Order Distribution</h3>
              <div className="h-64 flex items-center justify-center bg-dark-surface rounded-lg">
                <p className="text-text-muted">Chart visualization coming soon</p>
              </div>
            </Card>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default AnalyticsDashboardPage;
