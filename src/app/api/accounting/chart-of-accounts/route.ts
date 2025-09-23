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

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) {
      query.type = type;
    }

    const accounts = await ChartOfAccounts.find(query)
      .populate('parentId', 'name code')
      .sort({ code: 1 });

    // Calculate account levels for hierarchy display
    const accountsWithLevels = accounts.map(account => {
      return {
        ...account.toObject(),
        // Map model fields to frontend expected fields for backward compatibility
        accountCode: account.code,
        accountName: account.name,
        accountType: account.type,
        accountSubType: account.subType,
        parentAccount: account.parentId
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
      accountSubType,
      parentAccount, 
      description, 
      isActive = true 
    } = body;

    // Validate required fields
    if (!accountCode || !accountName || !accountType || !accountSubType) {
      return NextResponse.json(
        { error: 'Account code, name, type, and sub-type are required' },
        { status: 400 }
      );
    }

    // Check if account code already exists
    const existingAccount = await ChartOfAccounts.findOne({ code: accountCode });
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
      if (parent.type !== accountType) {
        return NextResponse.json(
          { error: 'Parent account must be of the same type' },
          { status: 400 }
        );
      }
    }

    // Calculate level based on parent
    let level = 0;
    if (parentAccount) {
      const parent = await ChartOfAccounts.findById(parentAccount);
      if (parent) {
        level = parent.level + 1;
      }
    }

    const newAccount = new ChartOfAccounts({
      code: accountCode,
      name: accountName,
      type: accountType,
      subType: accountSubType,
      parentId: parentAccount || null,
      level,
      description,
      isActive,
      balance: '0.00',
      openingBalance: '0.00',
      currency: 'USD',
      createdBy: session.user.id
    });

    await newAccount.save();

    const populatedAccount = await ChartOfAccounts.findById(newAccount._id)
      .populate('parentId', 'name code');

    // Map model fields to frontend expected fields for backward compatibility
    const responseAccount = {
      ...populatedAccount.toObject(),
      accountCode: populatedAccount.code,
      accountName: populatedAccount.name,
      accountType: populatedAccount.type,
      accountSubType: populatedAccount.subType,
      parentAccount: populatedAccount.parentId
    };

    return NextResponse.json({
      success: true,
      account: responseAccount,
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