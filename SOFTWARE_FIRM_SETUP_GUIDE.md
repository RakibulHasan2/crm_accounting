# Software Firm Accounting Setup Guide
## Hotchpotch Digital Ltd - Quick Start Examples

---

## Initial Chart of Accounts Setup

Run this script to set up a complete chart of accounts for a software development firm:

### 1. Create Basic Account Structure

Navigate to **Chart of Accounts** and create these accounts:

#### Assets (1000-1999)
```
1001 - Cash - Business Checking
1002 - Cash - PayPal Account  
1003 - Cash - Stripe Account
1010 - Accounts Receivable
1020 - Prepaid Software Licenses
1030 - Prepaid Insurance
1040 - Security Deposits
1100 - Computer Equipment
1110 - Office Equipment
1120 - Furniture & Fixtures
1130 - Accumulated Depreciation - Equipment
```

#### Liabilities (2000-2999)
```
2001 - Accounts Payable
2010 - Accrued Payroll
2020 - Payroll Tax Payable
2030 - Sales Tax Payable
2040 - Income Tax Payable
2050 - Credit Card Payable
2100 - Equipment Loan
2110 - Line of Credit
```

#### Equity (3000-3999)
```
3001 - Owner's Capital
3010 - Retained Earnings
3020 - Owner's Draws
```

#### Revenue (4000-4999)
```
4001 - Custom Software Development
4002 - Web Development
4003 - Mobile App Development
4004 - Consulting Services
4005 - Technical Support & Maintenance
4006 - Training Services
4007 - Software Licensing Revenue
4008 - Hosting Services
```

#### Expenses (5000-5999)
```
5001 - Direct Labor - Development
5002 - Subcontractor Costs
5003 - Software Licenses & Subscriptions
5100 - Salaries & Wages
5110 - Employee Benefits
5120 - Payroll Taxes
5130 - Workers Compensation
5140 - Office Rent
5150 - Utilities
5160 - Internet & Phone
5170 - Professional Services
5180 - Legal & Accounting
5190 - Insurance
5200 - Marketing & Advertising
5210 - Travel & Entertainment
5220 - Office Supplies
5230 - Depreciation Expense
5240 - Bad Debt Expense
5250 - Bank Fees
5260 - Equipment Maintenance
5270 - Professional Development
```

---

## Sample Opening Balances Entry

### Opening Balance Journal Entry (January 1, 2024)
```
Journal Entry #: JE-2024-001
Date: January 1, 2024
Description: Opening Balances for Hotchpotch Digital Ltd

Dr. Cash - Business Checking (1001)        $25,000.00
Dr. Computer Equipment (1100)               $15,000.00
Dr. Office Equipment (1110)                  $5,000.00
    Cr. Owner's Capital (3001)                          $45,000.00

Total Debits: $45,000.00
Total Credits: $45,000.00
```

---

## Monthly Transaction Examples

### Week 1: Project Initiation

#### 1. Signed New Development Contract
```
Date: January 3, 2024
Description: Web Application Development - TechStart Inc
Reference: CONTRACT-2024-001

Dr. Accounts Receivable (1010)             $50,000.00
    Cr. Custom Software Development (4001)             $50,000.00
```

#### 2. Purchased Development Software Licenses
```
Date: January 3, 2024
Description: Annual Adobe Creative Suite License
Reference: INV-ADOBE-2024

Dr. Software Licenses & Subscriptions (5003) $2,400.00
    Cr. Cash - Business Checking (1001)                 $2,400.00
```

### Week 2: Operations

#### 3. Paid Freelance Developer
```
Date: January 8, 2024
Description: Frontend Development - John Smith
Reference: INV-JS-001

Dr. Subcontractor Costs (5002)              $3,500.00
    Cr. Cash - Business Checking (1001)                 $3,500.00
```

#### 4. Office Rent Payment
```
Date: January 10, 2024
Description: January Office Rent
Reference: LEASE-JAN-2024

Dr. Office Rent (5140)                      $3,000.00
    Cr. Cash - Business Checking (1001)                 $3,000.00
```

### Week 3: Revenue & Expenses

#### 5. Received Client Payment
```
Date: January 15, 2024
Description: Payment from TechStart Inc - Milestone 1
Reference: PAY-TECHSTART-001

Dr. Cash - Business Checking (1001)        $20,000.00
    Cr. Accounts Receivable (1010)                     $20,000.00
```

#### 6. Monthly Payroll
```
Date: January 15, 2024
Description: Bi-weekly Payroll - Development Team
Reference: PAYROLL-012024-1

Dr. Salaries & Wages (5100)               $12,000.00
Dr. Payroll Taxes (5120)                   $1,800.00
    Cr. Cash - Business Checking (1001)                $13,800.00
```

### Week 4: Monthly Closing

#### 7. Utility Bills
```
Date: January 25, 2024
Description: Monthly Utilities
Reference: UTIL-JAN-2024

Dr. Utilities (5150)                          $450.00
    Cr. Cash - Business Checking (1001)                   $450.00
```

#### 8. Professional Services
```
Date: January 30, 2024
Description: Monthly Accounting Services
Reference: INV-CPA-001

Dr. Legal & Accounting (5180)               $1,200.00
    Cr. Accounts Payable (2001)                         $1,200.00
```

#### 9. Equipment Depreciation
```
Date: January 31, 2024
Description: Monthly Depreciation - Computer Equipment
Reference: DEP-JAN-2024

Dr. Depreciation Expense (5230)               $625.00
    Cr. Accumulated Depreciation - Equipment (1130)       $625.00
```

---

## End-of-Month Reporting

### Generate These Reports:
1. **Trial Balance** (as of January 31, 2024)
2. **Profit & Loss Statement** (January 1-31, 2024)
3. **Balance Sheet** (as of January 31, 2024)

### Expected Results:

#### Trial Balance Summary
```
Total Debits: $89,575.00
Total Credits: $89,575.00
Status: ✓ Balanced
```

#### P&L Summary (January)
```
Total Revenue: $50,000.00
Total Expenses: $24,975.00
Net Income: $25,025.00
Profit Margin: 50%
```

#### Key Ratios for Software Firms
- **Labor Cost %**: Should be 40-60% of revenue
- **Technology Expense %**: Should be 5-10% of revenue
- **Overhead %**: Should be 15-25% of revenue
- **Net Margin %**: Target 20-40% for software services

---

## Quarterly Tasks

### Every 3 Months:
1. **Backup Accounting Data**
2. **Review Chart of Accounts** - Add new accounts as needed
3. **Analyze Financial Trends** - Compare to previous quarters
4. **Tax Preparation** - Gather documents for accountant
5. **Budget Review** - Adjust forecasts based on actual performance

### Key Performance Indicators (KPIs)
- **Monthly Recurring Revenue (MRR)**
- **Customer Acquisition Cost (CAC)**
- **Average Project Value**
- **Utilization Rate** (billable hours / total hours)
- **Cash Flow Cycle** (days from project start to payment)

---

## Common Software Firm Scenarios

### Scenario 1: Retainer Agreement
```
Monthly Retainer: $5,000
Journal Entry (Monthly):
Dr. Cash - Business Checking               $5,000.00
    Cr. Technical Support & Maintenance (4005)         $5,000.00
```

### Scenario 2: Equity Investment
```
Angel Investment: $100,000
Journal Entry:
Dr. Cash - Business Checking             $100,000.00
    Cr. Owner's Capital (3001)                        $100,000.00
```

### Scenario 3: Equipment Financing
```
New Server Purchase with Loan: $10,000
Journal Entry:
Dr. Computer Equipment (1100)             $10,000.00
    Cr. Equipment Loan (2100)                         $10,000.00
```

### Scenario 4: Bad Debt Write-off
```
Uncollectible Invoice: $2,500
Journal Entry:
Dr. Bad Debt Expense (5240)                $2,500.00
    Cr. Accounts Receivable (1010)                     $2,500.00
```

---

## Tips for Software Development Firms

### Revenue Recognition Best Practices:
1. **Milestone-based**: Record revenue when deliverables are completed
2. **Time & Materials**: Record revenue as work is performed
3. **Fixed Price**: Use percentage of completion method for long projects
4. **Retainers**: Record as deferred revenue until services are performed

### Expense Management:
1. **Track Project Costs**: Use project codes for direct cost allocation
2. **Software Subscriptions**: Monitor and review annual renewals
3. **Equipment Depreciation**: Follow 3-year schedule for computers
4. **Professional Development**: Budget 5-10% of salary costs for training

### Cash Flow Management:
1. **Invoice Promptly**: Bill clients immediately upon milestone completion
2. **Payment Terms**: Net 15 or Net 30 maximum
3. **Deposit Requirements**: Request 25-50% upfront for new projects
4. **Expense Timing**: Align major purchases with revenue cycles

---

## Support Resources

### Quick Reference Links:
- **Chart of Accounts**: `/accounting/chart-of-accounts`
- **Journal Entries**: `/accounting/journal-entries`
- **General Ledger**: `/accounting/ledger`
- **Trial Balance**: `/accounting/trial-balance`
- **Financial Reports**: `/accounting/financial-reports`

### Training Resources:
1. **Double-Entry Bookkeeping Basics**
2. **Software Industry Accounting Standards**
3. **Financial Statement Analysis**
4. **Tax Planning for Software Companies**

---

*For additional support or custom chart of accounts setup, contact our accounting team at support@hotchpotchdigital.com*