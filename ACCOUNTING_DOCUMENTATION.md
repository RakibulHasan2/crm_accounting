 # Accounting Module Documentation
## Hotchpotch Digital Ltd - CRM & Accounting System

---

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [User Roles & Permissions](#user-roles--permissions)
5. [Chart of Accounts](#chart-of-accounts)
6. [Journal Entries](#journal-entries)
7. [General Ledger](#general-ledger)
8. [Trial Balance](#trial-balance)
9. [Financial Reports](#financial-reports)
10. [Software Firm Examples](#software-firm-examples)
11. [API Reference](#api-reference)
12. [Getting Started](#getting-started)

---

## Overview

The Accounting Module is a comprehensive double-entry bookkeeping system designed for small to medium-sized businesses, with specific optimizations for software development firms like Hotchpotch Digital Ltd.

### Key Features
- **Double-Entry Bookkeeping**: All transactions maintain accounting equation balance
- **Real-time Financial Reporting**: Live P&L, Balance Sheet, and Trial Balance
- **Role-Based Access Control**: Secure access based on user roles
- **Chart of Accounts Management**: Flexible account structure setup
- **Journal Entry System**: Complete transaction recording with validation
- **General Ledger**: Account-wise transaction history with running balances
- **Financial Reports**: Professional-grade P&L and Balance Sheet reports

---

## Architecture

### Technology Stack
- **Frontend**: Next.js 15.5.3 with TypeScript and Tailwind CSS
- **Backend**: Next.js API Routes with MongoDB
- **Authentication**: NextAuth.js with JWT tokens
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Real-time double-entry validation

### Database Models
1. **ChartOfAccounts**: Account structure and configuration
2. **JournalEntry**: Transaction recording with entries array
3. **User**: User management with role-based permissions

---

## Features

### 1. Chart of Accounts
- **Purpose**: Define the structure of your accounting system
- **Account Types**: Asset, Liability, Equity, Revenue, Expense
- **Features**:
  - Hierarchical account structure
  - Account code management
  - Balance tracking
  - Account type filtering
  - Search and sort functionality

### 2. Journal Entries
- **Purpose**: Record all business transactions
- **Features**:
  - Double-entry validation (debits = credits)
  - Multiple entry lines per transaction
  - Status management (draft, posted)
  - Reference number tracking
  - Date-based organization

### 3. General Ledger
- **Purpose**: View account-wise transaction history
- **Features**:
  - Running balance calculation
  - Date range filtering
  - Transaction search
  - Account selection
  - Export capabilities

### 4. Trial Balance
- **Purpose**: Verify accounting equation balance
- **Features**:
  - Real-time balance verification
  - Account type filtering
  - As-of date reporting
  - Balance validation
  - Professional formatting

### 5. Financial Reports
- **Purpose**: Generate standard financial statements
- **Reports Available**:
  - Profit & Loss Statement
  - Balance Sheet
  - Cash Flow Statement (coming soon)

---

## User Roles & Permissions

### Admin
- Full system access
- User management
- System configuration
- All accounting features

### Accountant
- Complete accounting module access
- Journal entry creation and posting
- Financial report generation
- Chart of accounts management

### Manager
- View-only access to financial reports
- Dashboard analytics
- Budget vs actual reporting

### Auditor
- Read-only access to all accounting data
- Report generation
- Data export capabilities

### Sales
- Limited access to customer-related financial data
- Revenue reports
- Commission tracking

---

## Chart of Accounts

### Account Structure
The system uses a 4-digit account coding system:

#### Assets (1000-1999)
- **1000-1099**: Current Assets
  - 1001: Cash - Checking Account
  - 1002: Cash - Savings Account
  - 1010: Accounts Receivable
  - 1020: Inventory
  - 1030: Prepaid Expenses

- **1100-1199**: Fixed Assets
  - 1100: Computer Equipment
  - 1110: Office Equipment
  - 1120: Furniture & Fixtures
  - 1130: Accumulated Depreciation

#### Liabilities (2000-2999)
- **2000-2099**: Current Liabilities
  - 2001: Accounts Payable
  - 2010: Accrued Expenses
  - 2020: Short-term Loans
  - 2030: Sales Tax Payable

- **2100-2199**: Long-term Liabilities
  - 2100: Long-term Debt
  - 2110: Equipment Loans

#### Equity (3000-3999)
- 3001: Owner's Equity
- 3010: Retained Earnings
- 3020: Current Year Earnings

#### Revenue (4000-4999)
- 4001: Software Development Revenue
- 4002: Consulting Revenue
- 4003: Maintenance & Support Revenue
- 4004: Training Revenue
- 4005: Other Revenue

#### Expenses (5000-5999)
- **5000-5099**: Cost of Goods Sold
  - 5001: Direct Labor
  - 5002: Subcontractor Costs
  - 5003: Software Licenses

- **5100-5199**: Operating Expenses
  - 5100: Salaries & Wages
  - 5110: Employee Benefits
  - 5120: Office Rent
  - 5130: Utilities
  - 5140: Internet & Telecommunications
  - 5150: Professional Services
  - 5160: Marketing & Advertising
  - 5170: Travel & Entertainment
  - 5180: Office Supplies
  - 5190: Depreciation Expense

---

## Journal Entries

### Transaction Types for Software Firms

#### 1. Revenue Recognition
```
Date: 2024-01-15
Description: Software Development Project - Client ABC
Reference: INV-2024-001

Dr. Accounts Receivable (1010)     $10,000.00
    Cr. Software Development Revenue (4001)     $10,000.00
```

#### 2. Expense Recording
```
Date: 2024-01-15
Description: Monthly Office Rent
Reference: RENT-JAN-2024

Dr. Office Rent (5120)             $2,500.00
    Cr. Cash - Checking Account (1001)          $2,500.00
```

#### 3. Equipment Purchase
```
Date: 2024-01-10
Description: New Development Workstation
Reference: INV-TECH-001

Dr. Computer Equipment (1100)      $3,500.00
    Cr. Cash - Checking Account (1001)          $3,500.00
```

#### 4. Employee Payroll
```
Date: 2024-01-31
Description: January Payroll
Reference: PAYROLL-JAN-2024

Dr. Salaries & Wages (5100)        $15,000.00
Dr. Employee Benefits (5110)       $2,250.00
    Cr. Cash - Checking Account (1001)          $17,250.00
```

---

## General Ledger

### Features
- **Account Selection**: Choose any account from the chart of accounts
- **Date Filtering**: View transactions for specific date ranges
- **Running Balance**: Real-time balance calculation
- **Transaction History**: Complete audit trail
- **Search Functionality**: Find specific transactions

### Sample Ledger View (Cash - Checking Account)
```
Date        Journal#    Description                    Debit      Credit     Balance
2024-01-01  JE-001     Opening Balance                           $25,000.00  $25,000.00
2024-01-10  JE-002     Computer Equipment                        $3,500.00   $21,500.00
2024-01-15  JE-003     Client Payment - ABC Corp     $10,000.00             $31,500.00
2024-01-31  JE-004     January Payroll                           $17,250.00  $14,250.00
```

---

## Trial Balance

### Purpose
Verify that total debits equal total credits across all accounts.

### Sample Trial Balance (January 31, 2024)
```
Account Code    Account Name                    Debit      Credit
1001           Cash - Checking Account      $14,250.00
1010           Accounts Receivable           $5,000.00
1100           Computer Equipment            $3,500.00
2001           Accounts Payable                         $2,000.00
3001           Owner's Equity                           $15,000.00
4001           Software Development Revenue             $10,000.00
5100           Salaries & Wages             $15,000.00
5110           Employee Benefits             $2,250.00

TOTALS                                      $40,000.00  $40,000.00
```

---

## Financial Reports

### Profit & Loss Statement
Shows revenue and expenses for a specific period.

#### Sample P&L (January 2024)
```
HOTCHPOTCH DIGITAL LTD
Profit & Loss Statement
For the Month Ended January 31, 2024

REVENUE
Software Development Revenue              $10,000.00
Consulting Revenue                         $3,000.00
Total Revenue                            $13,000.00

EXPENSES
Salaries & Wages                         $15,000.00
Employee Benefits                         $2,250.00
Office Rent                               $2,500.00
Utilities                                   $300.00
Total Expenses                           $20,050.00

NET INCOME (LOSS)                        ($7,050.00)
```

### Balance Sheet
Shows financial position at a specific date.

#### Sample Balance Sheet (January 31, 2024)
```
HOTCHPOTCH DIGITAL LTD
Balance Sheet
As of January 31, 2024

ASSETS
Current Assets:
  Cash - Checking Account                 $14,250.00
  Accounts Receivable                      $5,000.00
  Total Current Assets                    $19,250.00

Fixed Assets:
  Computer Equipment                       $3,500.00
  Total Fixed Assets                       $3,500.00

TOTAL ASSETS                             $22,750.00

LIABILITIES & EQUITY
Current Liabilities:
  Accounts Payable                         $2,000.00
  Total Current Liabilities                $2,000.00

Equity:
  Owner's Equity                          $15,000.00
  Retained Earnings                        $7,050.00
  Total Equity                            $22,050.00

TOTAL LIABILITIES & EQUITY               $24,050.00
```

---

## Software Firm Examples

### Common Transactions

#### 1. Project Revenue Recognition
```
Scenario: Completed a $25,000 web application project
Entry:
Dr. Accounts Receivable               $25,000.00
    Cr. Software Development Revenue              $25,000.00
```

#### 2. Subscription Software Licensing
```
Scenario: Annual software license expense
Entry:
Dr. Software Licenses (5003)          $1,200.00
    Cr. Cash - Checking Account                   $1,200.00
```

#### 3. Freelancer Payment
```
Scenario: Paid freelance developer
Entry:
Dr. Subcontractor Costs (5002)        $3,000.00
    Cr. Cash - Checking Account                   $3,000.00
```

#### 4. Equipment Depreciation
```
Scenario: Monthly depreciation on computers
Entry:
Dr. Depreciation Expense (5190)         $500.00
    Cr. Accumulated Depreciation (1130)            $500.00
```

### Typical Account Balances for Software Firms

#### Month-End Snapshot
- **Cash**: $10,000 - $50,000 (depending on project cycles)
- **Accounts Receivable**: 30-60 days of revenue
- **Equipment**: $5,000 - $25,000 (computers, servers)
- **Revenue**: Variable based on project completion
- **Salaries**: Largest expense category (60-70% of revenue)

---

## API Reference

### Authentication
All API endpoints require authentication via NextAuth.js session.

### Endpoints

#### Chart of Accounts
```
GET /api/accounting/chart-of-accounts
POST /api/accounting/chart-of-accounts
PUT /api/accounting/chart-of-accounts/[id]
DELETE /api/accounting/chart-of-accounts/[id]
```

#### Journal Entries
```
GET /api/accounting/journal-entries
POST /api/accounting/journal-entries
PUT /api/accounting/journal-entries/[id]
DELETE /api/accounting/journal-entries/[id]
POST /api/accounting/journal-entries/[id]/post
```

#### General Ledger
```
GET /api/accounting/ledger?accountId={id}&dateFrom={date}&dateTo={date}
```

#### Trial Balance
```
GET /api/accounting/trial-balance?asOfDate={date}&accountType={type}
```

#### Financial Reports
```
GET /api/accounting/financial-reports?reportType={type}&dateFrom={date}&dateTo={date}
```

---

## Getting Started

### 1. Initial Setup
1. Access the system as an admin user
2. Create your chart of accounts structure
3. Set up opening balances

### 2. Daily Operations
1. Record journal entries for all transactions
2. Review and post entries
3. Monitor account balances

### 3. Monthly Reporting
1. Generate trial balance
2. Review profit & loss statement
3. Prepare balance sheet
4. Analyze financial performance

### 4. Best Practices
- Record transactions daily
- Reconcile accounts monthly
- Backup data regularly
- Review financial reports weekly
- Maintain proper documentation

---

## Support & Maintenance

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- User account with appropriate permissions

### Data Backup
- Automatic database backups
- Monthly export recommendations
- Cloud storage integration

### Updates & Maintenance
- Regular system updates
- Security patches
- Feature enhancements
- User training sessions

---

## Contact Information

**Hotchpotch Digital Ltd**
- Website: https://hotchpotchdigital.com
- Email: support@hotchpotchdigital.com
- Phone: +1 (555) 123-4567

**Development Team**
- Lead Developer: [Name]
- Project Manager: [Name]
- Support Team: [Email]

---

*This documentation is current as of January 2024. For the latest updates and feature additions, please refer to the system changelog.*