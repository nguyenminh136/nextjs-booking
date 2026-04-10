import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Mock user database - in real app, this would be in Nest.js backend
const mockUsers: Record<
  string,
  {
    id: string;
    email: string;
    password: string;
    role: string;
    firstName?: string;
    lastName?: string;
    isEmailVerified: boolean;
  }
> = {
  'test@example.com': {
    id: 'mock_user_1',
    email: 'test@example.com',
    password: 'password123', // In real app, this would be hashed
    role: 'user',
    firstName: 'John',
    lastName: 'Doe',
    isEmailVerified: true,
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required', statusCode: 400 },
        { status: 400 }
      );
    }

    // Mock user lookup - in real app, this would query Nest.js backend
    const user = mockUsers[email];

    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: 'Invalid credentials', statusCode: 401 },
        { status: 401 }
      );
    }

    if (!user.isEmailVerified) {
      return NextResponse.json(
        { message: 'Please verify your email first', statusCode: 403 },
        { status: 403 }
      );
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const responseUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      isEmailVerified: user.isEmailVerified,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      accessToken,
      user: responseUser,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Login failed', statusCode: 500 },
      { status: 500 }
    );
  }
}
