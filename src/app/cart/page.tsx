'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import ProductCard from '@/components/ProductCard';
import { getFeaturedProducts } from '@/lib/data';

const suggestions = getFeaturedProducts().slice(0, 3);

export default function CartPage() {
  const { state, removeItem, updateQuantity, subtotal } = useCart();
  const shipping = subtotal > 999 ? 0 : 60;
  const total = subtotal + shipping;

  if (state.items.length === 0) {
    return (
      <div style={{ padding: '80px 0 100px', backgroundColor: 'var(--off-white)', minHeight: '60vh' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 36, color: 'var(--text-muted)', marginBottom: 12 }}>Your cart is empty</p>
          <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 32 }}>Add some of India&apos;s finest to get started.</p>
          <Link href="/shop" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section style={{ padding: '48px 0 16px', backgroundColor: 'var(--ivory-dark)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 300, color: 'var(--text-primary)' }}>
            Your Cart
          </h1>
        </div>
      </section>

      <section style={{ padding: '48px 0 100px', backgroundColor: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48, alignItems: 'flex-start' }} className="cart-layout">

            {/* Items */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 0 12px', borderBottom: '1px solid var(--border-color)', marginBottom: 0 }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Product</p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total</p>
              </div>

              {state.items.map((item) => (
                <div key={`${item.product.id}-${item.size.value}`} style={{ display: 'flex', gap: 24, padding: '28px 0', borderBottom: '1px solid var(--border-color)', alignItems: 'flex-start' }}>
                  <div style={{ position: 'relative', width: 100, height: 130, flexShrink: 0, border: '1px solid var(--border-color)', overflow: 'hidden', backgroundColor: 'var(--ivory)' }}>
                    <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Link href={`/products/${item.product.slug}`} style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--text-primary)', textDecoration: 'none', display: 'block', marginBottom: 4 }}>
                      {item.product.name}
                    </Link>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>{item.size.label}</p>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', width: 'fit-content' }}>
                      <button onClick={() => updateQuantity(item.product.id, item.size.value, item.quantity - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px', fontSize: 14 }} aria-label="Decrease quantity">−</button>
                      <span style={{ padding: '8px 16px', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', fontSize: 13, minWidth: 40, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.size.value, item.quantity + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px', fontSize: 14 }} aria-label="Increase quantity">+</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                    <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16 }}>₹{(item.size.price * item.quantity).toLocaleString('en-IN')}</p>
                    <button onClick={() => removeItem(item.product.id, item.size.value)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--ivory-dark)', padding: '32px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--text-primary)', marginBottom: 24 }}>Order Summary</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Subtotal</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Shipping</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: shipping === 0 ? 'green' : 'var(--text-primary)' }}>
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p style={{ fontSize: 11, color: 'var(--text-light)' }}>Free shipping on orders above ₹999</p>
                )}
              </div>

              {/* Coupon */}
              <div style={{ display: 'flex', marginBottom: 20 }}>
                <input type="text" placeholder="Coupon code" aria-label="Coupon code" style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--border-color)', borderRight: 'none', fontSize: 13, backgroundColor: 'var(--cream)' }} />
                <button className="btn btn-secondary" style={{ fontSize: 10, padding: '10px 16px', flexShrink: 0 }}>Apply</button>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 20, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
                  <span style={{ fontWeight: 700, fontSize: 18 }}>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px 0', fontSize: 11 }}>
                Proceed to Checkout
              </Link>

              <Link href="/shop" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* You May Also Like */}
      <section style={{ padding: '60px 0 100px', backgroundColor: 'var(--cream)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: 'var(--text-primary)', marginBottom: 36 }}>Complete Your Pantry</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="suggestions-grid">
            {suggestions.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </>
  );
}
