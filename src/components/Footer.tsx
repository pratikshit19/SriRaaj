'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--brown-dark)', color: 'var(--ivory)', borderTop: '1px solid var(--brown-mid)' }}>
      {/* Main Footer */}
      <div className="container" style={{ padding: '72px 40px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.4fr', gap: 60 }} className="footer-grid">
          {/* Brand Column */}
          <div>
            <div style={{ marginBottom: 24 }}>
              <Link href="/" aria-label="SRIRAAJ Home" style={{ display: 'inline-block', textDecoration: 'none' }}>
                <Image
                  src="/images/logo-sriraaj-light.png"
                  alt="SRIRAAJ — Pure Indian Goodness"
                  width={200}
                  height={75}
                  style={{ height: '72px', width: 'auto', objectFit: 'contain' }}
                />
              </Link>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-light)', lineHeight: 1.8, maxWidth: 280, marginBottom: 32 }}>
              Rooted in India&apos;s oldest food traditions. Made for the way we cook today.
            </p>
            {/* Newsletter */}
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--border-color)', marginBottom: 14 }}>
              Stories, recipes &amp; new products
            </p>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: 0 }}>
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Email for newsletter"
                style={{
                  flex: 1, padding: '12px 14px',
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(201,185,154,0.3)',
                  borderRight: 'none',
                  color: 'var(--ivory)',
                  fontSize: 12,
                  fontFamily: 'var(--font-sans)',
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ fontSize: 10, padding: '12px 20px', flexShrink: 0 }}
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Shop */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--border-color)', marginBottom: 20 }}>Shop</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { href: '/shop?category=ghee', label: 'Ghee' },
                { href: '/shop?category=oils', label: 'Cooking Oils' },
                { href: '/shop?category=pantry', label: 'Pantry' },
                { href: '/shop?category=gifting', label: 'Gifting' },
                { href: '/shop?category=new', label: 'New Arrivals' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontSize: 13, color: 'var(--text-light)', textDecoration: 'none', transition: 'color 0.2s' }} className="footer-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--border-color)', marginBottom: 20 }}>Company</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { href: '/our-story', label: 'Our Story' },
                { href: '/our-process', label: 'Our Process' },
                { href: '/quality', label: 'Quality' },
                { href: '/recipes', label: 'Recipes' },
                { href: '/contact', label: 'Contact' },
                { href: '/faq', label: 'FAQ' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontSize: 13, color: 'var(--text-light)', textDecoration: 'none' }} className="footer-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Social */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--border-color)', marginBottom: 20 }}>Contact</p>
            <address style={{ fontStyle: 'normal', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href="mailto:hello@sriraaj.in" style={{ fontSize: 13, color: 'var(--text-light)', textDecoration: 'none' }} className="footer-link">
                hello@sriraaj.in
              </a>
              <a href="tel:[PHONE TO BE PROVIDED]" style={{ fontSize: 13, color: 'var(--text-light)', textDecoration: 'none' }}>
                [PHONE TO BE PROVIDED]
              </a>
              <p style={{ fontSize: 13, color: 'var(--text-light)', lineHeight: 1.7 }}>
                [ADDRESS TO BE PROVIDED]
              </p>
            </address>

            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--border-color)', marginBottom: 16, marginTop: 28 }}>Follow</p>
            <div style={{ display: 'flex', gap: 14 }}>
              {[
                { href: '#', label: 'Instagram', icon: <InstagramIcon /> },
                { href: '#', label: 'Facebook', icon: <FacebookIcon /> },
                { href: '#', label: 'YouTube', icon: <YouTubeIcon /> },
              ].map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} style={{ color: 'var(--text-light)', transition: 'color 0.2s' }} className="footer-link">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(201,185,154,0.15)', padding: '20px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 11, color: 'var(--text-light)' }}>
            © 2026 SRIRAAJ. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {[
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/terms', label: 'Terms' },
              { href: '/shipping', label: 'Shipping' },
              { href: '/refunds', label: 'Refunds' },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ fontSize: 11, color: 'var(--text-light)', textDecoration: 'none' }} className="footer-link">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>


    </footer>
  );
}

function InstagramIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>;
}
function FacebookIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
}
function YouTubeIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.97A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>;
}
