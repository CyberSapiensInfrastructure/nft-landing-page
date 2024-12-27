import { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import { F8__factory } from "typechain-types/factories/F8__factory";
import { F8 } from "typechain-types/F8";
import { FormInput } from "../common/FormInput";
import { LoadingOverlay } from "../common/LoadingOverlay";
import { Toast } from "../common/Toast";
import { validateEthereumAddress, handleError } from "../../utils/validation";

const F8_ADDRESS = '0x4684059c10Cc9b9E3013c953182E2e097B8d089d';

interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

interface NFTMetadata {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
  attributesText: string;
  uri: string;
}

interface MissionData {
  missionId: string;
  missionName: string;
  missionAmount: BigNumber;
  rebornAmount: BigNumber;
  isComplete: boolean;
  expiryDate: BigNumber;
  canClaim?: boolean;
}

interface NewMissionForm {
  missionName: string;
  missionAmount: string;
  rebornAmount: string;
  expiryDate: string;
}

interface NFTManagementProps {
  provider: ethers.providers.Web3Provider | null;
  account: string | null;
}

export const NFTManagement: React.FC<NFTManagementProps> = ({ provider, account }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [f8Contract, setF8Contract] = useState<F8 | null>(null);
  const [mintAddress, setMintAddress] = useState("");
  const [mintAddressError, setMintAddressError] = useState("");
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata[]>([]);
  const [missions, setMissions] = useState<MissionData[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'mint' | 'list' | 'missions'>('mint');
  const [selectedTokenId, setSelectedTokenId] = useState("");
  const [showNewMissionForm, setShowNewMissionForm] = useState(false);
  const [newMission, setNewMission] = useState<NewMissionForm>({
    missionName: '',
    missionAmount: '',
    rebornAmount: '',
    expiryDate: ''
  });
  const [editingMission, setEditingMission] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<NewMissionForm>({
    missionName: '',
    missionAmount: '',
    rebornAmount: '',
    expiryDate: ''
  });

  // Initialize contract when provider is available
  useEffect(() => {
    if (provider) {
      const signer = provider.getSigner();
      const contract = F8__factory.connect(F8_ADDRESS, signer);
      setF8Contract(contract);
    }
  }, [provider]);

  // Handle minting NFT
  const handleMint = async () => {
    if (!f8Contract) return;

    const addressError = validateEthereumAddress(mintAddress);
    if (addressError) {
      setMintAddressError(addressError);
      return;
    }

    try {
      setIsLoading(true);
      setLoadingMessage("Estimating gas...");

      const gasEstimate = await f8Contract.estimateGas.mintF8(mintAddress);
      
      setLoadingMessage("Minting NFT...");
      const tx = await f8Contract.mintF8(mintAddress, {
        gasLimit: Math.floor(gasEstimate.toNumber() * 1.2)
      });

      setLoadingMessage("Waiting for confirmation...");
      await tx.wait();

      setToastMessage("NFT minted successfully!");
      setToastType('success');
      setShowToast(true);
      setMintAddress("");
      setMintAddressError("");
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

  // Get user's NFTs
  const getMyNFTs = async () => {
    if (!f8Contract || !account) return;

    try {
      setIsLoading(true);
      setLoadingMessage("Fetching your NFTs...");

      const tokenIds = await f8Contract.getList(account);

      const metadataPromises = tokenIds.map(async (tokenId: BigNumber) => {
        const uri = await f8Contract.tokenURI(tokenId);
        try {
          const proxyUrl = 'https://api.allorigins.win/get?url=';
          const response = await fetch(proxyUrl + encodeURIComponent(`${uri}.json`));
          const proxyData = await response.json();
          const metadata = JSON.parse(proxyData.contents);
          
          return {
            tokenId: tokenId.toString(),
            name: metadata.name || `F8 NFT #${tokenId}`,
            description: metadata.description || "Providence NFT",
            image: metadata.image || `http://cybersapiens.xyz/f8/img/${tokenId}.png`,
            attributes: metadata.attributes || [],
            attributesText: metadata.attributes
              ? metadata.attributes
                  .map((attr: NFTAttribute) => `${attr.trait_type}: ${attr.value}`)
                  .join(", ")
              : "",
            uri
          };
        } catch (error) {
          console.error(`Error fetching metadata for token ${tokenId}:`, error);
          return {
            tokenId: tokenId.toString(),
            name: `F8 NFT #${tokenId}`,
            description: "Providence NFT",
            image: `http://cybersapiens.xyz/f8/img/${tokenId}.png`,
            attributes: [],
            attributesText: "",
            uri
          };
        }
      });

      const metadata = await Promise.all(metadataPromises);
      setNftMetadata(metadata);
      
      setToastMessage("NFTs fetched successfully!");
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

  // Load data when tab changes
  useEffect(() => {
    if (!account) return;

    if (activeTab === 'list' && nftMetadata.length === 0) {
      getMyNFTs();
    } else if (activeTab === 'missions' && missions.length === 0) {
      getMissions();
    }
  }, [activeTab, account]);

  // Update missions when token ID changes
  useEffect(() => {
    if (activeTab === 'missions' && selectedTokenId) {
      getMissions();
    }
  }, [selectedTokenId, activeTab]);

  // Create new mission
  const handleCreateMission = async () => {
    if (!f8Contract) return;

    try {
      setIsLoading(true);
      setLoadingMessage("Creating new mission...");

      const missionAmount = ethers.utils.parseEther(newMission.missionAmount);
      const rebornAmount = ethers.utils.parseEther(newMission.rebornAmount);
      const expiryTimestamp = Math.floor(new Date(newMission.expiryDate).getTime() / 1000);

      const gasEstimate = await f8Contract.estimateGas.insertMission(
        newMission.missionName,
        missionAmount,
        rebornAmount,
        expiryTimestamp
      );

      const tx = await f8Contract.insertMission(
        newMission.missionName,
        missionAmount,
        rebornAmount,
        expiryTimestamp,
        {
          gasLimit: Math.floor(gasEstimate.toNumber() * 1.2)
        }
      );

      setLoadingMessage("Waiting for confirmation...");
      await tx.wait();

      setToastMessage("Mission created successfully!");
      setToastType('success');
      setShowToast(true);
      setShowNewMissionForm(false);
      setNewMission({
        missionName: '',
        missionAmount: '',
        rebornAmount: '',
        expiryDate: ''
      });
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

  // Update existing mission
  const handleUpdateMission = async (missionId: string) => {
    if (!f8Contract) return;

    try {
      setIsLoading(true);
      setLoadingMessage("Updating mission...");

      const missionAmount = ethers.utils.parseEther(editForm.missionAmount);
      const rebornAmount = ethers.utils.parseEther(editForm.rebornAmount);
      const expiryTimestamp = Math.floor(new Date(editForm.expiryDate).getTime() / 1000);

      const gasEstimate = await f8Contract.estimateGas.updateMission(
        missionId,
        editForm.missionName,
        missionAmount,
        rebornAmount,
        false, // isComplete
        expiryTimestamp
      );

      const tx = await f8Contract.updateMission(
        missionId,
        editForm.missionName,
        missionAmount,
        rebornAmount,
        false,
        expiryTimestamp,
        {
          gasLimit: Math.floor(gasEstimate.toNumber() * 1.2)
        }
      );

      setLoadingMessage("Waiting for confirmation...");
      await tx.wait();

      setToastMessage("Mission updated successfully!");
      setToastType('success');
      setShowToast(true);
      setEditingMission(null);
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

  // Start editing mission
  const startEditingMission = (mission: MissionData) => {
    setEditingMission(mission.missionId);
    setEditForm({
      missionName: mission.missionName,
      missionAmount: ethers.utils.formatEther(mission.missionAmount),
      rebornAmount: ethers.utils.formatEther(mission.rebornAmount),
      expiryDate: new Date(mission.expiryDate.toNumber() * 1000).toISOString().split('T')[0]
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-700">
        <nav className="-mb-px flex gap-4">
          <button
            onClick={() => setActiveTab('mint')}
            className={`py-2 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'mint'
                ? 'border-purple-500 text-purple-500'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Mint NFT
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`py-2 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'list'
                ? 'border-purple-500 text-purple-500'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            My NFTs
          </button>
          <button
            onClick={() => setActiveTab('missions')}
            className={`py-2 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'missions'
                ? 'border-purple-500 text-purple-500'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Missions
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-slate-800 rounded-xl p-6">
        {/* Connect Wallet Button */}
        {!account ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="mt-4 text-gray-400">Connect your wallet to access {activeTab === 'mint' ? 'minting' : activeTab === 'list' ? 'your NFTs' : 'missions'}</p>
            <button
              onClick={() => {}}
              className="mt-4 bg-purple-500 hover:bg-purple-600 px-6 py-2 rounded-lg font-medium text-white inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            {/* Connected Wallet Info */}
            <div className="flex justify-end mb-6">
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Connected Wallet</p>
                  <p className="text-white font-medium">{account.slice(0, 6)}...{account.slice(-4)}</p>
                </div>
                <button
                  onClick={() => {}}
                  className="bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mint NFT Form */}
            {activeTab === 'mint' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Mint NFT</h2>
                <FormInput
                  label="Recipient Address"
                  value={mintAddress}
                  onChange={setMintAddress}
                  error={mintAddressError}
                  placeholder="0x..."
                  helperText="Enter the address that will receive the NFT"
                />
                <button
                  onClick={handleMint}
                  disabled={!mintAddress || !!mintAddressError || isLoading}
                  className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium text-white"
                >
                  Mint NFT
                </button>
              </div>
            )}

            {/* NFT List */}
            {activeTab === 'list' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Your NFTs</h2>
                  <button
                    onClick={getMyNFTs}
                    disabled={isLoading}
                    className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium text-white text-sm"
                  >
                    Refresh
                  </button>
                </div>
                {nftMetadata.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-4 text-gray-400">You don't have any NFTs yet</p>
                    <button
                      onClick={() => setActiveTab('mint')}
                      className="mt-4 text-purple-500 hover:text-purple-400 font-medium inline-flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Mint your first NFT
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nftMetadata.map((nft) => (
                      <div 
                        key={nft.tokenId} 
                        onClick={() => setSelectedTokenId(nft.tokenId)}
                        className={`bg-slate-700/50 rounded-lg overflow-hidden border border-slate-600 hover:border-purple-500 transition-all duration-200 cursor-pointer ${
                          selectedTokenId === nft.tokenId ? 'ring-2 ring-purple-500 bg-purple-500/5' : ''
                        }`}
                      >
                        <div className="aspect-square w-full relative">
                          <img 
                            src={nft.image} 
                            alt={nft.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-white">{nft.name}</h3>
                            <span className="text-sm text-purple-400">F8 NFT</span>
                          </div>
                          
                          <p className="text-gray-300 text-sm">{nft.description}</p>
                          
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-400">Attributes</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {nft.attributes.map((attr, index) => (
                                <div 
                                  key={index} 
                                  className="bg-slate-600/50 rounded px-3 py-2 text-sm"
                                >
                                  <div className="text-gray-400">{attr.trait_type}</div>
                                  <div className="text-white font-medium">{attr.value}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="pt-2 border-t border-slate-600">
                            <a 
                              href={`${nft.uri}.json`} 
                              target="_blank"
                              rel="noopener noreferrer" 
                              className="text-purple-400 hover:text-purple-300 text-sm inline-flex items-center gap-1"
                            >
                              View Metadata
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Missions */}
            {activeTab === 'missions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Mission Management</h2>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowNewMissionForm(!showNewMissionForm)}
                      className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg font-medium text-white text-sm inline-flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {showNewMissionForm ? 'Cancel' : 'New Mission'}
                    </button>
                    <button
                      onClick={getMissions}
                      disabled={isLoading}
                      className="bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium text-white text-sm inline-flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </button>
                  </div>
                </div>

                {/* New Mission Form */}
                {showNewMissionForm && (
                  <div className="bg-slate-700/50 rounded-lg p-6 border border-purple-500/50">
                    <h3 className="text-lg font-medium text-white mb-4">Create New Mission</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        label="Mission Name"
                        value={newMission.missionName}
                        onChange={(value) => setNewMission(prev => ({ ...prev, missionName: value }))}
                        placeholder="Enter mission name"
                      />
                      <FormInput
                        label="Mission Amount (AVAX)"
                        value={newMission.missionAmount}
                        onChange={(value) => setNewMission(prev => ({ ...prev, missionAmount: value }))}
                        placeholder="Enter mission amount in AVAX"
                        type="number"
                        step="0.01"
                      />
                      <FormInput
                        label="Reborn Amount (AVAX)"
                        value={newMission.rebornAmount}
                        onChange={(value) => setNewMission(prev => ({ ...prev, rebornAmount: value }))}
                        placeholder="Enter reborn amount in AVAX"
                        type="number"
                        step="0.01"
                      />
                      <FormInput
                        label="Expiry Date"
                        value={newMission.expiryDate}
                        onChange={(value) => setNewMission(prev => ({ ...prev, expiryDate: value }))}
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleCreateMission}
                        disabled={!newMission.missionName || !newMission.missionAmount || !newMission.rebornAmount || !newMission.expiryDate}
                        className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium text-white"
                      >
                        Create Mission
                      </button>
                    </div>
                  </div>
                )}

                {/* Mission List */}
                <div className="grid gap-6">
                  {missions.map((mission) => (
                    <div key={mission.missionId} className="bg-slate-700/50 rounded-lg p-6 border border-slate-600 hover:border-purple-500/50 transition-all duration-200">
                      {editingMission === mission.missionId ? (
                        // Edit Form
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                              label="Mission Name"
                              value={editForm.missionName}
                              onChange={(value) => setEditForm(prev => ({ ...prev, missionName: value }))}
                              placeholder="Enter mission name"
                            />
                            <FormInput
                              label="Mission Amount (AVAX)"
                              value={editForm.missionAmount}
                              onChange={(value) => setEditForm(prev => ({ ...prev, missionAmount: value }))}
                              placeholder="Enter mission amount in AVAX"
                              type="number"
                              step="0.01"
                            />
                            <FormInput
                              label="Reborn Amount (AVAX)"
                              value={editForm.rebornAmount}
                              onChange={(value) => setEditForm(prev => ({ ...prev, rebornAmount: value }))}
                              placeholder="Enter reborn amount in AVAX"
                              type="number"
                              step="0.01"
                            />
                            <FormInput
                              label="Expiry Date"
                              value={editForm.expiryDate}
                              onChange={(value) => setEditForm(prev => ({ ...prev, expiryDate: value }))}
                              type="date"
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingMission(null)}
                              className="bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium text-white text-sm"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUpdateMission(mission.missionId)}
                              disabled={!editForm.missionName || !editForm.missionAmount || !editForm.rebornAmount || !editForm.expiryDate}
                              className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium text-white text-sm"
                            >
                              Update Mission
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Mission Display
                        <>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-white">{mission.missionName}</h3>
                              <p className="text-sm text-gray-400">Mission #{mission.missionId}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                mission.isComplete ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                              }`}>
                                {mission.isComplete ? 'Completed' : 'Active'}
                              </span>
                              <button
                                onClick={() => startEditingMission(mission)}
                                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-slate-600/50"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-400">Mission Amount</p>
                              <p className="text-white font-medium">{ethers.utils.formatEther(mission.missionAmount)} AVAX</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Reborn Amount</p>
                              <p className="text-white font-medium">{ethers.utils.formatEther(mission.rebornAmount)} AVAX</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-gray-400">Expires</p>
                            <p className="text-white font-medium">
                              {new Date(mission.expiryDate.toNumber() * 1000).toLocaleDateString()}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {missions.length === 0 && !showNewMissionForm && (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <p className="mt-4 text-gray-400">No missions available</p>
                    <button
                      onClick={() => setShowNewMissionForm(true)}
                      className="mt-4 text-purple-500 hover:text-purple-400 font-medium inline-flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create your first mission
                    </button>
                  </div>
                )}
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
    </div>
  );
};
