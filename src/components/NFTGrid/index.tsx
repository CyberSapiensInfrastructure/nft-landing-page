import { useState } from "react";

import { NFTGridProps } from './types';
import { FilterBar } from "./FilterBar";
import { MobileHeader } from "./MobileHeader";
import { DesktopSidebar } from './DesktopSidebar';
import { NFTGridView } from './NFTGridView';
import { DesktopHeader } from './DesktopHeader';
import { NFTList } from './NFTList';

const filters = [
  { id: 1, title: "All NFTs", icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )},
  { id: 2, title: "Art", icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )},
  { id: 3, title: "Gaming", icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
  )},
  { id: 4, title: "Memberships", icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )}
];

export const NFTGrid: React.FC<NFTGridProps> = ({ nfts, isLoading, onSelect, selectedNFTId, view, onViewChange, onTabChange }) => {
  const [filterSelected, setFilterSelected] = useState(1);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

  const handleTabChange = (tab: 'all' | 'my') => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full h-full flex">
      {/* Desktop Sidebar */}
      <DesktopSidebar    
        isMenuCollapsed={isMenuCollapsed}
        setIsMenuCollapsed={setIsMenuCollapsed}
        filters={filters}
        filterSelected={filterSelected}
        setFilterSelected={setFilterSelected}
      />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-[3.5rem] left-0 right-0 z-50 bg-[#0c0c0c] border-b border-[#a8c7fa]/10">
        <MobileHeader 
          activeTab={activeTab}
          view={view}
          handleTabChange={handleTabChange}
          onViewChange={onViewChange}
        />
        <div className="bg-[#0c0c0c]/95 backdrop-blur-md">
          <FilterBar 
            filters={filters}
            filterSelected={filterSelected}
            setFilterSelected={setFilterSelected}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${isMenuCollapsed ? 'lg:ml-[60px]' : 'lg:ml-[200px]'} min-h-screen transition-all duration-300 ${!isMenuCollapsed && 'lg:pt-0 pt-[7.5rem]'}`}>
        {/* Desktop Header */}
        <DesktopHeader 
          view={view} 
          onViewChange={onViewChange}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          filters={filters}
          filterSelected={filterSelected}
          setFilterSelected={setFilterSelected}
        />

        <div className="w-full">
          {view === 'grid' ? (
            <NFTGridView nfts={nfts} onSelect={onSelect} selectedNFTId={selectedNFTId} />
          ) : (
            <NFTList nfts={nfts} onSelect={onSelect} selectedNFTId={selectedNFTId} />
          )}
        </div>
      </div>
    </div>
  );
}; 