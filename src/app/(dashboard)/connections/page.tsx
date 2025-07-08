'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Database,
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
} from 'lucide-react';

export default function ConnectionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Redirect unauthenticated users to home
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  // Fetch connections on search change and when authenticated
  const fetchConnections = async () => {
    setLoading(true);
    const res = await fetch(`/api/connections?q=${encodeURIComponent(search)}`);
    const data = await res.json();
    setConnections(data.results || []);
    setLoading(false);
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchConnections();
    }
  }, [search, status]);

  const handleDelete = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this connection?');
    if (!confirmed) return;

    await fetch(`/api/connections/${id}`, { method: 'DELETE' });
    fetchConnections();
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#a3d8ff]">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading...
      </div>
    );
  }

  // While redirecting, render nothing or a loading state
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen p-8 bg-[#1a1a1a] text-[#a3d8ff]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Database className="w-6 h-6" />
          Database Connections
        </h1>
        <button className="bg-blue-500 text-black font-semibold px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-400">
          <Plus className="w-4 h-4" />
          Add Connection
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Search className="text-blue-400" />
        <input
          type="text"
          placeholder="Search connections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-black text-white px-4 py-2 border border-blue-600 rounded w-full"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          Loading connections...
        </div>
      ) : (
        <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2">
          {connections.length === 0 ? (
            <p className="text-gray-500">No connections found.</p>
          ) : (
            connections.map((conn) => (
              <div
                key={conn.id}
                className="bg-[#111] border border-blue-700 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold">{conn.name}</p>
                  <p className="text-sm text-gray-400">
                    {conn.dbType} at {conn.host}:{conn.port}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    className="hover:text-green-400"
                    onClick={() => alert('Edit modal coming soon')}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="hover:text-red-500"
                    onClick={() => handleDelete(conn.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
