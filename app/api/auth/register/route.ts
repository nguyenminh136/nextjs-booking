import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, confirmPassword, role, firstName, lastName } = body;

    // Validation
    if (!email || !password || !confirmPassword || !role) {
      return NextResponse.json(
        { message: 'Missing required fields', statusCode: 400 },
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

    // Mock user creation - in real app, this would call Nest.js backend
    const userId = `user_${Date.now()}`;

    // Generate JWT token
    const accessToken = jwt.sign(
      {
        sub: userId,
        email,
        role,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const user = {
      id: userId,
      email,
      role,
      firstName,
      lastName,
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      accessToken,
      user,
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Registration failed', statusCode: 500 },
      { status: 500 }
    );
  }
}
