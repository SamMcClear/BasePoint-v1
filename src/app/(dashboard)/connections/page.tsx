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
  User,
  Users,
  Mail,
} from 'lucide-react';

interface ConnectionWithOwner {
  id: number;
  name: string;
  dbType: string;
  host: string;
  port: number;
  username: string;
  database: string;
  createdAt: string;
  owner: {
    id: number;
    name: string | null;
    email: string;
    image: string | null;
  };
  sharedWith: Array<{
    user: {
      id: number;
      name: string | null;
      email: string;
    };
  }>;
  _count: {
    sharedWith: number;
  };
}

export default function ConnectionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [connections, setConnections] = useState<ConnectionWithOwner[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<'connections' | 'users'>('connections');
  const [users, setUsers] = useState<any[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [stats, setStats] = useState<{
    totalConnections: number;
    totalUsers: number;
    recentConnections: number;
  } | null>(null);

  // Redirect unauthenticated users to home
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch stats on mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/stats')
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(error => console.error('Error fetching stats:', error));
    }
  }, [status]);

  // Fetch connections on search change and when authenticated
  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/connections?q=${encodeURIComponent(debouncedSearch)}`);
      if (!res.ok) throw new Error('Failed to fetch connections');
      const data = await res.json();
      setConnections(data.results || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on search change
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users?q=${encodeURIComponent(debouncedSearch)}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.results || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = () => {
    if (searchMode === 'connections') {
      fetchConnections();
    } else {
      fetchUsers();
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [debouncedSearch, status, searchMode]);

  const handleUserClick = (user: any) => {
    setSearchMode('connections');
    setSearch(user.email);
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this connection?');
    if (!confirmed) return;

    await fetch(`/api/connections/${id}`, { method: 'DELETE' });
    fetchData();
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
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="w-6 h-6" />
            {searchMode === 'connections' ? 'Database Connections' : 'Users'}
          </h1>
          {stats && (
            <div className="flex gap-4 mt-2 text-sm text-gray-400">
              <span>{stats.totalConnections} total connections</span>
              <span>{stats.totalUsers} total users</span>
              <span>{stats.recentConnections} added this week</span>
            </div>
          )}
        </div>
        <button className="bg-blue-500 text-black font-semibold px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-400">
          <Plus className="w-4 h-4" />
          Add Connection
        </button>
      </div>

      {/* Search Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSearchMode('connections')}
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            searchMode === 'connections'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <Database className="w-4 h-4" />
          Connections
        </button>
        <button
          onClick={() => setSearchMode('users')}
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            searchMode === 'users'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <Users className="w-4 h-4" />
          Users
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Search className="text-blue-400" />
        <input
          type="text"
          placeholder={
            searchMode === 'connections'
              ? 'Search by connection name, user name, or email...'
              : 'Search by user name or email...'
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-black text-white px-4 py-2 border border-blue-600 rounded w-full"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          Loading {searchMode}...
        </div>
      ) : (
        <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2">
          {searchMode === 'connections' ? (
            // Connections View
            connections.length === 0 ? (
              <p className="text-gray-500">No connections found.</p>
            ) : (
              connections.map((conn) => (
                <div
                  key={conn.id}
                  className="bg-[#111] border border-blue-700 rounded-lg p-4 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-5 h-5 text-blue-400" />
                      <p className="text-lg font-semibold">{conn.name}</p>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      {conn.dbType} at {conn.host}:{conn.port}
                    </p>
                    
                    {/* Owner Information */}
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Owner:</span>
                        <span>{conn.owner?.name || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span>{conn.owner?.email}</span>
                      </div>
                    </div>
                    
                    {/* Shared Information */}
                    {conn._count?.sharedWith > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-sm text-orange-400">
                        <Users className="w-4 h-4" />
                        <span>Shared with {conn._count.sharedWith} user{conn._count.sharedWith > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 ml-4">
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
            )
          ) : (
            // Users View
            users.length === 0 ? (
              <p className="text-gray-500">No users found.</p>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="bg-[#111] border border-green-700 rounded-lg p-4 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
                  onClick={() => handleUserClick(user)}
                  title="Click to view this user's connections"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-green-400" />
                        <p className="text-lg font-semibold">{user.name || 'No name set'}</p>
                        <span className={`px-2 py-1 text-xs rounded ${
                          user.role === 'ADMIN' ? 'bg-red-600 text-white' :
                          user.role === 'DEVELOPER' ? 'bg-blue-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2 text-sm text-gray-300">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{user._count.connections} connection{user._count.connections !== 1 ? 's' : ''}</span>
                        <span>{user._count.permissions} permission{user._count.permissions !== 1 ? 's' : ''}</span>
                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      )}
    </div>
  );
}
