# Payment Status Dropdown Feature

## Overview
Added a payment status dropdown in the admin panel that allows admins to quickly change the payment status of orders directly from the order list and order detail pages.

## Features

### 1. **Payment Status Dropdown Component**
- Location: `src/components/PaymentStatusDropdown.tsx`
- Visual indicators with icons and colors for each status
- Instant update without confirmation modal (unlike order status)
- Loading state during API call
- Toast notifications for success/error

### 2. **Payment Status Options**

| Status | Icon | Color | Description |
|--------|------|-------|-------------|
| Unpaid | ❌ | Red | No payment received |
| Partially Paid | ⏳ | Yellow | Some payment received |
| Fully Paid | ✅ | Green | Payment complete |
| Refunded | ↩️ | Purple | Payment refunded |
| Cash on Delivery | 💵 | Blue | COD order |

### 3. **Integration Points**

#### Order Detail Page
- Location: `src/pages/OrderDetailPage.tsx`
- Shows in the "Order Summary" sidebar
- Only visible to admins (staff see a badge)
- Updates order details on change

#### Order List Page
- Location: `src/pages/OrderListPage.tsx`
- New "Payment" column in the table view
- Quick status updates without leaving the list
- Only visible to admins (staff see a badge)

## Usage

### For Admins

1. **From Order List:**
   - Navigate to Orders page
   - Find the "Payment" column
   - Click the dropdown and select new status
   - Status updates immediately

2. **From Order Detail:**
   - Open any order
   - Find "Payment Status" in the Order Summary sidebar
   - Click the dropdown and select new status
   - Page refreshes with updated data

### For Staff
- Staff members see payment status as a read-only badge
- Cannot change payment status (admin-only feature)

## API Integration

### Endpoint
```
POST /api/admin/orders/{order_id}/update-payment-status/
```

### Request Body
```json
{
  "payment_status": "paid"
}
```

### Response
```json
{
  "success": true,
  "message": "Payment status updated from unpaid to paid",
  "order": { ... }
}
```

## Technical Details

### Service Function
```typescript
// src/services/manualOrderService.ts
export const updatePaymentStatus = async (
  orderId: number,
  paymentStatus: string
): Promise<{
  success: boolean;
  message: string;
  order: any;
}>
```

### Component Props
```typescript
interface PaymentStatusDropdownProps {
  orderId: number;
  currentStatus: PaymentStatus;
  onStatusChange: () => void;
}
```

### Type Definition
```typescript
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded' | 'cod';
```

## Styling

The dropdown uses:
- Tailwind CSS for styling
- Dark mode support
- Gradient colors for better visibility
- Smooth transitions and hover effects
- Loading spinner during updates

## Error Handling

- Network errors show toast notification
- Failed updates revert to previous status
- Error messages from backend are displayed
- Loading state prevents multiple clicks

## Future Enhancements

Potential improvements:
1. Bulk payment status updates
2. Payment status filters in order list
3. Payment status history tracking
4. Automatic status based on payment records
5. Payment reminders for unpaid orders

## Related Files

- `src/components/PaymentStatusDropdown.tsx` - Main component
- `src/services/manualOrderService.ts` - API service
- `src/types/manualOrder.ts` - Type definitions
- `src/pages/OrderDetailPage.tsx` - Detail page integration
- `src/pages/OrderListPage.tsx` - List page integration
- `backend/admin_panel/manual_order_views.py` - Backend endpoint
