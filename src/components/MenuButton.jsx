import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const MenuButton = ({ icon: Icon, label, onClick, delay = 0, color = "bg-black/80 hover:bg-black/90 border-[#EA580C] text-[#EA580C]" }) => {
    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`w-full max-w-md p-4 mb-4 rounded-2xl shadow-lg flex items-center justify-between group relative overflow-hidden ${color}`}
        >
            <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                    <Icon size={24} className="text-white" />
                </div>
                <span className="text-lg font-medium tracking-wide">{label}</span>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                <ArrowRight size={20} className="text-white/70" />
            </div>
        </motion.button>
    );
};

export default MenuButton;
