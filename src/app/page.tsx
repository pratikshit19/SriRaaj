import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import NewsletterForm from '@/components/NewsletterForm';
import { getFeaturedProducts, recipes } from '@/lib/data';

export const metadata: Metadata = {
  title: 'SRIRAAJ — Pure Indian Goodness',
  description: 'Premium A2 Cow Ghee, Cold-Pressed Mustard Oil, and Groundnut Oil. Traditional Indian food products made the way they were always meant to be made.',
};

const featuredProducts = getFeaturedProducts();

export default function HomePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        id="hero"
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - 68px)',
          backgroundColor: 'var(--brown-dark)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
        aria-label="Hero section"
      >
        {/* Background Image */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image
            src="/images/hero-ghee.jpg"
            alt="Golden A2 Cow Ghee poured from a brass ladle into a clay pot"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            sizes="100vw"
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(42,20,8,0.88) 0%, rgba(42,20,8,0.6) 55%, rgba(42,20,8,0.15) 100%)',
          }} />
        </div>

        {/* Content */}
        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 80, paddingBottom: 80 }}>
          <div style={{ maxWidth: 620 }}>
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-sans)',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--terracotta-muted)',
              marginBottom: 28,
            }}>
              PURE INDIAN GOODNESS
            </span>

            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(48px, 7vw, 88px)',
              fontWeight: 300,
              color: '#FAF8F3',
              lineHeight: 1.0,
              marginBottom: 12,
              letterSpacing: '-0.01em',
            }}>
              India&apos;s Finest,
              <br />
              <em style={{ fontStyle: 'italic', color: 'var(--terracotta-muted)' }}>Traditionally</em>
              <br />
              Made.
            </h1>

            <div style={{ width: 40, height: 1, background: 'var(--terracotta-muted)', margin: '28px 0' }} />

            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 15,
              color: 'rgba(245,239,224,0.8)',
              lineHeight: 1.75,
              maxWidth: 420,
              marginBottom: 40,
            }}>
              Pure ingredients. Thoughtful processes. Honest food.
              From traditional Indian kitchens to modern homes.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/shop" className="btn btn-primary" style={{ fontSize: 11, padding: '16px 40px' }}>
                Shop Products
              </Link>
              <Link href="/our-story" className="btn" style={{
                fontSize: 11, padding: '15px 39px',
                border: '1px solid rgba(201,185,154,0.5)',
                color: '#FAF8F3',
                backgroundColor: 'transparent',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                display: 'inline-flex',
              }}>
                Our Story
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div style={{
          position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.5,
        }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FAF8F3' }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: '#FAF8F3', opacity: 0.5 }} />
        </div>
      </section>

      {/* ── CATEGORY STRIP ───────────────────────────────────────── */}
      <section
        id="categories"
        style={{ backgroundColor: 'var(--ivory-dark)', borderBottom: '1px solid var(--border-color)' }}
        aria-label="Product categories"
      >
        <div className="container" style={{ padding: '0 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }} className="category-strip">
            {[
              { label: 'A2 Cow Ghee', sub: 'Traditional Bilona', href: '/shop?category=ghee' },
              { label: 'Mustard Oil', sub: 'Cold-Pressed Kachi Ghani', href: '/shop?category=oils' },
              { label: 'Groundnut Oil', sub: 'Cold-Pressed', href: '/shop?category=oils' },
              { label: 'More Products', sub: 'Coming Soon', href: '/shop' },
            ].map((cat, i) => (
              <Link
                key={cat.label}
                href={cat.href}
                style={{
                  display: 'block',
                  padding: '28px 32px',
                  borderRight: i < 3 ? '1px solid var(--border-color)' : 'none',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s',
                }}
                className="category-item"
              >
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 6 }}>
                  {cat.sub}
                </p>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  {cat.label}
                </p>
              </Link>
            ))}
          </div>
        </div>

      </section>

      {/* ── WHY SRIRAAJ ──────────────────────────────────────────── */}
      <section
        id="why-sriraaj"
        style={{ padding: '100px 0', backgroundColor: 'var(--off-white)' }}
        aria-label="Why SRIRAAJ"
      >
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="why-grid">
            <div>
              <span className="section-label">Why SRIRAAJ</span>
              <h2 className="section-title" style={{ marginBottom: 20 }}>
                Made the way it<br />
                was always<br />
                meant to be.
              </h2>
              <div className="divider" />
              <p className="section-subtitle" style={{ marginBottom: 40 }}>
                We believe that food at its best is food made with intention — carefully sourced,
                processed with respect for tradition, and delivered with transparency.
                SRIRAAJ exists to bring that standard to every Indian home.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 36 }}>
                {[
                  { title: 'Traditional Processes', desc: 'Time-honoured methods that preserve what matters most.' },
                  { title: 'Carefully Sourced', desc: 'Ingredients selected with attention to quality and origin.' },
                  { title: 'No Shortcuts', desc: 'Every product made without unnecessary additives or compromises.' },
                  { title: 'Transparent', desc: 'Honest about what goes in, how it is made, and where it comes from.' },
                ].map((item) => (
                  <div key={item.title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ width: 2, height: 44, backgroundColor: 'var(--terracotta)', flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', marginBottom: 3, letterSpacing: '0.02em' }}>{item.title}</p>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/our-story" className="btn btn-secondary">Learn Our Story</Link>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <Image
                  src="/images/story-kitchen.jpg"
                  alt="Traditional Indian kitchen with brass and copper vessels"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  loading="lazy"
                />
              </div>
              {/* Accent block */}
              <div style={{
                position: 'absolute',
                bottom: -24,
                right: -24,
                width: 140,
                height: 140,
                backgroundColor: 'var(--terracotta)',
                zIndex: -1,
              }} />
            </div>
          </div>
        </div>

      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────── */}
      <section
        id="featured-products"
        style={{ padding: '100px 0', backgroundColor: 'var(--cream)' }}
        aria-label="Featured products"
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 52, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <span className="section-label">Our Products</span>
              <h2 className="section-title">
                Pure. Traditional.<br />Uncompromised.
              </h2>
            </div>
            <Link href="/shop" className="btn btn-ghost" style={{ marginBottom: 8 }}>
              View All Products →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

      </section>

      {/* ── OUR STORY EDITORIAL ──────────────────────────────────── */}
      <section
        id="our-story"
        style={{ padding: '100px 0', backgroundColor: 'var(--ivory-dark)' }}
        aria-label="Our story"
      >
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid var(--border-color)' }} className="story-grid">
            {/* Image */}
            <div style={{ position: 'relative', minHeight: 520, overflow: 'hidden' }}>
              <Image
                src="/images/process-sourcing.jpg"
                alt="Traditional oil press with a farmer in a mustard field"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 900px) 100vw, 50vw"
                loading="lazy"
              />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(42,20,8,0.3)' }} />
            </div>

            {/* Content */}
            <div style={{ padding: '72px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'var(--brown-dark)', color: '#FAF8F3' }}>
              <div style={{ marginBottom: 28 }}>
                <Image
                  src="/images/logo-sriraaj-light.png"
                  alt="SRIRAAJ — Pure Indian Goodness"
                  width={200}
                  height={75}
                  style={{ height: '68px', width: 'auto', objectFit: 'contain' }}
                />
              </div>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--terracotta-muted)', marginBottom: 20, display: 'block' }}>
                Our Heritage &amp; Roots
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 300, color: '#FAF8F3', lineHeight: 1.1, marginBottom: 24 }}>
                Rooted in India&apos;s<br />food traditions.
              </h2>
              <div style={{ width: 40, height: 1, background: 'var(--terracotta-muted)', marginBottom: 24 }} />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'rgba(245,239,224,0.75)', lineHeight: 1.85, marginBottom: 16 }}>
                [BRAND STORY TO BE PROVIDED]
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'rgba(245,239,224,0.75)', lineHeight: 1.85, marginBottom: 36 }}>
                SRIRAAJ was born from a simple conviction: that India&apos;s finest food traditions deserve to be preserved,
                protected, and made accessible — without compromise.
              </p>
              <Link href="/our-story" style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--terracotta-muted)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'gap 0.2s',
              }}>
                Read The Full Story →
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* ── PROCESS / SOURCING ───────────────────────────────────── */}
      <section
        id="process"
        style={{ padding: '100px 0', backgroundColor: 'var(--off-white)' }}
        aria-label="Our process"
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="section-label">How We Make It</span>
            <h2 className="section-title">From source to your kitchen.</h2>
            <p className="section-subtitle" style={{ margin: '16px auto 0' }}>
              Every step is intentional. Every decision is made with the final product in mind.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, borderTop: '1px solid var(--border-color)', borderLeft: '1px solid var(--border-color)' }} className="process-steps">
            {[
              { step: '01', title: 'Source', desc: '[SOURCING DETAILS TO BE PROVIDED]' },
              { step: '02', title: 'Select', desc: 'Only the finest batches pass our quality review before processing begins.' },
              { step: '03', title: 'Process', desc: '[MANUFACTURING PROCESS TO BE PROVIDED]' },
              { step: '04', title: 'Pack', desc: 'Sealed to preserve quality, freshness, and natural character.' },
              { step: '05', title: 'Deliver', desc: 'Dispatched directly to you, from our facility to your home.' },
            ].map((step) => (
              <div key={step.step} style={{
                padding: '40px 28px',
                borderRight: '1px solid var(--border-color)',
                borderBottom: '1px solid var(--border-color)',
              }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', color: 'var(--terracotta)', marginBottom: 14 }}>
                  {step.step}
                </p>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--text-primary)', marginBottom: 12 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/our-process" className="btn btn-secondary">Our Full Process</Link>
          </div>
        </div>

      </section>

      {/* ── QUALITY & TRUST ──────────────────────────────────────── */}
      <section
        id="quality"
        style={{ padding: '100px 0', backgroundColor: 'var(--terracotta)', color: '#FAF8F3' }}
        aria-label="Quality and trust"
      >
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'center' }} className="quality-grid">
            <div>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.6)', marginBottom: 16, display: 'block' }}>
                Our Standards
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300, color: '#FAF8F3', lineHeight: 1.1, marginBottom: 20 }}>
                Quality you<br />can trust.
              </h2>
              <div style={{ width: 40, height: 1, background: 'rgba(245,239,224,0.4)', marginBottom: 20 }} />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'rgba(245,239,224,0.8)', lineHeight: 1.8, marginBottom: 32 }}>
                We hold ourselves to standards that are visible in every jar and bottle — not just in what we say, but in what you taste.
              </p>
              <Link href="/quality" style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FAF8F3', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Quality & Authenticity →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(245,239,224,0.15)' }} className="quality-items">
              {[
                { title: 'Ingredient Integrity', desc: 'Only what belongs goes in. Nothing added, nothing hidden.' },
                { title: 'Traditional Processing', desc: '[PROCESS CERTIFICATION TO BE PROVIDED]' },
                { title: 'Quality Checks', desc: 'Every batch is reviewed before it leaves our facility.' },
                { title: 'Packaging', desc: 'Sealed for freshness, designed to protect product integrity.' },
                { title: 'Traceability', desc: '[TRACEABILITY DETAILS TO BE PROVIDED]' },
                { title: 'Certifications', desc: '[CERTIFICATION TO BE PROVIDED]' },
              ].map((item) => (
                <div key={item.title} style={{ padding: '32px 28px', backgroundColor: 'rgba(42,20,8,0.15)' }}>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12, letterSpacing: '0.06em', color: '#FAF8F3', marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 12, color: 'rgba(245,239,224,0.7)', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* ── RECIPES / JOURNAL ────────────────────────────────────── */}
      <section
        id="recipes"
        style={{ padding: '100px 0', backgroundColor: 'var(--cream)' }}
        aria-label="Recipes and journal"
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 52, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <span className="section-label">Recipes &amp; Journal</span>
              <h2 className="section-title">From our kitchen,<br />to yours.</h2>
            </div>
            <Link href="/recipes" className="btn btn-ghost" style={{ marginBottom: 8 }}>
              View All →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--border-color)' }} className="recipes-grid">
            {recipes.map((recipe, i) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.slug}`}
                style={{
                  textDecoration: 'none',
                  borderRight: i < recipes.length - 1 ? '1px solid var(--border-color)' : 'none',
                  display: 'block',
                  overflow: 'hidden',
                }}
                className="recipe-card"
              >
                <div style={{ position: 'relative', aspectRatio: '3/2', overflow: 'hidden' }}>
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    sizes="(max-width: 900px) 100vw, 33vw"
                    loading="lazy"
                  />
                </div>
                <div style={{ padding: '28px 28px 32px', backgroundColor: 'var(--cream)' }}>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 10 }}>
                    {recipe.category}
                  </p>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 10 }}>
                    {recipe.title}
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {recipe.excerpt}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-light)', letterSpacing: '0.05em' }}>{recipe.readTime} · {recipe.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────── */}
      <section
        id="newsletter"
        style={{ padding: '80px 0', backgroundColor: 'var(--ivory-dark)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}
        aria-label="Newsletter signup"
      >
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="newsletter-grid">
            <div>
              <span className="section-label">Stay Connected</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 3.5vw, 44px)', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 16 }}>
                Stories, recipes &amp;<br />new products from SRIRAAJ.
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                No clutter. Just what matters — seasonal recipes, product stories, and updates from our kitchen.
              </p>
            </div>
            <div>
              <NewsletterForm />
            </div>
          </div>
        </div>

      </section>
    </>
  );
}
