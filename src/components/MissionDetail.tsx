import { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import { F8__factory } from "../../typechain-types/factories/F8__factory";
import { F8 } from "typechain-types/F8";
import { Toast } from "./common/Toast";
import { LoadingOverlay } from "./common/LoadingOverlay";
import { handleError } from "../utils/validation";

const F8_ADDRESS = "0x4684059c10Cc9b9E3013c953182E2e097B8d089d";

interface MissionData {
  missionId: string;
  missionName: string;
  missionAmount: BigNumber;
  rebornAmount: BigNumber;
  isComplete: boolean;
  expiryDate: BigNumber;
  canClaim?: boolean;
}

interface MissionDetailProps {
  provider: ethers.providers.Web3Provider | null;
  account: string | null;
  missionId: string;
  onClose: () => void;
}

export const MissionDetail: React.FC<MissionDetailProps> = ({
  provider,
  account,
  missionId,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [f8Contract, setF8Contract] = useState<F8 | null>(null);
  const [mission, setMission] = useState<MissionData | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState<string>("");
  const [userTokens, setUserTokens] = useState<string[]>([]);

  // Initialize contract when provider is available
  useEffect(() => {
    if (provider && account) {
      const signer = provider.getSigner();
      const contract = F8__factory.connect(F8_ADDRESS, signer);
      setF8Contract(contract);
    }
  }, [provider, account]);

  // Get mission details
  const getMissionDetails = async () => {
    if (!f8Contract || !account) return;

    try {
      setIsLoading(true);
      setLoadingMessage("Fetching mission details...");

      const missionData = await f8Contract.viewMission(missionId);
      const canClaim = selectedTokenId
        ? await f8Contract.missionStatus(account, missionId, selectedTokenId)
        : false;

      setMission({
        missionId,
        missionName: missionData.missionName,
        missionAmount: missionData.missionAmount,
        rebornAmount: missionData.rebornAmount,
        isComplete: missionData.isComplete,
        expiryDate: missionData.expiryDate,
        canClaim,
      });

      // Get user's tokens
      const tokens = await f8Contract.getList(account);
      setUserTokens(tokens.map(t => t.toString()));

    } catch (error) {
      const errorMessage = handleError(error);
      setToastMessage(errorMessage);
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  // Load mission details on mount
  useEffect(() => {
    getMissionDetails();
  }, [f8Contract, account, missionId, selectedTokenId]);

  // Claim mission reward
  const handleClaimReward = async () => {
    if (!f8Contract || !selectedTokenId) return;

    try {
      setIsLoading(true);
      setLoadingMessage("Claiming reward...");

      const tx = await f8Contract.missionRewardClaim(missionId, selectedTokenId);
      
      setLoadingMessage("Waiting for confirmation...");
      await tx.wait();

      setToastMessage("Mission reward claimed successfully!");
      setToastType("success");
      setShowToast(true);
      getMissionDetails();
    } catch (error) {
      const errorMessage = handleError(error);
      setToastMessage(errorMessage);
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  if (!mission) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Mission Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Mission Info */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">{mission.missionName}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                mission.isComplete ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"
              }`}>
                {mission.isComplete ? "Completed" : "Active"}
              </span>
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

            {/* Expiry Date */}
            <div className="bg-slate-700/50 rounded-xl p-4 space-y-1">
              <p className="text-sm text-gray-400">Expires On</p>
              <p className="text-lg font-semibold text-white">
                {new Date(mission.expiryDate.toNumber() * 1000).toLocaleDateString()} at{" "}
                {new Date(mission.expiryDate.toNumber() * 1000).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* NFT Selection */}
          {userTokens.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Select NFT to Claim</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {userTokens.map((tokenId) => (
                  <button
                    key={tokenId}
                    onClick={() => setSelectedTokenId(tokenId)}
                    className={`p-4 rounded-xl border ${
                      selectedTokenId === tokenId
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-slate-600 hover:border-purple-500/50"
                    } transition-all duration-200`}
                  >
                    <p className="text-white font-medium">Token #{tokenId}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Claim Button */}
          {!mission.isComplete && (
            <div className="flex justify-end">
              <button
                onClick={handleClaimReward}
                disabled={!selectedTokenId || !mission.canClaim || isLoading}
                className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium text-white transition-colors"
              >
                {isLoading ? "Processing..." : "Claim Reward"}
              </button>
            </div>
          )}
        </div>
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