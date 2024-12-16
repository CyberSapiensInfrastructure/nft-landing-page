import { ViewToggle } from './ViewToggle';

interface MobileHeaderProps {
  activeTab: 'all' | 'my';
  view: 'grid' | 'list';
  handleTabChange: (tab: 'all' | 'my') => void;
  onViewChange: (view: 'grid' | 'list') => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ activeTab, view, handleTabChange, onViewChange }) => (
  <div className="w-full lg:hidden">
    <div className="flex items-center justify-between p-3 border-b border-[#a8c7fa]/10">
      {/* All/My NFTs Toggle */}
      <div className="flex gap-1.5 p-1 bg-[#0c0c0c]/80 rounded-lg border border-[#a8c7fa]/10">
        <button
          onClick={() => handleTabChange('all')}
          className={`px-3 py-1 rounded-lg text-base font-medium transition-all ${
            activeTab === 'all' ? "bg-[#7042f88b] text-white" : "text-[#a8c7fa]/60 hover:text-[#a8c7fa]"
          }`}
        >
          All NFTs
        </button>
        <button
          onClick={() => handleTabChange('my')}
          className={`px-3 py-1 rounded-lg text-base font-medium transition-all ${
            activeTab === 'my' ? "bg-[#7042f88b] text-white" : "text-[#a8c7fa]/60 hover:text-[#a8c7fa]"
          }`}
        >
          My NFTs
        </button>
      </div>

      {/* View Toggle */}
      <ViewToggle view={view} onViewChange={onViewChange} />
    </div>
  </div>
); 