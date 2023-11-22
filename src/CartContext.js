import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext();

const calculateTotal = (products) => {
  // Calculate the total amount based on the products in the cart
  let total = 0;
  products.forEach((product) => {
    total += (product.price + (product.shipping || 0)) * product.quantity;
  });
  return total;
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return action.payload.products;
    case 'INCREMENT_QUANTITY':
      return state.map((product) =>
        product.id === action.payload.productId
          ? {
              ...product,
              quantity: product.quantity + 1,
              amount: (product.price + (product.shipping || 0)) * (product.quantity + 1),
            }
          : product
      );
    case 'DECREMENT_QUANTITY':
      return state.map((product) =>
        product.id === action.payload.productId && product.quantity > 0
          ? {
              ...product,
              quantity: product.quantity - 1,
              amount: (product.price + (product.shipping || 0)) * (product.quantity - 1),
            }
          : product
      );
    case 'UPDATE_AMOUNTS':
      return state.map((product) => ({
        ...product,
        amount: (product.price + (product.shipping || 0)) * product.quantity,
      }));
    default:
      return state;
  }
};

const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/product.json');
        const productsWithInitialValues = response.data.products.map((product) => ({
          ...product,
          quantity: 0,
          amount: 0,
        }));
        dispatch({ type: 'SET_CART', payload: { products: productsWithInitialValues } });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  const memoizedCalculateTotal = useCallback(() => calculateTotal(cart), [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch, calculateTotal: memoizedCalculateTotal }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CartProvider, useCart };
