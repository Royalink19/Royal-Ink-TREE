import { NextResponse } from 'next/server';
import { readAnalytics, resetAnalytics } from '@/lib/analytics-storage';

export async function GET() {
  try {
    const data = readAnalytics();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read analytics' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const fresh = resetAnalytics();
    return NextResponse.json({ success: true, data: fresh });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to reset analytics' }, { status: 500 });
  }
}
