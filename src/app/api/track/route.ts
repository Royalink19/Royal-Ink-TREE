import { NextResponse } from 'next/server';
import { recordEvent } from '@/lib/analytics-storage';

export async function POST(request: Request) {
  try {
    let body;
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      // Beacon requests may send raw text
      const text = await request.text();
      body = JSON.parse(text);
    }

    if (!body || !body.type) {
      return NextResponse.json({ error: 'Invalid event format' }, { status: 400 });
    }

    const updated = recordEvent({
      type: body.type,
      source: body.source || 'direct',
      linkId: body.linkId,
      timestamp: body.timestamp || new Date().toISOString(),
    });

    return NextResponse.json({ success: true, visits: updated.totalVisits });
  } catch (err) {
    console.error('Tracking API error:', err);
    return NextResponse.json({ error: 'Internal tracking error' }, { status: 500 });
  }
}
