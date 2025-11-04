import { OrderDetail } from '../types/order';
import ProgressUpdate from './ProgressUpdate';

/**
 * ChecklistView Component
 * 
 * Displays an interactive checklist for staff members to track order completion progress.
 * Features:
 * - Shows customer contact information and campaign resources
 * - Displays all checklist items with completion status
 * - Integrates ProgressUpdate component for real-time tracking
 * 
 * Requirements: 8.2, 8.3, 9.1
 */
interface ChecklistViewProps {
  order: OrderDetail;
  onUpdate?: () => void;
}

const ChecklistView = ({ order, onUpdate }: ChecklistViewProps) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };



  return (
    <div className="space-y-6">
      {/* User Resources and Contact Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information & Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Contact Details</h3>
            <div>
              <p className="text-xs text-gray-600">Customer Name</p>
              <p className="font-medium text-gray-900">{order.user.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Phone Number</p>
              <a 
                href={`tel:${order.user.phone}`}
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                {order.user.phone}
              </a>
            </div>
            <div>
              <p className="text-xs text-gray-600">Order Number</p>
              <p className="font-medium text-gray-900">{order.order_number}</p>
            </div>
          </div>

          {/* Campaign Resources Summary */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Campaign Resources</h3>
            {order.resources && order.resources.length > 0 ? (
              order.resources.map((resourceGroup: any, groupIndex: number) => (
                <div key={resourceGroup.order_item_id} className="text-sm space-y-2">
                  {groupIndex > 0 && <div className="border-t pt-2 mt-2"></div>}
                  
                  {/* Item Name */}
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-gray-700">{resourceGroup.item_name}</p>
                  </div>

                  {/* Dynamic Resources */}
                  {resourceGroup.dynamic && resourceGroup.dynamic.length > 0 && (
                    <>
                      {/* Text fields (slogan, phone, etc.) */}
                      {resourceGroup.dynamic
                        .filter((f: any) => ['text', 'phone', 'date'].includes(f.field_type))
                        .map((field: any) => (
                          <div key={field.id}>
                            <p className="text-xs text-gray-600">{field.field_name}</p>
                            {field.field_type === 'phone' ? (
                              <a 
                                href={`https://wa.me/${field.value.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 inline-flex items-center"
                              >
                                {field.value}
                                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                </svg>
                              </a>
                            ) : field.field_type === 'date' ? (
                              <p className="text-gray-900">{formatShortDate(field.value)}</p>
                            ) : (
                              <p className="text-gray-900 italic">"{field.value}"</p>
                            )}
                          </div>
                        ))}

                      {/* Image fields */}
                      {resourceGroup.dynamic
                        .filter((f: any) => f.field_type === 'image' && f.value)
                        .map((field: any) => (
                          <div key={field.id}>
                            <p className="text-xs text-gray-600 mb-1">{field.field_name}</p>
                            <a
                              href={`${API_BASE_URL}${field.value}?token=${localStorage.getItem('admin_token')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 text-xs"
                            >
                              View Image →
                            </a>
                          </div>
                        ))}

                      {/* Document fields */}
                      {resourceGroup.dynamic
                        .filter((f: any) => f.field_type === 'document' && f.value)
                        .map((field: any) => (
                          <div key={field.id}>
                            <p className="text-xs text-gray-600 mb-1">{field.field_name}</p>
                            <a
                              href={`${API_BASE_URL}${field.value}?token=${localStorage.getItem('admin_token')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 text-xs"
                            >
                              Download →
                            </a>
                          </div>
                        ))}
                    </>
                  )}

                  {/* Static Resources (Legacy) */}
                  {resourceGroup.static && (
                    <>
                      {resourceGroup.static.campaign_slogan && (
                        <div>
                          <p className="text-xs text-gray-600">Slogan</p>
                          <p className="text-gray-900 italic">"{resourceGroup.static.campaign_slogan}"</p>
                        </div>
                      )}
                      {resourceGroup.static.whatsapp_number && (
                        <div>
                          <p className="text-xs text-gray-600">WhatsApp</p>
                          <a 
                            href={`https://wa.me/${resourceGroup.static.whatsapp_number.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 inline-flex items-center"
                          >
                            {resourceGroup.static.whatsapp_number}
                            <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No resources uploaded yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Progress Update with Interactive Checklist */}
      {order.checklist && order.checklist.items.length > 0 && (
        <ProgressUpdate
          checklistItems={order.checklist.items}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
};

export default ChecklistView;
