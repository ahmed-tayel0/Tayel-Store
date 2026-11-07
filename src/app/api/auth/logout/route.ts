import { NextResponse } from 'next/server';

export async function POST() {
  // Auth is now localStorage-only on client side
  // Server just confirms the logout action
  return NextResponse.json({ success: true });
}