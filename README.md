# Basic Accounts & CRM System

A comprehensive web-based accounting and customer relationship management system built for **Hotchpotch Digital Ltd**. This application combines core bookkeeping features with CRM capabilities, designed for small-to-medium business operations.

## 🚀 Features

### Authentication & Authorization
- ✅ Secure login with email and password
- ✅ Role-Based Access Control (RBAC)
- ✅ User roles: Admin, Accountant, Sales, Manager, Auditor
- ✅ JWT-based session management
- ✅ Password hashing with bcrypt

### Accounting Module (Planned)
- 📊 Chart of Accounts with hierarchical structure
- 📝 Journal Entries with balanced entry enforcement
- 📋 Sales/Purchase Vouchers & Invoices
- 📈 Ledger & Trial Balance
- 📊 Financial Statements (P&L, Balance Sheet)
- 🧾 VAT & Tax management
- 📊 Standard accounting reports
- 🔍 Audit trail for all financial records

### CRM Module (Planned)
- 👥 Contacts & Companies management
- 🎯 Leads & Opportunities tracking
- 📋 Activities & Tasks management
- 💬 Communication logging
- 🎯 Visual Pipeline (Kanban view)
- 📊 Sales reports and dashboards
- 📤 Import/Export functionality

### Administration (Planned)
- 👨‍💼 User management
- ⚙️ Company settings and financial year setup
- 🔧 System configuration
- 💾 Backup & restore options

## 🛠 Technology Stack

### Backend
- **Framework**: Next.js 15.5.3 with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with JWT
- **Security**: bcryptjs for password hashing

### Frontend
- **UI Framework**: React 19+ with Next.js App Router
- **Styling**: Tailwind CSS with custom design system
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

### Development Tools
- **Language**: TypeScript
- **Linting**: ESLint with Next.js configuration
- **Package Manager**: npm

## 📁 Project Structure

```
crm_accounting/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   │   ├── [...nextauth]/  # NextAuth.js configuration
│   │   │   │   └── register/  # User registration
│   │   │   └── health/        # Health check endpoint
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx          # Home page
│   ├── lib/                   # Utility libraries
│   │   ├── dbConnect.ts       # MongoDB connection
│   │   ├── config.ts          # Environment configuration
│   │   └── utils.ts           # Common utilities
│   ├── models/                # Database models
│   │   └── User.ts           # User model with RBAC
│   └── types/                 # TypeScript type definitions
│       └── next-auth.d.ts     # NextAuth type extensions
├── public/                    # Static assets
├── .env.local                 # Environment variables
├── .env.example              # Environment template
├── package.json              # Dependencies and scripts
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── next.config.ts            # Next.js configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crm_accounting
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/crm_accounting
   
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
   
   # Security
   JWT_SECRET=your-jwt-secret-key-change-this-in-production
   
   # Application Settings
   APP_NAME="Basic Accounts & CRM"
   COMPANY_NAME="Hotchpotch Digital Ltd"
   DEFAULT_CURRENCY=USD
   VAT_RATE=0.15
   ```

4. **Start MongoDB**
   - **Local MongoDB**: Start your local MongoDB service
   - **MongoDB Atlas**: Use the connection string from your Atlas cluster

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)
## 📋 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🔐 User Roles & Permissions

> **📋 For detailed role responsibilities and permissions, see [ROLES_AND_RESPONSIBILITIES.md](./ROLES_AND_RESPONSIBILITIES.md)**

### **Current Implementation Status** ✅

| Role | Status | Primary Function | Key Modules |
|------|--------|------------------|-------------|
| **🔴 Admin** | ✅ **Active** | System administration & oversight | User management, system config, all modules |
| **🟢 Accountant** | ✅ **Active** | Financial management & reporting | Chart of accounts, journal entries, financial reports |
| **🟠 Sales** | 🚧 **Planned** | Lead & customer management | CRM, contacts, opportunities, pipeline |
| **🔵 Manager** | ⚠️ **Partial** | Strategic oversight & analytics | Reports, dashboards, performance monitoring |
| **🟣 Auditor** | ⚠️ **Partial** | Compliance & verification | Read-only access, audit trails, compliance reports |

### **Implemented Features by Role:**

#### **✅ Admin (Fully Implemented)**
- Complete user management system
- System configuration and settings
- Full access to all accounting modules
- Admin dashboard with analytics
- User activity monitoring

#### **✅ Accountant (Fully Implemented)**
- Chart of Accounts management
- Journal Entries with double-entry validation
- General Ledger with running balances
- Trial Balance verification
- Financial Reports (P&L, Balance Sheet)
- Accountant-specific dashboard

#### **🚧 Sales (Planned for Next Phase)**
- Contact and company management
- Lead qualification and tracking
- Sales pipeline management
- Opportunity management
- Activity logging and follow-up

#### **⚠️ Manager (Partially Implemented)**
- View access to financial reports
- Dashboard analytics (limited)
- Performance monitoring (basic)

#### **⚠️ Auditor (Partially Implemented)**
- Read-only access to financial data
- Basic audit trail access
- Compliance reporting (limited)
| **Manager** | View dashboards, approve invoices, review reports |
| **Auditor** | Read-only access to financial records and CRM history |

## 🌐 API Endpoints

### **✅ Implemented & Active**

#### Authentication
- `POST /api/auth/register` - User registration with role-based activation
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication system

#### System Health
- `GET /api/health` - Health check and database connectivity status

#### Accounting Module
- `GET /api/accounting/chart-of-accounts` - Retrieve chart of accounts
- `POST /api/accounting/chart-of-accounts` - Create new account
- `PUT /api/accounting/chart-of-accounts/[id]` - Update account
- `DELETE /api/accounting/chart-of-accounts/[id]` - Delete account

- `GET /api/accounting/journal-entries` - List journal entries with pagination
- `POST /api/accounting/journal-entries` - Create new journal entry
- `GET /api/accounting/journal-entries/[id]` - Get specific journal entry
- `PUT /api/accounting/journal-entries/[id]` - Update journal entry
- `DELETE /api/accounting/journal-entries/[id]` - Delete journal entry
- `POST /api/accounting/journal-entries/[id]/post` - Post journal entry

- `GET /api/accounting/ledger` - General ledger with account filtering
- `GET /api/accounting/trial-balance` - Trial balance report
- `GET /api/accounting/financial-reports` - P&L and Balance Sheet reports
- `GET /api/accounting/dashboard` - Accountant dashboard statistics

#### Admin Module
- `GET /api/admin/dashboard` - Admin dashboard with system stats
- `GET /api/admin/users` - User management (list, create, update)
- `GET /api/admin/settings` - System configuration

### **🚧 Planned for Future Releases**

#### CRM Module (Coming Soon)
- `GET/POST /api/crm/contacts` - Contact management
- `GET/POST /api/crm/companies` - Company management  
- `GET/POST /api/crm/opportunities` - Opportunity tracking
- `GET/POST /api/crm/activities` - Activity logging

#### Advanced Features (Roadmap)
- `GET /api/reports/advanced` - Advanced analytics
- `POST /api/data/import` - Data import functionality
- `GET /api/audit/trail` - Comprehensive audit logging

## 🔒 Security Features

- **Password Security**: bcrypt hashing with salt rounds
- **Session Management**: JWT tokens with configurable expiration
- **Role-Based Access**: Strict permission controls on all endpoints
- **Input Validation**: Comprehensive validation using Zod schemas
- **CORS Configuration**: Proper cross-origin request handling
- **Environment Variables**: Sensitive data stored securely

## 📊 Database Schema

### User Model
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  password: string (hashed),
  role: 'admin' | 'accountant' | 'sales' | 'manager' | 'auditor',
  status: 'active' | 'inactive' | 'pending',
  lastLogin?: Date,
  avatar?: string,
  phone?: string,
  department?: string,
  createdAt: Date,
  updatedAt: Date,
  createdBy?: ObjectId,
  updatedBy?: ObjectId
}
```

## 🔍 Current Implementation Status

### ✅ **Fully Completed & Production Ready**
- **🏗️ Core Infrastructure**
  - Next.js 15.5.3 with TypeScript and App Router
  - MongoDB with Mongoose ODM
  - NextAuth.js authentication with JWT sessions
  - Complete RBAC system with 5 user roles
  - TailwindCSS design system with responsive UI

- **👥 User Management System**
  - User registration with role-based auto-activation
  - Secure authentication with bcrypt password hashing
  - Role-based access control throughout application
  - User status management (active/pending/inactive)

- **📊 Complete Accounting System**
  - Chart of Accounts with hierarchical structure
  - Journal Entries with double-entry validation
  - General Ledger with running balances
  - Trial Balance with real-time verification
  - Financial Reports (P&L, Balance Sheet)
  - Professional accountant dashboard

- **🔐 Admin Panel**
  - Complete user management interface
  - System configuration and settings
  - Admin-specific dashboard with analytics
  - User activity monitoring

- **📈 Reports System**
  - Role-based report access
  - Financial report generation
  - Professional report formatting
  - Export capabilities

### � **Planned for Next Phase**
- **CRM Module**: Contact management, lead tracking, sales pipeline
- **Sales Module**: Opportunity management, revenue forecasting
- **Enhanced Auditing**: Comprehensive audit trails and compliance reports
- **Advanced Analytics**: Business intelligence dashboards

### 🎯 **Ready for Production Use**
The accounting system is **fully functional** and ready for real-world use by software development firms and small-to-medium businesses. All core accounting features are implemented with proper validation, security, and role-based access control.

---

**Built with ❤️ by Hotchpotch Digital Ltd**  
*Comprehensive business management solution for the modern enterprise*
