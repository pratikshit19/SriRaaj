import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { recipes } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Recipes & Journal — SRIRAAJ',
  description: 'Indian recipes, cooking techniques, and food stories from the SRIRAAJ kitchen.',
};

export default function RecipesPage() {
  const featured = recipes.find((r) => r.featured);
  const rest = recipes.filter((r) => r !== featured);

  return (
    <>
      {/* Header */}
      <section style={{ padding: '80px 0 60px', backgroundColor: 'var(--ivory-dark)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <span className="section-label">Recipes &amp; Journal</span>
          <h1 className="section-title" style={{ maxWidth: 500, marginBottom: 16 }}>
            From our kitchen,<br />to yours.
          </h1>
          <p className="section-subtitle">
            Recipes, techniques, and stories about India&apos;s finest food traditions.
          </p>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section style={{ padding: '64px 0', backgroundColor: 'var(--off-white)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container">
            <Link href={`/recipes/${featured.slug}`} style={{ textDecoration: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid var(--border-color)' }} className="featured-recipe">
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <Image src={featured.image} alt={featured.title} fill style={{ objectFit: 'cover' }} sizes="50vw" priority />
              </div>
              <div style={{ padding: '60px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'var(--ivory-dark)' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 20, display: 'block' }}>
                  Featured · {featured.category}
                </span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 3.5vw, 44px)', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 16 }}>
                  {featured.title}
                </h2>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 28 }}>
                  {featured.excerpt}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-light)' }}>{featured.readTime} · {featured.date}</p>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Recipe Grid */}
      <section style={{ padding: '64px 0 100px', backgroundColor: 'var(--cream)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--border-color)' }} className="recipe-grid-page">
            {rest.map((recipe, i) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.slug}`}
                style={{
                  textDecoration: 'none',
                  borderRight: i < rest.length - 1 ? '1px solid var(--border-color)' : 'none',
                  display: 'block',
                  overflow: 'hidden',
                }}
                className="recipe-card-link"
              >
                <div style={{ position: 'relative', aspectRatio: '3/2', overflow: 'hidden' }}>
                  <Image src={recipe.image} alt={recipe.title} fill style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }} sizes="33vw" loading="lazy" />
                </div>
                <div style={{ padding: '28px', backgroundColor: 'var(--cream)' }}>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 10 }}>
                    {recipe.category}
                  </p>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 10 }}>
                    {recipe.title}
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 16 }}>{recipe.excerpt}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-light)' }}>{recipe.readTime} · {recipe.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
