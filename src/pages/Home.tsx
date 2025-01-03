import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Hero from "../components/Hero";
import { ethers } from "ethers";
import { handleError } from "../utils/validation";
import { F8__factory } from "../../typechain-types/factories/F8__factory";
interface MissionData {
  missionId: string;
  missionName: string;
  missionAmount: ethers.BigNumber;
  rebornAmount: ethers.BigNumber;
  isComplete: boolean;
  expiryDate: ethers.BigNumber;
  canClaim?: boolean;
}

interface ContextType {
  provider: ethers.providers.Web3Provider | null;
  account: string | null;
}

const formatExpiryDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return "Expired";
  }
  
  if (diffDays === 0) {
    return "Expires Today";
  }
  
  if (diffDays === 1) {
    return "Expires Tomorrow";
  }
  
  if (diffDays <= 7) {
    return `Expires in ${diffDays} days`;
  }
  
  return `Expires on ${date.toLocaleDateString('en-US', { 
    month: 'short',
    day: 'numeric'
  })}`;
};

const MissionCard = ({ mission, onViewDetails }: { 
  mission: MissionData;
  onViewDetails?: () => void;
}) => {
  const isExpired = new Date(mission.expiryDate.toNumber() * 1000) < new Date();

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border transition-all duration-300 overflow-hidden group hover:shadow-xl hover:-translate-y-1
      ${mission.isComplete 
        ? 'border-green-500/20 hover:border-green-500/40' 
        : isExpired
          ? 'border-red-500/20 hover:border-red-500/40 opacity-75'
          : 'border-slate-700/50 hover:border-slate-600/50'
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 ${isExpired ? 'bg-red-900/20' : ''}`} />
        <img
          src="/src/assets/img/mission.png"
          alt={mission.missionName}
          className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ${isExpired ? 'grayscale' : ''}`}
        />
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm
            ${mission.isComplete 
              ? 'bg-green-500/20 text-green-500 border border-green-500/20' 
              : isExpired
                ? 'bg-red-500/20 text-red-400 border border-red-500/20'
                : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20'
            }`}
          >
            {mission.isComplete 
              ? 'Completed' 
              : isExpired
                ? 'Expired'
                : 'Active'
            }
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {/* Mission Header */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
            {mission.missionName}
          </h3>
          <p className="text-sm text-gray-400">Mission #{mission.missionId}</p>
        </div>

        {/* Mission Details */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-700/30 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Mission Amount</p>
              <p className="text-sm sm:text-base font-semibold text-white">{ethers.utils.formatEther(mission.missionAmount)} AVAX</p>
            </div>
            <div className="bg-slate-700/30 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Reborn Amount</p>
              <p className="text-sm sm:text-base font-semibold text-white">{ethers.utils.formatEther(mission.rebornAmount)} AVAX</p>
            </div>
          </div>

          <div className="bg-slate-700/30 backdrop-blur-sm rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-gray-400">Time Remaining</p>
              <span className={`text-xs font-medium ${
                isExpired
                  ? 'text-red-400'
                  : new Date(mission.expiryDate.toNumber() * 1000).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
                    ? 'text-yellow-400'
                    : 'text-white'
              }`}>
                {formatExpiryDate(mission.expiryDate.toNumber())}
              </span>
            </div>
            <div className="w-full bg-slate-600/30 rounded-full h-1.5">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  isExpired
                    ? 'bg-red-500'
                    : new Date(mission.expiryDate.toNumber() * 1000).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
                      ? 'bg-yellow-500'
                      : 'bg-purple-500'
                }`}
                style={{
                  width: `${Math.max(0, Math.min(100, (new Date(mission.expiryDate.toNumber() * 1000).getTime() - new Date().getTime()) / (7 * 24 * 60 * 60 * 1000) * 100))}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/missions?id=${mission.missionId}`}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 px-4 py-2.5 rounded-lg font-medium text-white text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const MissionSlider = React.memo(({ missions }: { missions: MissionData[] }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const activeMissions = missions.filter(
    mission => !mission.isComplete && new Date(mission.expiryDate.toNumber() * 1000) > new Date()
  );

  const scrollTo = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    const scrollAmount = 350 + 24; // card width + gap
    const maxScroll = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;

    if (direction === "left") {
      const newPosition = Math.max(0, scrollPosition - scrollAmount);
      setScrollPosition(newPosition);
      sliderRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
    } else {
      const newPosition = Math.min(maxScroll, scrollPosition + scrollAmount);
      setScrollPosition(newPosition);
      sliderRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
    }
  };

  const handleScroll = useCallback(() => {
    if (sliderRef.current) {
      setScrollPosition(sliderRef.current.scrollLeft);
    }
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", handleScroll);
      return () => slider.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const showLeftArrow = scrollPosition > 0;
  const showRightArrow = sliderRef.current
    ? scrollPosition < sliderRef.current.scrollWidth - sliderRef.current.clientWidth - 10
    : true;

  if (activeMissions.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-r from-purple-500/5 via-slate-800/50 to-purple-500/5 rounded-xl border border-purple-500/10 backdrop-blur-xl">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/10 flex items-center justify-center">
          <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Active Missions</h3>
        <p className="text-gray-400">Check back later for new missions</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Slider Container */}
      <div className="relative">
        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide scroll-smooth"
        >
          {activeMissions.map((mission) => (
            <div
              key={mission.missionId}
              className="min-w-[350px] snap-start flex-shrink-0"
            >
              <MissionCard mission={mission} />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {showLeftArrow && (
          <button
            onClick={() => scrollTo("left")}
            className="absolute -left-3 lg:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-black/70 hover:scale-110 z-20 opacity-0 group-hover:opacity-100"
            aria-label="Previous missions"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {showRightArrow && (
          <button
            onClick={() => scrollTo("right")}
            className="absolute -right-3 lg:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-black/70 hover:scale-110 z-20 opacity-0 group-hover:opacity-100"
            aria-label="Next missions"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-6 w-12 lg:w-20 bg-gradient-to-r from-[#0c0c0c] via-[#0c0c0c]/80 to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-6 w-12 lg:w-20 bg-gradient-to-l from-[#0c0c0c] via-[#0c0c0c]/80 to-transparent pointer-events-none z-10" />
      </div>

      {/* Scroll Indicator */}
      {activeMissions.length > 3 && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Scroll to see more missions</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}

      {/* Mission Counter */}
      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-sm text-white border border-white/10">
        {activeMissions.length} Active Mission{activeMissions.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
});

const Home: React.FC = () => {
  const { provider, account } = useOutletContext<ContextType>();
  const [isMissionsLoading, setIsMissionsLoading] = useState(false);
  const [missions, setMissions] = useState<MissionData[]>([]);
  const hasFetchedRef = useRef(false);



  const fetchMissions = useCallback(async () => {
    if (!provider || !account || hasFetchedRef.current) return;

    try {
      setIsMissionsLoading(true);
      const signer = provider.getSigner();
      const f8Contract = F8__factory.connect(
        "0x4684059c10Cc9b9E3013c953182E2e097B8d089d",
        signer
      );

      const missionCounter = await f8Contract.getMissionCounter();
      const missionPromises = [];

      for (let i = 0; i < missionCounter.toNumber(); i++) {
        missionPromises.push(f8Contract.viewMission(i));
      }

      const missionResults = await Promise.all(missionPromises);
      const formattedMissions = missionResults.map((mission, index) => ({
        missionId: index.toString(),
        missionName: mission.missionName,
        missionAmount: mission.missionAmount,
        rebornAmount: mission.rebornAmount,
        isComplete: mission.isComplete,
        expiryDate: mission.expiryDate,
      }));

      setMissions(formattedMissions);
      hasFetchedRef.current = true;
    } catch (error) {
      console.error("Error fetching missions:", handleError(error));
    } finally {
      setIsMissionsLoading(false);
    }
  }, [provider, account]);

  useEffect(() => {
    if (provider && account && !hasFetchedRef.current) {
      fetchMissions();
    }
  }, [fetchMissions, provider, account]);

  // Reset fetch flag when account changes
  useEffect(() => {
    hasFetchedRef.current = false;
  }, [account]);

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <Hero />
      {/* Missions Section */}
      <section className="py-20 bg-[#0c0c0c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Active Missions
              </h2>
              <p className="text-gray-400">Complete missions to earn rewards</p>
            </div>
            <Link
              to="/missions"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
            >
              View All Missions
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          {isMissionsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-slate-800/50 rounded-xl h-[300px]"
                />
              ))}
            </div>
          ) : missions.length > 0 ? (
            <MissionSlider missions={missions} />
          ) : (
            <div className="text-center py-12 bg-slate-800/50 rounded-xl">
              <p className="text-gray-400">
                No missions available at the moment
              </p>
            </div>
          )}
        </div>
      </section>

   
    </div>
  );
};

export default Home;