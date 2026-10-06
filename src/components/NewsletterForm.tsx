'use client';

import React, { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div style={{
        padding: '18px 24px',
        backgroundColor: 'var(--cream-dark)',
        border: '1px solid var(--border-color)',
        color: 'var(--terracotta)',
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        fontWeight: 500,
      }}>
        Thank you for subscribing to SRIRAAJ journal.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 0 }}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-label="Email address for newsletter"
          id="newsletter-email"
          style={{
            flex: 1,
            padding: '16px 20px',
            border: '1px solid var(--border-color)',
            borderRight: 'none',
            backgroundColor: 'var(--off-white)',
            fontSize: 14,
            color: 'var(--text-primary)',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          id="newsletter-submit"
          className="btn btn-primary"
          style={{ borderRadius: 0, padding: '16px 28px', whiteSpace: 'nowrap' }}
        >
          Subscribe
        </button>
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-light)', letterSpacing: '0.04em' }}>
        We respect your inbox. Unsubscribe at any time.
      </p>
    </form>
  );
}
