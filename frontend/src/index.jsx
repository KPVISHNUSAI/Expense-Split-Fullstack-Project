// src/index.jsx

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import './styles/global.css';

// Error tracking setup
const handleError = (error, errorInfo) => {
  // You can implement your error tracking service here (e.g., Sentry)
  console.error('Application Error:', error);
  console.error('Error Info:', errorInfo);
};

// Performance monitoring
const reportWebVitals = (metric) => {
  // You can implement your performance monitoring here
  console.log(metric);
};

// Root wrapper with error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    handleError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Oops! Something went wrong.
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Please try refreshing the page or contact support if the problem persists.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Create root container
const container = document.getElementById('root');
const root = createRoot(container);

// Development environment checks
if (process.env.NODE_ENV === 'development') {
  // Enable React strict mode for development
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  // Production rendering without strict mode
  root.render(
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  );
}

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}

// Report web vitals
reportWebVitals();

// Hot module replacement for development
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    root.render(
      <ErrorBoundary>
        <Provider store={store}>
          <NextApp />
        </Provider>
      </ErrorBoundary>
    );
  });
}

// Global error handler for uncaught errors
window.addEventListener('unhandledrejection', (event) => {
  handleError(event.reason, { type: 'unhandledrejection' });
});

// Export for testing
export { ErrorBoundary };