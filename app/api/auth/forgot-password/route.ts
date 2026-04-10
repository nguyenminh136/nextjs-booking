import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required', statusCode: 400 },
        { status: 400 }
      );
    }

    // Mock password reset - in real app, this would:
    // 1. Check if user exists in Nest.js backend
    // 2. Generate a reset token
    // 3. Send email with reset link
    // 4. Store token in database

    // For now, just acknowledge the request
    return NextResponse.json({
      message: `If an account exists with ${email}, a password reset link has been sent to the email address.`,
      email,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Failed to process password reset request', statusCode: 500 },
      { status: 500 }
    );
  }
}
