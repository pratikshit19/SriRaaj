'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/CartContext';

export default function CartDrawer() {
  const { state, removeItem, updateQuantity, closeCart, subtotal } = useCart();

  useEffect(() => {
    if (state.isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [state.isOpen]);

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(42,20,8,0.5)',
          zIndex: 200, backdropFilter: 'blur(2px)',
        }}
        aria-label="Close cart"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-label="Shopping cart"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(440px, 100vw)',
          backgroundColor: 'var(--off-white)',
          borderLeft: '1px solid var(--border-color)',
          zIndex: 201,
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 28px',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky', top: 0, backgroundColor: 'var(--off-white)', zIndex: 1,
        }}>
          <div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Your Cart
            </span>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--text-primary)', marginTop: 2 }}>
              {state.items.length} {state.items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            style={{ background: 'none', border: '1px solid var(--border-color)', cursor: 'pointer', padding: '8px 10px', color: 'var(--text-primary)' }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, padding: '0 28px', paddingTop: 8 }}>
          {state.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--text-muted)', marginBottom: 8 }}>Your cart is empty</p>
              <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 28 }}>Add some of India&apos;s finest to get started.</p>
              <Link href="/shop" className="btn btn-primary" onClick={closeCart}>Browse Products</Link>
            </div>
          ) : (
            state.items.map((item) => (
              <div key={`${item.product.id}-${item.size.value}`} style={{
                display: 'flex', gap: 16, padding: '20px 0',
                borderBottom: '1px solid var(--border-color)',
              }}>
                <div style={{ position: 'relative', width: 80, height: 100, flexShrink: 0, border: '1px solid var(--border-color)', overflow: 'hidden', background: 'var(--ivory)' }}>
                  <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.04em', marginBottom: 2 }}>
                    {item.product.name}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>{item.size.label}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)' }}>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size.value, item.quantity - 1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px', fontSize: 14, color: 'var(--text-primary)' }}
                        aria-label="Decrease quantity"
                      >−</button>
                      <span style={{ padding: '6px 12px', fontSize: 13, minWidth: 32, textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size.value, item.quantity + 1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px', fontSize: 14, color: 'var(--text-primary)' }}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
                      ₹{(item.size.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.size.value)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 10, padding: 0 }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div style={{
            padding: '20px 28px 32px',
            borderTop: '1px solid var(--border-color)',
            position: 'sticky', bottom: 0, backgroundColor: 'var(--off-white)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Subtotal</span>
              <span style={{ fontWeight: 600, fontSize: 16 }}>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 16 }}>Shipping calculated at checkout</p>
            <Link
              href="/checkout"
              className="btn btn-primary"
              onClick={closeCart}
              style={{ width: '100%', justifyContent: 'center', padding: '16px 0', fontSize: 11 }}
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={closeCart}
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', marginTop: 10, fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 0' }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
