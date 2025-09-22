import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import dbConnect from '@/lib/dbConnect';
import ChartOfAccounts from '@/models/ChartOfAccounts';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || !['admin', 'accountant', 'manager', 'auditor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const type = searchParams.get('type');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (search) {
      query.$or = [
        { accountName: { $regex: search, $options: 'i' } },
        { accountCode: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) {
      query.accountType = type;
    }

    const accounts = await ChartOfAccounts.find(query)
      .populate('parentAccount', 'accountName accountCode')
      .sort({ accountCode: 1 });

    // Calculate account levels for hierarchy display
    const accountsWithLevels = accounts.map(account => {
      const level = account.parentAccount ? 1 : 0; // Simple 2-level hierarchy for now
      return {
        ...account.toObject(),
        level
      };
    });

    return NextResponse.json({
      success: true,
      accounts: accountsWithLevels
    });

  } catch (error) {
    console.error('Error fetching chart of accounts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || !['admin', 'accountant'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { 
      accountCode, 
      accountName, 
      accountType, 
      parentAccount, 
      description, 
      isActive = true 
    } = body;

    // Validate required fields
    if (!accountCode || !accountName || !accountType) {
      return NextResponse.json(
        { error: 'Account code, name, and type are required' },
        { status: 400 }
      );
    }

    // Check if account code already exists
    const existingAccount = await ChartOfAccounts.findOne({ accountCode });
    if (existingAccount) {
      return NextResponse.json(
        { error: 'Account code already exists' },
        { status: 400 }
      );
    }

    // Validate parent account if provided
    if (parentAccount) {
      const parent = await ChartOfAccounts.findById(parentAccount);
      if (!parent) {
        return NextResponse.json(
          { error: 'Invalid parent account' },
          { status: 400 }
        );
      }
      
      // Ensure parent is the same account type
      if (parent.accountType !== accountType) {
        return NextResponse.json(
          { error: 'Parent account must be of the same type' },
          { status: 400 }
        );
      }
    }

    const newAccount = new ChartOfAccounts({
      accountCode,
      accountName,
      accountType,
      parentAccount: parentAccount || null,
      description,
      isActive,
      balance: 0,
      createdBy: session.user.id
    });

    await newAccount.save();

    const populatedAccount = await ChartOfAccounts.findById(newAccount._id)
      .populate('parentAccount', 'accountName accountCode');

    return NextResponse.json({
      success: true,
      account: populatedAccount,
      message: 'Account created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}