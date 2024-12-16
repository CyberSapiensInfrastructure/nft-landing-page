import React from "react";

interface QuestProgressProps {
  completedTasks: number;
  totalTasks: number;
}

const QuestProgress: React.FC<QuestProgressProps> = ({
  completedTasks,
  totalTasks,
}) => {
  const percentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="mt-8 p-4 bg-[#7042f88b]/5 backdrop-blur-sm border border-[#7042f88b]/20 rounded-lg">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-white/60 tracking-wider">
            QUEST PROGRESS
          </span>
          <span className="text-sm font-medium text-[#7042f88b]">
            {percentage}%
          </span>
        </div>
        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#7042f88b] to-[#9f7aea] rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-xs text-white/40 text-right">
          {completedTasks}/{totalTasks} Tasks Completed
        </div>
      </div>
    </div>
  );
};

export default QuestProgress;
