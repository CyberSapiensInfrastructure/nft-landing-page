import React from 'react';

const features = [
  {
    id: 1,
    title: 'Exclusive NFTs',
    description: 'Access unique digital collectibles with special privileges.',
    icon: (
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
          d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Mission System',
    description: 'Complete missions to unlock rewards and special features.',
    icon: (
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
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Community',
    description: 'Join a vibrant community of collectors and enthusiasts.',
    icon: (
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
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Rewards',
    description: 'Earn rewards for participating in the ecosystem.',
    icon: (
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
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

const About: React.FC = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">about providence</h1>
          <p className="text-xl text-[#a8c7fa]/60 mb-12">
            discover the future of digital collectibles with our unique nft ecosystem
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="bg-[#0c0c0c]/50 backdrop-blur-sm rounded-xl border border-[#a8c7fa]/10 p-6 hover:border-[#7042f88b]/50 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[#7042f88b]/20 rounded-xl text-[#7042f8] group-hover:bg-[#7042f88b]/30 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                </div>
                <p className="text-[#a8c7fa]/60">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-[#0c0c0c]/50 backdrop-blur-sm rounded-xl border border-[#a8c7fa]/10 p-8">
            <h2 className="text-2xl font-bold mb-4">our mission</h2>
            <p className="text-[#a8c7fa]/60 mb-6">
              We are building a unique NFT ecosystem that combines digital collectibles with real utility. Our mission is to create a vibrant community of collectors and enthusiasts who can participate in various activities and earn rewards.
            </p>
            <p className="text-[#a8c7fa]/60">
              Through our mission system, users can unlock special features and privileges by completing various tasks. This creates an engaging experience that goes beyond simple NFT ownership.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 