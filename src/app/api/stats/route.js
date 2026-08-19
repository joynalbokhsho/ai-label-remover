import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function GET() {
  try {
    const count = await redis.get('ai_remove_processed_count');
    return NextResponse.json({ count: count ? parseInt(count, 10) : 0 });
  } catch (error) {
    console.error('Redis error:', error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}

export async function POST() {
  try {
    const count = await redis.incr('ai_remove_processed_count');
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Redis error:', error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
