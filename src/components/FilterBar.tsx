import React from 'react';

interface FilterBarProps {
  activeTab: "all" | "my";
  setActiveTab: (tab: "all" | "my") => void;
  filters: {
    status: string;
    category: string;
    sortBy: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    status: string;
    category: string;
    sortBy: string;
  }>>;
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeTab,
  setActiveTab,
  filters,
  setFilters,
  view,
  setView
}) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-[#0c0c0c]/50 backdrop-blur-sm rounded-xl border border-[#a8c7fa]/10 relative z-[100]">
      {/* Quick Filter Tabs */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setActiveTab("all")}
          className={`px-6 py-2.5 ${activeTab === "all" ? 'bg-[#7042f88b]' : 'bg-[#0c0c0c] border border-[#a8c7fa]/10'} 
                     text-white rounded-xl flex items-center gap-2 hover:bg-[#7042f88b]/80 transition-all duration-300`}
        >
          all nfts
        </button>
        <button 
          onClick={() => setActiveTab("my")}
          className={`px-6 py-2.5 ${activeTab === "my" ? 'bg-[#7042f88b]' : 'bg-[#0c0c0c] border border-[#a8c7fa]/10'} 
                     text-white rounded-xl flex items-center gap-2 hover:bg-[#7042f88b]/80 transition-all duration-300`}
        >
          my nfts
        </button>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* Reset Button */}
        <button
          onClick={() => setFilters({
            status: "all",
            category: "all",
            sortBy: "newest"
          })}
          className="px-4 py-2.5 bg-[#0c0c0c] hover:bg-[#0c0c0c]/80 text-[#a8c7fa]/60 hover:text-white 
                   rounded-xl border border-[#a8c7fa]/10 hover:border-[#7042f88b]/50 
                   transition-all duration-300 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          reset
        </button>

        {/* Status Filter */}
        <div className="relative group">
          <button className="px-6 py-2.5 bg-[#0c0c0c] hover:bg-[#0c0c0c]/80 text-white rounded-xl 
                         flex items-center gap-2 border border-[#a8c7fa]/10 hover:border-[#7042f88b]/50 
                         transition-all duration-300 min-w-[140px]">
            <span className="text-[#a8c7fa]/60 text-sm">status:</span>
            <span className="text-white">{filters.status}</span>
            <svg className="w-4 h-4 ml-auto text-[#a8c7fa]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="absolute top-full left-0 mt-2 w-full bg-[#0c0c0c] border border-[#a8c7fa]/10 
                       rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 
                       group-hover:visible transition-all duration-300 z-[110]">
            <div className="py-1">
              {["all", "completed", "not_completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilters(prev => ({ ...prev, status }))}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-[#7042f88b]/20 transition-colors
                           text-[#a8c7fa]/60 hover:text-white"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="relative group">
          <button className="px-6 py-2.5 bg-[#0c0c0c] hover:bg-[#0c0c0c]/80 text-white rounded-xl 
                         flex items-center gap-2 border border-[#a8c7fa]/10 hover:border-[#7042f88b]/50 
                         transition-all duration-300 min-w-[140px]">
            <span className="text-[#a8c7fa]/60 text-sm">category:</span>
            <span className="text-white">{filters.category}</span>
            <svg className="w-4 h-4 ml-auto text-[#a8c7fa]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="absolute top-full left-0 mt-2 w-full bg-[#0c0c0c] border border-[#a8c7fa]/10 
                       rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 
                       group-hover:visible transition-all duration-300 z-[110]">
            <div className="py-1">
              {["all", "whitelist", "airdrop", "reborn", "genesis"].map((category) => (
                <button
                  key={category}
                  onClick={() => setFilters(prev => ({ ...prev, category }))}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-[#7042f88b]/20 transition-colors
                           text-[#a8c7fa]/60 hover:text-white"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="relative group">
          <button className="px-6 py-2.5 bg-[#0c0c0c] hover:bg-[#0c0c0c]/80 text-white rounded-xl 
                         flex items-center gap-2 border border-[#a8c7fa]/10 hover:border-[#7042f88b]/50 
                         transition-all duration-300 min-w-[140px]">
            <span className="text-[#a8c7fa]/60 text-sm">sort by:</span>
            <span className="text-white">{filters.sortBy}</span>
            <svg className="w-4 h-4 ml-auto text-[#a8c7fa]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="absolute top-full right-0 mt-2 w-48 bg-[#0c0c0c] border border-[#a8c7fa]/10 
                       rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 
                       group-hover:visible transition-all duration-300 z-[110]">
            <div className="py-1">
              {[
                { value: "newest", label: "newest first" },
                { value: "oldest", label: "oldest first" },
                { value: "price_high_low", label: "price: high to low" },
                { value: "price_low_high", label: "price: low to high" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilters(prev => ({ ...prev, sortBy: option.value }))}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-[#7042f88b]/20 transition-colors
                           text-[#a8c7fa]/60 hover:text-white"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-1.5 p-1 bg-[#0c0c0c]/80 rounded-lg border border-[#a8c7fa]/10">
          <button
            onClick={() => setView("grid")}
            className={`flex items-center justify-center p-1.5 rounded-lg transition-all ${
              view === "grid"
                ? "bg-[#7042f88b] text-white"
                : "text-[#a8c7fa]/60 hover:text-[#a8c7fa]"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" 
              />
            </svg>
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center justify-center p-1.5 rounded-lg transition-all ${
              view === "list"
                ? "bg-[#7042f88b] text-white"
                : "text-[#a8c7fa]/60 hover:text-[#a8c7fa]"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}; 