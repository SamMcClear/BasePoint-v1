'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send to API route (we'll build this next)
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      alert('Account created. Please log in.');
      setEmail('');
      setPassword('');
    } else {
      const { message } = await res.json();
      alert(`Error: ${message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#a3d8ff] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111] border border-[#2a2a2a] rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Your Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 bg-black border border-[#a3d8ff] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#7dcaff]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 bg-black border border-[#a3d8ff] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#7dcaff]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#a3d8ff] text-black font-semibold rounded hover:bg-[#7dcaff] transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-[#7ab5e6]">
          Already have an account?{' '}
          <Link href="/login" className="underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

