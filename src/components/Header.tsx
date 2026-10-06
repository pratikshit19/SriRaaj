'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/lib/data';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import CartDrawer from './CartDrawer';
import SearchModal from './SearchModal';

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: scrolled ? 'rgba(250, 248, 243, 0.97)' : '#FAF8F3',
          borderBottom: '1px solid #C9B99A',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
          boxShadow: scrolled ? '0 1px 20px rgba(42, 20, 8, 0.06)' : 'none',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: scrolled ? 72 : 80,
            transition: 'height 0.25s ease',
          }}
        >
          {/* Logo */}
          <Link href="/" aria-label="SRIRAAJ Home" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Image
              src="/images/logo-sriraaj-dark.png"
              alt="SRIRAAJ — Pure Indian Goodness"
              width={180}
              height={68}
              style={{
                height: scrolled ? '56px' : '64px',
                width: 'auto',
                objectFit: 'contain',
                transition: 'height 0.25s ease',
              }}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav
            aria-label="Primary navigation"
            style={{ display: 'flex', alignItems: 'center', gap: 32 }}
            className="desktop-nav"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '0.01em',
                    textTransform: 'none',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search products and recipes"
              title="Search (Click to open)"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 6,
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'background-color 0.2s, color 0.2s',
              }}
              className="desktop-nav header-action-btn"
            >
              <SearchIcon />
            </button>

            {/* Account */}
            <Link
              href="/account"
              aria-label={isAuthenticated ? `Account: ${user?.name}` : 'Account'}
              title={isAuthenticated ? `Account: ${user?.name}` : 'Account / Sign In'}
              style={{
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                padding: 4,
                borderRadius: '50%',
                transition: 'transform 0.15s ease',
              }}
              className="desktop-nav"
            >
              {isAuthenticated && user ? (
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: 'var(--terracotta)',
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    letterSpacing: 0,
                    boxShadow: '0 2px 6px rgba(139, 58, 42, 0.25)',
                    overflow: 'hidden',
                  }}
                >
                  {user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </span>
              ) : (
                <AccountIcon />
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              aria-label={`Cart (${totalItems} items)`}
              style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: 4, color: 'var(--text-primary)', display: 'flex' }}
            >
              <CartIcon />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </button>

            {/* Shop CTA — desktop only */}
            <Link href="/shop" className="btn btn-primary desktop-nav" style={{ fontSize: 11, letterSpacing: '0.09em', padding: '10px 20px' }}>
              Shop Now
            </Link>

            {/* Hamburger — mobile */}
            <button
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'none', color: 'var(--text-primary)', flexDirection: 'column', gap: 5, justifyContent: 'center' }}
              className="mobile-menu-btn"
            >
              <span style={{ display: 'block', width: 22, height: 1.5, background: 'currentColor', transition: 'transform 0.3s', transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
              <span style={{ display: 'block', width: 22, height: 1.5, background: 'currentColor', transition: 'opacity 0.3s', opacity: mobileOpen ? 0 : 1 }} />
              <span style={{ display: 'block', width: 22, height: 1.5, background: 'currentColor', transition: 'transform 0.3s', transform: mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        ref={mobileRef}
        aria-hidden={!mobileOpen}
        style={{
          position: 'fixed',
          top: scrolled ? 72 : 80,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--off-white)',
          zIndex: 99,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto',
          padding: '32px 24px',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <nav aria-label="Mobile navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 16,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--terracotta)' : 'var(--text-primary)',
                  textDecoration: 'none',
                  padding: '16px 0',
                  borderBottom: '1px solid var(--border-color)',
                  borderLeft: isActive ? '3px solid var(--terracotta)' : 'none',
                  paddingLeft: isActive ? 12 : 0,
                  transition: 'all 0.2s',
                }}
              >
                <span>{link.label}</span>
                {isActive && <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--terracotta)' }} />}
              </Link>
            );
          })}
        </nav>
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => {
              setMobileOpen(false);
              setSearchOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 16px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-color)',
              borderRadius: 6,
              color: 'var(--text-muted)',
              fontSize: 14,
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <SearchIcon />
            <span>Search products, recipes...</span>
          </button>

          <Link
            href="/account"
            onClick={() => setMobileOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-color)',
              borderRadius: 6,
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: 14,
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
            }}
          >
            {isAuthenticated && user ? (
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  backgroundColor: 'var(--terracotta)',
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <AccountIcon />
            )}
            <span>{isAuthenticated && user ? `My Account (${user.name})` : 'Account / Sign In'}</span>
          </Link>
        </div>

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link href="/shop" className="btn btn-primary" onClick={() => setMobileOpen(false)} style={{ justifyContent: 'center' }}>
            Shop Now
          </Link>
          <Link href="/contact" className="btn btn-secondary" onClick={() => setMobileOpen(false)} style={{ justifyContent: 'center' }}>
            Contact Us
          </Link>
        </div>
      </div>

      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
