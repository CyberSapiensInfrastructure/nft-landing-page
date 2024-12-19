import { useState } from 'react';
import { motion } from 'framer-motion';

export const ContractActions = () => {
  const [mintAmount, setMintAmount] = useState('');
  const [missionData, setMissionData] = useState({ title: '', description: '', reward: '' });
  const [rewardAmount, setRewardAmount] = useState('');

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
    <div className="space-y-6">
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