import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  const { email, password } = req.body;

  try {
    const usersPath = path.join(process.cwd(), 'public/users.json');
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      res.json({ success: false, message: 'User already exists' });
      return;
    }

    users.push({ email, password });
    fs.writeFileSync(usersPath, JSON.stringify(users));
    res.json({ success: true, token: 'dummy-token' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}