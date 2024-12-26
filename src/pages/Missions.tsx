import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { ethers } from 'ethers';
import { F8__factory } from "typechain-types/factories/F8__factory";
import { F8 } from "typechain-types/F8";
import { Toast } from "../components/common/Toast";
import { LoadingOverlay } from "../components/common/LoadingOverlay";
import { handleError } from "../utils/validation";

const F8_ADDRESS = '0x4684059c10Cc9b9E3013c953182E2e097B8d089d';

interface MissionData {
  missionId: string;
  missionName: string;
  missionAmount: ethers.BigNumber;
  rebornAmount: ethers.BigNumber;
  isComplete: boolean;
  expiryDate: ethers.BigNumber;
  canClaim?: boolean;
}

interface ContextType {
  provider: ethers.providers.Web3Provider | null;
  account: string | null;
}

const filterOptions = [
  { id: 'all', label: 'All Missions' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'claimable', label: 'Claimable' },
];

const sortOptions = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'reward-high', label: 'Highest Reward' },
  { id: 'reward-low', label: 'Lowest Reward' },
];

const Missions: React.FC = () => {
  const { provider, account } = useOutletContext<ContextType>();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [f8Contract, setF8Contract] = useState<F8 | null>(null);
  const [missions, setMissions] = useState<MissionData[]>([]);
  const [filteredMissions, setFilteredMissions] = useState<MissionData[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showToast, setShowToast] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSort, setActiveSort] = useState('newest');

  // Initialize contract when provider is available
  useEffect(() => {
    if (provider) {
      const signer = provider.getSigner();
      const contract = F8__factory.connect(F8_ADDRESS, signer);
      setF8Contract(contract);
    }
  }, [provider]);

  // Check if user can claim mission reward
  const checkMissionStatus = async (missionId: string, tokenId: string) => {
    if (!f8Contract || !account) return false;

    try {
      const status = await f8Contract.missionStatus(account, missionId, tokenId);
      return status;
    } catch (error) {
      console.error("Error checking mission status:", error);
      return false;
    }
  };

  // Get all missions with claim status
  const getMissions = async () => {
    if (!f8Contract || !account) return;

    try {
      setIsLoading(true);
      setLoadingMessage("Fetching missions...");

      const missionCounter = await f8Contract.getMissionCounter();
      const missionPromises = [];

      for (let i = 0; i < missionCounter.toNumber(); i++) {
        missionPromises.push(f8Contract.viewMission(i));
      }

      const missionResults = await Promise.all(missionPromises);
      const formattedMissions = await Promise.all(missionResults.map(async (mission, index) => {
        const canClaim = selectedTokenId ? await checkMissionStatus(index.toString(), selectedTokenId) : false;
        return {
          missionId: index.toString(),
          missionName: mission.missionName,
          missionAmount: mission.missionAmount,
          rebornAmount: mission.rebornAmount,
          isComplete: mission.isComplete,
          expiryDate: mission.expiryDate,
          canClaim
        };
      }));

      setMissions(formattedMissions);
      filterAndSortMissions(formattedMissions, activeFilter, activeSort, searchQuery);
    } catch (error) {
      const errorMessage = handleError(error);
      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  // Filter and sort missions
  const filterAndSortMissions = (
    missionList: MissionData[],
    filter: string,
    sort: string,
    search: string
  ) => {
    let filtered = [...missionList];

    // Apply search
    if (search) {
      filtered = filtered.filter(mission =>
        mission.missionName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply filter
    switch (filter) {
      case 'active':
        filtered = filtered.filter(mission => !mission.isComplete);
        break;
      case 'completed':
        filtered = filtered.filter(mission => mission.isComplete);
        break;
      case 'claimable':
        filtered = filtered.filter(mission => mission.canClaim);
        break;
    }

    // Apply sort
    switch (sort) {
      case 'newest':
        filtered.sort((a, b) => b.missionId.localeCompare(a.missionId));
        break;
      case 'oldest':
        filtered.sort((a, b) => a.missionId.localeCompare(b.missionId));
        break;
      case 'reward-high':
        filtered.sort((a, b) => b.rebornAmount.sub(a.rebornAmount).toNumber());
        break;
      case 'reward-low':
        filtered.sort((a, b) => a.rebornAmount.sub(b.rebornAmount).toNumber());
        break;
    }

    setFilteredMissions(filtered);
  };

  // Claim mission reward
  const claimMissionReward = async (missionId: string, tokenId: string) => {
    if (!f8Contract) return;

    try {
      setIsLoading(true);
      setLoadingMessage("Claiming reward...");

      const gasEstimate = await f8Contract.estimateGas.missionRewardClaim(missionId, tokenId);
      
      const tx = await f8Contract.missionRewardClaim(missionId, tokenId, {
        gasLimit: Math.floor(gasEstimate.toNumber() * 1.2)
      });

      setLoadingMessage("Waiting for confirmation...");
      await tx.wait();

      setToastMessage("Mission reward claimed successfully!");
      setToastType('success');
      setShowToast(true);
      
      // Refresh missions after claiming
      getMissions();
    } catch (error) {
      const errorMessage = handleError(error);
      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  // Effect hooks for filtering and data fetching
  useEffect(() => {
    if (account) {
      getMissions();
    }
  }, [account, selectedTokenId]);

  useEffect(() => {
    filterAndSortMissions(missions, activeFilter, activeSort, searchQuery);
  }, [activeFilter, activeSort, searchQuery]);

  return (
    <div className="min-h-screen py-20 bg-[#0c0c0c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Providence Missions
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Complete missions to earn rewards and unlock special features. Connect your wallet and select an NFT to participate.
          </p>
        </motion.div>

        {!account ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700/50"
          >
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="mt-4 text-gray-400">Connect your wallet to view available missions</p>
          </motion.div>
        ) : (
          <>
            {/* Controls Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 space-y-6"
            >
              {/* Token ID Input */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 max-w-md mx-auto">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Enter your NFT Token ID to check mission eligibility
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={selectedTokenId}
                    onChange={(e) => setSelectedTokenId(e.target.value)}
                    placeholder="Enter Token ID"
                    className="flex-1 p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    onClick={getMissions}
                    disabled={!selectedTokenId || isLoading}
                    className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-white font-medium"
                  >
                    Check
                  </button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search missions..."
                    className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                  <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 overflow-x-auto md:justify-center">
                  {filterOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setActiveFilter(option.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200
                        ${activeFilter === option.id
                          ? 'bg-purple-500 text-white'
                          : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <select
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value)}
                  className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-purple-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Missions Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredMissions.map((mission) => (
                  <motion.div
                    key={mission.missionId}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border transition-all duration-300
                      ${mission.isComplete 
                        ? 'border-green-500/20 hover:border-green-500/40' 
                        : mission.canClaim 
                          ? 'border-purple-500/20 hover:border-purple-500/40'
                          : 'border-slate-700/50 hover:border-slate-600/50'
                      }`}
                  >
                    <div className="p-6 space-y-4">
                      {/* Mission Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-white">{mission.missionName}</h3>
                          <p className="text-sm text-gray-400">Mission #{mission.missionId}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium
                            ${mission.isComplete 
                              ? 'bg-green-500/20 text-green-500' 
                              : 'bg-yellow-500/20 text-yellow-500'
                            }`}
                          >
                            {mission.isComplete ? 'Completed' : 'Active'}
                          </span>
                          {selectedTokenId && mission.canClaim && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-500">
                              Eligible for Claim
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Mission Details */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                          <span className="text-gray-400">Mission Amount</span>
                          <span className="text-white font-medium">{ethers.utils.formatEther(mission.missionAmount)} AVAX</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                          <span className="text-gray-400">Reward Amount</span>
                          <span className="text-white font-medium">{ethers.utils.formatEther(mission.rebornAmount)} AVAX</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-400">Expires</span>
                          <span className="text-white font-medium">
                            {new Date(mission.expiryDate.toNumber() * 1000).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Claim Button */}
                      {!mission.isComplete && selectedTokenId && (
                        <motion.button
                          onClick={() => claimMissionReward(mission.missionId, selectedTokenId)}
                          disabled={!mission.canClaim || isLoading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="mt-4 w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-medium text-white text-sm inline-flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Claiming...
                            </>
                          ) : (
                            <>
                              {mission.canClaim ? 'Claim Reward' : 'Not Eligible'}
                            </>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredMissions.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700/50"
              >
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p className="mt-4 text-gray-400">No missions found</p>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay message={loadingMessage} />}

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default Missions; 