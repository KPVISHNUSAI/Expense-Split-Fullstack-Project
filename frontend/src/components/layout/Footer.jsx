// src/components/layout/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerSections = {
        product: {
            title: 'Product',
            links: [
                { name: 'Features', href: '/features' },
                { name: 'How it works', href: '/how-it-works' },
                { name: 'Pricing', href: '/pricing' },
                { name: 'FAQ', href: '/faq' }
            ]
        },
        company: {
            title: 'Company',
            links: [
                { name: 'About us', href: '/about' },
                { name: 'Blog', href: '/blog' },
                { name: 'Careers', href: '/careers' },
                { name: 'Contact', href: '/contact' }
            ]
        },
        legal: {
            title: 'Legal',
            links: [
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Cookie Policy', href: '/cookies' },
                { name: 'Security', href: '/security' }
            ]
        },
        social: {
            title: 'Social',
            links: [
                { name: 'Twitter', href: 'https://twitter.com', external: true },
                { name: 'Facebook', href: 'https://facebook.com', external: true },
                { name: 'Instagram', href: 'https://instagram.com', external: true },
                { name: 'LinkedIn', href: 'https://linkedin.com', external: true }
            ]
        }
    };

    const renderFooterSection = (section, key) => (
        <div key={key}>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
                {section.title}
            </h3>
            <ul className="mt-4 space-y-4">
                {section.links.map((link) => (
                    <li key={link.name}>
                        {link.external ? (
                            <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-base text-gray-500 hover:text-gray-900"
                            >
                                {link.name}
                            </a>
                        ) : (
                            <Link
                                to={link.href}
                                className="text-base text-gray-500 hover:text-gray-900"
                            >
                                {link.name}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );

    const renderNewsletter = () => (
        <div className="mt-12 xl:mt-0">
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
                Subscribe to our newsletter
            </h3>
            <p className="mt-4 text-base text-gray-500">
                Get the latest updates about ExpenseSplit features and releases.
            </p>
            <form className="mt-4 sm:flex sm:max-w-md">
                <label htmlFor="email-address" className="sr-only">
                    Email address
                </label>
                <input
                    type="email"
                    name="email-address"
                    id="email-address"
                    autoComplete="email"
                    required
                    className="appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:placeholder-gray-400"
                    placeholder="Enter your email"
                />
                <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 flex items-center justify-center border border-transparent rounded-md py-2 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Subscribe
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    {/* Brand section */}
                    <div className="space-y-8 xl:col-span-1">
                        <Link to="/" className="flex items-center">
                            <span className="text-2xl font-bold text-indigo-600">
                                ExpenseSplit
                            </span>
                        </Link>
                        <p className="text-gray-500 text-base">
                            Making expense sharing simple and hassle-free. Split bills with friends, 
                            roommates, and groups easily.
                        </p>
                        <div className="flex space-x-6">
                            {footerSections.social.links.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <span className="sr-only">{item.name}</span>
                                    {/* Add social icons here if needed */}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links sections */}
                    <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            {renderFooterSection(footerSections.product, 'product')}
                            {renderFooterSection(footerSections.company, 'company')}
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            {renderFooterSection(footerSections.legal, 'legal')}
                            {renderNewsletter()}
                        </div>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="mt-12 border-t border-gray-200 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-base text-gray-400">
                            &copy; {currentYear} ExpenseSplit. All rights reserved.
                        </p>
                        <div className="mt-4 md:mt-0">
                            <img
                                className="h-10"
                                src="/secure-payments.png"
                                alt="Secure payments"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;