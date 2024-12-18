import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NFT } from './NFTGrid';

interface BottomSheetProps {
  selectedNFT: NFT | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ selectedNFT, isOpen, onClose }) => {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: isOpen ? 0 : "100%" }}
      exit={{ y: "100%" }}
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
                <div
                  className={`px-2 py-1 rounded-full text-sm font-medium 
                  ${
                    selectedNFT.status === "completed"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  }`}
                >
                  {selectedNFT.status === "completed" ? "Completed" : "In Progress"}
                </div>
              </div>

              {/* Image Container */}
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <img
                  src={selectedNFT.image}
                  alt={selectedNFT.name}
                  className="w-full h-full object-cover"
                />
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

                {selectedNFT.status === "completed" && (
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