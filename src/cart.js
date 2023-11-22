import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';

const Cart = () => {
  const { cart, dispatch } = useCart();

  const calculateTotal = () => {
    return cart.reduce((total, product) => total + product.amount, 0);
  };

  const [cartTotal, setCartTotal] = useState(() => calculateTotal());

  const calculateSubtotal = () => {
    return cart.reduce((subtotal, product) => subtotal + product.amount, 0);
  };

  const handleIncrement = (productId) => {
    dispatch({ type: 'INCREMENT_QUANTITY', payload: { productId } });
  };

  const handleDecrement = (productId) => {
    dispatch({ type: 'DECREMENT_QUANTITY', payload: { productId } });
  };

  useEffect(() => {
    dispatch({ type: 'UPDATE_AMOUNTS' });
    setCartTotal(calculateTotal());
  }, [cart, dispatch, calculateTotal]);
  
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Shopping Cart</h1>

      {cart.map((product) => (
        <div key={product.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h2>{product.title}</h2>
          <img src={product.image} alt={product.title} style={{ maxWidth: '100px' }} />
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          <p>Shipping: Free{product.shipping}</p>
          <p>Quantity: {product.quantity}</p>
          <button onClick={() => handleIncrement(product.id)}>+</button>
          <button onClick={() => handleDecrement(product.id)}>-</button>
          <p>Amount: ${product.amount}</p>
        </div>
      ))}

      {cart.length > 0 && (
        <div style={{ borderTop: '1px solid #ccc', marginTop: '20px', padding: '10px' }}>
          <p>Subtotal: ${calculateSubtotal()}</p>
          <p>Total: ${cartTotal}</p>
        </div>
      )}
    </div>
  );
};

export default Cart;
