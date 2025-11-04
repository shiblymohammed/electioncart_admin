# 💰 Payment Status Dropdown - Quick Guide

## What's New?

Admins can now change payment status directly from the admin panel using a convenient dropdown!

## 🎯 Where to Find It

### 1. Order List Page
- New **"Payment"** column in the orders table
- Click dropdown → Select status → Done! ✅

### 2. Order Detail Page
- Look for **"Payment Status"** in the Order Summary sidebar
- Click dropdown → Select status → Page refreshes with new status

## 🎨 Payment Status Options

```
❌ Unpaid           - No payment received (Red)
⏳ Partially Paid   - Some payment received (Yellow)
✅ Fully Paid       - Payment complete (Green)
↩️ Refunded         - Payment refunded (Purple)
💵 Cash on Delivery - COD order (Blue)
```

## 🚀 How to Use

### Quick Update from Order List:
1. Go to **Orders** page
2. Find the order you want to update
3. Click the **Payment Status** dropdown in the "Payment" column
4. Select the new status
5. ✨ Done! Status updates instantly

### Detailed Update from Order Detail:
1. Click on any order to open details
2. Look at the right sidebar under "Order Summary"
3. Find **"Payment Status"**
4. Click the dropdown and select new status
5. Page refreshes automatically with updated info

## 💡 Tips

- **Instant Updates**: No confirmation needed - status changes immediately
- **Visual Feedback**: Loading spinner shows while updating
- **Error Handling**: If update fails, status reverts automatically
- **Toast Notifications**: Success/error messages appear at the top
- **Admin Only**: Staff members can only view payment status (read-only)

## 🔄 Automatic Updates

Payment status can also update automatically when:
- Recording a payment via "Record Payment" button
- Payment records reach the order total
- Razorpay payment is verified

## 📊 Payment Information Display

On the Order Detail page, you'll also see:
- **Total Amount**: Full order amount
- **Total Paid**: Amount received so far
- **Balance Due**: Remaining amount (if partially paid)

## 🎯 Use Cases

### Scenario 1: Customer Pays in Cash
1. Order created as "Unpaid"
2. Customer pays cash at office
3. Admin changes status to "Fully Paid" ✅
4. Optionally record payment for tracking

### Scenario 2: Partial Payment
1. Order total: ₹10,000
2. Customer pays ₹5,000 advance
3. Admin changes status to "Partially Paid" ⏳
4. Record payment of ₹5,000
5. When balance paid, change to "Fully Paid" ✅

### Scenario 3: COD Order
1. Create manual order
2. Set payment status to "Cash on Delivery" 💵
3. When delivered and paid, change to "Fully Paid" ✅

### Scenario 4: Refund
1. Customer requests refund
2. Process refund
3. Change status to "Refunded" ↩️

## 🔧 Technical Details

**Backend Endpoint:**
```
POST /api/admin/orders/{order_id}/update-payment-status/
Body: { "payment_status": "paid" }
```

**Frontend Component:**
```
src/components/PaymentStatusDropdown.tsx
```

## 🎨 Design Features

- **Color-coded statuses** for quick visual identification
- **Icons** for better UX
- **Dark mode support**
- **Smooth animations**
- **Responsive design**

## ❓ FAQ

**Q: Can staff members change payment status?**
A: No, only admins can change payment status. Staff can only view it.

**Q: What happens if I select the wrong status?**
A: Just select the correct status from the dropdown again. It updates instantly.

**Q: Does changing payment status affect order status?**
A: No, they are independent. You can have a "Fully Paid" order that's still "In Progress".

**Q: Can I see payment history?**
A: Yes! Payment records are shown on the Order Detail page with timestamps.

**Q: What if the API call fails?**
A: The status will revert to the previous value and show an error message.

---

**Need Help?** Contact the development team or check the full documentation in `docs/PAYMENT_STATUS_DROPDOWN.md`
