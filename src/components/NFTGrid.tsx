import React from "react";

export interface NFT {
  id: number;
  name: string;
  description?: string;
  image: string;
  status: "completed" | "not_completed";
  price: number;
  expireDate: string;
  missionAmount: number;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface NFTGridProps {
  nfts: NFT[];
  isLoading: boolean;
  onSelect: (nft: NFT) => void;
  selectedNFTId?: number;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  onTabChange: (tab: "all" | "my") => void;
}

export const NFTGrid: React.FC<NFTGridProps> = ({
  nfts,
  isLoading,
  onSelect,
  selectedNFTId,
  view,
}) => {
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
                      ${
                        nft.status === "completed"
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
                ${
                  selectedNFTId === nft.id
                    ? "ring-2 ring-[#7042f88b] bg-[#7042f88b]/5"
                    : ""
                }`}
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
                        ${
                          nft.status === "completed"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        }`}
                      >
                        {nft.status === "completed"
                          ? "Completed"
                          : "In Progress"}
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
