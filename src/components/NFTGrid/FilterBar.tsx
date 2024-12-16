import { Filter } from './types';

interface FilterBarProps {
  filters: Filter[];
  filterSelected: number;
  setFilterSelected: (id: number) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, filterSelected, setFilterSelected }) => (
  <div className="overflow-x-auto scrollbar-none">
    <div className="flex gap-1.5 p-3 pt-0 min-w-min">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setFilterSelected(filter.id)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-base font-medium whitespace-nowrap transition-all
            ${filterSelected === filter.id
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
); 