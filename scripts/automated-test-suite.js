// Automated Test Script for Accounting System
// Run this in browser console after logging in

class AccountingSystemTester {
  constructor() {
    this.baseUrl = window.location.origin;
    this.testResults = [];
  }

  async log(test, result, details = '') {
    const status = result ? '✅ PASS' : '❌ FAIL';
    const message = `${status}: ${test} ${details}`;
    console.log(message);
    this.testResults.push({ test, result, details, message });
  }

  async testAPI(endpoint, method = 'GET', body = null) {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (body) options.body = JSON.stringify(body);
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      return { success: response.ok, status: response.status, data: await response.json() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testAuthentication() {
    console.log('\n🔐 Testing Authentication...');
    
    const sessionResult = await this.testAPI('/api/auth/session');
    await this.log('Session API', sessionResult.success, 
      sessionResult.success ? `User: ${sessionResult.data?.user?.email}` : sessionResult.error);
  }

  async testChartOfAccounts() {
    console.log('\n📊 Testing Chart of Accounts...');
    
    // Test GET
    const getResult = await this.testAPI('/api/accounting/chart-of-accounts');
    await this.log('Chart of Accounts GET', getResult.success, 
      getResult.success ? `Found ${getResult.data?.accounts?.length || 0} accounts` : getResult.error);

    // Test POST - Create a test account
    const testAccount = {
      accountCode: 'TEST001',
      accountName: 'Test Account',
      accountType: 'asset',
      accountSubType: 'current_asset',
      description: 'Automated test account',
      isActive: true
    };

    const postResult = await this.testAPI('/api/accounting/chart-of-accounts', 'POST', testAccount);
    await this.log('Chart of Accounts CREATE', postResult.success,
      postResult.success ? 'Test account created' : postResult.error || postResult.data?.error);

    return postResult.data?.account?._id;
  }

  async testJournalEntries() {
    console.log('\n📝 Testing Journal Entries...');
    
    const getResult = await this.testAPI('/api/accounting/journal-entries');
    await this.log('Journal Entries GET', getResult.success,
      getResult.success ? `Found ${getResult.data?.entries?.length || 0} entries` : getResult.error);
  }

  async testTrialBalance() {
    console.log('\n⚖️ Testing Trial Balance...');
    
    const result = await this.testAPI('/api/accounting/trial-balance');
    await this.log('Trial Balance GET', result.success,
      result.success ? 'Trial balance generated' : result.error);
  }

  async testFinancialReports() {
    console.log('\n📈 Testing Financial Reports...');
    
    const result = await this.testAPI('/api/accounting/financial-reports');
    await this.log('Financial Reports GET', result.success,
      result.success ? 'Reports API accessible' : result.error);
  }

  async testLedger() {
    console.log('\n📚 Testing Ledger...');
    
    const result = await this.testAPI('/api/accounting/ledger');
    await this.log('Ledger GET', result.success,
      result.success ? 'Ledger API accessible' : result.error);
  }

  async cleanupTestAccount(accountId) {
    if (accountId) {
      console.log('\n🧹 Cleaning up test data...');
      const deleteResult = await this.testAPI(`/api/accounting/chart-of-accounts/${accountId}`, 'DELETE');
      await this.log('Test Account CLEANUP', deleteResult.success,
        deleteResult.success ? 'Test account removed' : 'Test account deactivated');
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Accounting System Tests...\n');
    console.log('='.repeat(50));
    
    const startTime = Date.now();
    
    try {
      await this.testAuthentication();
      await this.testChartOfAccounts();
      await this.testJournalEntries();
      await this.testTrialBalance();
      await this.testFinancialReports();
      await this.testLedger();
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      console.log('\n' + '='.repeat(50));
      console.log('📊 TEST SUMMARY');
      console.log('='.repeat(50));
      
      const passed = this.testResults.filter(r => r.result).length;
      const total = this.testResults.length;
      const passRate = ((passed / total) * 100).toFixed(1);
      
      console.log(`Total Tests: ${total}`);
      console.log(`Passed: ${passed}`);
      console.log(`Failed: ${total - passed}`);
      console.log(`Pass Rate: ${passRate}%`);
      console.log(`Duration: ${duration}s`);
      
      console.log('\n📋 Detailed Results:');
      this.testResults.forEach(result => {
        console.log(`  ${result.message}`);
      });
      
      console.log('\n' + '='.repeat(50));
      
      if (passRate >= 80) {
        console.log('🎉 Overall Status: SYSTEM FUNCTIONAL');
      } else if (passRate >= 60) {
        console.log('⚠️ Overall Status: PARTIAL FUNCTIONALITY');
      } else {
        console.log('🚨 Overall Status: CRITICAL ISSUES DETECTED');
      }
      
    } catch (error) {
      console.error('❌ Test execution failed:', error);
    }
  }

  // Quick navigation tests
  async testPageNavigation() {
    console.log('\n🧭 Testing Page Navigation...');
    
    const pages = [
      '/accounting',
      '/accounting/chart-of-accounts',
      '/accounting/journal-entries',
      '/accounting/ledger',
      '/accounting/trial-balance',
      '/accounting/financial-reports'
    ];
    
    for (const page of pages) {
      try {
        const response = await fetch(`${this.baseUrl}${page}`);
        await this.log(`Page: ${page}`, response.ok, `Status: ${response.status}`);
      } catch (error) {
        await this.log(`Page: ${page}`, false, error.message);
      }
    }
  }

  // Test form validation
  async testFormValidation() {
    console.log('\n✅ Testing Form Validation...');
    
    // Test creating account without required fields
    const invalidAccount = {
      accountCode: '', // Empty required field
      accountName: 'Test',
      accountType: 'asset'
      // Missing accountSubType
    };
    
    const result = await this.testAPI('/api/accounting/chart-of-accounts', 'POST', invalidAccount);
    await this.log('Form Validation', !result.success, 
      !result.success ? 'Validation correctly rejected invalid data' : 'Validation failed to catch errors');
  }
}

// Usage instructions
console.log(`
🧪 ACCOUNTING SYSTEM TESTER LOADED

To run tests, execute:

// Basic functionality test
const tester = new AccountingSystemTester();
await tester.runAllTests();

// Test specific modules
await tester.testChartOfAccounts();
await tester.testJournalEntries();

// Test navigation
await tester.testPageNavigation();

// Test form validation
await tester.testFormValidation();

📝 Make sure you're logged in before running tests!
`);

// Auto-export for manual usage
window.AccountingTester = AccountingSystemTester;