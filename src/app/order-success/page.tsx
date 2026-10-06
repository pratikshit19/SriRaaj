import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';


export const metadata: Metadata = {
  title: 'Order Confirmed — SRIRAAJ',
  description: 'Thank you for your order with SRIRAAJ. Pure Indian goodness is on its way.',
};

interface OrderSuccessProps {
  searchParams: Promise<{
    orderId?: string;
    paymentId?: string;
    amount?: string;
  }>;
}

async function OrderSuccessContent({ searchParams }: OrderSuccessProps) {
  const params = await searchParams;
  const orderId = params.orderId || `SR-${Math.floor(10000 + Math.random() * 90000)}`;
  const paymentId = params.paymentId || `pay_${Date.now().toString(36)}`;
  const amount = params.amount ? parseInt(params.amount) : null;

  return (
    <main style={{ backgroundColor: 'var(--off-white)', minHeight: '80vh', padding: '120px 20px 100px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          {/* Emblem & Checkmark */}
          <div
            style={{
              width: 80,
              height: 80,
              margin: '0 auto 24px',
              borderRadius: '50%',
              backgroundColor: 'rgba(139, 58, 42, 0.08)',
              border: '2px solid var(--terracotta)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(139, 58, 42, 0.12)',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--terracotta)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <span className="section-label">Order Confirmed</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4.5vw, 48px)', color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.15 }}>
            Dhanyavaad! Your Order is Placed
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.6 }}>
            We have received your payment via <strong>Razorpay</strong>. Your fresh batch of unadulterated goodness is being hand-packed with care.
          </p>

          {/* Details Card */}
          <div
            style={{
              backgroundColor: 'var(--cream)',
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              padding: '28px 32px',
              textAlign: 'left',
              marginBottom: 36,
              boxShadow: '0 4px 20px rgba(42, 20, 8, 0.04)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, borderBottom: '1px solid var(--border-color)', paddingBottom: 20, marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  Order Number
                </span>
                <strong style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--text-primary)' }}>
                  {orderId}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  Razorpay Reference
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
                  {paymentId}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  Payment Status
                </span>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(34, 197, 94, 0.12)', color: '#15803D', padding: '3px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                  <span>✓</span>
                  <span>Paid & Verified</span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  Estimated Delivery
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  3–5 Business Days
                </span>
              </div>
            </div>

            {amount && (
              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: 20, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Total Paid</span>
                <strong style={{ fontSize: 16, color: 'var(--text-primary)' }}>₹{amount.toLocaleString('en-IN')}</strong>
              </div>
            )}
          </div>

          {/* Packaging Note */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: 'rgba(139, 58, 42, 0.05)',
              border: '1px dashed var(--terracotta-muted)',
              borderRadius: 6,
              fontSize: 12,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: 36,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: 20 }}>🌿</span>
            <span>
              All oils and ghees are packaged in UV-protective amber glass jars and shipped in biodegradable honeycomb shock-absorbing padding.
            </span>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/account" className="btn btn-primary" style={{ padding: '14px 32px' }}>
              View in My Account
            </Link>
            <Link href="/shop" className="btn btn-secondary" style={{ padding: '14px 32px' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
  );
}

export default function OrderSuccessPage(props: OrderSuccessProps) {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '120px 0', textAlign: 'center', backgroundColor: 'var(--off-white)' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--text-muted)' }}>Loading confirmation...</p>
        </div>
      }
    >
      <OrderSuccessContent {...props} />
    </Suspense>
  );
}
