import api from './api';

export const downloadInvoice = async (orderId: number): Promise<void> => {
  try {
    const response = await api.get(`/admin/orders/${orderId}/invoice/`, {
      responseType: 'blob',
    });
    
    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `invoice-${orderId}.pdf`;
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to download invoice');
  }
};

export default {
  downloadInvoice,
};
