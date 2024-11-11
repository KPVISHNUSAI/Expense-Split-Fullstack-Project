// src/components/layout/Sidebar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
    HomeIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    ArrowPathIcon,
    ClockIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', to: '/', icon: HomeIcon },
    { name: 'Groups', to: '/groups', icon: UserGroupIcon },
    { name: 'Expenses', to: '/expenses', icon: CurrencyDollarIcon },
    { name: 'Settlements', to: '/settlements', icon: ArrowPathIcon },
    { name: 'Activity', to: '/activity', icon: ClockIcon },
    { name: 'Reports', to: '/reports', icon: ChartBarIcon },
];

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { user } = useSelector(state => state.auth);
    const { stats } = useSelector(state => state.dashboard);

    const isActivePath = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const NavItem = ({ item }) => (
        <Link
            to={item.to}
            className={`${
                isActivePath(item.to)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
            onClick={() => onClose?.()}
        >
            <item.icon
                className={`${
                    isActivePath(item.to) ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                } mr-4 flex-shrink-0 h-6 w-6`}
            />
            {item.name}
        </Link>
    );

    const SidebarContent = () => (
        <div className="flex flex-col h-0 flex-1">
            {/* User Profile Section */}
            <div className="border-b border-gray-200 px-4 py-4">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600">
                            <span className="text-lg font-medium leading-none text-white">
                                {user?.name?.[0] || 'U'}
                            </span>
                        </span>
                    </div>
                    <div className="ml-3">
                        <p className="text-base font-medium text-gray-700">{user?.name}</p>
                        <p className="text-sm font-medium text-gray-500">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto">
                <nav className="px-3 mt-6 space-y-1">
                    {navigation.map((item) => (
                        <NavItem key={item.name} item={item} />
                    ))}
                </nav>
            </div>

            {/* Stats Section */}
            <div className="border-t border-gray-200 p-4">
                <div className="space-y-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Statistics
                        </p>
                        <dl className="mt-2 space-y-2">
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Total Groups</dt>
                                <dd className="text-sm font-medium text-gray-900">{stats?.totalGroups || 0}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Active Expenses</dt>
                                <dd className="text-sm font-medium text-gray-900">{stats?.totalExpenses || 0}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Settlements</dt>
                                <dd className="text-sm font-medium text-gray-900">{stats?.totalSettlements || 0}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Sidebar */}
            <div className={`lg:hidden ${isOpen ? '' : 'hidden'}`}>
                <div className="fixed inset-0 flex z-40">
                    {/* Overlay */}
                    <div 
                        className="fixed inset-0"
                        onClick={onClose}
                    >
                        <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
                    </div>

                    {/* Sidebar Panel */}
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                type="button"
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={onClose}
                            >
                                <XMarkIcon className="h-6 w-6 text-white" />
                            </button>
                        </div>
                        <SidebarContent />
                    </div>
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
                    <SidebarContent />
                </div>
            </div>
        </>
    );
};

export default Sidebar;