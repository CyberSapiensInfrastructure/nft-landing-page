import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

export const Dashboard = () => {
  const stats = [
    { title: 'Total Users', value: '150', icon: '👥', trend: '+12.5%' },
    { title: 'Active NFTs', value: '45', icon: '🖼️', trend: '+5.2%' },
    { title: 'Total Volume', value: '1,234 ETH', icon: '📊', trend: '+8.1%' },
    { title: 'Total Missions', value: '89', icon: '🎯', trend: '+15.3%' }
  ];

  const chartData = {
    nftVolume: [
      { name: 'Jan', value: 400 },
      { name: 'Feb', value: 300 },
      { name: 'Mar', value: 600 },
      { name: 'Apr', value: 800 },
      { name: 'May', value: 1000 },
    ],
    distribution: [
      { name: 'Active NFTs', value: 45 },
      { name: 'Staked NFTs', value: 30 },
      { name: 'Listed NFTs', value: 25 },
    ]
  };

  const COLORS = ['#6366f1', '#ec4899', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
                <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                  {stat.value}
                </h3>
                <span className="text-emerald-400 text-sm font-medium">{stat.trend}</span>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-4">NFT Trading Volume</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.nftVolume}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-4">NFT Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50"
      >
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New NFT Minted', time: '5 minutes ago', status: 'success' },
            { action: 'Reward Distributed', time: '2 hours ago', status: 'success' },
            { action: 'Mission Created', time: '4 hours ago', status: 'success' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
              <div>
                <h4 className="font-medium text-white">{activity.action}</h4>
                <p className="text-sm text-slate-400">{activity.time}</p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-500 rounded-full text-sm">
                Success
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}; 