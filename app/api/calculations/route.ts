import { NextResponse } from 'next/server';
import { computeStatsByCompany } from '../../../lib/calculations';

// --- Next.js API Route Handler ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const companyName = body.companyName;

    if (!companyName || typeof companyName !== 'string') {
      return NextResponse.json({ message: 'Company name is required and must be a string.' }, { status: 400 });
    }

    const stats = await computeStatsByCompany(companyName);

    if (stats.length === 0) {
      return NextResponse.json({ message: `No data found for company: ${companyName}. Or the company might not exist.` }, { status: 404 });
    }

    return NextResponse.json(stats);

  } catch (error: any) {
    console.error('Error in /api/calculations POST handler:', error);
    return NextResponse.json({ message: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}