import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NFT } from '../components/NFTGrid';
import nftImage from '../assets/img/nft.jpg';

export const NFTDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nft, setNft] = useState<NFT | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTDetail = async () => {
      try {
        // Simüle edilmiş veri - gerçek uygulamada API'den gelecek
        const mockNFT: NFT = {
          id: Number(id),
          name: ["WHITELIST", "AIRDROP", "REBORN", "GENESIS"][Number(id) - 1] || "Unknown",
          image: nftImage,
          price: 0,
          status: Number(id) <= 2 ? 'completed' : 'not_completed',
          expireDate: "31.12.2024 - 23:59:59",
          missionAmount: Number(id) - 1
        };
        setNft(mockNFT);
      } catch (error) {
        console.error("Error fetching NFT:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTDetail();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!nft) {
    return <div className="flex items-center justify-center h-screen">NFT not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514] text-white">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-soft-light">
        <div className="absolute inset-0 bg-noise animate-noise" />
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-4 sm:mb-6 flex items-center gap-2 text-[#a8c7fa]/60 hover:text-[#a8c7fa] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>

          <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Left Column - Image */}
            <div className="relative">
              <img 
                src={nft.image} 
                alt={nft.name}
                className="w-full aspect-square object-cover rounded-2xl"
              />
            </div>

            {/* Right Column - Details */}
            <div className="space-y-4 sm:space-y-6">
              {/* NFT Header - Mobile */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold">{nft.name}</h1>
                <div className={`self-start sm:self-auto px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
                  ${nft.status === 'completed' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  }`}>
                  {nft.status === 'completed' ? 'Completed' : 'In Progress'}
                </div>
              </div>

              {/* NFT Info */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-[#a8c7fa]/5 p-3 sm:p-4 rounded-xl">
                  <span className="text-[#a8c7fa]/60 text-sm">Mission Amount</span>
                  <p className="text-xl sm:text-2xl font-bold mt-1">{nft.missionAmount}</p>
                </div>
                <div className="bg-[#a8c7fa]/5 p-3 sm:p-4 rounded-xl">
                  <span className="text-[#a8c7fa]/60 text-sm">Expires</span>
                  <p className="text-xl sm:text-2xl font-bold mt-1">{nft.expireDate}</p>
                </div>
              </div>

              {/* Description - Optional */}
              <div className="bg-[#a8c7fa]/5 p-4 rounded-xl">
                <span className="text-[#a8c7fa]/60 text-sm">Description</span>
                <p className="text-white mt-2">
                  This NFT represents your {nft.name.toLowerCase()} status in the Providence ecosystem.
                  {nft.status === 'completed' 
                    ? ' You have successfully completed all required missions.' 
                    : ' Complete the required missions to unlock full benefits.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0c0c0c] to-transparent md:relative md:bg-none md:p-0 md:mt-6">
                <div className="space-y-3 max-w-4xl mx-auto">
                  {!nft.status && (
                    <button className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#d8624b]/20 hover:bg-[#d8624b]/40 border border-[#d8624b]/30 
                      rounded-xl text-white/90 transition-all duration-300 flex items-center justify-center gap-2 text-base sm:text-lg">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Mint NFT
                    </button>
                  )}
                  
                  {nft.status === 'completed' && (
                    <button className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#7042f8]/20 hover:bg-[#7042f8]/40 border border-[#7042f8]/30 
                      rounded-xl text-white/90 transition-all duration-300 flex items-center justify-center gap-2 text-base sm:text-lg">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Transfer NFT
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NFTDetail; 