import React, { useEffect, useState } from "react";
import ConnectButton from "./ConnectButton";
import { useDispatch } from "react-redux";
import { ethers, providers } from "ethers";
import { useWeb3ModalProvider } from "@web3modal/ethers5/react";
import {
  resetProvider,
  setProvider,
  setSigner,
} from "../app/slices/walletProvider";
import StackedNotifications from "./Notification";
import ShuffleLoader from "./Loader";
import Footer from "./Footer";
import NFTGrid from "./NFTGrid";
import { NFT } from './NFTGrid';
import nftImage from '../assets/img/nft.jpg';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const BackgroundCompiler = React.lazy(
  () => import("../components/BackgroundCompiler")
);

const DecoElements = React.memo(() => (
  <>
    {/* Noise overlay */}
    <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.015] mix-blend-soft-light">
      <div className="absolute inset-0 bg-noise animate-noise" />
    </div>

    {/* Particle grid */}
    <div className="fixed inset-0 z-0 pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-[#7042f88b]/20 rounded-full animate-particle"
          style={{
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${20 + Math.random() * 20}s`,
          }}
        />
      ))}
    </div>

    {/* Cyber circles */}
    <div className="fixed left-10 top-40 opacity-30 pointer-events-none z-0">
      <div className="relative w-64 h-64">
        <div className="absolute inset-0 border border-[#7042f88b]/20 rounded-full animate-spin-slow" />
        <div className="absolute inset-2 border border-[#7042f88b]/10 rounded-full animate-spin-reverse" />
        <div className="absolute inset-4 border border-[#7042f88b]/5 rounded-full animate-spin-slow" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-[#7042f88b]/40 rounded-full animate-pulse" />
        </div>
      </div>
    </div>

    {/* Energy beams */}
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="fixed opacity-20 pointer-events-none overflow-hidden"
        style={{
          left: `${30 + i * 30}%`,
          top: "20%",
          transform: "rotate(45deg)",
        }}
      >
        <div
          className="w-[1px] h-[200px] bg-gradient-to-b from-transparent via-[#7042f88b] to-transparent animate-energy-beam"
          style={{ animationDelay: `${i * 2}s` }}
        />
      </div>
    ))}
  </>
));

const Layout: React.FC = () => {
  const { walletProvider } = useWeb3ModalProvider();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const dispatch = useDispatch();
  
  // NFT States
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [nftCollection, setNftCollection] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleDisconnect = () => {
      dispatch(resetProvider());
      setWalletAddress("");
    };

    if (walletProvider) {
      const web3Provider = new ethers.providers.Web3Provider(
        walletProvider as providers.ExternalProvider
      );
      dispatch(setProvider(web3Provider));
      const signer = web3Provider.getSigner();
      dispatch(setSigner(signer));

      if ("on" in walletProvider && "removeListener" in walletProvider) {
        (walletProvider as any).on("disconnect", handleDisconnect);
        return () => {
          (walletProvider as any).removeListener("disconnect", handleDisconnect);
        };
      }
    } else {
      handleDisconnect();
    }
  }, [walletProvider, dispatch]);

  useEffect(() => {
    const getAddress = async () => {
      if (walletProvider) {
        const web3Provider = new ethers.providers.Web3Provider(
          walletProvider as providers.ExternalProvider
        );
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
      }
    };
    getAddress();
  }, [walletProvider]);

  // Fetch NFT collection data
  useEffect(() => {
    const fetchNFTs = async () => {
      setIsLoading(true);
      try {
        // Simüle edilmiş NFT verisi
        const mockNFTs = [
          {
            id: 1,
            name: "WHITELIST",
            image: nftImage,
            price: 0,
            status: 'completed',
            expireDate: "31.12.2024 - 23:59:59",
            missionAmount: 0
          },
          {
            id: 2,
            name: "AIRDROP",
            image: nftImage,
            price: 0,
            status: 'not_completed',
            expireDate: "31.12.2024 - 23:59:59",
            missionAmount: 1
          },
          {
            id: 3,
            name: "REBORN",
            image: nftImage,
            price: 0,
            status: 'not_completed',
            expireDate: "31.12.2024 - 23:59:59",
            missionAmount: 0
          }
        ] as NFT[];
        setNftCollection(mockNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  const handleNFTSelect = (nft: NFT) => {
    setSelectedNFT(currentNFT => currentNFT?.id === nft.id ? null : nft);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514] text-white flex flex-col font-orbitron text-[110%] relative">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-soft-light">
        <div className="absolute inset-0 bg-noise animate-noise" />
      </div>
      <BackgroundCompiler />
      <ShuffleLoader />
      <DecoElements />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <a
            href="https://playprovidence.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs tracking-[0.2em] hover:text-[#7042f88b] transition-all duration-300 group"
          >
            <div className="w-2 h-2 bg-[#d8624b]/30 group-hover:bg-[#d8624b] transition-all duration-300" />
            PROVIDENCE F8
          </a>
          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 relative mt-24">
        {/* Title - En üstte */}
        <div className="text-center pb-8">
          <p className="text-2xl tracking-[0.2em] text-white uppercase font-medium">
            Providence NFT Collection
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-[#d8624b]/30" />
            <div className="w-2 h-2 bg-[#d8624b]/30" />
            <div className="w-2 h-2 bg-[#d8624b]/30" />
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="flex h-[calc(100vh-12rem)]">
          {/* Sol Kolon - NFT Listesi */}
          <div className="w-2/3 border-r border-[#a8c7fa]/10">
            <div className="p-8 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#a8c7fa]/20 scrollbar-track-transparent">
              <NFTGrid
                nfts={nftCollection} 
                isLoading={isLoading} 
                onSelect={handleNFTSelect}
                selectedNFTId={selectedNFT?.id} 
              />
            </div>
          </div>

          {/* Sağ Kolon - NFT Detayları */}
          <div className="w-1/3 border-l border-[#a8c7fa]/10">
            <div className="p-8 h-full overflow-y-auto">
              {selectedNFT ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* NFT Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-medium">NFT Details</h2>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${selectedNFT.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}>
                      {selectedNFT.status === 'completed' ? 'Completed' : 'In Progress'}
                    </div>
                  </div>

                  {/* NFT Image */}
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-[#a8c7fa]/20 group">
                    <img 
                      src={selectedNFT.image} 
                      alt={selectedNFT.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* NFT Info */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-medium mb-2">{selectedNFT.name}</h3>
                      <p className="text-[#a8c7fa]/60 text-sm">
                        This exclusive Providence NFT grants you access to special features and rewards.
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                        <div className="text-sm text-[#a8c7fa]/60 mb-1">Mission Amount</div>
                        <div className="text-xl text-white">{selectedNFT.missionAmount}</div>
                      </div>
                      <div className="p-4 bg-[#a8c7fa]/5 rounded-xl border border-[#a8c7fa]/10">
                        <div className="text-sm text-[#a8c7fa]/60 mb-1">Expires In</div>
                        <div className="text-xl text-white">{selectedNFT.expireDate}</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm text-[#a8c7fa]/60 mb-2">
                        <span>Completion Progress</span>
                        <span>{selectedNFT.status === 'completed' ? '100%' : '0%'}</span>
                      </div>
                      <div className="h-2 bg-[#a8c7fa]/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: selectedNFT.status === 'completed' ? '100%' : '0%' }}
                          transition={{ duration: 0.5 }}
                          className={`h-full rounded-full ${
                            selectedNFT.status === 'completed'
                              ? 'bg-gradient-to-r from-green-500 to-green-400'
                              : 'bg-gradient-to-r from-orange-500 to-orange-400'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4">
                      {!selectedNFT.status && (
                        <button className="w-full px-6 py-4 bg-[#d8624b]/20 hover:bg-[#d8624b]/40 border border-[#d8624b]/30 
                                         rounded-xl text-white/90 transition-all duration-300 flex items-center justify-center gap-2
                                         hover:scale-[1.02]">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Mint NFT
                        </button>
                      )}
                      
                      {selectedNFT.status === 'completed' && (
                        <button className="w-full px-6 py-4 bg-[#7042f8]/20 hover:bg-[#7042f8]/40 border border-[#7042f8]/30 
                                         rounded-xl text-white/90 transition-all duration-300 flex items-center justify-center gap-2
                                         hover:scale-[1.02]">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          Transfer NFT
                        </button>
                      )}

                      <Link 
                        to={`/nft/${selectedNFT.id}`}
                        className="w-full px-6 py-4 bg-[#a8c7fa]/20 hover:bg-[#a8c7fa]/40 border border-[#a8c7fa]/30 
                                 rounded-xl text-white/90 transition-all duration-300 flex items-center justify-center gap-2
                                 hover:scale-[1.02]"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Full Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div className="space-y-4 text-[#a8c7fa]/40">
                    <svg className="w-16 h-16 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    <p className="text-lg">Select an NFT to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <StackedNotifications />
    </div>
  );
};

export default Layout;
