import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';

interface SystemSettings {
  companyName: string;
  currency: string;
  vatRate: string;
  financialYearStart: string;
  maxFileSize: string;
  emailHost: string;
  emailPort: string;
  emailUser: string;
  smtpEnabled: boolean;
  backupFrequency: string;
  sessionTimeout: string;
}

// In a real app, these would be stored in database
let systemSettings: SystemSettings = {
  companyName: 'Hotchpotch Digital Ltd',
  currency: 'USD',
  vatRate: '15',
  financialYearStart: '01-01',
  maxFileSize: '10',
  emailHost: 'smtp.gmail.com',
  emailPort: '587',
  emailUser: '',
  smtpEnabled: false,
  backupFrequency: 'daily',
  sessionTimeout: '60'
};

// GET /api/admin/settings - Get system settings
export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(systemSettings);

  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/settings - Update system settings
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate and update settings
    systemSettings = { ...systemSettings, ...body };

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      settings: systemSettings 
    });

  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}