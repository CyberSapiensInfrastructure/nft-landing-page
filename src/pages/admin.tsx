import { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Dashboard Component
const Dashboard = () => {
  const [mintAmount, setMintAmount] = useState('');
  const [missionData, setMissionData] = useState({ title: '', description: '', reward: '' });
  const [rewardAmount, setRewardAmount] = useState('');

  const areaChartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 1000 },
  ];

  const pieChartData = [
    { name: 'Active NFTs', value: 45 },
    { name: 'Staked NFTs', value: 30 },
    { name: 'Listed NFTs', value: 25 },
  ];

  const COLORS = ['#6366f1', '#ec4899', '#06b6d4'];

  const handleMintF8 = () => {
    // Implement mintF8 logic
    console.log('Minting F8:', mintAmount);
  };

  const handleInsertMission = () => {
    // Implement insertMission logic
    console.log('Inserting Mission:', missionData);
  };

  const handleDepositReward = () => {
    // Implement depositReward logic
    console.log('Depositing Reward:', rewardAmount);
  };

  const handleWithdrawReward = () => {
    // Implement withdrawReward logic
    console.log('Withdrawing Reward:', rewardAmount);
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Total Users', value: '150', icon: '👥', trend: '+12.5%' },
          { title: 'Active NFTs', value: '45', icon: '🖼️', trend: '+5.2%' },
          { title: 'Total Volume', value: '1,234', icon: '📊', trend: '+8.1%' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-700/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 font-medium">{stat.title}</p>
                <h3 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                  {stat.value}
                </h3>
                <span className="text-emerald-400 text-sm font-medium">{stat.trend}</span>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mint F8 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-4">Mint F8 Token</h3>
          <div className="space-y-4">
            <input
              type="number"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              placeholder="Amount"
              className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={handleMintF8}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white rounded-xl hover:opacity-90 font-medium"
            >
              Mint Tokens
            </button>
          </div>
        </motion.div>

        {/* Insert Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-4">Create Mission</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={missionData.title}
              onChange={(e) => setMissionData({ ...missionData, title: e.target.value })}
              placeholder="Mission Title"
              className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <textarea
              value={missionData.description}
              onChange={(e) => setMissionData({ ...missionData, description: e.target.value })}
              placeholder="Mission Description"
              className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="number"
              value={missionData.reward}
              onChange={(e) => setMissionData({ ...missionData, reward: e.target.value })}
              placeholder="Reward Amount"
              className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={handleInsertMission}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white rounded-xl hover:opacity-90 font-medium"
            >
              Create Mission
            </button>
          </div>
        </motion.div>

        {/* Reward Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 col-span-2"
        >
          <h3 className="text-xl font-bold text-white mb-4">Reward Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <input
                type="number"
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                placeholder="Deposit Amount"
                className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={handleDepositReward}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-xl hover:opacity-90 font-medium"
              >
                Deposit Reward
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="number"
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                placeholder="Withdraw Amount"
                className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={handleWithdrawReward}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:opacity-90 font-medium"
              >
                Withdraw Reward
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Users Component
const Users = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white">Kullanıcı Yönetimi</h2>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white"
      >
        Yeni Kullanıcı Ekle
      </motion.button>
    </div>
    
    <div className="grid gap-4">
      {[1, 2, 3].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-[#2D3B52] p-4 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              {String.fromCharCode(65 + index)}
            </div>
            <div>
              <h3 className="text-white font-medium">Kullanıcı {index + 1}</h3>
              <p className="text-gray-400 text-sm">user{index + 1}@example.com</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg"
            >
              Düzenle
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
            >
              Sil
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// NFT Management Component
const NFTManagement = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white">NFT Yönetimi</h2>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white"
      >
        Yeni NFT Ekle
      </motion.button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-[#2D3B52] rounded-xl overflow-hidden"
        >
          <div className="h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <span className="text-4xl">🖼️</span>
          </div>
          <div className="p-4">
            <h3 className="text-white font-medium">NFT #{index + 1}</h3>
            <p className="text-gray-400 text-sm">0.5 ETH</p>
            <div className="mt-4 flex justify-between">
              <span className="text-sm text-green-400">Active</span>
              <button className="text-blue-400 hover:text-blue-300">Edit</button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// Settings Component
const Settings = () => (
  <div className="space-y-8">
    <h2 className="text-2xl font-bold text-white mb-6">Sistem Ayarları</h2>
    
    <div className="grid gap-6">
      {[
        { title: 'Genel Ayarlar', icon: '⚙️' },
        { title: 'Güvenlik', icon: '🔒' },
        { title: 'Bildirimler', icon: '🔔' },
        { title: 'API Ayarları', icon: '🔗' }
      ].map((section, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-[#2D3B52] p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{section.icon}</span>
              <div>
                <h3 className="text-white font-medium">{section.title}</h3>
                <p className="text-gray-400 text-sm">Ayarları düzenle</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white rounded-lg"
            >
              Düzenle
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default function AdminPage() {
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'nfts':
        return <NFTManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AdminLayout onTabChange={setActiveComponent}>
      {renderComponent()}
    </AdminLayout>
  );
} 