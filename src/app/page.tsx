'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#a3d8ff] font-[family-name:var(--font-geist-sans)]">
      {/* Top Navigation */}
      <header className="w-full flex justify-between items-center px-6 py-4 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Basepoint DB logo"
            width={36}
            height={36}
          />
          <h1 className="text-xl font-bold text-[#a3d8ff]">Basepoint DB</h1>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden sm:flex gap-6 items-center">
          <Link
            href="/login"
            className="hover:underline underline-offset-4 text-[#a3d8ff]"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded border border-[#a3d8ff] hover:bg-[#222] transition"
          >
            Sign Up
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="sm:hidden text-[#a3d8ff] focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-[#121212] border-b border-[#2a2a2a] px-6 py-4 space-y-2">
          <Link href="/login" className="block hover:underline">
            Login
          </Link>
          <Link
            href="/signup"
            className="block px-4 py-2 rounded border border-[#a3d8ff] hover:bg-[#222] transition text-center"
          >
            Sign Up
          </Link>
        </div>
      )}

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center text-center px-6 pt-20 pb-32 space-y-8">
        <h2 className="text-5xl font-bold tracking-tight text-[#a3d8ff]">
          Welcome to Basepoint DB
        </h2>
        <p className="text-lg text-[#d0eaff] max-w-xl">
          The reliable database interface for modern applications.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Link
            href="/dashboard"
            className="px-6 py-3 text-sm font-semibold rounded-lg border border-[#a3d8ff] text-[#a3d8ff] hover:bg-[#222] transition"
          >
            Go to Dashboard
          </Link>
          <Link
            href="https://docs.basepointdb.io"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 text-sm font-semibold rounded-lg border border-transparent text-black bg-[#a3d8ff] hover:bg-[#7dcaff] transition"
          >
            View Docs
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-[#7ab5e6] space-y-2 pb-8">
        <p>© {new Date().getFullYear()} Basepoint DB</p>
        <div className="flex justify-center gap-4 underline underline-offset-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
          <a href="mailto:team@basepointdb.io">Contact</a>
        </div>
      </footer>
    </div>
  );
}

