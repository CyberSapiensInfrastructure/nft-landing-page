import React from 'react';

const communityLinks = [
  {
    id: 1,
    name: 'Discord',
    description: 'Join our Discord community to chat with other members and get updates.',
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
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    url: 'https://discord.gg/providence',
  },
  {
    id: 2,
    name: 'Twitter',
    description: 'Follow us on Twitter for the latest news and announcements.',
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
          d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
        />
      </svg>
    ),
    url: 'https://twitter.com/providence',
  },
  {
    id: 3,
    name: 'Medium',
    description: 'Read our blog posts and stay updated with our progress.',
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
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14"
        />
      </svg>
    ),
    url: 'https://medium.com/providence',
  },
  {
    id: 4,
    name: 'Telegram',
    description: 'Join our Telegram group for instant updates and discussions.',
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
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
        />
      </svg>
    ),
    url: 'https://t.me/providence',
  },
];

const Community: React.FC = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">join our community</h1>
          <p className="text-xl text-[#a8c7fa]/60 mb-12">
            connect with us on social media and join our growing community
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communityLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0c0c0c]/50 backdrop-blur-sm rounded-xl border border-[#a8c7fa]/10 p-6 hover:border-[#7042f88b]/50 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[#7042f88b]/20 rounded-xl text-[#7042f8] group-hover:bg-[#7042f88b]/30 transition-colors">
                    {link.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{link.name}</h3>
                </div>
                <p className="text-[#a8c7fa]/60">{link.description}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community; 