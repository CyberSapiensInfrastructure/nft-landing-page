import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { F8__factory } from "../../typechain-types/factories/F8__factory";

const F8_ADDRESS = "0x4684059c10Cc9b9E3013c953182E2e097B8d089d";

interface WalletContextType {
  isWalletConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  f8Contract: any | null;
  account: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [f8Contract, setF8Contract] = useState<any | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = F8__factory.connect(F8_ADDRESS, signer);
          setF8Contract(contract);
          setIsWalletConnected(true);
          setAccount(accounts[0]);
        }
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = F8__factory.connect(F8_ADDRESS, signer);
          setF8Contract(contract);
          setIsWalletConnected(true);
          setAccount(accounts[0]);
        } else {
          setF8Contract(null);
          setIsWalletConnected(false);
          setAccount(null);
        }
      });
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = F8__factory.connect(F8_ADDRESS, signer);
        setF8Contract(contract);
        setIsWalletConnected(true);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    }
  };

  const disconnectWallet = () => {
    setF8Contract(null);
    setIsWalletConnected(false);
    setAccount(null);
  };

  return (
    <WalletContext.Provider
      value={{
        isWalletConnected,
        connectWallet,
        disconnectWallet,
        f8Contract,
        account,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}; 