import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'my_secret_jwt_key';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required.' },
        { status: 400 }
      );
    }

    if (!fs.existsSync(USERS_FILE)) {
      return NextResponse.json(
        { message: 'No users found. Please sign up first.' },
        { status: 404 }
      );
    }

    const fileData = fs.readFileSync(USERS_FILE, 'utf-8');
    const users = JSON.parse(fileData);

    const userIndex = users.findIndex((u: any) => u.email === email);
    if (userIndex === -1) {
      return NextResponse.json(
        { message: 'No user found with this email.' },
        { status: 404 }
      );
    }

    // Generate a reset token (JWT with a short expiration, e.g., 15 minutes)
    const resetToken = jwt.sign(
      { email },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Store the token in the user object
    users[userIndex].resetToken = resetToken;

    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');

    // **Without an email service**, return the reset token directly.
    // In a real app, you would send it via email instead.
    return NextResponse.json({
      message: 'Reset token generated successfully.',
      resetToken
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
