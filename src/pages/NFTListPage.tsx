import React, { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [f8Contract, setF8Contract] = useState<F8 | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // Get initial values from URL or use defaults
  const [view, setView] = useState<"list" | "grid">(
    (searchParams.get("view") as "list" | "grid") || "grid"
  );
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "all",
    category: searchParams.get("category") || "all",
    sortBy: searchParams.get("sort") || "newest",
  });

  // Initialize contract and check wallet connection
  useEffect(() => {
    const initContract = async () => {
      if (window.ethereum) {
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
        window.ethereum.on("accountsChanged", (accounts: string[]) => {
          setIsWalletConnected(accounts.length > 0);
          if (accounts.length > 0) {
            const signer = provider.getSigner();
            const contract = F8__factory.connect(F8_ADDRESS, signer);
            setF8Contract(contract);
          } else {
            setF8Contract(null);
            setNfts([]);
          }
        });
      }
    };
    initContract();
  }, []);

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
  useEffect(() => {
    const fetchNFTs = async () => {
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
    };

    fetchNFTs();
  }, [f8Contract, isWalletConnected]);

  // Filter NFTs based on current filters
  const filteredNFTs = nfts
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
    });

  const handleConnectWallet = async () => {
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
  };

  const handleNFTSelect = (nft: NFT) => {
    setSelectedNFT(nft);
  };

  const handleCloseModal = () => {
    setSelectedNFT(null);
  };

  return (
    <div className="min-h-screen py-20">
      <AnimatePresence>
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
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-6">nft collection</h1>
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            view={view}
            setView={setView}
            isWalletConnected={isWalletConnected}
            onConnectWallet={handleConnectWallet}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isWalletConnected ? (
            <NFTGrid
              nfts={filteredNFTs}
              isLoading={isLoading}
              onSelect={handleNFTSelect}
              selectedNFTId={selectedNFT?.id}
              view={view}
            />
          ) : (
            <div className="text-center text-[#a8c7fa]/60 py-12">
              Connect your wallet to view your NFTs
            </div>
          )}
        </motion.div>

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
  );
};

export default NFTListPage;
