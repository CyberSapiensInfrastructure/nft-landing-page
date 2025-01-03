import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { NFTGrid } from "../components/NFTGrid";
import { BottomSheet } from "../components/BottomSheet";
import { FilterBar } from "../components/FilterBar";
import { LoadingAnimation } from "../components/LoadingAnimation";
import type { NFT } from "../components/NFTGrid";
import { F8 } from "../../typechain-types/F8";
import { F8__factory } from "../../typechain-types/factories/F8__factory";
import { ethers, BigNumber } from "ethers";

const F8_ADDRESS = "0x4684059c10Cc9b9E3013c953182E2e097B8d089d";

const NFTListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [f8Contract, setF8Contract] = useState<F8 | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get initial values from URL or use defaults
  const [view, setView] = useState<"list" | "grid">(
    (searchParams.get("view") as "list" | "grid") || "grid"
  );
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "all",
    category: searchParams.get("category") || "all",
    sortBy: searchParams.get("sort") || "newest",
  });

  const handleConnectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = F8__factory.connect(F8_ADDRESS, signer);
        setF8Contract(contract);
        setIsWalletConnected(true);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    }
  }, []);

  // Initialize contract and check wallet connection
  useEffect(() => {
    const initContract = async () => {
      if (!window.ethereum || isInitialized) return;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      
      setIsWalletConnected(accounts.length > 0);

      if (accounts.length > 0) {
        const signer = provider.getSigner();
        const contract = F8__factory.connect(F8_ADDRESS, signer);
        setF8Contract(contract);
      }

      // Listen for account changes
      const handleAccountsChanged = (accounts: string[]) => {
        setIsWalletConnected(accounts.length > 0);
        if (accounts.length > 0) {
          const signer = provider.getSigner();
          const contract = F8__factory.connect(F8_ADDRESS, signer);
          setF8Contract(contract);
        } else {
          setF8Contract(null);
          setNfts([]);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      setIsInitialized(true);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    };

    initContract();
  }, [isInitialized]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (view !== "grid") params.set("view", view);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.category !== "all") params.set("category", filters.category);
    if (filters.sortBy !== "newest") params.set("sort", filters.sortBy);

    setSearchParams(params, { replace: true });
  }, [view, filters, setSearchParams]);

  // Fetch NFTs when contract is available
  const fetchNFTs = useCallback(async () => {
    if (!f8Contract || !isWalletConnected) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadingMessage("Fetching your NFTs...");

    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        const tokenIds = await f8Contract.getList(accounts[0]);

        const metadataPromises = tokenIds.map(async (tokenId: BigNumber) => {
          const uri = await f8Contract.tokenURI(tokenId);
          try {
            const proxyUrl = "https://api.allorigins.win/get?url=";
            const response = await fetch(
              proxyUrl + encodeURIComponent(`${uri}.json`)
            );
            const proxyData = await response.json();
            const metadata = JSON.parse(proxyData.contents);

            return {
              id: parseInt(tokenId.toString()),
              name: metadata.name || `F8 NFT #${tokenId}`,
              description: metadata.description || "Providence NFT",
              image:
                metadata.image ||
                `http://cybersapiens.xyz/f8/img/${tokenId}.png`,
              status: "completed" as const,
              price: 0,
              expireDate: "31.12.2024 - 23:59:59",
              missionAmount: 0,
              attributes: metadata.attributes || [],
            } satisfies NFT;
          } catch (error) {
            console.error(
              `Error fetching metadata for token ${tokenId}:`,
              error
            );
            return {
              id: parseInt(tokenId.toString()),
              name: `F8 NFT #${tokenId}`,
              description: "Providence NFT",
              image: `http://cybersapiens.xyz/f8/img/${tokenId}.png`,
              status: "completed" as const,
              price: 0,
              expireDate: "31.12.2024 - 23:59:59",
              missionAmount: 0,
              attributes: [],
            } satisfies NFT;
          }
        });

        const metadata = await Promise.all(metadataPromises);
        setNfts(metadata);
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  }, [f8Contract, isWalletConnected]);

  useEffect(() => {
    if (isWalletConnected && f8Contract) {
      fetchNFTs();
    }
  }, [isWalletConnected, f8Contract, fetchNFTs]);

  // Filter NFTs based on current filters
  const filteredNFTs = useMemo(() => 
    nfts
      .filter((nft) => {
        if (filters.status !== "all" && nft.status !== filters.status) {
          return false;
        }
        if (
          filters.category !== "all" &&
          nft.name.toLowerCase() !== filters.category.toLowerCase()
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "oldest":
            return a.id - b.id;
          case "price_high_low":
            return b.price - a.price;
          case "price_low_high":
            return a.price - b.price;
          default: // newest
            return b.id - a.id;
        }
      })
  , [nfts, filters]);

  const handleNFTSelect = useCallback((nft: NFT) => {
    setSelectedNFT(nft);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedNFT(null);
  }, []);

  const handleViewChange = useCallback((newView: "list" | "grid") => {
    setView(newView);
  }, []);

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const renderNFTContent = useMemo(() => (
    <motion.div
      key={view} // Add key to force remount on view change
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <NFTGrid
        nfts={filteredNFTs}
        isLoading={isLoading}
        onSelect={handleNFTSelect}
        selectedNFTId={selectedNFT?.id}
        view={view}
      />
    </motion.div>
  ), [filteredNFTs, isLoading, handleNFTSelect, selectedNFT?.id, view]);

  const pageContent = useMemo(() => (
    <div className="min-h-screen py-20">
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingAnimation
            message={loadingMessage || "Loading your NFTs..."}
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500/10 via-slate-900 to-purple-500/10 p-8"
        >
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
          <div className="absolute inset-0 flex items-center justify-center bg-[#0c0c0c] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Providence nfts
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Providence NFTs are unique digital collectibles on the Avalanche
              blockchain. Each NFT represents a piece of the Providence
              ecosystem and grants special access to missions and rewards.
            </p>
          </div>
        </motion.div>

        {!isWalletConnected ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 bg-gradient-to-r from-purple-500/5 via-slate-800/50 to-purple-500/5 rounded-xl border border-purple-500/10 backdrop-blur-xl"
          >
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
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Wallet Not Connected
            </h3>
            <p className="text-gray-400 mb-6">
              Connect your wallet to view and participate in missions
            </p>
            <button
              onClick={handleConnectWallet}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Connect Wallet
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold mb-6">nft collection</h1>
              <FilterBar
                filters={filters}
                setFilters={handleFilterChange}
                view={view}
                setView={handleViewChange}
                isWalletConnected={isWalletConnected}
                onConnectWallet={handleConnectWallet}
              />
            </motion.div>

            <AnimatePresence mode="wait" initial={false}>
              {renderNFTContent}
            </AnimatePresence>
          </>
        )}

        <AnimatePresence>
          {selectedNFT && (
            <BottomSheet
              selectedNFT={selectedNFT}
              isOpen={!!selectedNFT}
              onClose={handleCloseModal}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  ), [
    isLoading,
    loadingMessage,
    isWalletConnected,
    handleConnectWallet,
    filters,
    view,
    handleFilterChange,
    handleViewChange,
    renderNFTContent,
    selectedNFT,
    handleCloseModal
  ]);

  return pageContent;
};

export default NFTListPage;
