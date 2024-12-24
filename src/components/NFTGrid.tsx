import React, { useState } from "react";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export type NFT = {
  id: number;
  name: string;
  image: string;
  description?: string;
  price: number;
  status: "completed" | "not_completed";
  expireDate: string;
  missionAmount: number;
};

interface NFTGridProps {
  nfts: NFT[];
  isLoading: boolean;
  onSelect: (nft: NFT) => void;
  selectedNFTId?: number;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  onTabChange?: (tab: "all" | "my") => void;
}

export const NFTGrid: React.FC<NFTGridProps> = ({
  nfts,
  isLoading,
  onSelect,
  selectedNFTId,
  view,
  onViewChange,
  onTabChange,
}) => {
  const [filterSelected, setFilterSelected] = useState(1);
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");

  const filters = [
    {
      id: 1,
      title: "All NFTs",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Art",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Gaming",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
          />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Memberships",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];

  const ViewGridIcon = () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  );

  const ViewListIcon = () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );

  const handleTabChange = (tab: "all" | "my") => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col gap-6">
     

      {/* Content Area */}
      <div className="w-full">
        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {nfts.map((nft) => (
              <div
                key={nft.id}
                onClick={() => onSelect(nft)}
                className={`relative group bg-[#0c0c0c] border border-[#a8c7fa]/10 rounded-2xl overflow-hidden
                hover:shadow-lg hover:shadow-[#7042f88b]/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer
                ${selectedNFTId === nft.id ? "ring-2 ring-[#7042f88b]" : ""}`}
              >
                {/* Image Container */}
                <div className="aspect-square relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                  <img
                    src={nft.image}
                    alt={nft.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <div
                      className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md
                      ${nft.status === "completed"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                      }`}
                    >
                      {nft.status === "completed" ? "Completed" : "In Progress"}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {nft.name}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#a8c7fa]/5 px-3 py-2.5 rounded-xl">
                      <span className="block text-[#a8c7fa]/60 text-xs mb-1">
                        Mission
                      </span>
                      <p className="text-white font-medium text-sm">
                        {nft.missionAmount}
                      </p>
                    </div>
                    <div className="bg-[#a8c7fa]/5 px-3 py-2.5 rounded-xl">
                      <span className="block text-[#a8c7fa]/60 text-xs mb-1">
                        Expires
                      </span>
                      <p className="text-white font-medium text-sm truncate">
                        {nft.expireDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {nfts.map((nft) => (
              <div
                key={nft.id}
                onClick={() => onSelect(nft)}
                className={`flex items-center gap-4 bg-[#0c0c0c] border border-[#a8c7fa]/10 
                p-4 rounded-xl hover:shadow-lg hover:shadow-[#7042f88b]/20 transition-all duration-300 cursor-pointer
                ${selectedNFTId === nft.id ? "ring-2 ring-[#7042f88b] bg-[#7042f88b]/5" : ""}`}
              >
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="flex-1 flex justify-between items-center min-w-0">
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-white">
                        {nft.name}
                      </h3>
                      <div
                        className={`px-2.5 py-1 rounded-full text-xs font-medium
                        ${nft.status === "completed"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        }`}
                      >
                        {nft.status === "completed" ? "Completed" : "In Progress"}
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-[#a8c7fa]/60">Mission:</span>
                        <span className="text-white font-medium">
                          {nft.missionAmount}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#a8c7fa]/60">Expires:</span>
                        <span className="text-white font-medium truncate">
                          {nft.expireDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center ml-4">
                    <svg
                      className="w-5 h-5 text-[#a8c7fa]/40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
