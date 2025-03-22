import { NextResponse } from 'next/server';

export async function GET() {
  const environment = process.env.NODE_ENV || 'development';
  
  return NextResponse.json({
    message: `API is running in ${environment.toUpperCase()} mode`,
    timestamp: new Date().toISOString(),
  });
} 