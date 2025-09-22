import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import dbConnect from '@/lib/dbConnect';
import ChartOfAccounts from '@/models/ChartOfAccounts';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || !['admin', 'accountant', 'manager', 'auditor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const account = await ChartOfAccounts.findById(id)
      .populate('parentAccount', 'accountName accountCode');

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      account
    });

  } catch (error) {
    console.error('Error fetching account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || !['admin', 'accountant'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const body = await request.json();
    const { 
      accountCode, 
      accountName, 
      accountType, 
      parentAccount, 
      description, 
      isActive 
    } = body;

    const account = await ChartOfAccounts.findById(id);
    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Check if account code already exists (excluding current account)
    if (accountCode && accountCode !== account.accountCode) {
      const existingAccount = await ChartOfAccounts.findOne({ 
        accountCode, 
        _id: { $ne: id } 
      });
      if (existingAccount) {
        return NextResponse.json(
          { error: 'Account code already exists' },
          { status: 400 }
        );
      }
    }

    // Validate parent account if provided
    if (parentAccount && parentAccount !== account.parentAccount?.toString()) {
      const parent = await ChartOfAccounts.findById(parentAccount);
      if (!parent) {
        return NextResponse.json(
          { error: 'Invalid parent account' },
          { status: 400 }
        );
      }
      
      // Ensure parent is the same account type
      if (parent.accountType !== (accountType || account.accountType)) {
        return NextResponse.json(
          { error: 'Parent account must be of the same type' },
          { status: 400 }
        );
      }

      // Prevent circular reference
      if (parentAccount === id) {
        return NextResponse.json(
          { error: 'Account cannot be its own parent' },
          { status: 400 }
        );
      }
    }

    // Update account
    const updatedAccount = await ChartOfAccounts.findByIdAndUpdate(
      id,
      {
        ...(accountCode && { accountCode }),
        ...(accountName && { accountName }),
        ...(accountType && { accountType }),
        ...(parentAccount !== undefined && { parentAccount: parentAccount || null }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
        updatedBy: session.user.id,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('parentAccount', 'accountName accountCode');

    return NextResponse.json({
      success: true,
      account: updatedAccount,
      message: 'Account updated successfully'
    });

  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || !['admin', 'accountant'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const account = await ChartOfAccounts.findById(id);

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Check if account has child accounts
    const childAccounts = await ChartOfAccounts.countDocuments({ parentAccount: id });
    if (childAccounts > 0) {
      return NextResponse.json(
        { error: 'Cannot delete account with child accounts' },
        { status: 400 }
      );
    }

    // Check if account has transactions (would need JournalEntry model)
    // TODO: Add transaction check when JournalEntry is implemented

    // For now, just mark as inactive instead of deleting
    await ChartOfAccounts.findByIdAndUpdate(id, { 
      isActive: false,
      updatedBy: session.user.id,
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}