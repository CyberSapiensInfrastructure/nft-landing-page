import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';

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
    url: 'https://discord.gg/playprovidence',
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
    url: 'https://twitter.com/PlayProvidence',
  },
  {
    id: 3,
    name: 'Reddit',
    description: 'Join our Reddit community for discussions and updates.',
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
          d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
        />
      </svg>
    ),
    url: 'https://www.reddit.com/r/PlayProvidence',
  },
  {
    id: 4,
    name: 'Instagram',
    description: 'Follow us on Instagram for visual updates and behind-the-scenes.',
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
          d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 19.5h11a3 3 0 003-3v-11a3 3 0 00-3-3h-11a3 3 0 00-3 3v11a3 3 0 003 3z"
        />
      </svg>
    ),
    url: 'https://www.instagram.com/PlayProvidence',
  },
  {
    id: 5,
    name: 'Youtube',
    description: 'Subscribe to our Youtube channel for video content and trailers.',
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
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    url: 'https://www.youtube.com/@PlayProvidence',
  },
  {
    id: 6,
    name: 'Facebook',
    description: 'Follow our Facebook page for news and community updates.',
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
          d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
        />
      </svg>
    ),
    url: 'https://www.facebook.com/PlayProvidence',
  },
];

const Community: React.FC = () => {
  // Auto scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold mb-6">join our community</h1>
            <p className="text-xl text-[#a8c7fa]/60 mb-12">
              connect with us on social media and join our growing community
            </p>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={{
                show: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {communityLinks.map((link, index) => (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#0c0c0c]/50 backdrop-blur-sm rounded-xl border border-[#a8c7fa]/10 p-6 hover:border-[#7042f88b]/50 transition-all group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-[#7042f88b]/20 rounded-xl text-[#7042f8] group-hover:bg-[#7042f88b]/30 transition-colors">
                      {link.icon}
                    </div>
                    <h3 className="text-lg font-semibold">{link.name}</h3>
                  </div>
                  <p className="text-[#a8c7fa]/60">{link.description}</p>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Community; 