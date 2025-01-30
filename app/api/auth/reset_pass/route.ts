import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'my_secret_jwt_key';

export async function POST(request: Request) {
  try {
    const { resetToken, newPassword } = await request.json();

    if (!resetToken || !newPassword) {
      return NextResponse.json(
        { message: 'Reset token and new password are required.' },
        { status: 400 }
      );
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token.' },
        { status: 401 }
      );
    }

    // Check if users file exists
    if (!fs.existsSync(USERS_FILE)) {
      return NextResponse.json(
        { message: 'No users found. Please sign up first.' },
        { status: 404 }
      );
    }

    const fileData = fs.readFileSync(USERS_FILE, 'utf-8');
    const users = JSON.parse(fileData);

    // Find the user by matching the stored resetToken
    const userIndex = users.findIndex((u: any) => u.resetToken === resetToken);
    if (userIndex === -1) {
      return NextResponse.json(
        { message: 'Invalid token or user not found.' },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear the resetToken
    users[userIndex].password = hashedPassword;
    delete users[userIndex].resetToken;

    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');

    return NextResponse.json(
      { message: 'Password has been reset successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset Password Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
