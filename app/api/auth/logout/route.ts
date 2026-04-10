import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Mock logout - in real app, this would:
    // 1. Invalidate the refresh token in the database
    // 2. Clear any server-side sessions

    return NextResponse.json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Failed to logout', statusCode: 500 },
      { status: 500 }
    );
  }
}
