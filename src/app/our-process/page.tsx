import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Process — SRIRAAJ',
  description: 'How SRIRAAJ products are made. From careful sourcing to traditional processing, every step is intentional.',
};

export default function OurProcessPage() {
  const steps = [
    {
      number: '01',
      title: 'Source',
      subtitle: 'Where it begins',
      description: '[SOURCING DETAILS TO BE PROVIDED]\n\nWe begin with the ingredient. Every product starts with careful selection of the source — the farm, the animal, the region, the season.',
      image: '/images/process-sourcing.jpg',
    },
    {
      number: '02',
      title: 'Select',
      subtitle: 'Quality at every stage',
      description: 'Not every batch makes the cut. We review each source for freshness, quality, and adherence to our standards before any processing begins.\n\n[SELECTION CRITERIA TO BE PROVIDED]',
      image: '/images/story-kitchen.jpg',
    },
    {
      number: '03',
      title: 'Process',
      subtitle: 'Traditional methods',
      description: '[MANUFACTURING PROCESS TO BE PROVIDED]\n\nOur processing methods are chosen to preserve the integrity of the ingredient — not to maximise yield or convenience.',
      image: '/images/hero-ghee.jpg',
    },
    {
      number: '04',
      title: 'Pack',
      subtitle: 'Protecting quality',
      description: '[PACKAGING DETAILS TO BE PROVIDED]\n\nPackaging is not an afterthought. We use materials and methods that protect the product from production to your home.',
      image: '/images/product-ghee.jpg',
    },
    {
      number: '05',
      title: 'Deliver',
      subtitle: 'From us to you',
      description: 'Products are dispatched directly to you. [LOGISTICS DETAILS TO BE PROVIDED]',
      image: '/images/recipe-ghee-rice.jpg',
    },
  ];

  return (
    <>
      {/* Header */}
      <section style={{ padding: '80px 0 60px', backgroundColor: 'var(--ivory-dark)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <span className="section-label">How We Make It</span>
          <h1 className="section-title" style={{ maxWidth: 560, marginBottom: 16 }}>
            Every step is<br />intentional.
          </h1>
          <p className="section-subtitle">
            From the source to your kitchen — transparency in every stage of the process.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section style={{ backgroundColor: 'var(--off-white)' }}>
        {steps.map((step, i) => (
          <div
            key={step.number}
            style={{ borderBottom: '1px solid var(--border-color)' }}
          >
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr', gap: 0 }} className="process-row">
                <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                  <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                    <Image src={step.image} alt={step.title} fill style={{ objectFit: 'cover' }} sizes="50vw" loading={i === 0 ? 'eager' : 'lazy'} />
                  </div>
                </div>
                <div style={{
                  order: i % 2 === 0 ? 1 : 0,
                  padding: '72px 64px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  backgroundColor: i % 2 === 0 ? 'var(--off-white)' : 'var(--ivory-dark)',
                  borderLeft: i % 2 === 0 ? '1px solid var(--border-color)' : 'none',
                  borderRight: i % 2 === 1 ? '1px solid var(--border-color)' : 'none',
                }}>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: 'var(--terracotta)', marginBottom: 12 }}>
                    STEP {step.number}
                  </p>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 52px)', color: 'var(--text-primary)', lineHeight: 1.0, marginBottom: 6 }}>
                    {step.title}
                  </h2>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 24 }}>
                    {step.subtitle}
                  </p>
                  <div style={{ width: 40, height: 1, background: 'var(--border-color)', marginBottom: 24 }} />
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.85, whiteSpace: 'pre-line' }}>
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--brown-dark)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 48px)', color: '#FAF8F3', marginBottom: 16 }}>
            Taste the difference.
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(245,239,224,0.7)', marginBottom: 36, maxWidth: 420, margin: '16px auto 36px' }}>
            Every product reflects this process. Every jar and bottle tells this story.
          </p>
          <Link href="/shop" className="btn btn-primary">Shop Now</Link>
        </div>
      </section>
    </>
  );
}
