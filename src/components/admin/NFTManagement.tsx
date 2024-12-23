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

export const NFTManagement = () => {
  const { signer, userAddress, connectWallet, disconnectWallet, isConnecting } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [f8Contract, setF8Contract] = useState<F8 | null>(null);
  const [mintAddress, setMintAddress] = useState("");
  const [mintAddressError, setMintAddressError] = useState("");
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'mint' | 'list'>('mint');

  // Initialize contract when signer is available
  useEffect(() => {
    if (signer) {
      const contract = F8__factory.connect(F8_ADDRESS, signer);
      setF8Contract(contract);
    }
  }, [signer]);

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

      // Estimate gas first
      const gasEstimate = await f8Contract.estimateGas.mintF8(mintAddress);
      
      setLoadingMessage("Minting NFT...");
      const tx = await f8Contract.mintF8(mintAddress, {
        gasLimit: Math.floor(gasEstimate.toNumber() * 1.2) // Add 20% buffer
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
    if (!f8Contract || !userAddress) return;

    try {
      setIsLoading(true);
      setLoadingMessage("Fetching your NFTs...");

      const balance = await f8Contract.balanceOf(userAddress);
      const tokenIds = await f8Contract.getList(userAddress);

      const metadataPromises = tokenIds.map(async (tokenId: BigNumber) => {
        const uri = await f8Contract.tokenURI(tokenId);
        try {
          // Use a CORS proxy to fetch the metadata
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
          // Fallback to default values if metadata fetch fails
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

  // Load NFTs when tab changes to list
  useEffect(() => {
    if (activeTab === 'list' && userAddress && nftMetadata.length === 0) {
      getMyNFTs();
    }
  }, [activeTab, userAddress]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header with Connect Wallet */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">NFT Management</h1>
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
          </nav>
        </div>
      )}

      {/* Mint NFT Form */}
      {userAddress && activeTab === 'mint' && (
        <div className="bg-slate-800 rounded-xl p-6 space-y-6">
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

      {/* NFT Display */}
      {userAddress && activeTab === 'list' && (
        <div className="bg-slate-800 rounded-xl p-6 space-y-6">
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
                <div key={nft.tokenId} className="bg-slate-700/50 rounded-lg overflow-hidden border border-slate-600 hover:border-purple-500 transition-all duration-200">
                  {/* NFT Image */}
                  <div className="aspect-square w-full relative">
                    <img 
                      src={nft.image} 
                      alt={nft.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* NFT Details */}
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-white">{nft.name}</h3>
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
