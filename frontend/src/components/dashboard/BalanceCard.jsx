// src/components/dashboard/BalanceCard.jsx

import React from 'react';
import { 
    ArrowTrendingUpIcon, 
    ArrowTrendingDownIcon, 
    BanknotesIcon 
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const BalanceCard = ({ title, amount, type, currency = '$' }) => {
    const getCardStyles = () => {
        switch (type) {
            case 'owed':
                return {
                    icon: ArrowTrendingUpIcon,
                    iconBg: 'bg-green-100',
                    iconColor: 'text-green-600',
                    amountColor: 'text-green-600'
                };
            case 'owe':
                return {
                    icon: ArrowTrendingDownIcon,
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    amountColor: 'text-red-600'
                };
            default:
                return {
                    icon: BanknotesIcon,
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    amountColor: 'text-blue-600'
                };
        }
    };

    const cardStyle = getCardStyles();
    const Icon = cardStyle.icon;

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
        >
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">
                        {title}
                    </h3>
                    <div className={`mt-2 flex items-baseline ${cardStyle.amountColor}`}>
                        <p className="text-2xl font-semibold">
                            {currency}{Math.abs(amount).toFixed(2)}
                        </p>
                    </div>
                </div>
                <div className={`p-3 rounded-md ${cardStyle.iconBg}`}>
                    <Icon className={`w-6 h-6 ${cardStyle.iconColor}`} />
                </div>
            </div>
            
            {/* Optional: Add a comparison with previous period */}
            {type !== 'total' && (
                <div className="mt-4 text-sm">
                    <span className={`${amount > 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                        {amount > 0 ? '+' : ''}{amount.toFixed(2)}
                    </span>
                    <span className="text-gray-500 ml-2">from last month</span>
                </div>
            )}
        </motion.div>
    );
};

export default BalanceCard;