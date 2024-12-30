import React from "react";

interface FilterBarProps {
  filters: {
    status: string;
    category: string;
    sortBy: string;
  };
  setFilters: (filters: {
    status: string;
    category: string;
    sortBy: string;
  }) => void;
  view: "list" | "grid";
  setView: (view: "list" | "grid") => void;
  isWalletConnected: boolean;
  onConnectWallet: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  view,
  setView,
  isWalletConnected,
  onConnectWallet,
}) => {
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  if (!isWalletConnected) {
    return (
      <div className="flex items-center justify-center py-8">
        <button
          onClick={onConnectWallet}
          className="px-8 py-3 bg-[#7042f88b] hover:bg-[#7042f8] text-white rounded-xl flex items-center gap-3 
                    transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#7042f8]/50"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Connect Wallet to View Your NFTs
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Status Dropdown */}
        <div className="relative group">
          <button
            className="px-6 py-2.5 bg-[#0c0c0c] hover:bg-[#0c0c0c]/80 text-white rounded-xl flex items-center gap-2 
                            border border-[#a8c7fa]/10 hover:border-[#7042f88b]/50 transition-all duration-300 min-w-[160px]"
          >
            <span className="text-[#a8c7fa]/60 text-sm">status:</span>
            <span className="text-white ml-1">
              {filters.status === "all" ? "all" : filters.status}
            </span>
            <svg
              className="w-4 h-4 ml-auto text-[#a8c7fa]/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            className="absolute top-full left-0 mt-2 w-full bg-[#0c0c0c] border border-[#a8c7fa]/10 rounded-xl overflow-hidden 
                         opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
          >
            <div className="py-1">
              {["all", "completed", "not_completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleFilterChange("status", status)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-[#7042f88b]/20 transition-colors
                    ${
                      filters.status === status
                        ? "text-white bg-[#7042f88b]/10"
                        : "text-[#a8c7fa]/60"
                    }`}
                >
                  {status === "all"
                    ? "all status"
                    : status === "completed"
                    ? "completed"
                    : "not completed"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="relative group">
          <button
            className="px-6 py-2.5 bg-[#0c0c0c] hover:bg-[#0c0c0c]/80 text-white rounded-xl flex items-center gap-2 
                            border border-[#a8c7fa]/10 hover:border-[#7042f88b]/50 transition-all duration-300 min-w-[160px]"
          >
            <span className="text-[#a8c7fa]/60 text-sm">category:</span>
            <span className="text-white ml-1">
              {filters.category === "all" ? "all" : filters.category}
            </span>
            <svg
              className="w-4 h-4 ml-auto text-[#a8c7fa]/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            className="absolute top-full left-0 mt-2 w-full bg-[#0c0c0c] border border-[#a8c7fa]/10 rounded-xl overflow-hidden 
                         opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
          >
            <div className="py-1">
              {["all", "whitelist", "airdrop", "reborn", "genesis"].map(
                (category) => (
                  <button
                    key={category}
                    onClick={() => handleFilterChange("category", category)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-[#7042f88b]/20 transition-colors
                    ${
                      filters.category === category
                        ? "text-white bg-[#7042f88b]/10"
                        : "text-[#a8c7fa]/60"
                    }`}
                  >
                    {category === "all" ? "all categories" : category}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="relative group ml-auto">
          <button
            className="px-6 py-2.5 bg-[#0c0c0c] hover:bg-[#0c0c0c]/80 text-white rounded-xl flex items-center gap-2 
                            border border-[#a8c7fa]/10 hover:border-[#7042f88b]/50 transition-all duration-300 min-w-[160px]"
          >
            <span className="text-[#a8c7fa]/60 text-sm">sort by:</span>
            <span className="text-white ml-1">
              {filters.sortBy === "newest"
                ? "newest"
                : filters.sortBy === "oldest"
                ? "oldest"
                : filters.sortBy === "price_high_low"
                ? "price: high to low"
                : "price: low to high"}
            </span>
            <svg
              className="w-4 h-4 ml-auto text-[#a8c7fa]/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            className="absolute top-full right-0 mt-2 w-48 bg-[#0c0c0c] border border-[#a8c7fa]/10 rounded-xl overflow-hidden 
                         opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
          >
            <div className="py-1">
              {[
                { value: "newest", label: "newest first" },
                { value: "oldest", label: "oldest first" },
                { value: "price_high_low", label: "price: high to low" },
                { value: "price_low_high", label: "price: low to high" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange("sortBy", option.value)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-[#7042f88b]/20 transition-colors
                    ${
                      filters.sortBy === option.value
                        ? "text-white bg-[#7042f88b]/10"
                        : "text-[#a8c7fa]/60"
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-[#0c0c0c]/50 p-1 rounded-xl border border-[#a8c7fa]/10 backdrop-blur-sm">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-lg transition-all duration-300 ${
              view === "grid"
                ? "bg-[#7042f88b] text-white shadow-lg shadow-[#7042f88b]/20"
                : "text-[#a8c7fa]/60 hover:text-[#a8c7fa] hover:bg-white/5"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg transition-all duration-300 ${
              view === "list"
                ? "bg-[#7042f88b] text-white shadow-lg shadow-[#7042f88b]/20"
                : "text-[#a8c7fa]/60 hover:text-[#a8c7fa] hover:bg-white/5"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
