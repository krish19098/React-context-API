import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

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
  

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
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
