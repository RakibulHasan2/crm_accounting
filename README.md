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

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, user management, system configuration |
| **Accountant** | Manage chart of accounts, journal entries, financial reports |
| **Sales** | Manage leads, opportunities, contacts, pipeline |
| **Manager** | View dashboards, approve invoices, review reports |
| **Auditor** | Read-only access to financial records and CRM history |

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication

### System
- `GET /api/health` - Health check and database status

### Upcoming Endpoints
- `GET /api/users` - List users (Admin only)
- `GET /api/accounts/chart` - Chart of accounts
- `POST /api/accounts/journal` - Create journal entry
- `GET /api/reports/ledger` - Ledger report
- `GET/POST /api/contacts` - Contact management
- `GET/POST /api/opportunities` - Opportunity management

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

## 🔍 Current Status

### ✅ Completed
- Next.js 15.5.3 setup with TypeScript
- MongoDB connection with Mongoose
- User authentication with NextAuth.js
- RBAC system with 5 user roles
- User registration API
- Health check endpoint
- Environment configuration
- Custom Tailwind design system

### 🚧 In Progress
- Authentication frontend pages
- Database models for accounting and CRM

### 📋 Next Steps
1. Create login/register UI components
2. Implement Chart of Accounts model
3. Build accounting dashboard
4. Add contact management system

---

**Built with ❤️ by Hotchpotch Digital Ltd**
