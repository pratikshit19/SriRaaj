import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Quality & Authenticity — SRIRAAJ',
  description: 'Our commitment to quality. Every SRIRAAJ product is made with ingredient integrity and transparent processes.',
};

export default function QualityPage() {
  return (
    <>
      {/* Header */}
      <section style={{ padding: '80px 0 60px', backgroundColor: 'var(--ivory-dark)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <span className="section-label">Quality &amp; Authenticity</span>
          <h1 className="section-title" style={{ maxWidth: 600, marginBottom: 16 }}>
            Quality you can see,<br />taste, and trust.
          </h1>
          <p className="section-subtitle">
            We hold ourselves to standards that go beyond regulations — because we believe you deserve to know exactly what you are getting.
          </p>
        </div>
      </section>

      {/* Quality Pillars */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, backgroundColor: 'var(--border-color)' }} className="quality-pillars">
            {[
              {
                title: 'Ingredient Integrity',
                desc: 'We begin with the ingredient and work backwards. Only ingredients that meet our standards at source are accepted. [INGREDIENT SOURCING STANDARDS TO BE PROVIDED]',
              },
              {
                title: 'Traditional Processing',
                desc: '[PROCESS DETAILS TO BE PROVIDED]\n\nOur processing methods are selected for their ability to preserve the inherent qualities of the ingredient — not for maximum extraction efficiency.',
              },
              {
                title: 'No Unnecessary Additives',
                desc: '[ADDITIVES POLICY TO BE PROVIDED]\n\nWhat goes into the product is exactly what you need — and nothing more.',
              },
              {
                title: 'Quality Checks',
                desc: '[QUALITY CHECK PROCESS TO BE PROVIDED]\n\nEvery batch is reviewed before it leaves our facility.',
              },
              {
                title: 'Packaging Standards',
                desc: '[PACKAGING STANDARDS TO BE PROVIDED]\n\nOur packaging is designed to protect the integrity and freshness of the product from production to your home.',
              },
              {
                title: 'Certifications',
                desc: '[CERTIFICATION TO BE PROVIDED]\n\nPlaceholder — certification information will be added once confirmed.',
              },
            ].map((p) => (
              <div key={p.title} style={{ padding: '48px 40px', backgroundColor: 'var(--off-white)' }}>
                <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, letterSpacing: '0.04em', color: 'var(--terracotta)', marginBottom: 16 }}>
                  {p.title}
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.85, whiteSpace: 'pre-line' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications placeholder */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--cream)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label">Certifications</span>
          <h2 className="section-title" style={{ marginBottom: 16 }}>Our Certifications</h2>
          <p className="section-subtitle" style={{ margin: '0 auto 48px' }}>
            [CERTIFICATIONS TO BE PROVIDED — add logos and descriptions once confirmed]
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            {['[CERTIFICATION 1]', '[CERTIFICATION 2]', '[CERTIFICATION 3]'].map((cert) => (
              <div key={cert} style={{
                width: 160,
                height: 120,
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--ivory-dark)',
                padding: 20,
              }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-light)', textAlign: 'center', letterSpacing: '0.06em' }}>{cert}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 0', textAlign: 'center', backgroundColor: 'var(--terracotta)' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 44px)', color: '#FAF8F3', marginBottom: 24 }}>
            Experience it yourself.
          </h2>
          <Link href="/shop" className="btn" style={{
            backgroundColor: '#FAF8F3',
            color: 'var(--terracotta)',
            padding: '16px 48px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            display: 'inline-flex',
          }}>
            Shop Now
          </Link>
        </div>
      </section>
    </>
  );
}
