# Complete Accounting System Testing Workflow

This document provides a comprehensive workflow to test all accounting functionalities of the CRM Accounting system.

## Prerequisites
- Server running at `http://localhost:3000`
- User logged in with appropriate permissions (admin, accountant, or manager)
- MongoDB connected and accessible

## Testing Workflow

### Phase 1: Authentication & Access Control Testing

#### 1.1 Test User Login
1. **Navigate to**: `http://localhost:3000/auth/signin`
2. **Test accounts needed**:
   - Admin user
   - Accountant user
   - Manager user
   - Sales user (limited access)
   - Auditor user (read-only)

#### 1.2 Test Role-Based Access
1. **Admin**: Should access all modules
2. **Accountant**: Should access all accounting modules
3. **Manager**: Should access all accounting modules (read/write)
4. **Sales**: Should only access CRM modules
5. **Auditor**: Should only have read access to reports

---

### Phase 2: Chart of Accounts Setup

#### 2.1 Create Account Structure
**Navigate to**: `http://localhost:3000/accounting/chart-of-accounts`

**Create these accounts in order:**

##### Assets (Type: asset)
1. **Current Assets** (Sub-type: current_asset)
   - Code: `1000`, Name: `Current Assets`, Description: `Parent account for current assets`

2. **Cash in Bank** (Sub-type: current_asset)
   - Code: `1001`, Name: `Cash in Bank`, Parent: `Current Assets`
   - Description: `Primary checking account`

3. **Accounts Receivable** (Sub-type: current_asset)
   - Code: `1200`, Name: `Accounts Receivable`
   - Description: `Money owed by customers`

4. **Inventory** (Sub-type: current_asset)
   - Code: `1300`, Name: `Inventory`
   - Description: `Products for sale`

##### Fixed Assets (Type: asset, Sub-type: fixed_asset)
5. **Equipment** 
   - Code: `1500`, Name: `Office Equipment`
   - Description: `Computers, furniture, etc.`

##### Liabilities (Type: liability)
6. **Current Liabilities** (Sub-type: current_liability)
   - Code: `2000`, Name: `Current Liabilities`

7. **Accounts Payable** (Sub-type: current_liability)
   - Code: `2001`, Name: `Accounts Payable`, Parent: `Current Liabilities`
   - Description: `Money owed to suppliers`

8. **Sales Tax Payable** (Sub-type: current_liability)
   - Code: `2100`, Name: `Sales Tax Payable`
   - Description: `Tax collected from customers`

##### Equity (Type: equity)
9. **Owner's Equity** (Sub-type: owner_equity)
   - Code: `3000`, Name: `Owner's Equity`
   - Description: `Owner's investment in business`

10. **Retained Earnings** (Sub-type: retained_earnings)
    - Code: `3200`, Name: `Retained Earnings`
    - Description: `Accumulated profits`

##### Income (Type: income)
11. **Sales Revenue** (Sub-type: revenue)
    - Code: `4000`, Name: `Sales Revenue`
    - Description: `Revenue from product sales`

12. **Service Revenue** (Sub-type: revenue)
    - Code: `4100`, Name: `Service Revenue`
    - Description: `Revenue from services`

##### Expenses (Type: expense)
13. **Cost of Goods Sold** (Sub-type: cost_of_goods_sold)
    - Code: `5000`, Name: `Cost of Goods Sold`
    - Description: `Direct costs of products sold`

14. **Operating Expenses** (Sub-type: operating_expense)
    - Code: `6000`, Name: `Operating Expenses`

15. **Rent Expense** (Sub-type: operating_expense)
    - Code: `6001`, Name: `Rent Expense`, Parent: `Operating Expenses`
    - Description: `Monthly office rent`

16. **Utilities Expense** (Sub-type: operating_expense)
    - Code: `6002`, Name: `Utilities Expense`, Parent: `Operating Expenses`
    - Description: `Electricity, water, internet`

#### 2.2 Verify Account Creation
- **Check**: All accounts appear in the list
- **Check**: Account hierarchy is displayed correctly
- **Check**: Parent-child relationships work
- **Check**: Account filtering by type works

---

### Phase 3: Journal Entries Testing

#### 3.1 Create Basic Journal Entries
**Navigate to**: `http://localhost:3000/accounting/journal-entries`

##### Transaction 1: Initial Capital Investment
**Description**: Owner invests $10,000 cash into business
- **Debit**: Cash in Bank (1001) - $10,000
- **Credit**: Owner's Equity (3000) - $10,000
- **Reference**: INV-001

##### Transaction 2: Purchase Equipment
**Description**: Buy office equipment for $2,000 cash
- **Debit**: Office Equipment (1500) - $2,000
- **Credit**: Cash in Bank (1001) - $2,000
- **Reference**: EQ-001

##### Transaction 3: Make a Sale
**Description**: Sell products for $1,500 cash
- **Debit**: Cash in Bank (1001) - $1,500
- **Credit**: Sales Revenue (4000) - $1,500
- **Reference**: SAL-001

##### Transaction 4: Pay Rent
**Description**: Pay monthly rent $800
- **Debit**: Rent Expense (6001) - $800
- **Credit**: Cash in Bank (1001) - $800
- **Reference**: RENT-001

##### Transaction 5: Purchase on Credit
**Description**: Buy inventory $3,000 on credit
- **Debit**: Inventory (1300) - $3,000
- **Credit**: Accounts Payable (2001) - $3,000
- **Reference**: INV-002

#### 3.2 Verify Journal Entry Features
- **Check**: Journal entries are saved correctly
- **Check**: Debits = Credits validation works
- **Check**: Date entry and formatting
- **Check**: Reference numbering
- **Check**: Edit functionality
- **Check**: Delete functionality (if implemented)

---

### Phase 4: Ledger Verification

#### 4.1 Check Individual Account Ledgers
**Navigate to**: `http://localhost:3000/accounting/ledger`

**Verify each account shows correct transactions:**

##### Cash in Bank (1001) should show:
- Opening Balance: $0
- +$10,000 (Initial Capital)
- -$2,000 (Equipment Purchase)
- +$1,500 (Sales)
- -$800 (Rent)
- **Current Balance: $8,700**

##### Owner's Equity (3000) should show:
- Opening Balance: $0
- +$10,000 (Initial Capital)
- **Current Balance: $10,000**

##### Sales Revenue (4000) should show:
- Opening Balance: $0
- +$1,500 (Sales)
- **Current Balance: $1,500**

#### 4.2 Test Ledger Features
- **Check**: Account selection dropdown works
- **Check**: Transaction details display correctly
- **Check**: Running balance calculation
- **Check**: Date range filtering (if implemented)

---

### Phase 5: Trial Balance Testing

#### 5.1 Generate Trial Balance
**Navigate to**: `http://localhost:3000/accounting/trial-balance`

**Expected Trial Balance:**
```
TRIAL BALANCE
As of [Current Date]

Account                    Debit      Credit
----------------------------------------
Cash in Bank              $8,700        -
Office Equipment          $2,000        -
Inventory                 $3,000        -
Accounts Payable             -     $3,000
Owner's Equity               -    $10,000
Sales Revenue                -     $1,500
Rent Expense               $800        -
----------------------------------------
TOTALS                   $14,500   $14,500
```

#### 5.2 Verify Trial Balance
- **Check**: All accounts with balances are included
- **Check**: Debit and Credit columns are correct
- **Check**: Totals balance (Debits = Credits)
- **Check**: Zero balance accounts are excluded (optional)

---

### Phase 6: Financial Reports Testing

#### 6.1 Test Available Reports
**Navigate to**: `http://localhost:3000/accounting/financial-reports`

##### Income Statement
**Expected results for the period:**
- **Revenue**: $1,500 (Sales Revenue)
- **Expenses**: $800 (Rent Expense)
- **Net Income**: $700

##### Balance Sheet
**Expected results as of current date:**
- **Assets**:
  - Current Assets: $11,700 (Cash + Inventory)
  - Fixed Assets: $2,000 (Equipment)
  - **Total Assets**: $13,700

- **Liabilities**:
  - Current Liabilities: $3,000 (Accounts Payable)

- **Equity**:
  - Owner's Equity: $10,000
  - Retained Earnings: $700 (Net Income)
  - **Total Equity**: $10,700

- **Total Liabilities & Equity**: $13,700

#### 6.2 Verify Report Features
- **Check**: Reports generate without errors
- **Check**: Date range selection works
- **Check**: Print/Export functionality (if implemented)
- **Check**: Report formatting and layout

---

### Phase 7: Dashboard Testing

#### 7.1 Accounting Dashboard
**Navigate to**: `http://localhost:3000/accounting`

**Verify dashboard shows:**
- Quick access to all modules
- Recent transactions summary
- Key financial metrics
- Navigation links work correctly

#### 7.2 User-Specific Dashboards
**Test different user roles:**
- **Admin**: `http://localhost:3000/admin`
- **Accountant**: `http://localhost:3000/accountant`
- **General**: `http://localhost:3000/dashboard`

---

### Phase 8: Error Handling & Edge Cases

#### 8.1 Test Data Validation
1. **Try creating account without required fields**
2. **Try duplicate account codes**
3. **Try unbalanced journal entries**
4. **Try deleting accounts with transactions**
5. **Try accessing unauthorized pages**

#### 8.2 Test Performance
1. **Create 100+ accounts** (use bulk creation if available)
2. **Create 50+ journal entries**
3. **Test report generation with large datasets**
4. **Test search and filtering with many records**

---

### Phase 9: Integration Testing

#### 9.1 End-to-End Workflow
1. **Complete month of transactions** (20-30 entries)
2. **Generate monthly reports**
3. **Verify all balances tie together**
4. **Test month-end closing process** (if implemented)

#### 9.2 Multi-User Testing
1. **Multiple users creating entries simultaneously**
2. **Test concurrent access to same records**
3. **Verify user activity logging** (if implemented)

---

## Expected Results Summary

### After completing all tests, you should have:

1. **Chart of Accounts**: 16 accounts across all categories
2. **Journal Entries**: 5 sample transactions
3. **Trial Balance**: Balanced at $14,500
4. **Net Income**: $700
5. **Total Assets**: $13,700
6. **All modules**: Functioning without errors

---

## Common Issues to Watch For

1. **Authentication redirects** not working
2. **Role-based access** not enforcing properly
3. **Database connection** errors
4. **Validation errors** on form submissions
5. **Balance calculations** incorrect
6. **Report generation** failing
7. **UI responsiveness** issues on mobile

---

## Quick Test Commands

### API Testing (using browser console or Postman):

```javascript
// Test Chart of Accounts API
fetch('/api/accounting/chart-of-accounts')
  .then(r => r.json())
  .then(console.log);

// Test Journal Entries API
fetch('/api/accounting/journal-entries')
  .then(r => r.json())
  .then(console.log);

// Test Trial Balance API
fetch('/api/accounting/trial-balance')
  .then(r => r.json())
  .then(console.log);
```

---

## Success Criteria

✅ **All pages load without errors**  
✅ **Authentication works for all user types**  
✅ **Account creation and management functional**  
✅ **Journal entries save and calculate correctly**  
✅ **Trial balance shows balanced totals**  
✅ **Reports generate accurate data**  
✅ **Role-based permissions enforced**  
✅ **Database operations complete successfully**  

---

**Last Updated**: September 23, 2025  
**Version**: 1.0