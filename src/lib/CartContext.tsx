'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Product, ProductSize } from '@/lib/data';

export interface CartItem {
  product: Product;
  size: ProductSize;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; size: ProductSize; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: string; sizeValue: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; sizeValue: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (i) => i.product.id === action.product.id && i.size.value === action.size.value
      );
      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + action.quantity,
        };
        return { ...state, items: updated, isOpen: true };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, size: action.size, quantity: action.quantity }],
        isOpen: true,
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.product.id === action.productId && i.size.value === action.sizeValue)
        ),
      };
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => !(i.product.id === action.productId && i.size.value === action.sizeValue)
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId && i.size.value === action.sizeValue
            ? { ...i, quantity: action.quantity }
            : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (product: Product, size: ProductSize, quantity: number) => void;
  removeItem: (productId: string, sizeValue: string) => void;
  updateQuantity: (productId: string, sizeValue: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  const addItem = (product: Product, size: ProductSize, quantity: number) =>
    dispatch({ type: 'ADD_ITEM', product, size, quantity });
  const removeItem = (productId: string, sizeValue: string) =>
    dispatch({ type: 'REMOVE_ITEM', productId, sizeValue });
  const updateQuantity = (productId: string, sizeValue: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', productId, sizeValue, quantity });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.size.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart, openCart, closeCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
