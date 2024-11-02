// src/components/layout/Footer.jsx

import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
                            ExpenseSplit
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Making expense sharing simple and hassle-free.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
                            Quick Links
                        </h3>
                        <ul className="mt-2 space-y-2">
                            <li>
                                <a href="/about" className="text-sm text-gray-500 hover:text-gray-900">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="/terms" className="text-sm text-gray-500 hover:text-gray-900">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
                            Contact Us
                        </h3>
                        <ul className="mt-2 space-y-2">
                            <li className="text-sm text-gray-500">
                                Email: support@expensesplit.com
                            </li>
                            <li className="text-sm text-gray-500">
                                Phone: (555) 123-4567
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-6">
                    <p className="text-sm text-gray-400 text-center">
                        © {new Date().getFullYear()} ExpenseSplit. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;