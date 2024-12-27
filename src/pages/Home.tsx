import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { NFTGrid } from "../components/NFTGrid";
import { BottomSheet } from "../components/BottomSheet";
import type { NFT } from "../components/NFTGrid";
import nftImage from "../assets/img/nft.jpg";
import { ethers } from "ethers";

interface ContextType {
  provider: ethers.providers.Web3Provider | null;
  account: string | null;
}

const Home: React.FC = () => {
  const {  account } = useOutletContext<ContextType>();
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isNFTsLoading, setIsNFTsLoading] = useState(true);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!account) return;
      
      setIsNFTsLoading(true);
      try {
        // Simulated NFT data
        const mockNFTs = [
          {
            id: 1,
            name: "WHITELIST",
            image: nftImage,
            price: 0,
            status: "completed",
            expireDate: "31.12.2024 - 23:59:59",
            missionAmount: 0,
          },
          {
            id: 2,
            name: "AIRDROP",
            image: nftImage,
            price: 0,
            status: "not_completed",
            expireDate: "31.12.2024 - 23:59:59",
            missionAmount: 1,
          },
          {
            id: 3,
            name: "REBORN",
            image: nftImage,
            price: 0,
            status: "not_completed",
            expireDate: "31.12.2024 - 23:59:59",
            missionAmount: 2,
          },
          {
            id: 4,
            name: "GENESIS",
            image: nftImage,
            price: 0,
            status: "completed",
            expireDate: "31.12.2024 - 23:59:59",
            missionAmount: 3,
          },
        ] as NFT[];
        setNfts(mockNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setIsNFTsLoading(false);
      }
    };

    fetchNFTs();
  }, [account]);

  return (
    <div className="min-h-screen bg-[#0c0c0c] py-20">
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
              My NFT Collection
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              View and manage your Providence NFTs
            </p>
          </div>
        </motion.div>

        {!account ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20 bg-gradient-to-r from-purple-500/5 via-slate-800/50 to-purple-500/5 rounded-2xl border border-purple-500/10 backdrop-blur-xl"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Connect Your Wallet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Connect your wallet to view your NFT collection
            </p>
            <button
              onClick={() => {}} // Wallet connect handler will be handled by the parent component
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 px-8 py-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Connect Wallet
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {isNFTsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-slate-800/50 rounded-xl overflow-hidden">
                      <div className="aspect-square bg-slate-700/50" />
                      <div className="p-4 space-y-3">
                        <div className="h-5 bg-slate-700/50 rounded w-2/3" />
                        <div className="h-4 bg-slate-700/50 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : nfts.length > 0 ? (
              <NFTGrid
                nfts={nfts}
                onSelect={setSelectedNFT}
                isLoading={isNFTsLoading}
                view={view}
                onViewChange={setView}
                onTabChange={() => {}}
              />
            ) : (
              <div className="text-center py-12 bg-slate-800/50 rounded-xl">
                <p className="text-gray-400">No NFTs found in your collection</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* NFT Detail Bottom Sheet */}
      <AnimatePresence>
        {selectedNFT && (
          <BottomSheet
            selectedNFT={selectedNFT}
            isOpen={!!selectedNFT}
            onClose={() => setSelectedNFT(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
