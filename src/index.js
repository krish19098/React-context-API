import React from 'react';
import App from './App';
import { CartProvider } from './CartContext';
const rootElement = document.getElementById('root');
const { createRoot } = require('react-dom/client');
const root = createRoot(rootElement);
root.render(
  <CartProvider>
    <App />
  </CartProvider>
);
