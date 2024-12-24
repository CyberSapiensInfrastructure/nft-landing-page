interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (eventName: string, handler: (...args: any[]) => void) => void;
  removeListener: (eventName: string, handler: (...args: any[]) => void) => void;
  isConnected: () => boolean;
  selectedAddress: string | null;
  chainId: string | null;
  networkVersion: string | null;
  disconnect?: () => Promise<void>;
}

declare global {
  interface Window {
    ethereum: any;
    avalanche: any;
  }
} 