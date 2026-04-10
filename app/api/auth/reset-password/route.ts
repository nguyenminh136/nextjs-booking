import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password, confirmPassword } = body;

    // Validation
    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { message: 'Token and password are required', statusCode: 400 },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match', statusCode: 400 },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters', statusCode: 400 },
        { status: 400 }
      );
    }

    // Mock token validation and password reset - in real app, this would:
    // 1. Validate the reset token
    // 2. Check if token is expired
    // 3. Hash the new password
    // 4. Update user password in Nest.js backend
    // 5. Invalidate the reset token

    // For now, just acknowledge the request
    return NextResponse.json({
      message: 'Password has been reset successfully. Please log in with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: 'Failed to reset password', statusCode: 500 },
      { status: 500 }
    );
  }
}
