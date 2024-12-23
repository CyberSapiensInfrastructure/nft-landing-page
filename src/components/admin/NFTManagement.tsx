import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { F8__factory } from "typechain-types/factories/F8__factory";
import { F8 } from "typechain-types/F8";

// Add type declarations for Core Wallet and MetaMask
declare global {
  interface EthereumProvider {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (eventName: string, handler: (...args: any[]) => void) => void;
    removeListener: (eventName: string, handler: (...args: any[]) => void) => void;
    isConnected: () => boolean;
    selectedAddress: string | null;
    chainId: string | null;
    networkVersion: string | null;
  }

  interface Window {
    avalanche?: EthereumProvider;
    ethereum?: EthereumProvider;
  }
}

// Contract addresses for Fuji testnet
const F8_ADDRESS = '0x4684059c10Cc9b9E3013c953182E2e097B8d089d';
const LAUNCH_ADDRESS = '0x5Da9f3af025808Ec69702Ee45cd315241432b2F6';

// Fuji Chain Configuration
const FUJI_CHAIN_ID = "0xa869";
const FUJI_CHAIN_CONFIG = {
  chainId: FUJI_CHAIN_ID,
  chainName: "Avalanche Fuji Testnet",
  nativeCurrency: {
    name: "AVAX",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://testnet.snowtrace.io/"],
};

// Add these type definitions at the top of the file with other interfaces
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

// Add LoadingOverlay component
const LoadingOverlay = ({ message }: { message: string }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white font-medium">{message}</p>
      </div>
    </div>
  </div>
);

// Add Toast component
const Toast = ({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up z-50`}>
      {type === 'success' ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <p className="font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 hover:text-gray-200">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export const NFTManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [nftInfo, setNftInfo] = useState({
    symbol: "",
    name: "",
    totalSupply: ""
  });
  const [mintAddress, setMintAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [nftMetadata, setNftMetadata] = useState("");
  const [nftImage, setNftImage] = useState("");
  const [f8Contract, setF8Contract] = useState<F8 | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Verify and switch to Fuji network
  const ensureFujiNetwork = async (provider: ethers.providers.Web3Provider) => {
    try {
      const network = await provider.getNetwork();
      const chainId = "0x" + network.chainId.toString(16);
      
      if (chainId !== FUJI_CHAIN_ID) {
        try {
          // Try to switch to Fuji
          await provider.send("wallet_switchEthereumChain", [
            { chainId: FUJI_CHAIN_ID }
          ]);
        } catch (switchError: any) {
          // If Fuji is not added to the wallet, add it
          if (switchError.code === 4902) {
            await provider.send("wallet_addEthereumChain", [FUJI_CHAIN_CONFIG]);
          } else {
            throw switchError;
          }
        }
      }
      return true;
    } catch (error) {
      console.error("Failed to switch to Fuji network:", error);
      alert("Please switch to the Avalanche Fuji Testnet to continue.");
      return false;
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      const isCoreAvailable = typeof window.avalanche !== 'undefined';
      const isMetaMaskAvailable = typeof window.ethereum !== 'undefined';

      if (!isCoreAvailable && !isMetaMaskAvailable) {
        alert("Please install MetaMask or Core Wallet");
        return;
      }

      let provider: EthereumProvider;
      
      if (isCoreAvailable && window.avalanche) {
        provider = window.avalanche;
      } else if (isMetaMaskAvailable && window.ethereum) {
        provider = window.ethereum;
      } else {
        throw new Error("No wallet provider found");
      }

      await provider.request({ method: 'eth_requestAccounts' });
      const web3Provider = new ethers.providers.Web3Provider(provider as any);

      // Ensure we're on Fuji network
      const isCorrectNetwork = await ensureFujiNetwork(web3Provider);
      if (!isCorrectNetwork) return;

      const web3Signer = web3Provider.getSigner();
      const address = await web3Signer.getAddress();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setUserAddress(address);

      // Get initial contract info
      await getContractInfo(web3Provider, web3Signer);

      // Setup event listeners
      provider.on("accountsChanged", (accounts: string[]) => {
        setUserAddress(accounts[0]);
      });
      provider.on("chainChanged", () => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  // Get contract info
  const getContractInfo = async (provider: ethers.providers.Web3Provider, signer: ethers.Signer) => {
    try {
      const contract = F8__factory.connect(F8_ADDRESS, signer);
      setF8Contract(contract);
      
      const [symbol, name, totalSupply] = await Promise.all([
        contract.symbol(),
        contract.name(),
        contract.totalSupply()
      ]);
      setNftInfo({
        symbol,
        name,
        totalSupply: totalSupply.toString()
      });
    } catch (error) {
      console.error("Failed to get contract info:", error);
    }
  };

  // Helper function to show toast
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  // Mint NFT
  const handleMint = async () => {
    if (!f8Contract || !mintAddress) return;
    
    try {
      setLoadingMessage("Minting your NFT... Please wait");
      
      // Validate the address
      try {
        ethers.utils.getAddress(mintAddress);
      } catch (err) {
        throw new Error("Invalid Ethereum address");
      }
      
      const tx = await f8Contract.mintF8(mintAddress, {
        gasLimit: 500000
      });
      
      showToast("Transaction sent! Waiting for confirmation...");
      
      const receipt = await tx.wait(1);
      
      if (receipt.status) {
        const totalSupply = await f8Contract.totalSupply();
        setNftInfo(prev => ({ ...prev, totalSupply: totalSupply.toString() }));
        showToast("NFT minted successfully! 🎉");
      }
    } catch (error: any) {
      console.error("Failed to mint:", error);
      showToast(error.message || "Failed to mint NFT. Please try again.", 'error');
    } finally {
      setLoadingMessage("");
    }
  };

  // Get NFT metadata
  const getNFTMetadata = async () => {
    if (!f8Contract || !tokenId) return;

    try {
      setIsLoading(true);
      const tokenURI = await f8Contract.tokenURI(tokenId);
      console.log("Original Token URI:", tokenURI);
      
      // Create metadata object
      const metadata = {
        name: `F8 NFT #${tokenId}`,
        description: "Providence NFT",
        image: `http://cybersapiens.xyz/f8/img/${tokenId}.png`,
        attributes: []
      };
      
      console.log("Metadata:", metadata);
      setNftMetadata(JSON.stringify(metadata, null, 2));
      setNftImage(metadata.image);
      
    } catch (error: any) {
      console.error("Failed to get NFT metadata:", error);
      alert("Failed to fetch NFT metadata: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  // Get all NFTs
  const [allNFTs, setAllNFTs] = useState<string[]>([]);

  // Get user's NFTs
  const getMyNFTs = async () => {
    if (!f8Contract || !userAddress) return;

    try {
      setLoadingMessage("Fetching your NFTs... Please wait");
      const nftList = await f8Contract.getList(userAddress);
      
      // Convert BigNumber array to string array
      const nftIds = nftList.map(id => id.toString());
      setAllNFTs(nftIds);
      
      // Create metadata for each NFT
      const metadataPromises = nftIds.map(async (id) => {
        const tokenURI = await f8Contract.tokenURI(id);
        console.log(`NFT ${id}:`, tokenURI);
        
        try {
          // Use a CORS proxy to fetch the metadata
          const proxyUrl = 'https://api.allorigins.win/get?url=';
          const response = await fetch(proxyUrl + encodeURIComponent(`${tokenURI}.json`));
          const proxyData = await response.json();
          const data = JSON.parse(proxyData.contents);
          
          // Format similar to f8.js
          let attributesText = '';
          if (data.attributes) {
            attributesText = data.attributes
              .map((attr: NFTAttribute) => `${attr.trait_type}: ${attr.value}`)
              .join('\n');
          }

          return {
            tokenId: id,
            name: `F8 NFT #${id}`,
            description: data.description || "Providence NFT",
            image: data.image || `http://cybersapiens.xyz/f8/img/${id}.png`,
            attributes: data.attributes || [],
            attributesText,
            uri: tokenURI
          };
        } catch (error) {
          console.error(`Error fetching metadata for token ${id}:`, error);
          return {
            tokenId: id,
            name: `F8 NFT #${id}`,
            description: "Providence NFT",
            image: `http://cybersapiens.xyz/f8/img/${id}.png`,
            attributes: [],
            attributesText: '',
            uri: tokenURI
          };
        }
      });

      const metadataList = await Promise.all(metadataPromises);
      console.log("All metadata:", metadataList);
      setNftMetadata(JSON.stringify(metadataList, null, 2));
      showToast(`Successfully loaded ${nftList.length} NFTs!`);
    } catch (error: any) {
      console.error("Failed to get NFT list:", error);
      showToast(error.message || "Failed to fetch NFT list", 'error');
    } finally {
      setLoadingMessage("");
    }
  };

  // Check mission status
  const checkMissionStatus = async (missionId: string, tokenId: string) => {
    if (!f8Contract || !userAddress) return;

    try {
      const status = await f8Contract.missionStatus(userAddress, missionId, tokenId);
      return status;
    } catch (error) {
      console.error("Failed to check mission status:", error);
      return false;
    }
  };

  // Claim mission reward
  const claimMissionReward = async (missionId: string, tokenId: string) => {
    if (!f8Contract || !userAddress) return;

    try {
      setIsLoading(true);
      const tx = await f8Contract.missionRewardClaim(missionId, tokenId, {
        gasLimit: 500000
      });
      
      console.log("Claim transaction sent:", tx.hash);
      const receipt = await tx.wait(1);
      
      if (receipt.status) {
        console.log("Reward claimed successfully:", tx.hash);
        alert("Mission reward claimed successfully!");
      }
    } catch (error: any) {
      console.error("Failed to claim reward:", error);
      alert(error.message || "Failed to claim reward. Please try again.");
    } finally {
      setIsLoading(false);  
    }
  };

  // View mission
  const viewMission = async (missionId: string) => {
    if (!f8Contract) return;

    try {
      const mission = await f8Contract.viewMission(missionId);
      return {
        name: mission.missionName,
        amount: mission.missionAmount.toString(),
        rebornAmount: mission.rebornAmount.toString(),
        isComplete: mission.isComplete,
        expiryDate: new Date(mission.expiryDate.toNumber() * 1000).toLocaleString()
      };
    } catch (error) {
      console.error("Failed to view mission:", error);
      return null;
    }
  };

  // Get mission counter
  const getMissionCounter = async () => {
    if (!f8Contract) return;

    try {
      const counter = await f8Contract.getMissionCounter();
      return counter.toString();
    } catch (error) {
      console.error("Failed to get mission counter:", error);
      return "0";
    }
  };

  // View deposit reward
  const viewDepositReward = async () => {
    if (!f8Contract) return;

    try {
      const reward = await f8Contract.viewDepositReward();
      return ethers.utils.formatEther(reward);
    } catch (error) {
      console.error("Failed to view deposit reward:", error);
      return "0";
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setUserAddress("");
    setNftInfo({
      symbol: "",
      name: "",
      totalSupply: ""
    });
    setNftMetadata("");
    setNftImage("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      {/* Loading Overlay */}
      {loadingMessage && <LoadingOverlay message={loadingMessage} />}
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">NFT Management</h1>
      <div>
          {!userAddress ? (
            <button
              onClick={connectWallet}
              className="bg-purple-500 hover:bg-purple-600 px-6 py-2 rounded-lg font-medium text-white flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Connect Wallet
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
      </div>

      {userAddress && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Contract Info Card */}
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">Contract Info</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Symbol</span>
                <span className="text-white font-medium">{nftInfo.symbol}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Name</span>
                <span className="text-white font-medium">{nftInfo.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Supply</span>
                <span className="text-white font-medium">{nftInfo.totalSupply}</span>
              </div>
            </div>
          </div>

          {/* Mint NFT Card */}
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">Mint NFT</h2>
        <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Recipient Address</label>
                <input
                  type="text"
                  value={mintAddress}
                  onChange={(e) => setMintAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-purple-500 focus:outline-none"
                />
              </div>
          <button
            onClick={handleMint}
                disabled={isLoading || !mintAddress}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200
                          ${isLoading || !mintAddress
                          ? "bg-purple-500/50 cursor-not-allowed"
                          : "bg-purple-500 hover:bg-purple-600"}`}
          >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Minting...</span>
                  </div>
                ) : "Mint NFT"}
              </button>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={getMyNFTs}
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors
                          ${isLoading ? "bg-indigo-500/50 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading NFTs...</span>
                  </div>
                ) : "View My NFTs"}
              </button>
              <button
                onClick={async () => {
                  const counter = await getMissionCounter();
                  setNftMetadata(JSON.stringify({ missionCounter: counter }, null, 2));
                }}
                className="w-full py-2 px-4 rounded-lg font-medium bg-cyan-500 hover:bg-cyan-600 transition-colors"
              >
                View Mission Counter
              </button>
              <button
                onClick={async () => {
                  const reward = await viewDepositReward();
                  setNftMetadata(JSON.stringify({ depositReward: reward + " AVAX" }, null, 2));
                }}
                className="w-full py-2 px-4 rounded-lg font-medium bg-emerald-500 hover:bg-emerald-600 transition-colors"
              >
                View Deposit Reward
          </button>
        </div>
      </div>
        </div>
      )}

      {/* NFT List Section */}
      {userAddress && nftMetadata && (
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
          <h2 className="text-lg font-semibold text-white mb-4">My NFTs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {JSON.parse(nftMetadata).map((nft: NFTMetadata) => (
              <div key={nft.tokenId} className="bg-slate-700/50 rounded-lg overflow-hidden border border-slate-600 hover:border-purple-500 transition-all duration-200">
                {/* NFT Image */}
                <div className="aspect-square w-full relative">
                  <img 
                    src={nft.image} 
                    alt={`NFT #${nft.tokenId}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* NFT Details */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">NFT #{nft.tokenId}</h3>
                    <span className="text-sm text-purple-400">F8 NFT</span>
                  </div>
                  
                  <p className="text-gray-300 text-sm">{nft.description}</p>
                  
                  {/* Attributes */}
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
                  
                  {/* Token URI */}
                  <div className="pt-2 border-t border-slate-600">
                    <a 
                      href={`${nft.uri}.json`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      View Metadata →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mission Management */}
      {userAddress && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission Status Card */}
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">Check Mission Status</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Mission ID</label>
                  <input
                    type="text"
                    placeholder="Enter Mission ID"
                    className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Token ID</label>
                  <input
                    type="text"
                    placeholder="Enter Token ID"
                    className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={async () => {
                    const missionId = document.querySelector<HTMLInputElement>('input[placeholder="Enter Mission ID"]')?.value;
                    const tokenId = document.querySelector<HTMLInputElement>('input[placeholder="Enter Token ID"]')?.value;
                    if (missionId && tokenId) {
                      const status = await checkMissionStatus(missionId, tokenId);
                      setNftMetadata(JSON.stringify({ missionStatus: status }, null, 2));
                    }
                  }}
                  className="flex-1 py-2 px-4 rounded-lg font-medium bg-purple-500 hover:bg-purple-600 transition-colors"
                >
                  Check Status
                </button>
                <button
                  onClick={async () => {
                    const missionId = document.querySelector<HTMLInputElement>('input[placeholder="Enter Mission ID"]')?.value;
                    const tokenId = document.querySelector<HTMLInputElement>('input[placeholder="Enter Token ID"]')?.value;
                    if (missionId && tokenId) {
                      await claimMissionReward(missionId, tokenId);
                    }
                  }}
                  className="flex-1 py-2 px-4 rounded-lg font-medium bg-green-500 hover:bg-green-600 transition-colors"
                >
                  Claim Reward
                </button>
              </div>
            </div>
          </div>

          {/* View Mission Card */}
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">View Mission Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Mission ID</label>
                <input
                  type="text"
                  placeholder="Enter Mission ID"
                  onChange={(e) => {
                    const missionId = e.target.value;
                    if (missionId) {
                      viewMission(missionId).then(mission => {
                        if (mission) {
                          setNftMetadata(JSON.stringify(mission, null, 2));
                        }
                      });
                    }
                  }}
                  className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {userAddress && (nftMetadata || nftImage) && (
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
          <h2 className="text-lg font-semibold text-white mb-4">Results</h2>
          <div className="space-y-4">
            {nftImage && (
              <img src={nftImage} alt="NFT" className="max-w-sm mx-auto rounded-lg border border-slate-600" />
            )}
            {nftMetadata && (
              <div>
                <pre className="bg-slate-700 p-4 rounded-lg overflow-auto text-white border border-slate-600 whitespace-pre-wrap">
                  {JSON.parse(nftMetadata).map((nft: any, index: number) => (
                    `NFT #${nft.tokenId}
URI: ${nft.uri}.json
Description: ${nft.description}
${nft.attributesText}
______________________

`
                  ))}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
