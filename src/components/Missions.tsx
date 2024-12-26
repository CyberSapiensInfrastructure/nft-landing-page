import { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import { F8__factory } from "typechain-types/factories/F8__factory";
import { F8 } from "typechain-types/F8";
import { Toast } from "./common/Toast";
import { LoadingOverlay } from "./common/LoadingOverlay";
import { handleError } from "../utils/validation";

const F8_ADDRESS = '0x4684059c10Cc9b9E3013c953182E2e097B8d089d';

interface MissionData {
  missionId: string;
  missionName: string;
  missionAmount: BigNumber;
  rebornAmount: BigNumber;
  isComplete: boolean;
  expiryDate: BigNumber;
  canClaim?: boolean;
}

interface MissionsProps {
  provider: ethers.providers.Web3Provider | null;
  account: string | null;
}

export const Missions: React.FC<MissionsProps> = ({ provider, account }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [f8Contract, setF8Contract] = useState<F8 | null>(null);
  const [missions, setMissions] = useState<MissionData[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showToast, setShowToast] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState<string>("");

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

  // Load missions on mount and when account changes
  useEffect(() => {
    if (account) {
      getMissions();
    }
  }, [account]);

  // Update missions when token ID changes
  useEffect(() => {
    if (selectedTokenId) {
      getMissions();
    }
  }, [selectedTokenId]);

  return (
    <section className="py-20 bg-[#0c0c0c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Available Missions</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Complete missions to earn rewards. Connect your wallet and select an NFT to participate in missions.
          </p>
        </div>

        {!account ? (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="mt-4 text-gray-400">Connect your wallet to view available missions</p>
          </div>
        ) : (
          <>
            {/* Token ID Input */}
            <div className="mb-8">
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
            </div>

            {/* Missions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {missions.map((mission) => (
                <div 
                  key={mission.missionId}
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
                        <span className="text-gray-400">Reborn Amount</span>
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
                      <button
                        onClick={() => claimMissionReward(mission.missionId, selectedTokenId)}
                        disabled={!mission.canClaim || isLoading}
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
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {missions.length === 0 && (
              <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p className="mt-4 text-gray-400">No missions available at the moment</p>
              </div>
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
    </section>
  );
}; 