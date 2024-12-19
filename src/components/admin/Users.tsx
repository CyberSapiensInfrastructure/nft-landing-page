import { motion } from 'framer-motion';
import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  nftCount: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

export const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockUsers: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', nftCount: 5, joinDate: '2024-01-15', status: 'active' },
    { id: '2', name: 'Alice Smith', email: 'alice@example.com', nftCount: 3, joinDate: '2024-02-01', status: 'active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', nftCount: 0, joinDate: '2024-02-10', status: 'inactive' },
  ];

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-slate-400">Manage and monitor user activities</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white rounded-xl hover:opacity-90"
        >
          Export Users
        </motion.button>
      </div>

      {/* Search and Filter */}
      <div className="bg-slate-800/50 backdrop-blur-xl p-4 rounded-xl border border-slate-700/50">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Users Table */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-4 text-slate-400 font-medium">User</th>
                <th className="text-left p-4 text-slate-400 font-medium">NFTs</th>
                <th className="text-left p-4 text-slate-400 font-medium">Join Date</th>
                <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-slate-700 hover:bg-slate-700/30"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 flex items-center justify-center">
                        <span className="text-white font-bold">{user.name[0]}</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.name}</div>
                        <div className="text-slate-400 text-sm">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-white">{user.nftCount}</td>
                  <td className="p-4 text-white">{user.joinDate}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      user.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-500' 
                        : 'bg-rose-500/20 text-rose-500'
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 