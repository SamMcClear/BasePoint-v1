'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>;
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const userGreeting = session?.user?.name || session?.user?.email || 'there';

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-blue-300">
      {/* Top Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-black border-b border-blue-800">
        <h1 className="text-xl font-bold">Basepoint DB</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-blue-400 hidden sm:inline">
            Role: <span className="font-semibold uppercase">{session?.user?.role ?? 'USER'}</span>
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded bg-blue-700 text-white hover:bg-blue-600 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-black border-r border-blue-900 p-6 hidden md:block">
          <h2 className="text-xl font-bold mb-6">Navigation</h2>
          <ul className="space-y-4 text-sm">
            <li>
              <Link href="/dashboard" className="hover:text-blue-400">Overview</Link>
            </li>
            <li>
              <Link href="/connections" className="hover:text-blue-400">Connections</Link>
            </li>
            <li>
              <Link href="/dashboard/logs" className="hover:text-blue-400">Logs</Link>
            </li>
            <li>
              <Link href="/dashboard/settings" className="hover:text-blue-400">Settings</Link>
            </li>
          </ul>
        </aside>

        {/* Main */}
        <main className="flex-1 p-10">
          <h1 className="text-3xl font-bold text-white mb-4">Hello, {userGreeting} 👋</h1>

          <p className="text-sm text-blue-400 mt-1">
            Role: <strong className="uppercase">{session?.user?.role ?? 'USER'}</strong>
          </p>

          <div className="mt-10 border border-blue-700 rounded-xl p-6 bg-gray-800">
            <h2 className="text-xl font-semibold mb-2 text-blue-200">Quick Stats</h2>
            <p className="text-sm text-gray-400">We’ll show total databases, audit logs, user activity here.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

