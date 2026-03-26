import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state for the cart
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Create the context
const CartContext = createContext();

// Cart reducer function to handle different actions
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      let updatedItems;

      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
      } else {
        // Add new item with quantity 1
        updatedItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      // Calculate new totals
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice,
      };
    }

    case 'REMOVE_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex >= 0) {
        let updatedItems;

        if (state.items[existingItemIndex].quantity > 1) {
          // Decrease quantity if more than 1
          updatedItems = [...state.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity - 1,
          };
        } else {
          // Remove item if quantity is 1
          updatedItems = state.items.filter((item) => item.id !== action.payload.id);
        }

        // Calculate new totals
        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        return {
          ...state,
          items: updatedItems,
          totalItems,
          totalPrice,
        };
      }
      return state;
    }

    case 'DELETE_ITEM': {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );

      // Calculate new totals
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice,
      };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
};

// Cart provider component
export const CartProvider = ({ children }) => {
  // Load cart from localStorage if available
  const savedCart = localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : initialState;

  const [state, dispatch] = useReducer(cartReducer, savedCart);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  // Add item to cart
  const addToCart = (product) => {
    const sellingPrice = product.discount > 0
      ? Math.round(product.price * (1 - product.discount / 100))
      : product.price;
    dispatch({
      type: 'ADD_ITEM',
      payload: { ...product, price: sellingPrice },
    });
  };

  // Remove item from cart (decrease quantity)
  const removeFromCart = (product) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: product,
    });
  };

  // Delete item from cart completely
  const deleteFromCart = (product) => {
    dispatch({
      type: 'DELETE_ITEM',
      payload: product,
    });
  };

  // Clear the entire cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        cart: state,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};