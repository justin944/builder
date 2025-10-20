
import React from 'react';
import { motion } from 'framer-motion';
import { Baby, Music, Trophy, Store, Briefcase } from 'lucide-react';

const templates = [
  {
    id: 'kids',
    name: 'Kids',
    icon: Baby,
    color: 'from-pink-400 to-purple-400',
    description: 'Perfect for young talents'
  },
  {
    id: 'musicians',
    name: 'Musicians',
    icon: Music,
    color: 'from-blue-400 to-cyan-400',
    description: 'Showcase your musical talent'
  },
  {
    id: 'athletes',
    name: 'Athletes',
    icon: Trophy,
    color: 'from-orange-400 to-red-400',
    description: 'Highlight your sports achievements'
  },
  {
    id: 'vendors',
    name: 'Vendors',
    icon: Store,
    color: 'from-green-400 to-emerald-400',
    description: 'Promote your business'
  },
  {
    id: 'businesses',
    name: 'Businesses',
    icon: Briefcase,
    color: 'from-indigo-400 to-purple-400',
    description: 'Professional business cards'
  }
];

const TemplateSelector = ({ onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {templates.map((template, index) => {
        const Icon = template.icon;
        return (
          <motion.button
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(template)}
            className="relative overflow-hidden rounded-2xl p-8 text-left card-shadow hover:shadow-2xl transition-all duration-300 bg-white group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            
            <div className="relative z-10">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2 text-gray-800">{template.name}</h3>
              <p className="text-gray-600">{template.description}</p>
              
              <div className="mt-4 flex items-center text-sm font-semibold">
                <span className={`bg-gradient-to-r ${template.color} bg-clip-text text-transparent`}>
                  Select Template →
                </span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default TemplateSelector;
  