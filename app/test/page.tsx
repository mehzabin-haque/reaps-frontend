'use client'
import { useState } from 'react';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const emailExists = users.some(u => u.email === email);
    
    if (emailExists) {
      setError('Email already exists');
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password,
      address,
      phone,
      role: 'user'
    };

    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Redirect to login
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[url('/gradient-bg.jpg')] bg-cover bg-center flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute -top-8 right-0 w-24 h-24 bg-white rounded-full -rotate-40 shadow-xl" />
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#2563eb] mb-4">Welcome to REAPS</h1>
            <p className="text-gray-600">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#2563eb] transition-all duration-300 bg-gray-50 font-medium"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#2563eb] transition-all duration-300 bg-gray-50 font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#2563eb] transition-all duration-300 bg-gray-50 font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#2563eb] transition-all duration-300 bg-gray-50 font-medium"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#2563eb] transition-all duration-300 bg-gray-50 font-medium"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#2563eb] text-white py-4 rounded-xl font-semibold hover:bg-[#1d4ed8] transition-all duration-300 flex items-center justify-center"
            >
              Create Account
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600">Already have an account?{' '}</p>
              <button
                type="button"
                onClick={() => window.location.href='/login'}
                className="text-[#2563eb] hover:text-[#1d4ed8] font-semibold ml-2"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}