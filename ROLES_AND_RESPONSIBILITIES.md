# User Roles & Responsibilities Guide
## Hotchpotch Digital Ltd - CRM & Accounting System

---

## 🎯 **Role-Based Access Control (RBAC) Overview**

This system implements a comprehensive 5-tier role-based access control system designed for modern business operations. Each role has specific permissions and responsibilities tailored to their business function.

---

## 👥 **User Roles & Detailed Responsibilities**

### 1. 🔴 **ADMIN** - System Administrator
**Primary Function**: Complete system oversight and management

#### **Full Access & Responsibilities:**
- **System Administration**
  - User account creation, modification, and deactivation
  - Role assignment and permission management
  - System configuration and settings
  - Company-wide settings and financial year setup
  - Backup and restore operations

- **Complete Accounting Access**
  - All Chart of Accounts management
  - All Journal Entries (create, edit, post, reverse)
  - All Financial Reports generation
  - Trial Balance and General Ledger access
  - Audit trail monitoring

- **Complete CRM Access**
  - All contact and company management
  - All sales pipeline oversight
  - Opportunity management across all users
  - Sales performance monitoring

- **Reporting & Analytics**
  - System-wide reports generation
  - User activity monitoring
  - Performance dashboards
  - Compliance and audit reports

#### **Access Levels:**
- ✅ Admin Panel (exclusive access)
- ✅ All Accounting modules
- ✅ All CRM modules  
- ✅ All Reports
- ✅ User Management
- ✅ System Settings

---

### 2. 🟢 **ACCOUNTANT** - Financial Management Specialist
**Primary Function**: Complete financial record management and reporting

#### **Responsibilities:**
- **Financial Record Keeping**
  - Create and manage Chart of Accounts structure
  - Record all business transactions via Journal Entries
  - Ensure double-entry bookkeeping compliance
  - Monthly account reconciliation
  - Opening and closing balances management

- **Financial Reporting**
  - Generate Profit & Loss statements
  - Prepare Balance Sheets
  - Create Trial Balance reports
  - Monitor General Ledger accounts
  - Custom financial analysis

- **Compliance & Accuracy**
  - Ensure accounting standards compliance
  - Verify transaction accuracy
  - Maintain audit trails
  - VAT and tax calculation oversight
  - Period-end closing procedures

- **System Maintenance**
  - Account structure optimization
  - Journal entry templates creation
  - Financial report customization

#### **Access Levels:**
- ✅ Complete Accounting module access
- ✅ Financial Reports generation
- ✅ Limited CRM access (view customer financial data)
- ❌ User management
- ❌ System configuration

---

### 3. 🟠 **SALES** - Customer Relationship & Revenue Generation
**Primary Function**: Lead management and sales pipeline execution

#### **Responsibilities:**
- **Lead Management**
  - Create and qualify new leads
  - Convert prospects to customers
  - Maintain lead scoring and prioritization
  - Track lead sources and campaigns

- **Customer Relationship Management**
  - Manage contact information and communication
  - Schedule and track customer interactions
  - Maintain customer profiles and preferences
  - Handle customer inquiries and support

- **Sales Pipeline Management**
  - Create and manage sales opportunities
  - Track opportunity stages and probability
  - Forecast sales and revenue projections
  - Monitor sales targets and quotas

- **Activity Management**
  - Schedule follow-up activities
  - Log customer communications
  - Track meetings, calls, and emails
  - Maintain activity history

#### **Access Levels:**
- ✅ Complete CRM module access
- ✅ Customer-related financial reports
- ✅ Sales and revenue reports
- ❌ Full accounting access
- ❌ Financial statement generation
- ❌ User management

---

### 4. 🔵 **MANAGER** - Strategic Oversight & Decision Making
**Primary Function**: Cross-functional oversight and strategic decision support

#### **Responsibilities:**
- **Team Performance Monitoring**
  - Monitor sales team performance
  - Review accounting accuracy and timeliness
  - Oversee customer satisfaction metrics
  - Track departmental KPIs

- **Financial Oversight**
  - Review financial reports for decision making
  - Monitor budget vs actual performance
  - Approve large transactions or adjustments
  - Analyze profitability and cost centers

- **Strategic Planning**
  - Sales forecast analysis
  - Resource allocation decisions
  - Performance trend analysis
  - Business growth planning

- **Quality Assurance**
  - Review critical transactions before posting
  - Ensure compliance with company policies
  - Monitor data quality and integrity
  - Approve special requests or exceptions

#### **Access Levels:**
- ✅ View-only access to all financial reports
- ✅ Full CRM access for oversight
- ✅ Dashboard analytics and KPIs
- ✅ Team performance reports
- ❌ Direct financial transaction posting
- ❌ User management
- ❌ System configuration

---

### 5. 🟣 **AUDITOR** - Compliance & Verification Specialist
**Primary Function**: Independent verification and compliance monitoring

#### **Responsibilities:**
- **Financial Audit**
  - Review all financial transactions for accuracy
  - Verify accounting standard compliance
  - Trace audit trails and documentation
  - Identify discrepancies or irregularities

- **Compliance Monitoring**
  - Ensure regulatory compliance
  - Monitor internal control effectiveness
  - Review approval workflows
  - Verify authorization levels

- **Documentation & Reporting**
  - Generate audit reports and findings
  - Document control weaknesses
  - Track corrective action implementation
  - Maintain audit documentation

- **System Security Review**
  - Monitor user access and permissions
  - Review system logs and activities
  - Identify security risks or violations
  - Ensure data integrity

#### **Access Levels:**
- ✅ Read-only access to ALL financial data
- ✅ Read-only access to ALL CRM data
- ✅ Comprehensive audit reports
- ✅ System activity logs
- ✅ User activity monitoring
- ❌ Create, edit, or delete any records
- ❌ User management
- ❌ System configuration

---

## 🔐 **Permission Matrix**

| Feature/Function | Admin | Accountant | Sales | Manager | Auditor |
|------------------|-------|------------|-------|---------|---------|
| **User Management** | ✅ Full | ❌ None | ❌ None | ❌ None | ❌ None |
| **System Settings** | ✅ Full | ❌ None | ❌ None | ❌ None | ❌ None |
| **Chart of Accounts** | ✅ Full | ✅ Full | ❌ None | 👁️ View | 👁️ View |
| **Journal Entries** | ✅ Full | ✅ Full | ❌ None | 👁️ View | 👁️ View |
| **Financial Reports** | ✅ Full | ✅ Full | ⚠️ Limited | ✅ Full | 👁️ View |
| **Contact Management** | ✅ Full | ⚠️ Limited | ✅ Full | ✅ Full | 👁️ View |
| **Opportunity Management** | ✅ Full | ❌ None | ✅ Full | ✅ Full | 👁️ View |
| **Sales Pipeline** | ✅ Full | ❌ None | ✅ Full | ✅ Full | 👁️ View |
| **Activity Logging** | ✅ Full | ⚠️ Limited | ✅ Full | ✅ Full | 👁️ View |
| **Reports Generation** | ✅ All | ✅ Financial | ✅ Sales | ✅ All | 👁️ View |
| **Data Export** | ✅ All | ✅ Financial | ✅ Sales | ✅ All | ✅ Audit |

**Legend:**
- ✅ **Full**: Complete create, read, update, delete access
- 👁️ **View**: Read-only access
- ⚠️ **Limited**: Restricted access to relevant data only
- ❌ **None**: No access

---

## 🚦 **User Status & Activation**

### User Statuses:
- **ACTIVE**: Full access according to role permissions
- **PENDING**: Awaiting admin approval (default for most roles)
- **INACTIVE**: Temporarily suspended access

### Automatic Activation:
- **Accountants**: Auto-activated upon registration for immediate financial work
- **Other Roles**: Require admin approval for security

---

## 🎯 **Role-Based Workflows**

### **Daily Workflow Examples:**

#### **Accountant's Day:**
1. Review and post pending journal entries
2. Reconcile bank accounts
3. Generate daily cash flow report
4. Review trial balance for accuracy
5. Prepare monthly financial statements

#### **Sales Representative's Day:**
1. Follow up on pending opportunities
2. Log customer interactions
3. Update pipeline status
4. Schedule client meetings
5. Review sales performance metrics

#### **Manager's Day:**
1. Review team performance dashboards
2. Analyze financial performance reports
3. Monitor sales pipeline health
4. Approve large transactions
5. Strategic planning review

#### **Auditor's Day:**
1. Review recent transactions for compliance
2. Check authorization workflows
3. Generate audit trail reports
4. Monitor system access logs
5. Document findings and recommendations

---

## 🛡️ **Security & Compliance**

### **Access Control Measures:**
- Role-based menu visibility
- API endpoint protection
- Session-based authentication
- Audit logging for all actions
- Automatic session expiration

### **Data Protection:**
- Encrypted password storage
- Secure session management
- Role-based data filtering
- Activity monitoring
- Regular backup procedures

---

## 📞 **Support & Training**

### **Role-Specific Training Required:**
- **Admin**: System administration and user management
- **Accountant**: Accounting principles and financial reporting
- **Sales**: CRM best practices and sales processes
- **Manager**: Business analytics and performance monitoring
- **Auditor**: Compliance standards and audit procedures

### **Support Contacts:**
- **System Issues**: IT Administrator
- **Accounting Questions**: Senior Accountant
- **CRM Training**: Sales Manager
- **User Access**: System Administrator

---

**Built with ❤️ by Hotchpotch Digital Ltd**  
*Last Updated: September 2025*