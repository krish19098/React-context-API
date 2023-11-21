import React from 'react';
import { CartProvider } from './CartContext';
import './App.css';
import Cart from './cart';

const App = () => {
  return (
    <CartProvider>
      <Cart />
    </CartProvider>
  );
};

export default App;
