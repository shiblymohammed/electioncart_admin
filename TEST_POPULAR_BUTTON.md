# Testing Popular Button - Troubleshooting Guide

## 🔍 What to Check

### 1. **Is the Admin Frontend Running?**
```bash
cd admin-frontend
npm run dev
```
Should show: `Local: http://localhost:5174`

### 2. **Can You See the Product List?**
- Go to: http://localhost:5174/products
- Do you see products in the table?
- If NO products showing:
  - Check if you're logged in
  - Check if backend is running
  - Check browser console for errors

### 3. **Can You See the "Popular" Column?**
Look at the table headers:
```
Product Name | Type | Price | Status | Popular | Created | Actions
```
- Is "Popular" column visible?
- If NO: Browser might need hard refresh (Ctrl+Shift+R)

### 4. **Can You See the Button?**
In the "Popular" column, you should see:
- White button with "☆ Mark Popular" OR
- Green button with "★ Popular #X"

If you see NOTHING in the Popular column:
- Check browser console (F12) for errors
- Check if `product.is_popular` is defined

---

## 🐛 Common Issues

### Issue 1: "Nothing showing in Popular column"

**Check Console:**
```javascript
// Open browser console (F12) and type:
console.log(products);
// Look for is_popular and popular_order fields
```

**Solution:**
- Backend might not be sending `is_popular` field
- Check API response in Network tab
- Verify migration was applied

### Issue 2: "Button not clickable"

**Check:**
- Is button disabled (faded)?
- Already have 3 popular products?

**Solution:**
- Unmark one popular product first
- Or check if it's a different product type

### Issue 3: "Changes not saving"

**Check:**
- Browser console for API errors
- Backend logs for errors
- Network tab for failed requests

**Solution:**
- Verify backend is running
- Check authentication token
- Verify API endpoint exists

---

## ✅ Step-by-Step Verification

### Step 1: Check Backend API
```bash
# Test if backend returns is_popular field
curl http://localhost:8000/api/admin/products/
```

Look for:
```json
{
  "id": 1,
  "name": "Basic Package",
  "is_popular": false,
  "popular_order": 0,
  ...
}
```

### Step 2: Check Frontend Console
Open browser console (F12) and check for:
- Any red errors?
- Component rendering errors?
- API call failures?

### Step 3: Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for `/api/admin/products/` request
5. Check response - does it include `is_popular`?

### Step 4: Hard Refresh
Sometimes browser cache causes issues:
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

---

## 🔧 Quick Fixes

### Fix 1: Restart Everything
```bash
# Terminal 1: Backend
cd backend
python manage.py runserver

# Terminal 2: Admin Frontend
cd admin-frontend
npm run dev
```

### Fix 2: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Fix 3: Check if Migration Applied
```bash
cd backend
python manage.py showmigrations products
```

Should show:
```
products
 [X] 0009_alter_campaign_options_alter_package_options_and_more
```

If NOT checked, run:
```bash
python manage.py migrate
```

---

## 📸 What You Should See

### **Product List with Popular Column:**
```
┌────────────────────────────────────────────────────────────────┐
│ Product Name     │ Type    │ Price  │ Status │ Popular         │
├────────────────────────────────────────────────────────────────┤
│ Basic Package    │ package │ ₹5,000 │ Active │ [☆ Mark Popular]│
│ Premium Package  │ package │ ₹10K   │ Active │ [☆ Mark Popular]│
└────────────────────────────────────────────────────────────────┘
```

### **After Marking as Popular:**
```
┌────────────────────────────────────────────────────────────────┐
│ Product Name     │ Type    │ Price  │ Status │ Popular         │
├────────────────────────────────────────────────────────────────┤
│ Basic Package    │ package │ ₹5,000 │ Active │ [★ Popular #1]  │
│                  │         │        │        │ (GREEN BUTTON)  │
└────────────────────────────────────────────────────────────────┘
```

---

## 🆘 Still Not Working?

### Check These Files Exist:
```
admin-frontend/src/components/PopularToggleButton.tsx  ✓
admin-frontend/src/pages/ProductManagementPage.tsx     ✓
admin-frontend/src/services/productService.ts          ✓
```

### Verify Component Import:
Open `ProductManagementPage.tsx` and check:
```typescript
import { PopularToggleButton } from '../components/PopularToggleButton';
```

### Check if Function Exists:
```typescript
const handleTogglePopular = async (product: Product) => {
  // Should exist in ProductManagementPage
}
```

---

## 📝 Debug Checklist

- [ ] Backend running on port 8000
- [ ] Admin frontend running on port 5174
- [ ] Logged in as admin
- [ ] Can see product list
- [ ] Can see "Popular" column header
- [ ] Migration applied (0009_alter_campaign...)
- [ ] Browser console shows no errors
- [ ] API returns `is_popular` field
- [ ] PopularToggleButton.tsx file exists
- [ ] Component imported in ProductManagementPage

---

## 💬 What to Tell Me

If still not working, please tell me:

1. **What do you see?**
   - Empty column?
   - No column at all?
   - Error message?
   - Something else?

2. **Browser Console Errors?**
   - Open F12
   - Copy any red errors

3. **Network Tab?**
   - Does `/api/admin/products/` return data?
   - Does response include `is_popular` field?

4. **Screenshots?**
   - Show me what you're seeing

---

**Let's figure this out together!** 🔍
