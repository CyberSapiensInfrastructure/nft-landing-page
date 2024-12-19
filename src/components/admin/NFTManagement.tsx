import { motion } from 'framer-motion';
import { useState } from 'react';

interface NFT {
  id: string;
  name: string;
  owner: string;
  price: string;
  status: 'listed' | 'staked' | 'owned';
  image: string;
}

export const NFTManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const mockNFTs: NFT[] = [
    { id: '#1234', name: 'Providence #1', owner: '0x1234...5678', price: '0.5 ETH', status: 'listed', image: '🖼️' },
    { id: '#1235', name: 'Providence #2', owner: '0x8765...4321', price: '0.8 ETH', status: 'staked', image: '🖼️' },
    { id: '#1236', name: 'Providence #3', owner: '0x9876...1234', price: '1.2 ETH', status: 'owned', image: '🖼️' },
  ];

  const filteredNFTs = mockNFTs.filter(nft => 
    (filterStatus === 'all' || nft.status === filterStatus) &&
    (nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nft.owner.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const statusColors = {
    listed: 'bg-indigo-500/20 text-indigo-500',
    staked: 'bg-emerald-500/20 text-emerald-500',
    owned: 'bg-amber-500/20 text-amber-500'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">NFT Management</h2>
          <p className="text-slate-400">Monitor and manage NFT activities</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white rounded-xl hover:opacity-90"
        >
          Create NFT
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-xl p-4 rounded-xl border border-slate-700/50">
          <input
            type="text"
            placeholder="Search NFTs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl p-4 rounded-xl border border-slate-700/50 flex gap-2">
          {['all', 'listed', 'staked', 'owned'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg ${
                filterStatus === status
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNFTs.map((nft, index) => (
          <motion.div
            key={nft.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 overflow-hidden"
          >
            <div className="h-48 bg-gradient-to-br from-indigo-500/20 to-cyan-400/20 flex items-center justify-center">
              <span className="text-6xl">{nft.image}</span>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-medium">{nft.name}</h3>
                  <p className="text-slate-400 text-sm">{nft.owner}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${statusColors[nft.status]}`}>
                  {nft.status.charAt(0).toUpperCase() + nft.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">{nft.price}</span>
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
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}; 