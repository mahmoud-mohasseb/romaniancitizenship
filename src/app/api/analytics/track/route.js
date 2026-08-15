import { NextResponse } from 'next/server';
import { recordPageViewEvent } from '../../../../lib/analyticsDb';

export async function POST(req) {
  try {
    const body = await req.json();
    const userAgent = req.headers.get('user-agent') || '';

    const result = recordPageViewEvent({
      anonymousId: body.anonymousId,
      sessionId: body.sessionId,
      path: body.path,
      language: body.language,
      device: body.device,
      browser: body.browser,
      referrer: body.referrer,
      userAgent
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Analytics track route error:', error);
    return NextResponse.json({ success: false, error: 'Failed to record tracking event' }, { status: 500 });
  }
}
