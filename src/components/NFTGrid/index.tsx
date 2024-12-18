import { useState } from "react";
import { cn } from './utils';

import { NFTGridProps } from './types';

import { DesktopSidebar } from './DesktopSidebar';
import { NFTGridView } from './NFTGridView';
import { DesktopHeader } from './DesktopHeader';
import { NFTList } from './NFTList';



export const NFTGrid: React.FC<NFTGridProps> = ({ nfts, isLoading, onSelect, selectedNFTId, view, onViewChange, onTabChange }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

  const handleTabChange = (tab: 'all' | 'my') => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <DesktopHeader className="fixed top-0 right-0 left-0 z-10" view={view} onViewChange={onViewChange} activeTab={activeTab} handleTabChange={handleTabChange} />
      
      <div className="flex flex-1 pt-16">
        <DesktopSidebar 
          className="sticky top-16 h-[calc(100vh-4rem)]" 
          isOpen={isMenuCollapsed}
        />
        
        <main className={cn(
          "flex-1 transition-all duration-300",
          isMenuCollapsed ? "ml-[280px]" : "ml-0"
        )}>
          <div className="p-6">
            {view === 'grid' ? (
              <NFTGridView nfts={nfts} onSelect={onSelect} selectedNFTId={selectedNFTId} />
            ) : (
              <NFTList nfts={nfts} onSelect={onSelect} selectedNFTId={selectedNFTId} />
            )}
          </div>
        </main>
      </div>

      <footer className={cn(
        "bg-gray-100 py-4 transition-all duration-300",
        isMenuCollapsed ? "ml-[280px]" : "ml-0"
      )}>
        {/* Footer içeriği */}
      </footer>
    </div>
  );
}; 