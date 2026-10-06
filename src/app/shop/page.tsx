import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/lib/data';
import Link from 'next/link';


export const metadata: Metadata = {
  title: 'Shop — Premium Indian Food Products',
  description: 'Browse SRIRAAJ\'s range of premium traditional Indian food products. A2 Cow Ghee, Cold-Pressed Oils, and more.',
};

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>;
}

async function ShopContent({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const activeCategory = params.category || 'all';
  const filtered = activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Page Header */}
      <section style={{ padding: '60px 0 40px', backgroundColor: 'var(--ivory-dark)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <nav aria-label="Breadcrumb" style={{ marginBottom: 20 }}>
            <ol style={{ listStyle: 'none', display: 'flex', gap: 8, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', letterSpacing: '0.06em' }}>
              <li><Link href="/" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>Home</Link></li>
              <li>/</li>
              <li style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Shop</li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, color: 'var(--text-primary)', lineHeight: 1.0, marginBottom: 8 }}>
            All Products
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </section>

      <section style={{ padding: '48px 0 100px', backgroundColor: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }} className="shop-layout">

            {/* Sidebar */}
            <aside style={{ width: 200, flexShrink: 0 }} className="shop-sidebar">
              <div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
                  Category
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={cat.id === 'all' ? '/shop' : `/shop?category=${cat.id}`}
                        style={{
                          display: 'block',
                          padding: '9px 14px',
                          fontFamily: 'var(--font-sans)',
                          fontSize: 13,
                          textDecoration: 'none',
                          backgroundColor: activeCategory === cat.id ? 'var(--terracotta)' : 'transparent',
                          color: activeCategory === cat.id ? '#FAF8F3' : 'var(--text-primary)',
                          fontWeight: activeCategory === cat.id ? 600 : 400,
                          border: '1px solid',
                          borderColor: activeCategory === cat.id ? 'var(--terracotta)' : 'transparent',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {cat.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Product Grid */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: 'var(--text-muted)', marginBottom: 16 }}>No products found</p>
                  <Link href="/shop" className="btn btn-secondary">View All Products</Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="product-grid">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {/* Coming Soon Banner */}
              <div style={{
                marginTop: 64,
                padding: '40px 40px',
                backgroundColor: 'var(--ivory-dark)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 20,
              }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--text-primary)', marginBottom: 4 }}>More products arriving soon.</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Subscribe to be notified when new products launch.</p>
                </div>
                <Link href="/#newsletter" className="btn btn-primary" style={{ fontSize: 10 }}>Get Notified</Link>
              </div>
            </div>
          </div>
        </div>
      </section>


    </>
  );
}

export default function ShopPage(props: ShopPageProps) {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '120px 0', textAlign: 'center', backgroundColor: 'var(--off-white)' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--text-muted)' }}>Loading products...</p>
        </div>
      }
    >
      <ShopContent {...props} />
    </Suspense>
  );
}
