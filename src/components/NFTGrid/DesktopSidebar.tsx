interface DesktopSidebarProps {
  isMenuCollapsed: boolean;
  setIsMenuCollapsed: (collapsed: boolean) => void;
  filters: any[];
  filterSelected: number;
  setFilterSelected: (id: number) => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  isMenuCollapsed,
  setIsMenuCollapsed,
  filters,
  filterSelected,
  setFilterSelected
}) => (
  <div className={`hidden lg:flex ${isMenuCollapsed ? 'w-[60px]' : 'w-[200px]'} h-full fixed left-0 top-[4.5rem] bg-[#0c0c0c]/95 backdrop-blur-md border-r border-[#a8c7fa]/10 flex-col transition-all duration-300`}>
    <button
      onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
      className="absolute -right-3 top-4 w-6 h-6 bg-[#0c0c0c] border border-[#a8c7fa]/10 rounded-full flex items-center justify-center text-[#a8c7fa]/60 hover:text-[#a8c7fa]"
    >
      <svg className={`w-4 h-4 transition-transform ${isMenuCollapsed ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <div className="flex-1 p-4 space-y-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setFilterSelected(filter.id)}
          className={`w-full text-left rounded-xl text-sm font-medium transition-all
            ${isMenuCollapsed ? 'p-2 flex justify-center' : 'px-4 py-3 flex items-center gap-3'}
            ${filterSelected === filter.id
              ? "bg-[#7042f88b] text-white"
              : "text-[#a8c7fa]/60 hover:text-[#a8c7fa] hover:bg-[#a8c7fa]/10"
            }`}
        >
          <span className={isMenuCollapsed ? 'w-5 h-5' : ''}>{filter.icon}</span>
          {!isMenuCollapsed && <span>{filter.title}</span>}
        </button>
      ))}
    </div>
  </div>
); 