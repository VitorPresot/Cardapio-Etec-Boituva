import { NextResponse } from 'next/server';
import { processCronExpiredWeeks } from '@/lib/menu-store';

export async function GET(request: Request) {
  const secret = request.headers.get('x-cron-secret') || request.headers.get('authorization') || '';
  const expected = process.env.CRON_SECRET || '';

  if (!expected || !secret || !secret.includes(expected)) {
    return NextResponse.json({ success: false, error: 'Cron não autorizado' }, { status: 401 });
  }

  const result = await processCronExpiredWeeks();
  return NextResponse.json({
    success: true,
    message: 'Semanas expiradas processadas',
    ...result,
  });
}
