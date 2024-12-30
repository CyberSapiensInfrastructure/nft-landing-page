import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { ethers } from 'ethers';
import { F8__factory } from "../../typechain-types/factories/F8__factory";
import { F8 } from "typechain-types/F8";
import { Toast } from "../components/common/Toast";
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

const sortOptions = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'reward-high', label: 'Highest Reward' },
  { id: 'reward-low', label: 'Lowest Reward' },
];

const LoadingCard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden"
  >
    <div className="animate-pulse">
      <div className="h-48 bg-slate-700"></div>
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <div className="h-6 w-32 bg-slate-700 rounded"></div>
          <div className="h-4 w-24 bg-slate-700 rounded"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-slate-700 rounded"></div>
          <div className="h-4 w-full bg-slate-700 rounded"></div>
        </div>
        <div className="h-10 w-full bg-slate-700 rounded-lg"></div>
      </div>
    </div>
  </motion.div>
);

const EmptyState = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center py-16 bg-gradient-to-r from-purple-500/5 via-slate-800/50 to-purple-500/5 rounded-xl border border-purple-500/10 backdrop-blur-xl"
  >
    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/10 flex items-center justify-center">
      <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">No Missions Found</h3>
    <p className="text-gray-400">{message}</p>
  </motion.div>
);

const MissionCard = ({ mission, selectedTokenId, isLoading, onClaim }: { 
  mission: MissionData; 
  selectedTokenId: string;
  isLoading: boolean;
  onClaim: () => void;
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`group bg-slate-800/50 backdrop-blur-sm rounded-xl border transition-all duration-300 overflow-hidden
        ${mission.isComplete 
          ? 'border-green-500/20 hover:border-green-500/40' 
          : mission.canClaim 
            ? 'border-purple-500/20 hover:border-purple-500/40'
            : 'border-slate-700/50 hover:border-slate-600/50'
        }`}
    >
      {/* Mission Image */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img 
          src="/src/assets/img/mission.png"
          alt={mission.missionName}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm
            ${mission.isComplete 
              ? 'bg-green-500/20 text-green-500 border border-green-500/20' 
              : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20'
            }`}
          >
            {mission.isComplete ? 'Completed' : 'Active'}
          </span>
          {selectedTokenId && mission.canClaim && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-500 border border-purple-500/20 backdrop-blur-sm">
              Eligible for Claim
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Mission Header */}
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
            {mission.missionName}
          </h3>
          <p className="text-sm text-gray-400">Mission #{mission.missionId}</p>
        </div>

        {/* Mission Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-slate-700/30 backdrop-blur-sm">
            <span className="text-gray-400">Mission Amount</span>
            <span className="text-white font-medium">{ethers.utils.formatEther(mission.missionAmount)} AVAX</span>
          </div>
          <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-slate-700/30 backdrop-blur-sm">
            <span className="text-gray-400">Reborn Amount</span>
            <span className="text-white font-medium">{ethers.utils.formatEther(mission.rebornAmount)} AVAX</span>
          </div>
          <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-slate-700/30 backdrop-blur-sm">
            <span className="text-gray-400">Expires</span>
            <span className="text-white font-medium">
              {new Date(mission.expiryDate.toNumber() * 1000).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Claim Button */}
        {!mission.isComplete && selectedTokenId && (
          <motion.button
            onClick={onClaim}
            disabled={!mission.canClaim || isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-purple-500/50 disabled:to-purple-600/50 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-medium text-white text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
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
  );
};

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
  const [activeSort, setActiveSort] = useState('newest');
  const hasFetchedRef = useRef(false);

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
  const getMissions = useCallback(async () => {
    if (!f8Contract || !account || (hasFetchedRef.current && !selectedTokenId)) return;

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
      sortMissions(formattedMissions, activeSort);
      if (!selectedTokenId) {
        hasFetchedRef.current = true;
      }
    } catch (error) {
      const errorMessage = handleError(error);
      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  }, [f8Contract, account, selectedTokenId, activeSort]);

  // Initial fetch when contract and account are ready
  useEffect(() => {
    if (f8Contract && account && !hasFetchedRef.current) {
      getMissions();
    }
  }, [f8Contract, account, getMissions]);

  // Reset fetch flag when account changes
  useEffect(() => {
    hasFetchedRef.current = false;
  }, [account]);

  // Fetch when token ID changes
  useEffect(() => {
    if (selectedTokenId && f8Contract && account) {
      getMissions();
    }
  }, [selectedTokenId, getMissions]);

  // Sort missions
  const sortMissions = (missionList: MissionData[], sort: string) => {
    let sorted = [...missionList];

    switch (sort) {
      case 'newest':
        sorted.sort((a, b) => b.missionId.localeCompare(a.missionId));
        break;
      case 'oldest':
        sorted.sort((a, b) => a.missionId.localeCompare(b.missionId));
        break;
      case 'reward-high':
        sorted.sort((a, b) => b.rebornAmount.sub(a.rebornAmount).toNumber());
        break;
      case 'reward-low':
        sorted.sort((a, b) => a.rebornAmount.sub(b.rebornAmount).toNumber());
        break;
    }

    setFilteredMissions(sorted);
  };

  // Effect for sorting
  useEffect(() => {
    sortMissions(missions, activeSort);
  }, [activeSort, missions]);

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

  return (
    <div className="min-h-screen py-20 bg-[#0c0c0c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section with Animated Background */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500/10 via-slate-900 to-purple-500/10 p-8"
        >
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
          <div className="absolute inset-0 flex items-center justify-center bg-[#0c0c0c] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Providence Missions
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Complete missions to earn rewards and unlock special features. Connect your wallet and select an NFT to participate.
            </p>
          </div>
        </motion.div>

        {!account ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 bg-gradient-to-r from-purple-500/5 via-slate-800/50 to-purple-500/5 rounded-xl border border-purple-500/10 backdrop-blur-xl"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Wallet Not Connected</h3>
            <p className="text-gray-400 mb-6">Connect your wallet to view and participate in missions</p>
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
              {/* Token ID Input and Sort */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <div className="bg-gradient-to-r from-purple-500/5 via-slate-800/50 to-purple-500/5 rounded-xl border border-purple-500/10 p-6 backdrop-blur-xl">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Enter your NFT Token ID to check mission eligibility
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={selectedTokenId}
                        onChange={(e) => setSelectedTokenId(e.target.value)}
                        placeholder="Enter Token ID"
                        className="flex-1 p-2 rounded-lg bg-slate-700/50 text-white border border-purple-500/20 focus:border-purple-500 focus:outline-none placeholder-gray-500"
                      />
                      <button
                        onClick={getMissions}
                        disabled={!selectedTokenId || isLoading}
                        className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                      >
                        {isLoading ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          'Check'
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-64">
                  <select
                    value={activeSort}
                    onChange={(e) => setActiveSort(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gradient-to-r from-purple-500/5 via-slate-800/50 to-purple-500/5 border border-purple-500/10 text-white focus:outline-none focus:border-purple-500 backdrop-blur-xl"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id} className="bg-slate-800">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
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
                {isLoading ? (
                  <>
                    <LoadingCard />
                    <LoadingCard />
                    <LoadingCard />
                  </>
                ) : filteredMissions.length > 0 ? (
                  filteredMissions.map((mission) => (
                    <MissionCard
                      key={mission.missionId}
                      mission={mission}
                      selectedTokenId={selectedTokenId}
                      isLoading={isLoading}
                      onClaim={() => claimMissionReward(mission.missionId, selectedTokenId)}
                    />
                  ))
                ) : (
                  <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <EmptyState message="No missions available at the moment" />
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-slate-800/90 rounded-xl p-8 max-w-sm w-full mx-4 text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white font-medium">{loadingMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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