import React from 'react';
import { cn } from './utils';

interface DesktopSidebarProps {
  className?: string;
  isOpen: boolean;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  className,
  isOpen
}) => {
  return (
    <aside className={cn(
      "fixed left-0 w-[280px] bg-white border-r border-gray-200 transition-transform duration-300",
      isOpen ? "translate-x-0" : "-translate-x-full",
      className
    )}>
      {/* Sidebar içeriği */}
    </aside>
  );
}; 