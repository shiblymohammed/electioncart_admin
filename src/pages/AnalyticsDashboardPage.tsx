import { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
  revenue_trend?: Array<{ date: string; revenue: number }>;
  order_distribution?: Array<{ status: string; count: number }>;
}

const AnalyticsDashboardPage = () => {
  const { showError, showSuccess } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

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
        revenue_trend: [
          { date: 'Jan', revenue: 15000 },
          { date: 'Feb', revenue: 18000 },
          { date: 'Mar', revenue: 22000 },
          { date: 'Apr', revenue: 19000 },
          { date: 'May', revenue: 25000 },
          { date: 'Jun', revenue: 26000 },
        ],
        order_distribution: [
          { status: 'Completed', count: 25 },
          { status: 'In Progress', count: 12 },
          { status: 'Pending', count: 5 },
          { status: 'Cancelled', count: 3 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await api.get('/admin/analytics/export/', {
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      showSuccess('Analytics exported successfully');
    } catch (err: any) {
      showError('Failed to export analytics');
    } finally {
      setExporting(false);
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
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              onClick={handleExport}
              isLoading={exporting}
            >
              {exporting ? 'Exporting...' : 'Export CSV'}
            </Button>
            <Button variant="ghost" onClick={fetchAnalytics}>
              Refresh
            </Button>
          </div>
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

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            <Card>
              <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Revenue Trend
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.revenue_trend || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#8D96A0"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#8D96A0"
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#161B22', 
                        border: '1px solid #30363D',
                        borderRadius: '8px',
                        color: '#F0F6FC'
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Legend 
                      wrapperStyle={{ color: '#F0F6FC', fontSize: '14px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#22c55e" 
                      strokeWidth={3}
                      dot={{ fill: '#22c55e', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Revenue"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Order Distribution Chart */}
            <Card>
              <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                Order Distribution
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.order_distribution || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, percent }: any) => `${status}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {(analytics.order_distribution || []).map((_, index) => {
                        const colors = ['#22c55e', '#3b82f6', '#eab308', '#ef4444'];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#161B22', 
                        border: '1px solid #30363D',
                        borderRadius: '8px',
                        color: '#F0F6FC'
                      }}
                      formatter={(value: number) => [value, 'Orders']}
                    />
                    <Legend 
                      wrapperStyle={{ color: '#F0F6FC', fontSize: '14px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default AnalyticsDashboardPage;
