import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required', statusCode: 400 },
        { status: 400 }
      );
    }

    // Mock resend verification - in real app, this would:
    // 1. Check if user exists and email is not verified
    // 2. Generate new verification token
    // 3. Send verification email

    return NextResponse.json({
      message: `Verification email sent to ${email}. Please check your inbox.`,
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { message: 'Failed to resend verification email', statusCode: 500 },
      { status: 500 }
    );
  }
}
