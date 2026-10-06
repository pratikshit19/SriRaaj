'use client';

import React, { useState } from 'react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{
        padding: '36px 32px',
        backgroundColor: 'var(--cream)',
        border: '1px solid var(--border-color)',
        textAlign: 'center',
      }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--text-primary)', marginBottom: 12 }}>
          Thank You for Writing to Us
        </h3>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          We have received your message and will respond within 1 business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label htmlFor="contact-name" style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
            Name <span aria-hidden>*</span>
          </label>
          <input
            type="text"
            id="contact-name"
            name="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)', fontSize: 14, color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>
        <div>
          <label htmlFor="contact-email" style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
            Email <span aria-hidden>*</span>
          </label>
          <input
            type="email"
            id="contact-email"
            name="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)', fontSize: 14, color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
          Subject
        </label>
        <select
          id="contact-subject"
          name="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)', fontSize: 14, color: 'var(--text-primary)', outline: 'none', appearance: 'none' }}
        >
          <option value="">Select a topic</option>
          <option value="order">Order Enquiry</option>
          <option value="product">Product Question</option>
          <option value="wholesale">Wholesale</option>
          <option value="gifting">Corporate Gifting</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
          Message <span aria-hidden>*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)', fontSize: 14, color: 'var(--text-primary)', resize: 'vertical', outline: 'none' }}
        />
      </div>

      <div>
        <button type="submit" id="contact-submit" className="btn btn-primary" style={{ fontSize: 11, padding: '16px 48px' }}>
          Send Message
        </button>
      </div>
    </form>
  );
}
