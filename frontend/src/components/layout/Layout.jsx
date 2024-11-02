// src/components/layout/Layout.jsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <Header onMenuClick={() => setSidebarOpen(true)} />

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content Area */}
                <div className="flex-1 overflow-auto">
                    <main className="flex-1 relative py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {/* Page content via Outlet */}
                            <Outlet />
                        </div>
                    </main>

                    {/* Footer */}
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Layout;