import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { message: 'Verification token is required', statusCode: 400 },
        { status: 400 }
      );
    }

    // Mock email verification - in real app, this would:
    // 1. Validate the email verification token
    // 2. Check if token is expired
    // 3. Mark user email as verified in the database
    // 4. Invalidate the verification token

    return NextResponse.json({
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { message: 'Failed to verify email', statusCode: 500 },
      { status: 500 }
    );
  }
}
