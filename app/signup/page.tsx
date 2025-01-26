// app/signup/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('researcher');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, userType })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error creating account. Please try again.');
        return;
      }

      // Clear error
      setError('');

      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Signup Frontend Error:', error);
      setError('Error creating account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="md:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-blue-400 mb-4">Welcome to REAPS</h1>
            <p className="text-gray-600">Sign Up for an account</p>
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
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#2563eb] transition-all duration-300 bg-gray-50 font-medium"
                required
              >
                <option value="researcher">Researcher</option>
                <option value="policy_maker">Policy Maker</option>
              </select>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold hover:bg-blue-300 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Create Account
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600">Already have an account?{' '}</p>
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-[#2563eb] hover:text-[#1d4ed8] font-semibold ml-2"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>

        <div className="flex-1 bg-blue-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/logo2.jpg")' }}
          />
        </div>
      </div>
    </div>
  );
}
