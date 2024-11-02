// src/components/layout/Header.jsx

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { MenuIcon, BellIcon } from '@heroicons/react/outline';

const Header = ({ onMenuClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-sm lg:static lg:overflow-y-visible">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex justify-between h-16">
                    <div className="flex items-center">
                        <button
                            type="button"
                            className="lg:hidden px-4 text-gray-500 focus:outline-none"
                            onClick={onMenuClick}
                        >
                            <MenuIcon className="h-6 w-6" />
                        </button>
                        <div className="flex-shrink-0 flex items-center">
                            <h1 className="text-2xl font-bold text-indigo-600">ExpenseSplit</h1>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <button
                            type="button"
                            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <BellIcon className="h-6 w-6" />
                        </button>

                        <div className="ml-4 relative flex-shrink-0">
                            <div className="flex items-center">
                                <div className="ml-3">
                                    <button
                                        type="button"
                                        className="flex items-center max-w-xs rounded-full focus:outline-none"
                                        onClick={() => {}}
                                    >
                                        <span className="text-gray-700 text-sm font-medium">
                                            {user?.name}
                                        </span>
                                    </button>
                                </div>
                                <div className="ml-3">
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;