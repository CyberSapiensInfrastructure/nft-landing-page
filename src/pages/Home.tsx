import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Hero from "../components/Hero";
import { ethers } from "ethers";
import { handleError } from "../utils/validation";
import { F8__factory } from "../../typechain-types/factories/F8__factory";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

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

  return `Expires on ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;
};

const MissionDetailModal = ({
  mission,
  onClose,
}: {
  mission: MissionData;
  onClose: () => void;
}) => {
  const isExpired = new Date(mission.expiryDate.toNumber() * 1000) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-white">Mission Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Mission Info */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {mission.missionName}
                </h3>
                <p className="text-sm text-gray-400">
                  Mission #{mission.missionId}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  mission.isComplete
                    ? "bg-green-500/20 text-green-500 border border-green-500/20"
                    : isExpired
                    ? "bg-red-500/20 text-red-400 border border-red-500/20"
                    : "bg-yellow-500/20 text-yellow-500 border border-yellow-500/20"
                }`}
              >
                {mission.isComplete
                  ? "Completed"
                  : isExpired
                  ? "Expired"
                  : "Active"}
              </span>
            </div>

            {/* Mission Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {parseFloat(ethers.utils.formatEther(mission.missionAmount)) > 0 && (
                <div className={`bg-slate-700/50 rounded-xl p-4 space-y-1 ${
                  parseFloat(ethers.utils.formatEther(mission.rebornAmount)) === 0 ? 'md:col-span-2' : ''
                }`}>
                  <p className="text-sm text-gray-400">Mission Amount</p>
                  <p className="text-lg font-semibold text-white">
                    {ethers.utils.formatEther(mission.missionAmount)} AVAX
                  </p>
                </div>
              )}
              {parseFloat(ethers.utils.formatEther(mission.rebornAmount)) > 0 && (
                <div className={`bg-slate-700/50 rounded-xl p-4 space-y-1 ${
                  parseFloat(ethers.utils.formatEther(mission.missionAmount)) === 0 ? 'md:col-span-2' : ''
                }`}>
                  <p className="text-sm text-gray-400">Reborn Amount</p>
                  <p className="text-lg font-semibold text-white">
                    {ethers.utils.formatEther(mission.rebornAmount)} AVAX
                  </p>
                </div>
              )}
            </div>

            {/* Expiry Date */}
            <div className="bg-slate-700/50 rounded-xl p-4 space-y-1">
              <p className="text-sm text-gray-400">Expires On</p>
              <p className="text-lg font-semibold text-white">
                {formatExpiryDate(mission.expiryDate.toNumber())}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              to={`/missions?id=${mission.missionId}`}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 px-4 py-3 rounded-lg font-medium text-white text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
            >
              View Full Details
              <svg
                className="w-4 h-4"
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
        </div>
      </motion.div>
    </motion.div>
  );
};

const MissionCard = ({
  mission,
  onViewDetails,
}: {
  mission: MissionData;
  onViewDetails?: () => void;
}) => {
  const isExpired = new Date(mission.expiryDate.toNumber() * 1000) < new Date();
  const missionAmountValue = parseFloat(ethers.utils.formatEther(mission.missionAmount));
  const rebornAmountValue = parseFloat(ethers.utils.formatEther(mission.rebornAmount));
  const hasAnyAmount = missionAmountValue > 0 || rebornAmountValue > 0;

  return (
    <div
      onClick={onViewDetails}
      className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border transition-all duration-300 overflow-hidden hover:shadow-xl cursor-pointer h-full flex flex-col
        ${
          mission.isComplete
            ? "border-green-500/20 hover:border-green-500/40"
            : isExpired
            ? "border-red-500/20 hover:border-red-500/40 opacity-75"
            : "border-slate-700/50 hover:border-slate-600/50"
        }`}
    >
      <div className="relative h-48 overflow-hidden group/image">
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 ${
            isExpired ? "bg-red-900/20" : ""
          }`}
        />
        <img
          src="/src/assets/img/mission.png"
          alt={mission.missionName}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110 ${
            isExpired ? "grayscale" : ""
          }`}
        />
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm
            ${
              mission.isComplete
                ? "bg-green-500/20 text-green-500 border border-green-500/20"
                : isExpired
                ? "bg-red-500/20 text-red-400 border border-red-500/20"
                : "bg-yellow-500/20 text-yellow-500 border border-yellow-500/20"
            }`}
          >
            {mission.isComplete
              ? "Completed"
              : isExpired
              ? "Expired"
              : "Active"}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4 sm:p-6">
        {/* Mission Header */}
        <div className="mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white hover:text-purple-400 transition-colors">
            {mission.missionName}
          </h3>
          <p className="text-sm text-gray-400">Mission #{mission.missionId}</p>
        </div>

        {/* Mission Details */}
        <div className="space-y-3 flex-1">
          {hasAnyAmount && (
            <div className="grid grid-cols-2 gap-2">
              {missionAmountValue > 0 && (
                <div className={`bg-slate-700/30 backdrop-blur-sm rounded-lg p-3 ${rebornAmountValue === 0 ? 'col-span-2' : ''}`}>
                  <p className="text-xs text-gray-400 mb-1">Mission Amount</p>
                  <p className="text-sm sm:text-base font-semibold text-white">
                    {missionAmountValue} AVAX
                  </p>
                </div>
              )}
              {rebornAmountValue > 0 && (
                <div className={`bg-slate-700/30 backdrop-blur-sm rounded-lg p-3 ${missionAmountValue === 0 ? 'col-span-2' : ''}`}>
                  <p className="text-xs text-gray-400 mb-1">Reborn Amount</p>
                  <p className="text-sm sm:text-base font-semibold text-white">
                    {rebornAmountValue} AVAX
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="bg-slate-700/30 backdrop-blur-sm rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-gray-400">Time Remaining</p>
              <span
                className={`text-xs font-medium ${
                  isExpired
                    ? "text-red-400"
                    : new Date(mission.expiryDate.toNumber() * 1000).getTime() -
                        new Date().getTime() <
                      7 * 24 * 60 * 60 * 1000
                    ? "text-yellow-400"
                    : "text-white"
                }`}
              >
                {formatExpiryDate(mission.expiryDate.toNumber())}
              </span>
            </div>
            <div className="w-full bg-slate-600/30 rounded-full h-1.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isExpired
                    ? "bg-red-500"
                    : new Date(mission.expiryDate.toNumber() * 1000).getTime() -
                        new Date().getTime() <
                      7 * 24 * 60 * 60 * 1000
                    ? "bg-yellow-500"
                    : "bg-purple-500"
                }`}
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(
                      100,
                      ((new Date(
                        mission.expiryDate.toNumber() * 1000
                      ).getTime() -
                        new Date().getTime()) /
                        (7 * 24 * 60 * 60 * 1000)) *
                        100
                    )
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-4">
          <div className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 px-4 py-2.5 rounded-lg font-medium text-white text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            View Details
          </div>
        </div>
      </div>
    </div>
  );
};

const MissionSlider = React.memo(
  ({ missions }: { missions: MissionData[] }) => {
    const [selectedMission, setSelectedMission] = useState<MissionData | null>(null);
    const activeMissions = missions.filter(
      (mission) =>
        !mission.isComplete &&
        new Date(mission.expiryDate.toNumber() * 1000) > new Date()
    );

    if (activeMissions.length === 0) {
      return (
        <div className="text-center py-12 bg-gradient-to-r from-purple-500/5 via-slate-800/50 to-purple-500/5 rounded-xl border border-purple-500/10 backdrop-blur-xl">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/10 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No Active Missions
          </h3>
          <p className="text-gray-400">Check back later for new missions</p>
        </div>
      );
    }

    return (
      <>
        {/* Active Mission Counter */}
        <div className="mb-6 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-sm text-white border border-white/10 inline-flex items-center">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          {activeMissions.length} Active Mission{activeMissions.length !== 1 ? "s" : ""}
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, EffectCards]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            className="pb-12"
          >
            {activeMissions.map((mission) => (
              <SwiperSlide key={mission.missionId}>
                <MissionCard
                  mission={mission}
                  onViewDetails={() => setSelectedMission(mission)}
                />
              </SwiperSlide>
            ))}
            <div className="swiper-button-prev !text-white after:!text-2xl"></div>
            <div className="swiper-button-next !text-white after:!text-2xl"></div>
            <div className="swiper-pagination !bottom-0 !text-white"></div>
          </Swiper>

          {/* Mission Detail Modal */}
          <AnimatePresence>
            {selectedMission && (
              <MissionDetailModal
                mission={selectedMission}
                onClose={() => setSelectedMission(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </>
    );
  }
);

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
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Active Missions
              </h2>
              <p className="text-gray-400">Complete missions to earn rewards</p>
            </div>
            <Link
              to="/missions"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 whitespace-nowrap"
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
            <div className="relative group">
              <div className="flex gap-6 pb-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="min-w-[350px] flex-shrink-0">
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
                      {/* Image Skeleton */}
                      <div className="relative h-48 bg-slate-700/30 animate-pulse">
                        <div className="absolute top-4 right-4 w-20 h-6 bg-slate-600/50 rounded-full" />
                      </div>

                      {/* Content Skeleton */}
                      <div className="p-4 sm:p-6 space-y-4">
                        <div className="space-y-2">
                          <div className="h-6 bg-slate-700/30 rounded-lg w-3/4 animate-pulse" />
                          <div className="h-4 bg-slate-700/30 rounded-lg w-1/3 animate-pulse" />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-slate-700/30 rounded-lg p-3 space-y-2">
                            <div className="h-3 bg-slate-600/50 rounded w-2/3 animate-pulse" />
                            <div className="h-5 bg-slate-600/50 rounded animate-pulse" />
                          </div>
                          <div className="bg-slate-700/30 rounded-lg p-3 space-y-2">
                            <div className="h-3 bg-slate-600/50 rounded w-2/3 animate-pulse" />
                            <div className="h-5 bg-slate-600/50 rounded animate-pulse" />
                          </div>
                        </div>

                        <div className="bg-slate-700/30 rounded-lg p-3 space-y-2">
                          <div className="h-3 bg-slate-600/50 rounded w-2/3 animate-pulse" />
                          <div className="h-5 bg-slate-600/50 rounded animate-pulse" />
                        </div>

                        <div className="h-10 bg-slate-700/30 rounded-lg animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
