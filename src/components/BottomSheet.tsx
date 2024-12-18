import React from 'react';
import { motion } from 'framer-motion';
import { NFT } from './NFTGrid';
import { Link } from 'react-router-dom';

interface BottomSheetProps {
  selectedNFT: NFT;
  isOpen: boolean;
  onClose: () => void;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  selectedNFT,
  isOpen,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#0c0c0c]/95 backdrop-blur-xl 
                 border-l border-[#a8c7fa]/10 z-[150] overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-[#0c0c0c]/95 backdrop-blur-xl border-b border-[#a8c7fa]/10 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">nft details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#a8c7fa]/10 rounded-xl transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* NFT Image */}
        <img
          src={selectedNFT.image}
          alt={selectedNFT.name}
          className="w-full aspect-square object-cover rounded-xl"
        />

        {/* NFT Info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium">{selectedNFT.name}</h3>
            <div className={`px-2.5 py-1 rounded-full text-xs font-medium
              ${selectedNFT.status === "completed" 
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
              }`}
            >
              {selectedNFT.status === "completed" ? "completed" : "in progress"}
            </div>
          </div>

          {/* Mission & Expire Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#a8c7fa]/5 p-3 rounded-xl">
              <span className="block text-[#a8c7fa]/60 text-sm mb-1">mission</span>
              <p className="text-white font-medium">{selectedNFT.missionAmount}</p>
            </div>
            <div className="bg-[#a8c7fa]/5 p-3 rounded-xl">
              <span className="block text-[#a8c7fa]/60 text-sm mb-1">expires</span>
              <p className="text-white font-medium">{selectedNFT.expireDate}</p>
            </div>
          </div>

          {/* Description */}
          {selectedNFT.description && (
            <div className="bg-[#a8c7fa]/5 p-3 rounded-xl">
              <span className="block text-[#a8c7fa]/60 text-sm mb-1">description</span>
              <p className="text-white">{selectedNFT.description}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link 
            to={`/nft/${selectedNFT.id}`}
            className="w-full py-3 bg-[#7042f88b] hover:bg-[#7042f88b]/80 
                     rounded-xl transition-all duration-300 text-center"
          >
            view details
          </Link>
          
          <button 
            className="w-full py-3 bg-[#0c0c0c] hover:bg-[#0c0c0c]/80 
                     border border-[#a8c7fa]/10 hover:border-[#7042f88b]/50
                     rounded-xl transition-all duration-300"
          >
            view on marketplace
          </button>
        </div>
      </div>
    </motion.div>
  );
}; 