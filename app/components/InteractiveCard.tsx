import React from 'react';
import { motion } from 'framer-motion';

interface InteractiveCardProps {
  icon: React.ReactNode;
  title: string;
  className?: string;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({ icon, title, className }) => {
return (
    <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className={`p-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-xl transition-all border border-emerald-50 ${className || ''}`}
    >
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100/80 to-green-50 rounded-lg flex items-center justify-center mb-4 mx-auto">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-center text-gray-900">{title}</h3>
    </motion.div>
);
};

export default InteractiveCard;