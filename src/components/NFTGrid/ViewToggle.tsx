import { ViewGridIcon, ViewListIcon } from './icons';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => (
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
); 