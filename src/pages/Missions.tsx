import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { ethers } from 'ethers';
import { F8__factory } from "../../typechain-types/factories/F8__factory";
import { F8 } from "../../typechain-types/F8";
import { Toast } from "../components/common/Toast";
import { handleError } from "../utils/validation";
import { MissionDetail } from "../components/MissionDetail";

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

const formatExpiryDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return "Expired";
  }
  
  if (diffDays === 0) {
    return "Expires Today";
  }
  
  if (diffDays === 1) {
    return "Expires Tomorrow";
  }
  
  if (diffDays <= 7) {
    return `Expires in ${diffDays} days`;
  }
  
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return `Expires on ${date.toLocaleDateString('en-US', options)}`;
};

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

const MissionCard = ({ mission, selectedTokenId, isLoading, onClaim, onClick }: { 
  mission: MissionData; 
  selectedTokenId: string;
  isLoading: boolean;
  onClaim: () => void;
  onClick: () => void;
}) => {
  const isExpired = new Date(mission.expiryDate.toNumber() * 1000) < new Date();
  
  // Handle claim button click
  const handleClaimClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClaim();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`group bg-slate-800/50 backdrop-blur-sm rounded-xl border transition-all duration-300 overflow-hidden hover:shadow-xl hover:-translate-y-1
        ${mission.isComplete 
          ? 'border-green-500/20 hover:border-green-500/40' 
          : isExpired
            ? 'border-red-500/20 hover:border-red-500/40 opacity-75'
            : mission.canClaim 
              ? 'border-purple-500/20 hover:border-purple-500/40'
              : 'border-slate-700/50 hover:border-slate-600/50'
        }`}
    >
      {/* Mission Image */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 ${isExpired ? 'bg-red-900/20' : ''}`} />
        <img 
          src="/src/assets/img/mission.png"
          alt={mission.missionName}
          className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ${isExpired ? 'grayscale' : ''}`}
        />
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm
            ${mission.isComplete 
              ? 'bg-green-500/20 text-green-500 border border-green-500/20' 
              : isExpired
                ? 'bg-red-500/20 text-red-400 border border-red-500/20'
                : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20'
            }`}
          >
            {mission.isComplete 
              ? 'Completed' 
              : isExpired
                ? 'Expired'
                : 'Active'
            }
          </span>
          {selectedTokenId && mission.canClaim && !isExpired && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-500 border border-purple-500/20 backdrop-blur-sm">
              Eligible for Claim
            </span>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {/* Mission Header */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
            {mission.missionName}
          </h3>
          <p className="text-sm text-gray-400">Mission #{mission.missionId}</p>
        </div>

        {/* Mission Details */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-700/30 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Mission Amount</p>
              <p className="text-sm sm:text-base font-semibold text-white">{ethers.utils.formatEther(mission.missionAmount)} AVAX</p>
            </div>
            <div className="bg-slate-700/30 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Reborn Amount</p>
              <p className="text-sm sm:text-base font-semibold text-white">{ethers.utils.formatEther(mission.rebornAmount)} AVAX</p>
            </div>
          </div>

          <div className="bg-slate-700/30 backdrop-blur-sm rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-gray-400">Time Remaining</p>
              <span className={`text-xs font-medium ${
                new Date(mission.expiryDate.toNumber() * 1000) < new Date()
                  ? 'text-red-400'
                  : new Date(mission.expiryDate.toNumber() * 1000).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
                    ? 'text-yellow-400'
                    : 'text-white'
              }`}>
                {formatExpiryDate(mission.expiryDate.toNumber())}
              </span>
            </div>
            <div className="w-full bg-slate-600/30 rounded-full h-1.5">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  new Date(mission.expiryDate.toNumber() * 1000) < new Date()
                    ? 'bg-red-500'
                    : new Date(mission.expiryDate.toNumber() * 1000).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
                      ? 'bg-yellow-500'
                      : 'bg-purple-500'
                }`}
                style={{
                  width: `${Math.max(0, Math.min(100, (new Date(mission.expiryDate.toNumber() * 1000).getTime() - new Date().getTime()) / (7 * 24 * 60 * 60 * 1000) * 100))}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClick}
            className="flex-1 bg-slate-700/50 hover:bg-slate-700/70 px-4 py-2.5 rounded-lg font-medium text-white text-sm inline-flex items-center justify-center gap-2 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Details
          </button>

          {!mission.isComplete && selectedTokenId && (
            <motion.button
              onClick={handleClaimClick}
              disabled={!mission.canClaim || isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-purple-500/50 disabled:to-purple-600/50 disabled:cursor-not-allowed px-4 py-2.5 rounded-lg font-medium text-white text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Claiming...
                </>
              ) : (
                <>
                  {mission.canClaim ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Claim
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Not Eligible
                    </>
                  )}
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const Missions: React.FC = () => {
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
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);

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
        sorted.sort((a, b) => (b.rebornAmount.gt(a.rebornAmount) ? 1 : -1));
        break;
      case 'reward-low':
        sorted.sort((a, b) => (a.rebornAmount.gt(b.rebornAmount) ? 1 : -1));
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
            <div className="space-y-8">
              {/* Active Missions */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  Active Missions
                </h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {isLoading ? (
                      <>
                        <LoadingCard />
                        <LoadingCard />
                        <LoadingCard />
                      </>
                    ) : filteredMissions.filter(m => 
                        !m.isComplete && 
                        new Date(m.expiryDate.toNumber() * 1000) > new Date()
                      ).length > 0 ? (
                      filteredMissions
                        .filter(m => 
                          !m.isComplete && 
                          new Date(m.expiryDate.toNumber() * 1000) > new Date()
                        )
                        .map((mission) => (
                          <MissionCard
                            key={mission.missionId}
                            mission={mission}
                            selectedTokenId={selectedTokenId}
                            isLoading={isLoading}
                            onClaim={() => claimMissionReward(mission.missionId, selectedTokenId)}
                            onClick={() => setSelectedMissionId(mission.missionId)}
                          />
                        ))
                    ) : (
                      <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <EmptyState message="No active missions available at the moment" />
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Expired & Completed Missions */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  Expired & Completed Missions
                </h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {isLoading ? (
                      <>
                        <LoadingCard />
                        <LoadingCard />
                        <LoadingCard />
                      </>
                    ) : filteredMissions.filter(m => 
                        m.isComplete || 
                        new Date(m.expiryDate.toNumber() * 1000) <= new Date()
                      ).length > 0 ? (
                      filteredMissions
                        .filter(m => 
                          m.isComplete || 
                          new Date(m.expiryDate.toNumber() * 1000) <= new Date()
                        )
                        .map((mission) => (
                          <MissionCard
                            key={mission.missionId}
                            mission={mission}
                            selectedTokenId={selectedTokenId}
                            isLoading={isLoading}
                            onClaim={() => claimMissionReward(mission.missionId, selectedTokenId)}
                            onClick={() => setSelectedMissionId(mission.missionId)}
                          />
                        ))
                    ) : (
                      <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <EmptyState message="No expired or completed missions" />
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
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

      {/* Mission Detail Modal */}
      <AnimatePresence>
        {selectedMissionId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMissionId(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              {/* Header */}
              <div className="sticky top-0 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 p-6 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-white">Mission Details</h2>
                <button
                  onClick={() => setSelectedMissionId(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {(() => {
                  const mission = filteredMissions.find(m => m.missionId === selectedMissionId);
                  if (!mission) return null;

                  const isExpired = new Date(mission.expiryDate.toNumber() * 1000) < new Date();

                  return (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{mission.missionName}</h3>
                          <p className="text-sm text-gray-400 mt-1">Mission #{mission.missionId}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          mission.isComplete 
                            ? "bg-green-500/20 text-green-500" 
                            : isExpired
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-500"
                        }`}>
                          {mission.isComplete 
                            ? "Completed" 
                            : isExpired
                              ? "Expired"
                              : "Active"
                          }
                        </span>
                      </div>

                      {/* Mission Image */}
                      <div className="relative h-48 rounded-xl overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 ${isExpired ? 'bg-red-900/20' : ''}`} />
                        <img 
                          src="/src/assets/img/mission.png"
                          alt={mission.missionName}
                          className={`w-full h-full object-cover ${isExpired ? 'grayscale' : ''}`}
                        />
                      </div>

                      {/* Mission Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-700/50 rounded-xl p-4 space-y-1">
                          <p className="text-sm text-gray-400">Mission Amount</p>
                          <p className="text-lg font-semibold text-white">
                            {ethers.utils.formatEther(mission.missionAmount)} AVAX
                          </p>
                        </div>
                        <div className="bg-slate-700/50 rounded-xl p-4 space-y-1">
                          <p className="text-sm text-gray-400">Reborn Amount</p>
                          <p className="text-lg font-semibold text-white">
                            {ethers.utils.formatEther(mission.rebornAmount)} AVAX
                          </p>
                        </div>
                      </div>

                      {/* Expiry Status */}
                      <div className={`bg-slate-700/50 rounded-xl p-6 space-y-3 ${
                        isExpired ? 'border border-red-500/20' : ''
                      }`}>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-400">Mission Status</p>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isExpired
                              ? 'bg-red-500/20 text-red-400'
                              : new Date(mission.expiryDate.toNumber() * 1000).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {formatExpiryDate(mission.expiryDate.toNumber())}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="w-full bg-slate-600/30 rounded-full h-2">
                            <div 
                              className={`h-full rounded-full ${
                                isExpired
                                  ? 'bg-red-500'
                                  : new Date(mission.expiryDate.toNumber() * 1000).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
                                    ? 'bg-yellow-500'
                                    : 'bg-purple-500'
                              }`}
                              style={{
                                width: `${Math.max(0, Math.min(100, (new Date(mission.expiryDate.toNumber() * 1000).getTime() - new Date().getTime()) / (7 * 24 * 60 * 60 * 1000) * 100))}%`
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 text-center">
                            {isExpired ? (
                              <span className="text-red-400">Mission has expired</span>
                            ) : (
                              `Exact expiry: ${new Date(mission.expiryDate.toNumber() * 1000).toLocaleString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}`
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Claim Button */}
                      {!mission.isComplete && selectedTokenId && !isExpired && (
                        <button
                          onClick={() => claimMissionReward(mission.missionId, selectedTokenId)}
                          disabled={!mission.canClaim || isLoading}
                          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-purple-500/50 disabled:to-purple-600/50 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-medium text-white text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
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
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Missions; 