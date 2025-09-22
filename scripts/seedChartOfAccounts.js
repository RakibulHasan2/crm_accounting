const mongoose = require('mongoose');
require('dotenv').config({ path: './.env.local' });

// Define ChartOfAccounts schema directly here to avoid module import issues
const chartOfAccountsSchema = new mongoose.Schema({
  accountCode: { type: String, required: true, unique: true },
  accountName: { type: String, required: true },
  accountType: { 
    type: String, 
    required: true, 
    enum: ['assets', 'liabilities', 'equity', 'revenue', 'expenses'] 
  },
  parentAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'ChartOfAccounts', default: null },
  level: { type: Number, required: true, default: 1 },
  isActive: { type: Boolean, default: true },
  balance: { type: Number, default: 0 },
  description: { type: String }
}, {
  timestamps: true
});

const ChartOfAccounts = mongoose.models.ChartOfAccounts || mongoose.model('ChartOfAccounts', chartOfAccountsSchema);

const defaultAccounts = [
  // Assets
  { accountCode: '1000', accountName: 'Current Assets', accountType: 'assets', level: 0 },
  { accountCode: '1100', accountName: 'Cash and Cash Equivalents', accountType: 'assets', level: 1, parent: '1000' },
  { accountCode: '1110', accountName: 'Cash in Bank', accountType: 'assets', level: 1, parent: '1000' },
  { accountCode: '1120', accountName: 'Petty Cash', accountType: 'assets', level: 1, parent: '1000' },
  { accountCode: '1200', accountName: 'Accounts Receivable', accountType: 'assets', level: 1, parent: '1000' },
  { accountCode: '1300', accountName: 'Inventory', accountType: 'assets', level: 1, parent: '1000' },
  { accountCode: '1400', accountName: 'Prepaid Expenses', accountType: 'assets', level: 1, parent: '1000' },
  
  { accountCode: '1500', accountName: 'Non-Current Assets', accountType: 'assets', level: 0 },
  { accountCode: '1510', accountName: 'Property, Plant & Equipment', accountType: 'assets', level: 1, parent: '1500' },
  { accountCode: '1520', accountName: 'Accumulated Depreciation', accountType: 'assets', level: 1, parent: '1500' },
  { accountCode: '1530', accountName: 'Intangible Assets', accountType: 'assets', level: 1, parent: '1500' },

  // Liabilities
  { accountCode: '2000', accountName: 'Current Liabilities', accountType: 'liabilities', level: 0 },
  { accountCode: '2100', accountName: 'Accounts Payable', accountType: 'liabilities', level: 1, parent: '2000' },
  { accountCode: '2200', accountName: 'Short-term Loans', accountType: 'liabilities', level: 1, parent: '2000' },
  { accountCode: '2300', accountName: 'Accrued Expenses', accountType: 'liabilities', level: 1, parent: '2000' },
  { accountCode: '2400', accountName: 'Taxes Payable', accountType: 'liabilities', level: 1, parent: '2000' },
  
  { accountCode: '2500', accountName: 'Non-Current Liabilities', accountType: 'liabilities', level: 0 },
  { accountCode: '2510', accountName: 'Long-term Loans', accountType: 'liabilities', level: 1, parent: '2500' },
  { accountCode: '2520', accountName: 'Mortgage Payable', accountType: 'liabilities', level: 1, parent: '2500' },

  // Equity
  { accountCode: '3000', accountName: 'Owner\'s Equity', accountType: 'equity', level: 0 },
  { accountCode: '3100', accountName: 'Share Capital', accountType: 'equity', level: 1, parent: '3000' },
  { accountCode: '3200', accountName: 'Retained Earnings', accountType: 'equity', level: 1, parent: '3000' },
  { accountCode: '3300', accountName: 'Current Year Earnings', accountType: 'equity', level: 1, parent: '3000' },

  // Revenue
  { accountCode: '4000', accountName: 'Operating Revenue', accountType: 'revenue', level: 0 },
  { accountCode: '4100', accountName: 'Sales Revenue', accountType: 'revenue', level: 1, parent: '4000' },
  { accountCode: '4200', accountName: 'Service Revenue', accountType: 'revenue', level: 1, parent: '4000' },
  { accountCode: '4300', accountName: 'Other Income', accountType: 'revenue', level: 1, parent: '4000' },

  // Expenses
  { accountCode: '5000', accountName: 'Operating Expenses', accountType: 'expenses', level: 0 },
  { accountCode: '5100', accountName: 'Cost of Goods Sold', accountType: 'expenses', level: 1, parent: '5000' },
  { accountCode: '5200', accountName: 'Salaries and Wages', accountType: 'expenses', level: 1, parent: '5000' },
  { accountCode: '5300', accountName: 'Rent Expense', accountType: 'expenses', level: 1, parent: '5000' },
  { accountCode: '5400', accountName: 'Utilities Expense', accountType: 'expenses', level: 1, parent: '5000' },
  { accountCode: '5500', accountName: 'Office Supplies', accountType: 'expenses', level: 1, parent: '5000' },
  { accountCode: '5600', accountName: 'Marketing Expenses', accountType: 'expenses', level: 1, parent: '5000' },
  { accountCode: '5700', accountName: 'Travel Expenses', accountType: 'expenses', level: 1, parent: '5000' },
  { accountCode: '5800', accountName: 'Depreciation Expense', accountType: 'expenses', level: 1, parent: '5000' },
  { accountCode: '5900', accountName: 'Interest Expense', accountType: 'expenses', level: 1, parent: '5000' },
];

async function seedChartOfAccounts() {
  try {
    await dbConnect();
    
    // Check if accounts already exist
    const existingAccounts = await ChartOfAccounts.countDocuments();
    if (existingAccounts > 0) {
      console.log('Chart of Accounts already exists. Skipping seed.');
      return;
    }

    console.log('Seeding Chart of Accounts...');

    // First, create all parent accounts (level 0)
    const parentAccounts = defaultAccounts.filter(acc => acc.level === 0);
    const createdParents = new Map();

    for (const account of parentAccounts) {
      const newAccount = new ChartOfAccounts({
        accountCode: account.accountCode,
        accountName: account.accountName,
        accountType: account.accountType,
        parentAccount: null,
        isActive: true,
        balance: 0,
        description: `Default ${account.accountType} account`
      });
      
      const saved = await newAccount.save();
      createdParents.set(account.accountCode, saved._id);
      console.log(`Created parent account: ${account.accountCode} - ${account.accountName}`);
    }

    // Then create child accounts (level 1)
    const childAccounts = defaultAccounts.filter(acc => acc.level === 1);

    for (const account of childAccounts) {
      const parentId = createdParents.get(account.parent);
      
      const newAccount = new ChartOfAccounts({
        accountCode: account.accountCode,
        accountName: account.accountName,
        accountType: account.accountType,
        parentAccount: parentId,
        isActive: true,
        balance: 0,
        description: `Default ${account.accountType} account`
      });
      
      await newAccount.save();
      console.log(`Created child account: ${account.accountCode} - ${account.accountName}`);
    }

    console.log('Chart of Accounts seeded successfully!');
    console.log(`Total accounts created: ${defaultAccounts.length}`);

  } catch (error) {
    console.error('Error seeding Chart of Accounts:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seed function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedChartOfAccounts();
}

export default seedChartOfAccounts;