'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { products, recipes, type Product, type RecipePost as Recipe } from '@/lib/data';
import { useCart } from '@/lib/CartContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const popularSearches = [
  'A2 Cow Ghee',
  'Cold Pressed Mustard Oil',
  'Groundnut Oil',
  'Bilona Method',
  'Sesame Oil',
  'Tadka',
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { addItem } = useCart();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchingProducts: Product[] = trimmed
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.shortDescription.toLowerCase().includes(trimmed) ||
          p.category.toLowerCase().includes(trimmed) ||
          (p.badges && p.badges.some((b) => b.toLowerCase().includes(trimmed)))
      )
    : [];

  const matchingRecipes: Recipe[] = trimmed
    ? recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(trimmed) ||
          r.excerpt.toLowerCase().includes(trimmed) ||
          r.category.toLowerCase().includes(trimmed)
      )
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trimmed) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search SRIRAAJ products and journal"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(42, 20, 8, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px 20px 40px',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 720,
          backgroundColor: 'var(--off-white)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 24px 64px rgba(42, 20, 8, 0.25)',
          overflow: 'hidden',
          animation: 'searchSlideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Search Input Bar */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: '#FFF',
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--terracotta)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: 16, flexShrink: 0 }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>

          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search A2 Ghee, Cold-Pressed Oils, Recipes..."
            aria-label="Search products and journal"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              fontSize: 16,
              color: 'var(--text-primary)',
              backgroundColor: 'transparent',
            }}
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '4px 8px',
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Clear
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginLeft: 12,
              padding: 6,
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </form>

        {/* Content Body */}
        <div style={{ maxHeight: '65vh', overflowY: 'auto', padding: '24px' }}>
          {/* Default State: Popular Suggestions */}
          {!trimmed && (
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--terracotta)',
                  marginBottom: 14,
                }}
              >
                Popular Searches
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    style={{
                      background: 'var(--cream)',
                      border: '1px solid var(--border-color)',
                      padding: '8px 14px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 13,
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--cream-dark)';
                      e.currentTarget.style.borderColor = 'var(--terracotta)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--cream)';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 20 }}>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: 12,
                  }}
                >
                  Featured Collections
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {[
                    { title: 'A2 Cow Ghee', link: '/products/a2-cow-ghee' },
                    { title: 'Cold-Pressed Oils', link: '/shop?category=oils' },
                    { title: 'Traditional Staples', link: '/shop?category=pantry' },
                  ].map((col) => (
                    <Link
                      key={col.title}
                      href={col.link}
                      onClick={onClose}
                      style={{
                        padding: '14px 16px',
                        backgroundColor: 'var(--cream)',
                        border: '1px solid var(--border-color)',
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-serif)',
                        fontSize: 15,
                        display: 'block',
                      }}
                    >
                      {col.title} →
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results: Products */}
          {trimmed && matchingProducts.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--terracotta)',
                  }}
                >
                  Products ({matchingProducts.length})
                </span>
                <button
                  type="button"
                  onClick={handleSubmit}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--terracotta)',
                    fontSize: 12,
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  View All Products →
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {matchingProducts.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      backgroundColor: 'var(--cream)',
                      border: '1px solid var(--border-color)',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <Link
                      href={`/products/${p.slug}`}
                      onClick={onClose}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        textDecoration: 'none',
                        color: 'inherit',
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          position: 'relative',
                          width: 52,
                          height: 52,
                          backgroundColor: '#FFF',
                          border: '1px solid var(--border-color)',
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}
                      >
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          sizes="52px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <h4
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: 17,
                            color: 'var(--text-primary)',
                            marginBottom: 2,
                          }}
                        >
                          {p.name}
                        </h4>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)' }}>
                          ₹{p.price.toLocaleString('en-IN')}
                          {p.sizes && p.sizes.length > 0 ? ` · ${p.sizes[0].label}` : ''}
                        </p>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        const defaultSize = p.sizes?.[0] || { label: 'Standard', value: 'standard', price: p.price };
                        addItem(p, defaultSize, 1);
                        onClose();
                      }}
                      className="btn btn-primary"
                      style={{
                        fontSize: 10,
                        padding: '8px 14px',
                        letterSpacing: '0.08em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Add +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results: Recipes / Journal */}
          {trimmed && matchingRecipes.length > 0 && (
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--terracotta)',
                  marginBottom: 12,
                }}
              >
                Journal &amp; Recipes ({matchingRecipes.length})
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {matchingRecipes.map((r) => (
                  <Link
                    key={r.id}
                    href={`/recipes/${r.slug}`}
                    onClick={onClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '12px 14px',
                      backgroundColor: 'var(--cream)',
                      border: '1px solid var(--border-color)',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: 52,
                        height: 52,
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={r.image}
                        alt={r.title}
                        fill
                        sizes="52px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--terracotta)',
                          marginBottom: 2,
                        }}
                      >
                        {r.category}
                      </p>
                      <h4
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 16,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {r.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty Results */}
          {trimmed && matchingProducts.length === 0 && matchingRecipes.length === 0 && (
            <div style={{ textAlign: 'center', padding: '36px 16px' }}>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 24,
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                }}
              >
                No results found for &ldquo;{query}&rdquo;
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  marginBottom: 24,
                }}
              >
                Try searching for pure ghee, mustard oil, groundnut oil, or recipes.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                {['Ghee', 'Mustard Oil', 'Groundnut Oil'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setQuery(t)}
                    style={{
                      background: 'var(--cream)',
                      border: '1px solid var(--border-color)',
                      padding: '8px 16px',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    Search &ldquo;{t}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: 'var(--cream)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 11,
            color: 'var(--text-muted)',
          }}
        >
          <span>Tip: Press ESC to close</span>
          <span>Press Enter for full results</span>
        </div>
      </div>
    </div>
  );
}
