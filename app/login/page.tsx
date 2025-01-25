'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const user = existingUsers.find(u => u.email === email && u.password === password);

      if (user) {
        setError('');
        // Store user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        // Redirect based on role
        if (user.role === 'policy_maker') {
          router.push('/policy-maker/dashboard');
        } else {
          router.push('/researcher/dashboard');
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Error logging in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="md:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="text-center mb-10 ">
            
          </div>

          <div className="flex flex-col items-center">
            <div className="my-12 border-b text-center">
            <div className="absolute -top-8 right-0 w-24 h-24 bg-white rounded-full -rotate-40 shadow-xl" />
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-400 mb-4">Welcome to REAPS</h1>
            <p className="text-gray-600">Sign In to your account</p>
          </div>
            </div>

            <div className="mx-auto max-w-xs space-y-6">
            <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
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
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold hover:bg-blue-300 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <path d="M20 8v6M23 11h-6" />
              </svg>
              Sign In
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600">Forgot password?{' '}</p>
              <button
                type="button"
                onClick={() => window.location.href='/signup'}
                className="text-[#2563eb] hover:text-[#1d4ed8] font-semibold ml-2"
              >
                Create Account
              </button>
            </div>
          </form>
             
            </div>
          </div>
        </div>

        <div className="flex-1 bg-blue-100 text-center hidden lg:flex">
          <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat" 
               style={{ backgroundImage: 'url("/logo2.jpg")' }} />
        </div>
      </div>
    </div>
  );
}