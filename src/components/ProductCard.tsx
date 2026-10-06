'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/data';
import { useCart } from '@/lib/CartContext';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'featured';
}

export default function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const { addItem } = useCart();
  const defaultSize = product.sizes[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, defaultSize, 1);
  };

  return (
    <article
      className="product-card"
      style={{
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--cream)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        {/* Image */}
        <div style={{
          position: 'relative',
          aspectRatio: layout === 'featured' ? '4/3' : '3/4',
          overflow: 'hidden',
          backgroundColor: 'var(--ivory)',
        }}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            loading="lazy"
          />
          {product.badges.length > 0 && (
            <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {product.badges.map((badge) => (
                <span key={badge} style={{
                  backgroundColor: 'var(--brown-dark)',
                  color: 'var(--ivory)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '4px 8px',
                }}>
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '20px 20px 16px' }}>
          {/* Category */}
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 6,
          }}>
            {product.category === 'ghee' ? 'Pure Ghee' : product.category === 'oils' ? 'Cooking Oil' : product.category}
          </p>

          {/* Name */}
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 20,
            fontWeight: 400,
            color: 'var(--text-primary)',
            marginBottom: 6,
            lineHeight: 1.2,
          }}>
            {product.name}
          </h3>

          {/* Short Description */}
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: 14,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.shortDescription}
          </p>

          {/* Price Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: 17,
                color: 'var(--text-primary)',
              }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && (
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 13,
                  color: 'var(--text-light)',
                  textDecoration: 'line-through',
                }}>
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{product.sizes[0].label}+</span>
          </div>
        </div>
      </Link>

      {/* Add to Cart */}
      <div style={{ padding: '0 20px 20px' }}>
        <button
          onClick={handleAddToCart}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', fontSize: 10, padding: '12px 0' }}
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
