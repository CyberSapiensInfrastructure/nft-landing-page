import { ViewGridIcon, ViewListIcon } from './icons';
import { FilterBar } from './FilterBar';

interface DesktopHeaderProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  activeTab: 'all' | 'my';
  handleTabChange: (tab: 'all' | 'my') => void;
  filters: any[];
  filterSelected: number;
  setFilterSelected: (id: number) => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({ 
  view, 
  onViewChange, 
  activeTab, 
  handleTabChange,
  filters,
  filterSelected,
  setFilterSelected
}) => (
  <div className="sticky top-0 z-10 hidden lg:block">
    {/* Top Bar with All/My NFTs and View Toggle */}
    <div className="flex items-center justify-between p-4">
      {/* All/My NFTs Toggle */}
      <div className="flex gap-1.5 p-1 bg-[#0c0c0c]/80 rounded-lg border border-[#a8c7fa]/10">
        <button
          onClick={() => handleTabChange('all')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'all' ? "bg-[#7042f88b] text-white" : "text-[#a8c7fa]/60 hover:text-[#a8c7fa]"
          }`}
        >
          All NFTs
        </button>
        <button
          onClick={() => handleTabChange('my')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'my' ? "bg-[#7042f88b] text-white" : "text-[#a8c7fa]/60 hover:text-[#a8c7fa]"
          }`}
        >
          My NFTs
        </button>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 p-1 bg-[#0c0c0c]/80 rounded-lg border border-[#a8c7fa]/10">
        <button
          onClick={() => onViewChange('grid')}
          className={`flex items-center justify-center p-2 rounded-lg transition-all ${
            view === 'grid'
              ? "bg-[#7042f88b] text-white"
              : "text-[#a8c7fa]/60 hover:text-[#a8c7fa]"
          }`}
        >
          <ViewGridIcon />
        </button>
        <button
          onClick={() => onViewChange('list')}
          className={`flex items-center justify-center p-2 rounded-lg transition-all ${
            view === 'list'
              ? "bg-[#7042f88b] text-white"
              : "text-[#a8c7fa]/60 hover:text-[#a8c7fa]"
          }`}
        >
          <ViewListIcon />
        </button>
      </div>
    </div>
  </div>
); 