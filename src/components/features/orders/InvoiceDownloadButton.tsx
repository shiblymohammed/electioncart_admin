import { useState } from 'react';
import { useToast } from '../../../hooks/useToast';
import api from '../../../services/api';

interface InvoiceDownloadButtonProps {
  orderId: number;
  orderNumber?: string;
}

const InvoiceDownloadButton = ({ orderId, orderNumber }: InvoiceDownloadButtonProps) => {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      
      // Request invoice PDF from backend
      const response = await api.get(`/admin/orders/${orderId}/invoice/`, {
        responseType: 'blob',
      });

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = `invoice-${orderNumber || orderId}.pdf`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showSuccess('Invoice downloaded successfully');
    } catch (err: any) {
      console.error('Failed to download invoice:', err);
      showError(err.response?.data?.message || 'Failed to download invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span>Downloading...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download Invoice</span>
        </>
      )}
    </button>
  );
};

export default InvoiceDownloadButton;
