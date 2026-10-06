import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Story — SRIRAAJ',
  description: 'The story behind SRIRAAJ. Rooted in India\'s food traditions, made for the way we cook today.',
};

export default function OurStoryPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', height: '60vh', minHeight: 400, overflow: 'hidden' }}>
        <Image src="/images/story-kitchen.jpg" alt="Traditional Indian kitchen" fill style={{ objectFit: 'cover' }} priority sizes="100vw" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(42,20,8,0.5), rgba(42,20,8,0.75))' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 64 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--terracotta-muted)', marginBottom: 16, display: 'block' }}>
            Our Story
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 300, color: '#FAF8F3', lineHeight: 1.0, maxWidth: 700 }}>
            Rooted in India&apos;s<br />food traditions.
          </h1>
        </div>
      </section>

      {/* Story Content */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80 }} className="story-layout">
            <aside>
              <div style={{ position: 'sticky', top: 100 }}>
                <div style={{ marginBottom: 32, padding: '20px 16px', backgroundColor: 'var(--cream)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <Image
                    src="/images/logo-sriraj-devanagari.png"
                    alt="SRIRAAJ Official Brand Mark"
                    width={240}
                    height={160}
                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  />
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 12 }}>
                    Official Mark &amp; Identity
                  </p>
                </div>
                <div style={{ width: 40, height: 1, background: 'var(--terracotta)', marginBottom: 20 }} />
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--text-primary)', lineHeight: 1.5, fontStyle: 'italic' }}>
                  &ldquo;India&apos;s finest food traditions deserve to be preserved, protected, and made accessible.&rdquo;
                </p>
                <div style={{ width: 40, height: 1, background: 'var(--border-color)', marginTop: 20 }} />
              </div>
            </aside>

            <article>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--text-primary)', marginBottom: 24, lineHeight: 1.2 }}>
                Why SRIRAAJ Exists
              </h2>

              <div style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.9, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <p>[BRAND STORY TO BE PROVIDED]</p>
                <p>
                  India has always had access to some of the world&apos;s finest ingredients — A2 milk from indigenous cows,
                  mustard seeds pressed fresh in wooden ghani presses, groundnuts grown in rich Indian soil.
                  What has changed is how they are processed, packaged, and brought to market.
                </p>
                <p>
                  SRIRAAJ exists to change that. To take the best that Indian food tradition has to offer,
                  and make it available to every household that values what they put on their table.
                </p>
                <p>[FOUNDING STORY TO BE PROVIDED]</p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '36px 0', margin: '48px 0' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--text-primary)', lineHeight: 1.5, fontStyle: 'italic' }}>
                  &ldquo;Pure ingredients. Thoughtful processes. Honest food.&rdquo;
                </p>
              </div>

              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px, 2.5vw, 32px)', color: 'var(--text-primary)', marginBottom: 20, lineHeight: 1.2 }}>
                What We Believe In
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 48 }} className="beliefs-grid">
                {[
                  { title: 'Tradition', desc: 'Ancient Indian food practices exist for good reason. We respect and preserve them.' },
                  { title: 'Transparency', desc: 'You should know exactly what you are eating and how it was made.' },
                  { title: 'Quality', desc: 'Uncompromising standards at every step — from sourcing to delivery.' },
                  { title: 'Authenticity', desc: 'Real Indian food made the way it was always meant to be.' },
                ].map((b) => (
                  <div key={b.title} style={{ padding: '24px', backgroundColor: 'var(--ivory-dark)', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--terracotta)', letterSpacing: '0.06em', marginBottom: 8 }}>{b.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{b.desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link href="/our-process" className="btn btn-primary">Our Process</Link>
                <Link href="/shop" className="btn btn-secondary">Shop Products</Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
