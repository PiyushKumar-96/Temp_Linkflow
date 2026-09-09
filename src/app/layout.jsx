import React from 'react';

// Note: In Vite SPA, the root layout is handled by index.html and src/main.jsx
export default function Layout({ children }) {
  return <div className="app-root">{children}</div>;
}
