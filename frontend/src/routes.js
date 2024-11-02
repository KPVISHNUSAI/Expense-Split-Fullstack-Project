// src/routes.js

import { Dashboard } from './components/dashboard/Dashboard';
import { GroupList } from './components/groups/GroupList';
import { GroupDetail } from './components/groups/GroupDetail';
import { ExpenseList } from './components/expenses/ExpenseList';
import { SettlementList } from './components/settlements/SettlementList';

export const routes = [
    {
        path: '/',
        element: Dashboard,
        protected: true
    },
    {
        path: '/groups',
        element: GroupList,
        protected: true
    },
    {
        path: '/groups/:id',
        element: GroupDetail,
        protected: true
    },
    {
        path: '/expenses',
        element: ExpenseList,
        protected: true
    },
    {
        path: '/settlements',
        element: SettlementList,
        protected: true
    }
];