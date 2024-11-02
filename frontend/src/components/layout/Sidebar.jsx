// src/components/layout/Sidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    HomeIcon, 
    UserGroupIcon, 
    CurrencyDollarIcon, 
    CreditCardIcon,
    XIcon 
} from '@heroicons/react/outline';

const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Groups', href: '/groups', icon: UserGroupIcon },
    { name: 'Expenses', href: '/expenses', icon: CurrencyDollarIcon },
    { name: 'Settlements', href: '/settlements', icon: CreditCardIcon },
];

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 flex z-40 lg:hidden ${isOpen ? '' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />

                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            type="button"
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={onClose}
                        >
                            <XIcon className="h-6 w-6 text-white" />
                        </button>
                    </div>

                    <nav className="flex-1 h-0 overflow-y-auto pt-5 pb-4">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) =>
                                    `group flex items-center px-2 py-2 text-base font-medium ${
                                        isActive
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`
                                }
                            >
                                <item.icon className="mr-4 h-6 w-6" />
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
                        <nav className="flex-1 px-2 py-4 space-y-1">
                            {navigation.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    className={({ isActive }) =>
                                        `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                            isActive
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    <item.icon className="mr-3 h-6 w-6" />
                                    {item.name}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;