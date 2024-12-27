import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Hero from "../components/Hero";
import { BottomSheet } from "../components/BottomSheet";
import type { NFT } from "../components/NFTGrid";
import nftImage from "../assets/img/nft.jpg";
import { ethers } from "ethers";
import { F8__factory } from "typechain-types/factories/F8__factory";
import { handleError } from "../utils/validation";

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

const MissionCard = ({ mission }: { mission: MissionData }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img
          src="/src/assets/img/mission.png"
          alt={mission.missionName}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 z-20">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm
            ${
              mission.isComplete
                ? "bg-green-500/20 text-green-500 border border-green-500/20"
                : "bg-yellow-500/20 text-yellow-500 border border-yellow-500/20"
            }`}
          >
            {mission.isComplete ? "Completed" : "Active"}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors mb-2">
          {mission.missionName}
        </h3>
        <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-slate-700/30 backdrop-blur-sm">
          <span className="text-gray-400">Reward</span>
          <span className="text-white font-medium">
            {ethers.utils.formatEther(mission.rebornAmount)} AVAX
          </span>
        </div>
      </div>
    </div>
  );
};

const MissionSlider = React.memo(
  ({ missions }: { missions: MissionData[] }) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);

    const scrollTo = (direction: "left" | "right") => {
      if (!sliderRef.current) return;

      const scrollAmount = 350 + 24; // card width + gap
      const maxScroll =
        sliderRef.current.scrollWidth - sliderRef.current.clientWidth;

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
      ? scrollPosition <
        sliderRef.current.scrollWidth - sliderRef.current.clientWidth - 10
      : true;

    return (
      <div className="relative">
        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide scroll-smooth"
        >
          {missions.map((mission) => (
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
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-black/70 z-20"
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
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-black/70 z-20"
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
        <div className="absolute left-0 top-0 bottom-6 w-20 bg-gradient-to-r from-[#0c0c0c] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-6 w-20 bg-gradient-to-l from-[#0c0c0c] to-transparent pointer-events-none" />
      </div>
    );
  }
);

const Home: React.FC = () => {
  const { provider, account } = useOutletContext<ContextType>();
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  const [isMissionsLoading, setIsMissionsLoading] = useState(false);
  const [nfts, setNfts] = useState<NFT[]>([]);
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