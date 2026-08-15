import { NextResponse } from 'next/server';
import { recordHeartbeatEvent } from '../../../../lib/analyticsDb';

export async function POST(req) {
  try {
    const body = await req.json();
    const userAgent = req.headers.get('user-agent') || '';

    const result = recordHeartbeatEvent({
      anonymousId: body.anonymousId,
      sessionId: body.sessionId,
      path: body.path,
      language: body.language,
      device: body.device,
      userAgent
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Analytics heartbeat route error:', error);
    return NextResponse.json({ success: false, error: 'Failed to record heartbeat' }, { status: 500 });
  }
}
