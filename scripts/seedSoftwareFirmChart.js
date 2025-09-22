// Sample Chart of Accounts for Software Development Firm
// Run this script to populate the chart of accounts with typical software firm accounts

const mongoose = require('mongoose');

// MongoDB connection (update with your connection string)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm_accounting';

// Chart of Accounts Schema
const chartOfAccountsSchema = new mongoose.Schema({
  accountCode: { type: String, required: true, unique: true },
  accountName: { type: String, required: true },
  accountType: { 
    type: String, 
    required: true,
    enum: ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense']
  },
  description: String,
  isActive: { type: Boolean, default: true },
  parentAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'ChartOfAccounts' },
  currentBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ChartOfAccounts = mongoose.model('ChartOfAccounts', chartOfAccountsSchema);

// Sample accounts for a software development firm
const sampleAccounts = [
  // ASSETS (1000-1999)
  { accountCode: '1001', accountName: 'Cash - Business Checking', accountType: 'Asset', description: 'Primary business checking account' },
  { accountCode: '1002', accountName: 'Cash - PayPal Account', accountType: 'Asset', description: 'PayPal business account for online payments' },
  { accountCode: '1003', accountName: 'Cash - Stripe Account', accountType: 'Asset', description: 'Stripe account for credit card processing' },
  { accountCode: '1010', accountName: 'Accounts Receivable', accountType: 'Asset', description: 'Money owed by customers for services provided' },
  { accountCode: '1020', accountName: 'Prepaid Software Licenses', accountType: 'Asset', description: 'Software licenses paid in advance' },
  { accountCode: '1030', accountName: 'Prepaid Insurance', accountType: 'Asset', description: 'Insurance premiums paid in advance' },
  { accountCode: '1040', accountName: 'Security Deposits', accountType: 'Asset', description: 'Deposits paid for office space and utilities' },
  { accountCode: '1100', accountName: 'Computer Equipment', accountType: 'Asset', description: 'Computers, servers, and related hardware' },
  { accountCode: '1110', accountName: 'Office Equipment', accountType: 'Asset', description: 'Printers, phones, and office hardware' },
  { accountCode: '1120', accountName: 'Furniture & Fixtures', accountType: 'Asset', description: 'Office furniture and fixtures' },
  { accountCode: '1130', accountName: 'Accumulated Depreciation - Equipment', accountType: 'Asset', description: 'Accumulated depreciation on equipment' },

  // LIABILITIES (2000-2999)
  { accountCode: '2001', accountName: 'Accounts Payable', accountType: 'Liability', description: 'Money owed to vendors and suppliers' },
  { accountCode: '2010', accountName: 'Accrued Payroll', accountType: 'Liability', description: 'Payroll expenses not yet paid' },
  { accountCode: '2020', accountName: 'Payroll Tax Payable', accountType: 'Liability', description: 'Payroll taxes owed to government' },
  { accountCode: '2030', accountName: 'Sales Tax Payable', accountType: 'Liability', description: 'Sales tax collected but not yet remitted' },
  { accountCode: '2040', accountName: 'Income Tax Payable', accountType: 'Liability', description: 'Income taxes owed' },
  { accountCode: '2050', accountName: 'Credit Card Payable', accountType: 'Liability', description: 'Business credit card balances' },
  { accountCode: '2100', accountName: 'Equipment Loan', accountType: 'Liability', description: 'Loans for equipment purchases' },
  { accountCode: '2110', accountName: 'Line of Credit', accountType: 'Liability', description: 'Business line of credit' },

  // EQUITY (3000-3999)
  { accountCode: '3001', accountName: 'Owner\'s Capital', accountType: 'Equity', description: 'Owner\'s investment in the business' },
  { accountCode: '3010', accountName: 'Retained Earnings', accountType: 'Equity', description: 'Accumulated profits retained in business' },
  { accountCode: '3020', accountName: 'Owner\'s Draws', accountType: 'Equity', description: 'Owner withdrawals from business' },

  // REVENUE (4000-4999)
  { accountCode: '4001', accountName: 'Custom Software Development', accountType: 'Revenue', description: 'Revenue from custom software projects' },
  { accountCode: '4002', accountName: 'Web Development', accountType: 'Revenue', description: 'Revenue from web development services' },
  { accountCode: '4003', accountName: 'Mobile App Development', accountType: 'Revenue', description: 'Revenue from mobile application development' },
  { accountCode: '4004', accountName: 'Consulting Services', accountType: 'Revenue', description: 'Revenue from technical consulting' },
  { accountCode: '4005', accountName: 'Technical Support & Maintenance', accountType: 'Revenue', description: 'Revenue from ongoing support and maintenance' },
  { accountCode: '4006', accountName: 'Training Services', accountType: 'Revenue', description: 'Revenue from training and education services' },
  { accountCode: '4007', accountName: 'Software Licensing Revenue', accountType: 'Revenue', description: 'Revenue from software license sales' },
  { accountCode: '4008', accountName: 'Hosting Services', accountType: 'Revenue', description: 'Revenue from hosting and cloud services' },

  // EXPENSES (5000-5999)
  // Cost of Goods Sold
  { accountCode: '5001', accountName: 'Direct Labor - Development', accountType: 'Expense', description: 'Direct labor costs for development projects' },
  { accountCode: '5002', accountName: 'Subcontractor Costs', accountType: 'Expense', description: 'Costs for freelancers and subcontractors' },
  { accountCode: '5003', accountName: 'Software Licenses & Subscriptions', accountType: 'Expense', description: 'Software tools and subscriptions for development' },

  // Operating Expenses
  { accountCode: '5100', accountName: 'Salaries & Wages', accountType: 'Expense', description: 'Employee salaries and wages' },
  { accountCode: '5110', accountName: 'Employee Benefits', accountType: 'Expense', description: 'Health insurance, retirement, and other benefits' },
  { accountCode: '5120', accountName: 'Payroll Taxes', accountType: 'Expense', description: 'Employer portion of payroll taxes' },
  { accountCode: '5130', accountName: 'Workers Compensation', accountType: 'Expense', description: 'Workers compensation insurance' },
  { accountCode: '5140', accountName: 'Office Rent', accountType: 'Expense', description: 'Monthly office rent expense' },
  { accountCode: '5150', accountName: 'Utilities', accountType: 'Expense', description: 'Electricity, water, gas, and other utilities' },
  { accountCode: '5160', accountName: 'Internet & Phone', accountType: 'Expense', description: 'Internet and telecommunication services' },
  { accountCode: '5170', accountName: 'Professional Services', accountType: 'Expense', description: 'External professional services' },
  { accountCode: '5180', accountName: 'Legal & Accounting', accountType: 'Expense', description: 'Legal and accounting professional services' },
  { accountCode: '5190', accountName: 'Insurance', accountType: 'Expense', description: 'Business insurance premiums' },
  { accountCode: '5200', accountName: 'Marketing & Advertising', accountType: 'Expense', description: 'Marketing and advertising expenses' },
  { accountCode: '5210', accountName: 'Travel & Entertainment', accountType: 'Expense', description: 'Business travel and entertainment' },
  { accountCode: '5220', accountName: 'Office Supplies', accountType: 'Expense', description: 'Office supplies and materials' },
  { accountCode: '5230', accountName: 'Depreciation Expense', accountType: 'Expense', description: 'Depreciation of equipment and assets' },
  { accountCode: '5240', accountName: 'Bad Debt Expense', accountType: 'Expense', description: 'Uncollectible accounts receivable' },
  { accountCode: '5250', accountName: 'Bank Fees', accountType: 'Expense', description: 'Bank service charges and fees' },
  { accountCode: '5260', accountName: 'Equipment Maintenance', accountType: 'Expense', description: 'Maintenance and repair of equipment' },
  { accountCode: '5270', accountName: 'Professional Development', accountType: 'Expense', description: 'Training and education for employees' }
];

async function seedChartOfAccounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing accounts (optional - remove this line to keep existing accounts)
    // await ChartOfAccounts.deleteMany({});
    // console.log('Cleared existing chart of accounts');

    // Insert sample accounts
    for (const account of sampleAccounts) {
      try {
        const existingAccount = await ChartOfAccounts.findOne({ accountCode: account.accountCode });
        if (!existingAccount) {
          await ChartOfAccounts.create(account);
          console.log(`Created account: ${account.accountCode} - ${account.accountName}`);
        } else {
          console.log(`Account already exists: ${account.accountCode} - ${account.accountName}`);
        }
      } catch (error) {
        console.error(`Error creating account ${account.accountCode}:`, error.message);
      }
    }

    console.log('\nChart of Accounts seeding completed!');
    console.log(`Total accounts created: ${sampleAccounts.length}`);
    
    // Display summary by account type
    const summary = await ChartOfAccounts.aggregate([
      {
        $group: {
          _id: '$accountType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    console.log('\nAccount Summary:');
    summary.forEach(item => {
      console.log(`${item._id}: ${item.count} accounts`);
    });

  } catch (error) {
    console.error('Error seeding chart of accounts:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the seeding function if this script is executed directly
if (require.main === module) {
  seedChartOfAccounts();
}

module.exports = { seedChartOfAccounts, sampleAccounts };