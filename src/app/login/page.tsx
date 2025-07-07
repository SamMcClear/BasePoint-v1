// setup login with nextauth and create a page component
'use client';

import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome to the App</h1>
      {session ? (
        <div>
          <p className="mb-4">Signed in as {session.user?.email}</p>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={handleSignIn}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Sign In with Google
        </button>
      )}
    </div>
  );
}


