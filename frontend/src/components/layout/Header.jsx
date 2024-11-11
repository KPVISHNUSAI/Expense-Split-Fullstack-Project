// src/components/layout/Header.jsx

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3Icon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { logoutUser } from '../../redux/actions/authActions';

const Header = ({ onMenuClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { pendingSettlements } = useSelector(state => state.dashboard);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    const navigation = [
        { name: 'Dashboard', href: '/' },
        { name: 'My Groups', href: '/groups' },
        { name: 'Expenses', href: '/expenses' },
        { name: 'Settlements', href: '/settlements' },
    ];

    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <button
                                type="button"
                                className="lg:hidden px-4 text-gray-500 focus:outline-none"
                                onClick={onMenuClick}
                            >
                                <Bars3Icon className="h-6 w-6" />
                            </button>
                            <Link to="/" className="text-2xl font-bold text-indigo-600">
                                ExpenseSplit
                            </Link>
                        </div>
                        <nav className="hidden lg:flex lg:space-x-8 lg:ml-10">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center">
                        <button
                            type="button"
                            className="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <BellIcon className="h-6 w-6" />
                            {pendingSettlements?.length > 0 && (
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                            )}
                        </button>

                        <Menu as="div" className="ml-3 relative">
                            <Menu.Button className="flex rounded-full text-sm focus:outline-none">
                                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                            </Menu.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <div className="px-4 py-2 text-sm text-gray-700">
                                                    Signed in as<br />
                                                    <span className="font-medium">{user?.email}</span>
                                                </div>
                                            )}
                                        </Menu.Item>

                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    to="/profile"
                                                    className={`${
                                                        active ? 'bg-gray-100' : ''
                                                    } block px-4 py-2 text-sm text-gray-700`}
                                                >
                                                    Your Profile
                                                </Link>
                                            )}
                                        </Menu.Item>

                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={handleLogout}
                                                    className={`${
                                                        active ? 'bg-gray-100' : ''
                                                    } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                                                >
                                                    Sign out
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;