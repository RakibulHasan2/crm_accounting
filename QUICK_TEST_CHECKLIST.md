# Quick Manual Testing Checklist

## ⚡ Immediate Tests (5 minutes)

### 1. Basic Access Test
- [ ] Open `http://localhost:3000`
- [ ] Login redirects properly
- [ ] Dashboard loads without errors
- [ ] Navigation menu appears

### 2. Chart of Accounts Test (2 minutes)
- [ ] Navigate to `/accounting/chart-of-accounts`
- [ ] Page loads successfully
- [ ] Click "Create Account" button
- [ ] Fill form with:
  - Code: `1001`
  - Name: `Test Cash`
  - Type: `Asset`
  - Sub-Type: `Current Asset`
  - Description: `Test account`
- [ ] Submit form
- [ ] ✅ SUCCESS: Account appears in list
- [ ] ❌ FAILURE: Error message or 500 error

### 3. Journal Entries Test (2 minutes)
- [ ] Navigate to `/accounting/journal-entries`
- [ ] Page loads successfully
- [ ] List shows existing entries (or empty state)
- [ ] Create entry button works

### 4. Reports Test (1 minute)
- [ ] Navigate to `/accounting/trial-balance`
- [ ] Page loads without errors
- [ ] Navigate to `/accounting/financial-reports`
- [ ] Page loads without errors

## 🔥 Critical Issues to Check

### Authentication
- [ ] Can login as admin/accountant
- [ ] Unauthorized users redirected
- [ ] Logout functionality works

### Database Connection
- [ ] No MongoDB connection errors in console
- [ ] API endpoints return data (not 500 errors)

### Form Functionality
- [ ] Required field validation works
- [ ] Success messages appear
- [ ] Data persists after creation

## 📊 Browser Console Test

Open browser console and run:

```javascript
// Test API endpoints
fetch('/api/accounting/chart-of-accounts').then(r => r.json()).then(console.log);
fetch('/api/accounting/journal-entries').then(r => r.json()).then(console.log);
fetch('/api/accounting/trial-balance').then(r => r.json()).then(console.log);
```

Expected: JSON responses with data, not error messages

## 🚨 Red Flags

Stop testing if you see:
- [ ] 500 Internal Server Error
- [ ] Database connection failed
- [ ] Pages showing white screen
- [ ] Authentication loops (constant redirects)
- [ ] Console showing critical errors

## ✅ Success Indicators

System is functional if:
- [ ] All pages load
- [ ] Can create at least one account
- [ ] No 500 errors in network tab
- [ ] Authentication works
- [ ] Forms submit successfully

## 🔧 Quick Fixes

If tests fail:

1. **500 Errors**: Check server console for MongoDB issues
2. **Auth Issues**: Verify environment variables
3. **Form Errors**: Check required fields are filled
4. **Page Load Issues**: Clear browser cache

---

**Time Required**: 5-10 minutes for basic functionality verification
**Goal**: Confirm core accounting features work before detailed testing