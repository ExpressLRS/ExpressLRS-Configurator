import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './ui/App';
import './i18n';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
