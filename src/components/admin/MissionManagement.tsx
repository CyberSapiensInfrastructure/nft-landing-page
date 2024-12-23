import { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import { F8__factory } from "typechain-types/factories/F8__factory";
import { F8 } from "typechain-types/F8";
import { FormInput } from "../common/FormInput";
import { LoadingOverlay } from "../common/LoadingOverlay";
import { Toast } from "../common/Toast";
import { useWallet } from "../../hooks/useWallet";
import { validateEthereumAddress, handleError } from "../../utils/validation";

const F8_ADDRESS = '0x4684059c10Cc9b9E3013c953182E2e097B8d089d';

interface MissionData {
  missionId: string;
  missionName: string;
  missionAmount: BigNumber;
  rebornAmount: BigNumber;
  isComplete: boolean;
  expiryDate: BigNumber;
}

export const MissionManagement = () => {
  const { signer, userAddress, connectWallet, disconnectWallet, isConnecting } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [f8Contract, setF8Contract] = useState<F8 | null>(null);
  const [missions, setMissions] = useState<MissionData[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'view' | 'claim'>('view');

  // Initialize contract when signer is available
  useEffect(() => {
    if (signer) {
      const contract = F8__factory.connect(F8_ADDRESS, signer);
      setF8Contract(contract);
    }
  }, [signer]);

  // Get all missions
  const getMissions = async () => {
    if (!f8Contract || !userAddress) return;

    try {
      setIsLoading(true);
      setLoadingMessage("Fetching missions...");

      const missionCounter = await f8Contract.getMissionCounter();
      const missionPromises = [];

      for (let i = 0; i < missionCounter.toNumber(); i++) {
        missionPromises.push(f8Contract.viewMission(i));
      }

      const missionResults = await Promise.all(missionPromises);
      const formattedMissions = missionResults.map((mission, index) => ({
        missionId: index.toString(),
        missionName: mission.missionName,
        missionAmount: mission.missionAmount,
        rebornAmount: mission.rebornAmount,
        isComplete: mission.isComplete,
        expiryDate: mission.expiryDate
      }));

      setMissions(formattedMissions);
      
      setToastMessage("Missions fetched successfully!");
      setToastType('success');
      setShowToast(true);
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
  const claimReward = async (missionId: string, tokenId: string) => {
    if (!f8Contract) return;

    try {
      setIsLoading(true);
      setLoadingMessage("Claiming reward...");

      const tx = await f8Contract.missionRewardClaim(missionId, tokenId);
      await tx.wait();

      setToastMessage("Reward claimed successfully!");
      setToastType('success');
      setShowToast(true);
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

  // Load missions when component mounts
  useEffect(() => {
    if (userAddress && missions.length === 0) {
      getMissions();
    }
  }, [userAddress]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header with Connect Wallet */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Mission Management</h1>
        {!userAddress ? (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="bg-purple-500 hover:bg-purple-600 px-6 py-2 rounded-lg font-medium text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Connect Wallet
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Connected Wallet</p>
              <p className="text-white font-medium">{userAddress.slice(0, 6)}...{userAddress.slice(-4)}</p>
            </div>
            <button
              onClick={disconnectWallet}
              className="bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      {userAddress && (
        <div className="border-b border-slate-700">
          <nav className="-mb-px flex gap-4">
            <button
              onClick={() => setActiveTab('view')}
              className={`py-2 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors
                ${activeTab === 'view'
                  ? 'border-purple-500 text-purple-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Missions
            </button>
            <button
              onClick={() => setActiveTab('claim')}
              className={`py-2 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors
                ${activeTab === 'claim'
                  ? 'border-purple-500 text-purple-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Claim Rewards
            </button>
          </nav>
        </div>
      )}

      {/* Mission List */}
      {userAddress && activeTab === 'view' && (
        <div className="bg-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Available Missions</h2>
            <button
              onClick={getMissions}
              disabled={isLoading}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium text-white text-sm"
            >
              Refresh
            </button>
          </div>
          {missions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <p className="mt-4 text-gray-400">No missions available</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {missions.map((mission) => (
                <div key={mission.missionId} className="bg-slate-700 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{mission.missionName}</h3>
                      <p className="text-sm text-gray-400">Mission #{mission.missionId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${mission.isComplete ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                      {mission.isComplete ? 'Completed' : 'Active'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Mission Amount</p>
                      <p className="text-white font-medium">{ethers.utils.formatEther(mission.missionAmount)} AVAX</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Reward Amount</p>
                      <p className="text-white font-medium">{ethers.utils.formatEther(mission.rebornAmount)} AVAX</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Expires</p>
                    <p className="text-white font-medium">
                      {new Date(mission.expiryDate.toNumber() * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Claim Rewards */}
      {userAddress && activeTab === 'claim' && (
        <div className="bg-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">Claim Mission Rewards</h2>
          <div className="grid gap-6">
            <FormInput
              label="Mission ID"
              value=""
              onChange={() => {}}
              placeholder="Enter mission ID"
              helperText="Enter the ID of the mission you want to claim rewards for"
            />
            <FormInput
              label="Token ID"
              value=""
              onChange={() => {}}
              placeholder="Enter token ID"
              helperText="Enter the ID of your NFT token"
            />
            <button
              onClick={() => {}}
              disabled={isLoading}
              className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium text-white"
            >
              Claim Reward
            </button>
          </div>
        </div>
      )}

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