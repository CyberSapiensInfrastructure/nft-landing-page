import React, { useState } from "react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="w-full h-full flex">
  
      <div className="flex-1 flex flex-col gap-3 w-full">
        {/* Mobile Filter Bar */}
        <div className="z-30  border-b border-[#a8c7fa]/10">
          {/* All/My NFTs ve View Toggle */}
          <div className="flex items-center justify-between p-3">
            {/* All/My NFTs Toggle */}
            <div className="flex gap-1.5 p-1 bg-[#0c0c0c]/80 rounded-lg border border-[#a8c7fa]/10">
              <button
                onClick={() => handleTabChange("all")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "all"
                    ? "bg-[#7042f88b] text-white"
                    : "text-[#a8c7fa]/60 hover:text-[#a8c7fa]"
                }`}
              >
                All NFTs
              </button>
              <button
                onClick={() => handleTabChange("my")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "my"
                    ? "bg-[#7042f88b] text-white"
                    : "text-[#a8c7fa]/60 hover:text-[#a8c7fa]"
                }`}
              >
                My NFTs
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex gap-1.5 p-1 bg-[#0c0c0c]/80 rounded-lg border border-[#a8c7fa]/10">
              <button
                onClick={() => onViewChange("grid")}
                className={`flex items-center justify-center p-1.5 rounded-lg transition-all ${
                  view === "grid"
                    ? "bg-[#7042f88b] text-white"
                    : "text-[#a8c7fa]/60 hover:text-[#a8c7fa]"
                }`}
              >
                <ViewGridIcon />
              </button>
              <button
                onClick={() => onViewChange("list")}
                className={`flex items-center justify-center p-1.5 rounded-lg transition-all ${
                  view === "list"
                    ? "bg-[#7042f88b] text-white"
                    : "text-[#a8c7fa]/60 hover:text-[#a8c7fa]"
                }`}
              >
                <ViewListIcon />
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="overflow-x-auto scrollbar-none">
            <div className="flex gap-1.5 p-3 pt-0 min-w-min">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setFilterSelected(filter.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all
                  ${
                    filterSelected === filter.id
                      ? "bg-[#7042f88b] text-white"
                      : "bg-[#0c0c0c]/80 text-[#a8c7fa]/60 hover:text-[#a8c7fa] border border-[#a8c7fa]/10"
                  }`}
                >
                  <svg className="w-4 h-4">{filter.icon}</svg>
                  <span>{filter.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 overflow-auto h-[200px]
            `}
        >
          {/* Content Area */}
          <div className="w-full">
            {view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3">
                {nfts.map((nft) => (
                  <div
                    key={nft.id}
                    onClick={() => onSelect(nft)}
                    className={`relative group bg-[#0c0c0c]/50 backdrop-blur-md border border-[#a8c7fa]/10 rounded-xl p-3 
                    hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer
                    ${
                      selectedNFTId === nft.id ? "ring-2 ring-[#7042f88b]" : ""
                    }`}
                    style={{ zIndex: 10 }}
                  >
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-white truncate">
                          {nft.name}
                        </h3>
                        <div
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap
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

                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        <div className="bg-[#a8c7fa]/5 px-2 py-1.5 rounded-lg">
                          <span className="block text-[#a8c7fa]/60 mb-0.5">
                            Mission
                          </span>
                          <p className="text-white font-medium truncate">
                            {nft.missionAmount}
                          </p>
                        </div>
                        <div className="bg-[#a8c7fa]/5 px-2 py-1.5 rounded-lg">
                          <span className="block text-[#a8c7fa]/60 mb-0.5">
                            Expires
                          </span>
                          <p className="text-white font-medium truncate">
                            {nft.expireDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1 p-3">
                {nfts.map((nft) => (
                  <div
                    key={nft.id}
                    onClick={() => onSelect(nft)}
                    className={`flex items-center gap-2.5 border border-[#a8c7fa]/10 
                    p-2 rounded-xl hover:bg-[#a8c7fa]/5 transition-all duration-300 cursor-pointer
                    ${
                      selectedNFTId === nft.id
                        ? "ring-2 ring-[#7042f88b] bg-[#7042f88b]/5"
                        : ""
                    }`}
                  >
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 flex justify-between items-center min-w-0">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-xs font-medium text-white truncate">
                            {nft.name}
                          </h3>
                          <div
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap
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
                        <div className="flex gap-2 text-[10px]">
                          <div className="flex items-center gap-1">
                            <span className="text-[#a8c7fa]/60">Mission:</span>
                            <span className="text-white font-medium">
                              {nft.missionAmount}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[#a8c7fa]/60">Expires:</span>
                            <span className="text-white font-medium truncate">
                              {nft.expireDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center ml-3">
                        <svg
                          className="w-4 h-4 text-[#a8c7fa]/40"
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
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
