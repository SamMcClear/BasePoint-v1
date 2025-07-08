// setup login with nextauth and create a page component
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push('/dashboard');
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#a3d8ff] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111] border border-[#2a2a2a] rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 bg-black border border-[#a3d8ff] rounded text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-sm">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 bg-black border border-[#a3d8ff] rounded text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#a3d8ff] text-black font-semibold rounded hover:bg-[#7dcaff] transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#7ab5e6]">
          <p className="mb-2">Or continue with:</p>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => signIn('google')}
              aria-label="Sign in with Google"
              className="transition transform hover:scale-110"
            >
              <img
                src="/icons/google.svg"
                alt="Google logo"
                className="h-8 w-8"
                draggable={false}
              />
            </button>
            <button
              onClick={() => signIn('github')}
              aria-label="Sign in with GitHub"
              className="transition transform hover:scale-110"
            >
              <img
                src="/icons/github.svg"
                alt="GitHub logo"
                className="h-8 w-8"
                draggable={false}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

