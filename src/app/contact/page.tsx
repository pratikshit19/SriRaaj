import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us — SRIRAAJ',
  description: 'Get in touch with SRIRAAJ. We\'d love to hear from you.',
};

export default function ContactPage() {
  return (
    <>
      <section style={{ padding: '80px 0 60px', backgroundColor: 'var(--ivory-dark)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <span className="section-label">Contact</span>
          <h1 className="section-title" style={{ maxWidth: 500 }}>We&apos;d love to hear from you.</h1>
        </div>
      </section>

      <section style={{ padding: '80px 0', backgroundColor: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 80 }} className="contact-grid">

            {/* Contact Info */}
            <div>
              <div style={{ marginBottom: 40 }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>Get in Touch</p>
                <address style={{ fontStyle: 'normal', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 4 }}>Email</p>
                    <a href="mailto:hello@sriraaj.in" style={{ fontSize: 14, color: 'var(--text-primary)', textDecoration: 'none' }}>hello@sriraaj.in</a>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 4 }}>Phone</p>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>[PHONE TO BE PROVIDED]</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 4 }}>Address</p>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>[ADDRESS TO BE PROVIDED]</p>
                  </div>
                </address>
              </div>

              <div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>Business Enquiries</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 8 }}>
                  For wholesale, corporate gifting, and bulk orders:
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-primary)' }}>[BUSINESS CONTACT TO BE PROVIDED]</p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
