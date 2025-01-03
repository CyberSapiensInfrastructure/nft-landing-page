import React, { createContext, useContext, useState, useEffect } from 'react';
import { NFTMetadata } from '../types/nft';

interface NFTContextType {
  nftData: { [key: string]: NFTMetadata };
  setNFTData: (id: string, data: NFTMetadata) => void;
  getNFTById: (id: string) => NFTMetadata | null;
  activeNFT: NFTMetadata | null;
  setActiveNFT: (nft: NFTMetadata) => void;
  viewHistory: string[];
}

const NFTContext = createContext<NFTContextType | undefined>(undefined);

export const NFTProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nftData, setNftDataState] = useState<{ [key: string]: NFTMetadata }>({});
  const [activeNFT, setActiveNFTState] = useState<NFTMetadata | null>(null);
  const [viewHistory, setViewHistory] = useState<string[]>([]);

  useEffect(() => {
    // Load NFT data from localStorage on mount
    const storedData = localStorage.getItem('nftData');
    const storedActive = localStorage.getItem('activeNFT');
    const storedHistory = localStorage.getItem('nftViewHistory');

    if (storedData) {
      setNftDataState(JSON.parse(storedData));
    }
    if (storedActive) {
      setActiveNFTState(JSON.parse(storedActive));
    }
    if (storedHistory) {
      setViewHistory(JSON.parse(storedHistory));
    }
  }, []);

  const setNFTData = (id: string, data: NFTMetadata) => {
    const newData = { ...nftData, [id]: data };
    setNftDataState(newData);
    localStorage.setItem('nftData', JSON.stringify(newData));
  };

  const setActiveNFT = (nft: NFTMetadata) => {
    setActiveNFTState(nft);
    localStorage.setItem('activeNFT', JSON.stringify(nft));
    
    // Update view history
    const newHistory = [nft.id.toString(), ...viewHistory.filter(id => id !== nft.id.toString())].slice(0, 5);
    setViewHistory(newHistory);
    localStorage.setItem('nftViewHistory', JSON.stringify(newHistory));
  };

  const getNFTById = (id: string): NFTMetadata | null => {
    return nftData[id] || null;
  };

  return (
    <NFTContext.Provider value={{ 
      nftData, 
      setNFTData, 
      getNFTById, 
      activeNFT, 
      setActiveNFT,
      viewHistory 
    }}>
      {children}
    </NFTContext.Provider>
  );
};

export const useNFT = () => {
  const context = useContext(NFTContext);
  if (context === undefined) {
    throw new Error('useNFT must be used within a NFTProvider');
  }
  return context;
}; 