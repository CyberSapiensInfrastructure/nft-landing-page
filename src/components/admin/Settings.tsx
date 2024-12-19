import { motion } from 'framer-motion';
import { useState } from 'react';

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  fields: {
    label: string;
    type: string;
    value: string;
    placeholder?: string;
  }[];
}

export const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');

  const settingSections: SettingSection[] = [
    {
      id: 'general',
      title: 'General Settings',
      description: 'Basic configuration settings',
      icon: '⚙️',
      fields: [
        { label: 'Platform Name', type: 'text', value: 'Providence NFT', placeholder: 'Enter platform name' },
        { label: 'Contact Email', type: 'email', value: 'admin@providence.com', placeholder: 'Enter contact email' }
      ]
    },
    {
      id: 'security',
      title: 'Security Settings',
      description: 'Security and authentication settings',
      icon: '🔒',
      fields: [
        { label: 'Admin Password', type: 'password', value: '', placeholder: 'Enter new password' },
        { label: '2FA Status', type: 'toggle', value: 'enabled' }
      ]
    },
    {
      id: 'network',
      title: 'Network Settings',
      description: 'Blockchain network configuration',
      icon: '🌐',
      fields: [
        { label: 'Network RPC URL', type: 'text', value: 'https://ethereum.infura.io/v3/', placeholder: 'Enter RPC URL' },
        { label: 'Chain ID', type: 'number', value: '1', placeholder: 'Enter chain ID' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-slate-400">Manage your platform settings</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation Sidebar */}
        <div className="bg-slate-800/50 backdrop-blur-xl p-4 rounded-xl border border-slate-700/50">
          <nav className="space-y-2">
            {settingSections.map((section) => (
              <motion.button
                key={section.id}
                whileHover={{ x: 4 }}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-indigo-500/20 text-white'
                    : 'text-slate-400 hover:bg-slate-700/30'
                }`}
              >
                <span className="text-2xl">{section.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{section.title}</div>
                  <div className="text-sm opacity-75">{section.description}</div>
                </div>
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl p-6 rounded-xl border border-slate-700/50">
          {settingSections.map((section) => (
            section.id === activeSection && (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>{section.icon}</span>
                    {section.title}
                  </h3>
                  <p className="text-slate-400">{section.description}</p>
                </div>

                <div className="space-y-4">
                  {section.fields.map((field, index) => (
                    <div key={index} className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">
                        {field.label}
                      </label>
                      {field.type === 'toggle' ? (
                        <div className="flex items-center space-x-3">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${
                              field.value === 'enabled' ? 'bg-indigo-500' : 'bg-slate-700'
                            }`}
                          >
                            <motion.div
                              layout
                              className={`w-4 h-4 rounded-full bg-white`}
                              animate={{
                                x: field.value === 'enabled' ? 24 : 0
                              }}
                            />
                          </motion.button>
                          <span className="text-white">
                            {field.value === 'enabled' ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      ) : (
                        <input
                          type={field.type}
                          defaultValue={field.value}
                          placeholder={field.placeholder}
                          className="w-full p-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white rounded-xl hover:opacity-90"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </motion.div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}; 