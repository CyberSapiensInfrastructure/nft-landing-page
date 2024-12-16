import React from 'react';
import { useParams } from 'react-router-dom';

export const NFTDetail = () => {
  const { id } = useParams();
  // You'll need to fetch NFT data based on the ID
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <div className="relative">
          <div className="sticky top-8">
            <img
              src="nft-image-url"
              alt="NFT"
              className="w-full rounded-2xl shadow-xl"
            />
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">NFT Name</h1>
            <p className="text-gray-600 mt-2">Collection Name</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Current Price</h2>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">0.05 ETH</span>
              <span className="text-gray-500">($100 USD)</span>
            </div>
            <button className="w-full mt-4 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
              Buy Now
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600">
              Detailed description of the NFT goes here...
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Properties</h2>
            <div className="grid grid-cols-3 gap-4">
              {/* Add property items here */}
              <div className="bg-indigo-50 p-4 rounded-lg text-center">
                <p className="text-sm text-indigo-600 font-medium">Background</p>
                <p className="text-lg font-semibold">Blue</p>
              </div>
              {/* Add more properties */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 