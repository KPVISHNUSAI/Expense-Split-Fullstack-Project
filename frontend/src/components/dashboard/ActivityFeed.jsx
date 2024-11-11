// src/components/dashboard/ActivityFeed.jsx

import React from 'react';
import { 
    CurrencyDollarIcon,
    UserGroupIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { format, formatDistanceToNow } from 'date-fns';

const getActivityIcon = (type) => {
    switch (type) {
        case 'expense':
            return CurrencyDollarIcon;
        case 'settlement':
            return CheckCircleIcon;
        case 'group':
            return UserGroupIcon;
        default:
            return CurrencyDollarIcon;
    }
};

const getActivityColor = (type) => {
    switch (type) {
        case 'expense':
            return 'text-blue-600 bg-blue-100';
        case 'settlement':
            return 'text-green-600 bg-green-100';
        case 'group':
            return 'text-purple-600 bg-purple-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
};

const ActivityItem = ({ activity }) => {
    const Icon = getActivityIcon(activity.type);
    const colorClass = getActivityColor(activity.type);

    return (
        <div className="relative pb-8">
            <div className="relative flex items-start space-x-3">
                <div>
                    <div className={`relative px-1 ${colorClass} rounded-full`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <div>
                        <div className="text-sm">
                            <span className="font-medium text-gray-900">
                                {activity.user}
                            </span>
                            <span className="text-gray-500 ml-2">
                                {activity.action}
                            </span>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                        {activity.type === 'expense' && (
                            <div className="flex justify-between items-center">
                                <span>{activity.description}</span>
                                <span className="font-medium">${activity.amount.toFixed(2)}</span>
                            </div>
                        )}
                        {activity.type === 'settlement' && (
                            <div className="text-green-600">
                                Settlement completed: ${activity.amount.toFixed(2)}
                            </div>
                        )}
                        {activity.group && (
                            <span className="text-gray-500">
                                in {activity.group}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActivityFeed = ({ activities = [] }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
                Recent Activity
            </h2>
            
            <div className="flow-root">
                {activities.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                        No recent activity
                    </p>
                ) : (
                    <ul className="-mb-8">
                        {activities.map((activity, idx) => (
                            <li key={activity.id || idx}>
                                <ActivityItem activity={activity} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            {activities.length > 0 && (
                <div className="mt-6">
                    <button
                        type="button"
                        className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        View all activity
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActivityFeed;