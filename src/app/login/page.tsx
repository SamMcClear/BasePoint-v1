// setup login with nextauth and create a page component
'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, Github } from 'lucide-react';

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
        <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <LogIn className="w-6 h-6" />
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-[#a3d8ff] w-4 h-4" />
              <input
                id="email"
                type="email"
                className="w-full pl-10 pr-3 py-2 bg-black border border-[#a3d8ff] rounded text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                autoFocus
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-[#a3d8ff] w-4 h-4" />
              <input
                id="password"
                type="password"
                className="w-full pl-10 pr-3 py-2 bg-black border border-[#a3d8ff] rounded text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="**********"
                required
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(e);
                  }
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#a3d8ff] text-black font-semibold rounded hover:bg-[#7dcaff] transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <a
            href="/forgot-password"
            className="text-xs text-[#ff6b6b] hover:text-[#ff8080] underline transition"
          >
            Forgot password?
          </a>
        </div>

        <div className="mt-6 text-center text-sm text-[#7ab5e6]">
          <p className="mb-2">Or continue with:</p>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => signIn('google')}
              aria-label="Sign in with Google"
              className="p-2 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] transition transform hover:scale-110"
            >
              <svg
                className="w-6 h-6 text-[#a3d8ff]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>
            <button
              onClick={() => signIn('github')}
              aria-label="Sign in with GitHub"
              className="p-2 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] transition transform hover:scale-110"
            >
              <Github className="w-6 h-6 text-[#a3d8ff]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
