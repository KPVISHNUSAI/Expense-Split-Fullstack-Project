// src/components/dashboard/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BalanceCard from './BalanceCard';
import ActivityFeed from './ActivityFeed';
import { motion } from 'framer-motion';
import { 
    CurrencyDollarIcon, 
    UserGroupIcon, 
    ArrowPathIcon 
} from '@heroicons/react/24/outline';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        balances: {
            total: 0,
            owed: 0,
            owe: 0
        },
        activities: [],
        stats: {
            totalGroups: 0,
            totalExpenses: 0,
            totalSettlements: 0
        }
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Here you would typically dispatch actions to fetch data
                // For now, using setTimeout to simulate API call
                setTimeout(() => {
                    setDashboardData({
                        balances: {
                            total: 750.25,
                            owed: 1250.50,
                            owe: -500.25
                        },
                        activities: [
                            {
                                id: 1,
                                type: 'expense',
                                user: 'John Doe',
                                action: 'added an expense',
                                description: 'Dinner at Restaurant',
                                amount: 120.50,
                                group: 'Weekend Trip',
                                createdAt: new Date().toISOString()
                            },
                            {
                                id: 2,
                                type: 'settlement',
                                user: 'Jane Smith',
                                action: 'settled payment',
                                amount: 50.00,
                                group: 'Roommates',
                                createdAt: new Date(Date.now() - 86400000).toISOString()
                            },
                            {
                                id: 3,
                                type: 'group',
                                user: 'You',
                                action: 'created a new group',
                                description: 'Beach Trip',
                                createdAt: new Date(Date.now() - 172800000).toISOString()
                            }
                        ],
                        stats: {
                            totalGroups: 5,
                            totalExpenses: 25,
                            totalSettlements: 12
                        }
                    });
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [dispatch]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <ArrowPathIcon className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user?.name || 'User'}!
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Here's your financial overview and recent activity.
                </p>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BalanceCard
                    title="Total Balance"
                    amount={dashboardData.balances.total}
                    type="total"
                    currency="$"
                />
                <BalanceCard
                    title="You're Owed"
                    amount={dashboardData.balances.owed}
                    type="owed"
                    currency="$"
                />
                <BalanceCard
                    title="You Owe"
                    amount={dashboardData.balances.owe}
                    type="owe"
                    currency="$"
                />
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg shadow-sm p-6"
                >
                    <div className="flex items-center">
                        <UserGroupIcon className="h-6 w-6 text-indigo-600" />
                        <span className="ml-2 text-gray-900 font-medium">Active Groups</span>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {dashboardData.stats.totalGroups}
                    </p>
                </motion.div>
                
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg shadow-sm p-6"
                >
                    <div className="flex items-center">
                        <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                        <span className="ml-2 text-gray-900 font-medium">Total Expenses</span>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {dashboardData.stats.totalExpenses}
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg shadow-sm p-6"
                >
                    <div className="flex items-center">
                        <svg 
                            className="h-6 w-6 text-blue-600" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                            />
                        </svg>
                        <span className="ml-2 text-gray-900 font-medium">Settlements</span>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {dashboardData.stats.totalSettlements}
                    </p>
                </motion.div>
            </div>

            {/* Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivityFeed activities={dashboardData.activities} />
                
                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-4">
                        <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                            Add New Expense
                        </button>
                        <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                            Create New Group
                        </button>
                        <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Settle Up
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;