export interface NFTMetadata {
  id: number;
  name: string;
  description: string;
  image: string;
  status: 'completed' | 'not_completed';
  expireDate: string;
  missionAmount: number;
  rarity: string;
  creator: string;
  collection: string;
  blockchain: string;
  missions: Array<{ name: string; completed: boolean }>;
  attributes: Array<{ trait_type: string; value: string | number }>;
} 