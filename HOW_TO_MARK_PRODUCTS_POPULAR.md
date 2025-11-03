# How to Mark Products as Popular - Admin Frontend

## ✅ Implementation Complete!

The Popular Products feature is now fully integrated into the Admin Frontend!

---

## 🎯 How to Use

### Step 1: Go to Product Management

1. Login to Admin Panel: http://localhost:5174 (or your admin URL)
2. Click on **"Product Management"** from the dashboard
3. You'll see a list of all packages and campaigns

### Step 2: Mark Products as Popular

In the product list, you'll see a new **"Popular"** column with buttons:

#### For Non-Popular Products:
- Button shows: **"☆ Mark Popular"** (gray)
- Click to mark as popular
- Product becomes **Popular #1**, **#2**, or **#3**

#### For Popular Products:
- Button shows: **"★ Popular #1"** (yellow with filled star)
- Click again to unmark from popular
- Other popular products will auto-reorder

### Step 3: Maximum 3 Products

- **Maximum 3 packages** can be popular at once
- **Maximum 3 campaigns** can be popular at once
- When limit reached, button becomes disabled for non-popular products
- Unmark one to mark another

---

## 🎨 Visual Guide

### Product List View:
```
┌─────────────────────────────────────────────────────────────────────┐
│ Product Name    │ Type     │ Price  │ Status │ Popular           │  │
├─────────────────────────────────────────────────────────────────────┤
│ Basic Package   │ package  │ ₹5,000 │ Active │ [★ Popular #1]    │  │
│ Premium Package │ package  │ ₹10,000│ Active │ [★ Popular #2]    │  │
│ Advanced Pkg    │ package  │ ₹15,000│ Active │ [★ Popular #3]    │  │
│ Deluxe Package  │ package  │ ₹20,000│ Active │ [☆ Mark Popular]  │  │ ← Disabled
└─────────────────────────────────────────────────────────────────────┘
```

### Button States:

**Not Popular (Gray):**
```
┌──────────────────────┐
│ ☆ Mark Popular       │
└──────────────────────┘
```

**Popular (Yellow):**
```
┌──────────────────────┐
│ ★ Popular #1         │
└──────────────────────┘
```

**Disabled (Gray, Faded):**
```
┌──────────────────────┐
│ ☆ Mark Popular       │  (Can't click - limit reached)
└──────────────────────┘
```

---

## 📋 Step-by-Step Example

### Scenario: Mark Your First 3 Packages as Popular

1. **Go to Product Management**
   - Navigate to http://localhost:5174/products

2. **Filter by Packages** (optional)
   - Select "Packages" from the Type dropdown

3. **Mark First Package**
   - Find "Basic Package"
   - Click **"☆ Mark Popular"** button
   - Button changes to **"★ Popular #1"** (yellow)

4. **Mark Second Package**
   - Find "Premium Package"
   - Click **"☆ Mark Popular"** button
   - Button changes to **"★ Popular #2"** (yellow)

5. **Mark Third Package**
   - Find "Advanced Package"
   - Click **"☆ Mark Popular"** button
   - Button changes to **"★ Popular #3"** (yellow)

6. **Try to Mark Fourth Package**
   - Find "Deluxe Package"
   - Button is **disabled** (grayed out)
   - Hover shows: "Maximum 3 packages can be marked as popular"

7. **Unmark One to Mark Another**
   - Click **"★ Popular #2"** on Premium Package
   - Button changes back to **"☆ Mark Popular"**
   - Advanced Package auto-reorders to #2
   - Now you can mark Deluxe Package as #3

---

## 🔄 Auto-Reordering

When you unmark a popular product, the remaining products automatically reorder:

**Before:**
- Product A: Popular #1
- Product B: Popular #2
- Product C: Popular #3

**After unmarking Product B:**
- Product A: Popular #1
- Product C: Popular #2 (auto-reordered from #3)

---

## ✅ Verification

### Check on Homepage:

1. Go to Suburbia homepage: http://localhost:3000
2. Scroll to **"Popular Packages"** section
3. You should see the 3 packages you marked
4. Scroll to **"Popular Campaigns"** section
5. You should see the 3 campaigns you marked

### Check via API:

```bash
# Get popular packages
curl http://localhost:8000/api/packages/popular/

# Get popular campaigns
curl http://localhost:8000/api/campaigns/popular/
```

---

## 🎯 Tips

### Best Practices:
1. **Mark your best-selling products** as popular
2. **Update seasonally** - change popular products based on season
3. **Test different combinations** - see what converts best
4. **Keep images updated** - popular products should have good images

### Common Actions:
- **Rotate popular products monthly** - Keep homepage fresh
- **Feature new products** - Mark new launches as popular temporarily
- **Promote campaigns** - Mark active campaigns as popular

---

## 🐛 Troubleshooting

### Issue: Button is disabled
**Reason:** Already have 3 popular products of that type
**Solution:** Unmark one popular product first

### Issue: Changes not showing on homepage
**Reason:** Browser cache
**Solution:** Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: Error when clicking button
**Reason:** Not logged in as admin
**Solution:** Login with admin credentials

---

## 🎉 That's It!

You can now easily manage which products appear in the Popular sections on your homepage!

**Key Points:**
- ✅ Click button to toggle popular status
- ✅ Maximum 3 per type (packages/campaigns)
- ✅ Auto-reordering when unmarking
- ✅ Changes reflect immediately on homepage
- ✅ Visual feedback with star icons

---

**Need Help?**
- Check `POPULAR_PRODUCTS_IMPLEMENTATION_COMPLETE.md` for technical details
- Check `POPULAR_PRODUCTS_QUICK_START.md` for API usage
