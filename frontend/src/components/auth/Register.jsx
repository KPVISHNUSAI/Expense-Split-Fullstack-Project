// src/components/auth/Register.jsx

import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import authService  from '../../services/authService';
import { loginSuccess } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

const registerSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Name is too short')
        .max(50, 'Name is too long')
        .required('Name is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const { confirmPassword, ...registerData } = values;
            const response = await authService.register(registerData);
            dispatch(loginSuccess(response.data));
            toast.success('Registration successful!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Registration failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create a new account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            sign in to your account
                        </Link>
                    </p>
                </div>
                <Formik
                    initialValues={{
                        name: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                    }}
                    validationSchema={registerSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form className="mt-8 space-y-6">
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div>
                                    <Field
                                        name="name"
                                        type="text"
                                        className={`appearance-none rounded-t-md relative block w-full px-3 py-2 border ${
                                            errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                                        } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                        placeholder="Full name"
                                    />
                                    {errors.name && touched.name && (
                                        <div className="text-red-500 text-xs mt-1">{errors.name}</div>
                                    )}
                                </div>
                                <div>
                                    <Field
                                        name="email"
                                        type="email"
                                        className={`appearance-none relative block w-full px-3 py-2 border ${
                                            errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                                        } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                        placeholder="Email address"
                                    />
                                    {errors.email && touched.email && (
                                        <div className="text-red-500 text-xs mt-1">{errors.email}</div>
                                    )}
                                </div>
                                <div>
                                    <Field
                                        name="password"
                                        type="password"
                                        className={`appearance-none relative block w-full px-3 py-2 border ${
                                            errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                                        } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                        placeholder="Password"
                                    />
                                    {errors.password && touched.password && (
                                        <div className="text-red-500 text-xs mt-1">{errors.password}</div>
                                    )}
                                </div>
                                <div>
                                    <Field
                                        name="confirmPassword"
                                        type="password"
                                        className={`appearance-none rounded-b-md relative block w-full px-3 py-2 border ${
                                            errors.confirmPassword && touched.confirmPassword
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                        placeholder="Confirm password"
                                    />
                                    {errors.confirmPassword && touched.confirmPassword && (
                                        <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                        isSubmitting
                                            ? 'bg-indigo-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                    }`}
                                >
                                    {isSubmitting ? 'Creating account...' : 'Create account'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Register;