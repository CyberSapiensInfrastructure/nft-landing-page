export interface NFTGridProps {
  nfts: NFT[];
  isLoading: boolean;
  onSelect: (nft: NFT) => void;
  selectedNFTId?: number;
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  onTabChange?: (tab: 'all' | 'my') => void;
}

export type NFT = {
  id: number;
  name: string;
  image: string;
  description?: string;
  price: number;
  status: 'completed' | 'not_completed';
  expireDate: string;
  missionAmount: number;
};

export interface Filter {
  id: number;
  title: string;
  icon: React.ReactNode;
} 