import { NextResponse } from 'next/server';
import { getDashboardMetrics } from '../../../../lib/analyticsDb';

export async function GET() {
  try {
    const metrics = getDashboardMetrics();
    return NextResponse.json({ success: true, metrics });
  } catch (error) {
    console.error('Analytics dashboard API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard metrics' }, { status: 500 });
  }
}
