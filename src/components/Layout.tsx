import React, { useEffect, useState, useMemo } from "react";
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
import { NFTGrid , NFT} from "./NFTGrid";
import nftImage from '../assets/img/nft.jpg';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from './Header';

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



// Bottom Sheet komponenti
const BottomSheet: React.FC<{
  selectedNFT: NFT | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ selectedNFT, isOpen }) => {
  return (
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
    >
      <div className="bg-[#0c0c0c]/95 backdrop-blur-lg border-t border-[#a8c7fa]/10 rounded-t-3xl max-h-[80vh] overflow-y-auto">
        {/* Handle Bar */}
        <div className="sticky top-0 pt-3 pb-4 bg-[#0c0c0c]/95 backdrop-blur-lg">
          <div className="w-12 h-1 bg-white/20 rounded-full mx-auto" />
        </div>

        {/* Content */}
        <div className="px-6 pb-8">
          {selectedNFT ? (
            <div className="space-y-6">
              {/* NFT Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium">NFT Details</h2>
                <div className={`px-2 py-1 rounded-full text-xs font-medium 
                  ${selectedNFT.status === 'completed' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  }`}>
                  {selectedNFT.status === 'completed' ? 'Completed' : 'In Progress'}
                </div>
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

              {/* Action Buttons */}
              <div className="space-y-3">
                {!selectedNFT.status && (
                  <button className="w-full px-6 py-4 bg-[#d8624b]/20 hover:bg-[#d8624b]/40 border border-[#d8624b]/30 
                                   rounded-xl text-white/90 transition-all duration-300 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Mint NFT
                  </button>
                )}
                
                {selectedNFT.status === 'completed' && (
                  <button className="w-full px-6 py-4 bg-[#7042f8]/20 hover:bg-[#7042f8]/40 border border-[#7042f8]/30 
                                   rounded-xl text-white/90 transition-all duration-300 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Transfer NFT
                  </button>
                )}

                <Link 
                  to={`/nft/${selectedNFT.id}`}
                  className="w-full px-6 py-4 bg-[#a8c7fa]/20 hover:bg-[#a8c7fa]/40 border border-[#a8c7fa]/30 
                           rounded-xl text-white/90 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Full Details
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-[#a8c7fa]/40">
              <p>Select an NFT to view details</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};



const Layout: React.FC = () => {
  const { walletProvider } = useWeb3ModalProvider();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const dispatch = useDispatch();
  // NFT States
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [nftCollection, setNftCollection] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [myNFTs, setMyNFTs] = useState<NFT[]>([]);
  const [view, setView] = useState<'list' | 'grid'>('list');

  // NFT koleksiyonunu filtreleme
  const displayedNFTs = useMemo(() => {
    return activeTab === 'all' ? nftCollection : myNFTs;
  }, [activeTab, nftCollection, myNFTs]);

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
            missionAmount: 2
          },
          {
            id: 4,
            name: "GENESIS",
            image: nftImage,
            price: 0,
            status: 'completed',
            expireDate: "31.12.2024 - 23:59:59",
            missionAmount: 3
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

  // My NFTs için veri çekme
  useEffect(() => {
    const fetchMyNFTs = async () => {
      if (walletAddress) {
        setIsLoading(true);
        try {
          // Simüle edilmiş veri - gerçek uygulamada API'den gelecek
          const mockMyNFTs = nftCollection.filter(nft => nft.status === 'completed');
          setMyNFTs(mockMyNFTs);
        } catch (error) {
          console.error("Error fetching my NFTs:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setMyNFTs([]);
      }
    };

    fetchMyNFTs();
  }, [walletAddress, nftCollection]);

  const handleNFTSelect = (nft: NFT) => {
    setSelectedNFT(currentNFT => {
      const newSelection = currentNFT?.id === nft.id ? null : nft;
      setIsBottomSheetOpen(!!newSelection);
      return newSelection;
    });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514] text-white flex flex-col font-orbitron relative">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-soft-light">
        <div className="absolute inset-0 bg-noise animate-noise" />
      </div>
      <BackgroundCompiler />
      <ShuffleLoader />
      <DecoElements />
      
      <Header />

      {/* Main Content */}
      <div className="flex-1 pt-16">
        <div className="container mx-auto flex flex-col lg:flex-row h-[calc(100vh-4rem-2rem)]">
          {/* Sol Kolon - NFT Listesi */}
          <div className="flex-1 h-full px-4 py-6">
            <div className="h-full">
              <NFTGrid 
                nfts={displayedNFTs}
                isLoading={isLoading} 
                onSelect={handleNFTSelect}
                selectedNFTId={selectedNFT?.id}
                view={view}
                onViewChange={setView}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                }}
              />
            </div>
          </div>

          {/* Sağ Kolon - NFT Detayları (Desktop) */}
          {selectedNFT && (
            <div className="hidden lg:block w-[400px] border-l border-[#a8c7fa]/10">
              <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#a8c7fa]/10 scrollbar-track-transparent">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 flex flex-col min-h-full"
                >
                  {/* NFT Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium">NFT Details</h2>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${selectedNFT.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}>
                      {selectedNFT.status === 'completed' ? 'Completed' : 'In Progress'}
                    </div>
                  </div>

                  {/* NFT Content */}
                  <div className="flex-grow flex flex-col">
                    {/* Image Container */}
                    <div className="relative aspect-square mb-6">
                      <img 
                        src={selectedNFT.image} 
                        alt={selectedNFT.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>

                    {/* Info Container */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">{selectedNFT.name}</h3>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#a8c7fa]/5 p-3 rounded-xl">
                          <span className="text-[#a8c7fa]/60 text-sm">Mission Amount</span>
                          <p className="text-white font-medium mt-1">{selectedNFT.missionAmount}</p>
                        </div>
                        <div className="bg-[#a8c7fa]/5 p-3 rounded-xl">
                          <span className="text-[#a8c7fa]/60 text-sm">Expires</span>
                          <p className="text-white font-medium mt-1">{selectedNFT.expireDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 mt-6">
                    {!selectedNFT.status && (
                      <button className="w-full px-4 py-3 bg-[#d8624b]/20 hover:bg-[#d8624b]/40 border border-[#d8624b]/30 
                        rounded-xl text-white/90 transition-all duration-300 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Mint NFT
                      </button>
                    )}
                    
                    {selectedNFT.status === 'completed' && (
                      <button className="w-full px-4 py-3 bg-[#7042f8]/20 hover:bg-[#7042f8]/40 border border-[#7042f8]/30 
                        rounded-xl text-white/90 transition-all duration-300 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        Transfer NFT
                      </button>
                    )}

                    <Link 
                      to={`/nft/${selectedNFT.id}`}
                      className="w-full px-4 py-3 bg-[#a8c7fa]/20 hover:bg-[#a8c7fa]/40 border border-[#a8c7fa]/30 
                        rounded-xl text-white/90 transition-all duration-300 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Full Details
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sheet (Mobile) */}
      <div className="lg:hidden">
        <BottomSheet 
          selectedNFT={selectedNFT}
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
        />
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-[#a8c7fa]/10">
        <div className="container mx-auto px-4 py-4">
          <Footer />
        </div>
      </div>

      <StackedNotifications />
    </div>
  );
};

export default Layout;
