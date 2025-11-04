import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import './index.css'

// Log environment info for debugging
console.log('🚀 Election Cart Admin Starting...');
console.log('Environment:', {
  mode: import.meta.env.MODE,
  apiUrl: import.meta.env.VITE_API_BASE_URL,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
});

// Catch unhandled errors
window.addEventListener('error', (event) => {
  console.error('Unhandled error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #0D1117; color: #fff; font-family: system-ui;">
      <div style="text-align: center; padding: 20px;">
        <h1 style="color: #f85149;">❌ Root Element Not Found</h1>
        <p>The application could not find the root element to mount.</p>
        <p style="color: #8b949e; margin-top: 20px;">This is a critical error. Please contact support.</p>
      </div>
    </div>
  `;
  throw new Error('Root element not found');
}

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
  console.log('✅ App mounted successfully');
} catch (error) {
  console.error('❌ Failed to mount app:', error);
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #0D1117; color: #fff; font-family: system-ui;">
      <div style="max-width: 600px; padding: 20px;">
        <h1 style="color: #f85149;">❌ Failed to Start Application</h1>
        <p style="margin: 20px 0;">The application failed to initialize.</p>
        <pre style="background: #161b22; padding: 15px; border-radius: 6px; overflow: auto; color: #f85149;">${error}</pre>
        <button onclick="window.location.reload()" style="background: #238636; color: #fff; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; margin-top: 20px;">
          Reload Page
        </button>
      </div>
    </div>
  `;
}
