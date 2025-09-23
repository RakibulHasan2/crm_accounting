// Test Journal Entry Creation
// Run this in browser console after logging in and creating some accounts

const testJournalEntry = {
  description: "Test Journal Entry - Owner Investment",
  entryDate: "2024-01-01",
  entries: [
    {
      account: "ACCOUNT_ID_1", // Replace with actual account ID from Chart of Accounts
      debit: 10000,
      credit: 0,
      description: "Cash received from owner"
    },
    {
      account: "ACCOUNT_ID_2", // Replace with actual account ID from Chart of Accounts  
      debit: 0,
      credit: 10000,
      description: "Owner's equity contribution"
    }
  ]
};

console.log('Test Journal Entry Data:', JSON.stringify(testJournalEntry, null, 2));

// Test function to create journal entry
async function testJournalEntryCreation() {
  try {
    // First, get available accounts
    const accountsResponse = await fetch('/api/accounting/chart-of-accounts');
    const accountsData = await accountsResponse.json();
    
    if (accountsData.success && accountsData.accounts.length >= 2) {
      console.log('Available accounts:', accountsData.accounts);
      
      // Use the first two accounts for testing
      const account1 = accountsData.accounts[0];
      const account2 = accountsData.accounts[1];
      
      const testEntry = {
        description: "Automated Test Entry",
        entryDate: new Date().toISOString().split('T')[0],
        entries: [
          {
            account: account1._id,
            debit: 1000,
            credit: 0,
            description: `Debit to ${account1.accountName}`
          },
          {
            account: account2._id,
            debit: 0,
            credit: 1000,
            description: `Credit to ${account2.accountName}`
          }
        ]
      };
      
      console.log('Creating journal entry:', testEntry);
      
      const response = await fetch('/api/accounting/journal-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testEntry)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ SUCCESS: Journal entry created successfully!');
        console.log('Result:', result);
        return result;
      } else {
        console.log('❌ FAILED: Journal entry creation failed');
        console.log('Error:', result);
        return null;
      }
    } else {
      console.log('❌ No accounts available. Create some accounts first.');
      return null;
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return null;
  }
}

// Instructions
console.log(`
🧪 JOURNAL ENTRY TESTING

To test journal entry creation:

1. First ensure you have some accounts created in Chart of Accounts
2. Run: await testJournalEntryCreation()

This will automatically:
- Fetch available accounts
- Create a balanced journal entry using the first two accounts
- Show success/failure result

Manual testing:
- Go to: http://localhost:3000/accounting/journal-entries
- Click "Create Journal Entry"
- Fill in description, date, and at least 2 balanced entries
- Submit and check for success
`);

// Make function available globally
window.testJournalEntryCreation = testJournalEntryCreation;