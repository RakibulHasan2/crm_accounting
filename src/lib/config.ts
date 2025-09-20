// Environment configuration with validation
export const config = {
  // Database
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/crm_accounting',
  },
  
  // Authentication
  auth: {
    nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    nextAuthSecret: process.env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production',
    jwtSecret: process.env.JWT_SECRET || 'fallback-jwt-secret',
  },
  
  // Email configuration
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASS || '',
  },
  
  // Application settings
  app: {
    name: process.env.APP_NAME || 'Basic Accounts & CRM',
    companyName: process.env.COMPANY_NAME || 'Hotchpotch Digital Ltd',
    defaultCurrency: process.env.DEFAULT_CURRENCY || 'USD',
    vatRate: parseFloat(process.env.VAT_RATE || '0.15'),
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
  },
  
  // Development/Production flags
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Validation function to check if required environment variables are set
export function validateConfig() {
  const requiredVars = [
    'MONGODB_URI',
    'NEXTAUTH_SECRET',
    'JWT_SECRET',
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
    console.warn('Please check your .env.local file');
  }
  
  return missing.length === 0;
}

export default config;