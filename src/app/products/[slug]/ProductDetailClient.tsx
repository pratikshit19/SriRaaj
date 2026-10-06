'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/data';
import { useCart } from '@/lib/CartContext';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('description');
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, selectedSize, quantity);
  };

  const accordions = [
    { id: 'description', label: 'Description', content: product.description },
    { id: 'ingredients', label: 'Ingredients', content: product.ingredients },
    { id: 'nutrition', label: 'Nutritional Information', content: null },
    { id: 'how-to-use', label: 'How to Use', content: product.howToUse },
    { id: 'storage', label: 'Storage Instructions', content: product.storage },
    { id: 'shipping', label: 'Shipping & Delivery', content: '[SHIPPING DETAILS TO BE PROVIDED]' },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ padding: '20px 0', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--ivory-dark)' }}>
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol style={{ listStyle: 'none', display: 'flex', gap: 8, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', letterSpacing: '0.06em' }}>
              <li><Link href="/" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>Home</Link></li>
              <li>/</li>
              <li><Link href="/shop" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>Shop</Link></li>
              <li>/</li>
              <li style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Product Layout */}
      <section style={{ padding: '60px 0', backgroundColor: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72 }} className="pdp-grid">

            {/* LEFT: Gallery */}
            <div>
              {/* Main Image */}
              <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: 'var(--ivory)', marginBottom: 16 }}>
                <Image
                  src={product.images[activeImage] || product.images[0]}
                  alt={`${product.name} — image ${activeImage + 1}`}
                  fill
                  priority
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              </div>
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div style={{ display: 'flex', gap: 12 }}>
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      aria-label={`View image ${i + 1}`}
                      style={{
                        position: 'relative',
                        width: 80,
                        aspectRatio: '3/4',
                        border: `2px solid ${activeImage === i ? 'var(--terracotta)' : 'var(--border-color)'}`,
                        cursor: 'pointer',
                        backgroundColor: 'var(--ivory)',
                        overflow: 'hidden',
                        padding: 0,
                      }}
                    >
                      <Image src={img} alt="" fill style={{ objectFit: 'cover' }} sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Product Info */}
            <div>
              {/* Badges */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {product.badges.map((b) => (
                  <span key={b} style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    border: '1px solid var(--terracotta)',
                    color: 'var(--terracotta)',
                    padding: '4px 10px',
                  }}>{b}</span>
                ))}
              </div>

              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                {product.category === 'ghee' ? 'Pure Ghee' : product.category === 'oils' ? 'Cooking Oil' : product.category}
              </p>

              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 12 }}>
                {product.name}
              </h1>

              {/* Rating placeholder */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span className="stars">{'★'.repeat(Math.round(product.rating))}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {product.rating.toFixed(1)} · {product.reviewCount === 0 ? 'No reviews yet' : `${product.reviewCount} reviews`}
                </span>
              </div>

              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 24 }}>
                {product.shortDescription}
              </p>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 28 }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 28, color: 'var(--text-primary)' }}>
                  ₹{selectedSize.price.toLocaleString('en-IN')}
                </span>
                {selectedSize.compareAtPrice && (
                  <span style={{ fontSize: 18, color: 'var(--text-light)', textDecoration: 'line-through' }}>
                    ₹{selectedSize.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Size Selector */}
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: 12 }}>
                  Size — <span style={{ color: 'var(--terracotta)', fontWeight: 600 }}>{selectedSize.label}</span>
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {product.sizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setSelectedSize(size)}
                      aria-pressed={selectedSize.value === size.value}
                      style={{
                        padding: '10px 20px',
                        border: `1px solid ${selectedSize.value === size.value ? 'var(--terracotta)' : 'var(--border-color)'}`,
                        backgroundColor: selectedSize.value === size.value ? 'var(--terracotta)' : 'transparent',
                        color: selectedSize.value === size.value ? '#FAF8F3' : 'var(--text-primary)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {size.label}
                      <span style={{ fontSize: 11, marginLeft: 6, opacity: 0.8 }}>₹{size.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: 12 }}>
                  Quantity
                </p>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', width: 'fit-content' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '12px 20px', fontSize: 16, color: 'var(--text-primary)' }}
                  >−</button>
                  <span style={{ padding: '12px 20px', fontSize: 14, minWidth: 48, textAlign: 'center', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '12px 20px', fontSize: 16, color: 'var(--text-primary)' }}
                  >+</button>
                </div>
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '18px 0', fontSize: 11 }}
                >
                  Add to Cart — ₹{(selectedSize.price * quantity).toLocaleString('en-IN')}
                </button>
                <Link
                  href="/checkout"
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', padding: '17px 0', fontSize: 11 }}
                >
                  Buy Now
                </Link>
              </div>

              {/* Trust signals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '20px', backgroundColor: 'var(--ivory-dark)', border: '1px solid var(--border-color)' }}>
                {[
                  '✓ Dispatched within 2–3 business days',
                  '✓ [RETURN POLICY TO BE PROVIDED]',
                  '✓ Secure checkout',
                ].map((item) => (
                  <p key={item} style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT DETAILS / ACCORDIONS ─────────────────────────── */}
      <section style={{ padding: '60px 0 100px', backgroundColor: 'var(--cream)' }}>
        <div className="container">
          <div style={{ maxWidth: 740, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: 'var(--text-primary)', marginBottom: 32 }}>
              Product Details
            </h2>

            {accordions.map((acc) => (
              <div key={acc.id} className="accordion-item">
                <button
                  className="accordion-trigger"
                  onClick={() => setActiveAccordion(activeAccordion === acc.id ? null : acc.id)}
                  aria-expanded={activeAccordion === acc.id}
                  id={`accordion-${acc.id}`}
                  aria-controls={`panel-${acc.id}`}
                >
                  {acc.label}
                  <span style={{ fontSize: 18, color: 'var(--text-muted)', transition: 'transform 0.3s', transform: activeAccordion === acc.id ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                <div
                  id={`panel-${acc.id}`}
                  role="region"
                  aria-labelledby={`accordion-${acc.id}`}
                  style={{
                    maxHeight: activeAccordion === acc.id ? 600 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.35s ease',
                    opacity: activeAccordion === acc.id ? 1 : 0,
                  }}
                >
                  <div style={{ paddingBottom: 24 }}>
                    {acc.id === 'nutrition' ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'var(--font-sans)' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ textAlign: 'left', padding: '10px 0', color: 'var(--text-primary)', fontWeight: 600, fontSize: 11, letterSpacing: '0.05em' }}>Nutrient</th>
                            <th style={{ textAlign: 'right', padding: '10px 0', color: 'var(--text-primary)', fontWeight: 600, fontSize: 11, letterSpacing: '0.05em' }}>Per 100g</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(product.nutritionPer100g).map(([key, val]) => (
                            <tr key={key} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '10px 0', color: 'var(--text-muted)' }}>{key}</td>
                              <td style={{ padding: '10px 0', textAlign: 'right', color: 'var(--text-primary)', fontWeight: 500 }}>{val}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                        {acc.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
