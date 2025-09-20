import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { validateConfig } from '@/lib/config';

export async function GET() {
  try {
    // Validate environment configuration
    const configValid = validateConfig();
    
    // Test database connection
    await dbConnect();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      config: configValid ? 'valid' : 'missing_vars',
      version: '1.0.0'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}