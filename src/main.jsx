import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import App from './App';
import './styles/index.css';
import './styles/tailwind.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
