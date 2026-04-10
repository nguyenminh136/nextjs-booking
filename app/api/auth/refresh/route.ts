import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'Refresh token is required', statusCode: 400 },
        { status: 400 }
      );
    }

    try {
      // Verify and decode refresh token
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;

      // Generate new access token
      const newAccessToken = jwt.sign(
        {
          sub: decoded.sub,
          email: decoded.email,
          role: decoded.role,
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Mock user - in real app, fetch from Nest.js backend
      const user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json({
        accessToken: newAccessToken,
        user,
      });
    } catch (tokenError) {
      return NextResponse.json(
        { message: 'Invalid refresh token', statusCode: 401 },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { message: 'Failed to refresh token', statusCode: 500 },
      { status: 500 }
    );
  }
}
