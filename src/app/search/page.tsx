import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { products, recipes } from '@/lib/data';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Search Results — SRIRAAJ',
  description: 'Search results for SRIRAAJ products and journal articles.',
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = (params.q || '').trim();
  const queryLower = q.toLowerCase();

  const matchingProducts = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(queryLower) ||
          p.shortDescription.toLowerCase().includes(queryLower) ||
          p.category.toLowerCase().includes(queryLower) ||
          (p.badges && p.badges.some((b) => b.toLowerCase().includes(queryLower)))
      )
    : [];

  const matchingRecipes = q
    ? recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(queryLower) ||
          r.excerpt.toLowerCase().includes(queryLower) ||
          r.category.toLowerCase().includes(queryLower)
      )
    : [];

  return (
    <>
      {/* Header */}
      <section style={{ padding: '120px 0 40px', backgroundColor: 'var(--ivory-dark)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <span className="section-label">Search</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 56px)', color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.1 }}>
            {q ? `Search results for “${q}”` : 'Search SRIRAAJ'}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Found {matchingProducts.length} product{matchingProducts.length !== 1 ? 's' : ''} and {matchingRecipes.length} article{matchingRecipes.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* Results */}
      <section style={{ padding: '60px 0 100px', backgroundColor: 'var(--off-white)' }}>
        <div className="container">
          {matchingProducts.length > 0 && (
            <div style={{ marginBottom: 60 }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: 'var(--text-primary)', marginBottom: 28 }}>
                Matching Products
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="product-grid">
                {matchingProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {matchingRecipes.length > 0 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: 'var(--text-primary)', marginBottom: 28 }}>
                Related Journal &amp; Recipes
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="recipe-grid-page">
                {matchingRecipes.map((r) => (
                  <Link
                    key={r.id}
                    href={`/recipes/${r.slug}`}
                    style={{
                      textDecoration: 'none',
                      backgroundColor: 'var(--cream)',
                      border: '1px solid var(--border-color)',
                      overflow: 'hidden',
                      display: 'block',
                    }}
                  >
                    <div style={{ position: 'relative', aspectRatio: '3/2' }}>
                      <Image src={r.image} alt={r.title} fill style={{ objectFit: 'cover' }} sizes="33vw" />
                    </div>
                    <div style={{ padding: '24px' }}>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 9, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 8 }}>
                        {r.category}
                      </p>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--text-primary)', marginBottom: 8 }}>
                        {r.title}
                      </h3>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{r.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!q && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--text-primary)', marginBottom: 16 }}>
                Please enter a search term above.
              </p>
              <Link href="/shop" className="btn btn-primary">
                Browse All Products
              </Link>
            </div>
          )}

          {q && matchingProducts.length === 0 && matchingRecipes.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: 'var(--cream)', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: 'var(--text-primary)', marginBottom: 12 }}>
                No Results Found
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
                We couldn&apos;t find anything matching &ldquo;{q}&rdquo;. Browse our handcrafted product collection or explore traditional recipes.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
                <Link href="/shop" className="btn btn-primary">Shop All Products</Link>
                <Link href="/recipes" className="btn btn-secondary">Explore Recipes</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
