// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <Provider store={store}>
            <Router>
                <ToastContainer />
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected routes with Layout */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        {/* <Route index element={<Dashboard />} /> */}
                        {/* Add other protected routes here */}
                        {/* <Route path="groups/*" element={<GroupRoutes />} /> */}
                        {/* <Route path="expenses/*" element={<ExpenseRoutes />} /> */}
                        {/* <Route path="settlements/*" element={<SettlementRoutes />} /> */}
                    </Route>
                </Routes>
            </Router>
        </Provider>
    );
}

export default App;