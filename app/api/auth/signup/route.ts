// /app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

export async function POST(request: Request) {
  try {
    const { username, email, password, userType } = await request.json();

    if (!username || !email || !password || !userType) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Ensure users.json exists
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, '[]', 'utf-8');
    }

    // Read existing users
    const fileData = fs.readFileSync(USERS_FILE, 'utf-8');
    let users = [];
    try {
      users = JSON.parse(fileData);
    } catch (parseError) {
      console.error('Error parsing users.json:', parseError);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }

    // Check if email already exists
    const userExists = users.find((user: any) => user.email === email);
    if (userExists) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      role: userType,
      createdAt: new Date().toISOString(),
    };

    // Add new user to users array
    users.push(newUser);

    // Write updated users to the file
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
