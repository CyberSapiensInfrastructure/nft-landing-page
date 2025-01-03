import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import nftImage from '../assets/img/nft.jpg';
import { DecoElements } from '../components/Layout';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { ethers } from 'ethers';
import { F8__factory } from '../../typechain-types/factories/F8__factory';
import { useNFT } from '../context/NFTContext';
import { NFTMetadata } from '../types/nft';

const F8_ADDRESS = '0x4684059c10Cc9b9E3013c953182E2e097B8d089d';

export const NFTDetail = () => {
  useScrollToTop();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNFTById, setNFTData, setActiveNFT, viewHistory } = useNFT();
  const [nft, setNft] = useState<NFTMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'attributes' | 'history'>('overview');

  // Check wallet connection
  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setIsWalletConnected(accounts.length > 0);
      }
    };
    checkWallet();
  }, []);

  useEffect(() => {
    const fetchNFTData = async () => {
      if (!id) return;

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = F8__factory.connect(F8_ADDRESS, provider);
        
        // Get tokenURI from contract
        const tokenURI = await contract.tokenURI(parseInt(id));
        console.log('TokenURI:', tokenURI);
            
        // Use tokenURI data
        const nftData: NFTMetadata = {
          id: parseInt(id),
          name: `F8 NFT #${id}`,
          description: `TokenURI: ${tokenURI}`,
          image: nftImage,
          status: 'not_completed',
          expireDate: new Date().toISOString(),
          missionAmount: 0,
          rarity: "Unknown",
          creator: "Unknown",
          collection: "F8 Collection",
          blockchain: "Ethereum",
          missions: [],
          attributes: [
            { trait_type: "TokenURI", value: tokenURI }
          ]
        };

        setNFTData(id, nftData);
        setActiveNFT(nftData);
        setNft(nftData);
      } catch (error) {
        console.error('Contract Error:', error);
        setNft(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTData();
  }, [id]);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { 
      y: -20, 
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Overview</h2>
              <p className="text-[#a8c7fa]/60 text-lg">{nft?.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                <div className="text-sm text-[#a8c7fa]/60">Collection</div>
                <div className="text-white mt-1">{nft?.collection}</div>
              </div>
              <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                <div className="text-sm text-[#a8c7fa]/60">Creator</div>
                <div className="text-white mt-1">{nft?.creator}</div>
              </div>
            </div>

            {/* Missions Progress */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Missions</h2>
              <div className="space-y-3">
                {nft?.missions.map((mission, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10"
                  >
                    <span className="text-white">{mission.name}</span>
                    {mission.completed ? (
                      <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-[#a8c7fa]/30" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'attributes':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold">Attributes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {nft?.attributes.map((attr, index) => (
                <div 
                  key={index}
                  className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10"
                >
                  <div className="text-sm text-[#a8c7fa]/60">{attr.trait_type}</div>
                  <div className="text-white mt-1">{attr.value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'history':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold">Recently Viewed NFTs</h2>
            <div className="space-y-4">
              {viewHistory.map((historyId) => {
                const historyNFT = getNFTById(historyId);
                if (!historyNFT) return null;
                
                return (
                  <motion.div
                    key={historyId}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10 cursor-pointer"
                    onClick={() => navigate(`/nft/${historyId}`)}
                  >
                    <img 
                      src={historyNFT.image} 
                      alt={historyNFT.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-medium">{historyNFT.name}</h3>
                      <p className="text-[#a8c7fa]/60">{historyNFT.collection}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
    }
  };

  if (!window.ethereum) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514] text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-lg mx-auto text-center space-y-6">
            <div className="w-20 h-20 mx-auto mb-8">
              <svg className="w-full h-full text-[#7042f88b]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10H9m3 4a9 9 0 110-18 9 9 0 010 18zm0 0v-4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Wallet Not Found</h2>
            <p className="text-[#a8c7fa]/60">Please install MetaMask or another Web3 wallet to view NFT details.</p>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-[#7042f88b] hover:bg-[#7042f88b]/80 rounded-xl text-white transition-all duration-300"
            >
              Install MetaMask
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514] text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-lg mx-auto text-center space-y-6">
            <div className="w-20 h-20 mx-auto mb-8">
              <svg className="w-full h-full text-[#7042f88b]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25zm0 3.75h.008v3.75H12V12z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Wallet Not Connected</h2>
            <p className="text-[#a8c7fa]/60">Please connect your wallet to view NFT details.</p>
            <button
              onClick={async () => {
                try {
                  await window.ethereum.request({ method: 'eth_requestAccounts' });
                  const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                  setIsWalletConnected(accounts.length > 0);
                } catch (error) {
                  console.error('Error connecting wallet:', error);
                }
              }}
              className="px-6 py-3 bg-[#7042f88b] hover:bg-[#7042f88b]/80 rounded-xl text-white transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !nft) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7042f88b]"></div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={id}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514] text-white relative overflow-hidden"
      >
        <DecoElements />
        
        <div className="container mx-auto px-4 py-8 mt-10 relative z-10">
          {/* Back Button */}
          <motion.div variants={itemVariants} className="mb-8">
            <Link 
              to="/list"
              className="inline-flex items-center gap-2 text-[#a8c7fa]/60 hover:text-[#a8c7fa] group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to NFTs
            </Link>
          </motion.div>

          {/* NFT Content */}
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Left Column - NFT Image and Quick Stats */}
              <motion.div variants={itemVariants} className="lg:w-1/2 space-y-8">
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#7042f88b]/0 to-[#7042f88b]/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <img 
                    src={nft?.image} 
                    alt={nft?.name}
                    className="w-full aspect-square object-cover rounded-2xl border border-[#a8c7fa]/10"
                  />
                  <motion.div 
                    className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    <div className="flex justify-between text-sm">
                      <span className="px-3 py-1 bg-black/50 rounded-lg backdrop-blur-sm">
                        {nft?.collection}
                      </span>
                      <span className="px-3 py-1 bg-black/50 rounded-lg backdrop-blur-sm">
                        #{nft?.id.toString().padStart(4, '0')}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                    <div className="text-sm text-[#a8c7fa]/60">Rarity</div>
                    <div className="text-white mt-1">{nft?.rarity}</div>
                  </div>
                  <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                    <div className="text-sm text-[#a8c7fa]/60">Blockchain</div>
                    <div className="text-white mt-1">{nft?.blockchain}</div>
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Details and Tabs */}
              <motion.div variants={itemVariants} className="lg:w-1/2 space-y-8">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold">{nft?.name}</h1>
                    <div className={`px-3 py-1.5 rounded-full text-sm font-medium 
                      ${nft?.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}>
                      {nft?.status === 'completed' ? 'Completed' : 'In Progress'}
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-[#a8c7fa]/10">
                  <nav className="flex gap-8">
                    {(['overview', 'attributes', 'history'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`pb-4 text-lg font-medium transition-colors relative
                          ${selectedTab === tab 
                            ? 'text-[#7042f88b]' 
                            : 'text-[#a8c7fa]/60 hover:text-[#a8c7fa]'
                          }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        {selectedTab === tab && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7042f88b]"
                          />
                        )}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {renderTabContent()}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="space-y-3 pt-6">
                  {nft?.status !== 'completed' && (
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-4 bg-[#7042f88b]/20 hover:bg-[#7042f88b]/40 border border-[#7042f88b]/30 
                        rounded-xl text-white/90 transition-all duration-300 flex items-center justify-center gap-2
                        hover:shadow-lg hover:shadow-[#7042f88b]/20"
                    >
                      <motion.svg 
                        className="w-5 h-5" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor"
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </motion.svg>
                      Mint NFT
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NFTDetail; 