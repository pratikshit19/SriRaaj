'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: number; // in Rupees
  currency?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
}

type PaymentTab = 'upi' | 'card' | 'netbanking' | 'cod';

export default function RazorpayCheckoutModal({
  isOpen,
  onClose,
  orderId,
  amount,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
}: RazorpayCheckoutModalProps) {
  const [selectedTab, setSelectedTab] = useState<PaymentTab>('upi');
  const [upiId, setUpiId] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsProcessing(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulatedPayment = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));

    const simulatedPaymentId = `pay_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 6)}`;
    const simulatedSignature = `sig_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 8)}`;

    onSuccess({
      razorpay_payment_id: simulatedPaymentId,
      razorpay_order_id: orderId,
      razorpay_signature: simulatedSignature,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(26, 12, 5, 0.72)',
        backdropFilter: 'blur(6px)',
        padding: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 540,
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          animation: 'fadeInUp 0.25s ease-out',
        }}
      >
        {/* Razorpay + SRIRAAJ Header */}
        <div
          style={{
            backgroundColor: 'var(--brown-dark)',
            color: '#FAF8F3',
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid var(--terracotta)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                backgroundColor: 'rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <Image
                src="/images/logo-sriraaj-light.png"
                alt="SRIRAAJ"
                width={38}
                height={38}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600, letterSpacing: '0.04em' }}>
                  SRIRAAJ
                </span>
                <span
                  style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    color: '#60A5FA',
                    fontSize: 9,
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 4,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  Razorpay Sandbox
                </span>
              </div>
              <p style={{ fontSize: 11, color: 'rgba(250, 248, 243, 0.7)', marginTop: 2 }}>
                Order #{orderId.substring(0, 14)}
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(250,248,243,0.6)', display: 'block' }}>
              Amount Due
            </span>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}>
              ₹{amount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Customer Prefill Pill */}
        <div
          style={{
            backgroundColor: 'var(--cream)',
            padding: '10px 24px',
            fontSize: 12,
            color: 'var(--text-secondary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <span>
            Paying as <strong>{customerName || 'Guest Customer'}</strong> ({customerEmail || 'express@sriraaj.in'})
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Razorpay checkout"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontSize: 18,
              lineHeight: 1,
              padding: '0 4px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Payment Methods Split */}
        <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', flex: 1, minHeight: 320 }}>
          {/* Method Tabs */}
          <div style={{ backgroundColor: '#F9F7F2', borderRight: '1px solid var(--border-color)', padding: '16px 0' }}>
            <button
              type="button"
              onClick={() => setSelectedTab('upi')}
              style={{
                width: '100%',
                padding: '14px 18px',
                textAlign: 'left',
                border: 'none',
                background: selectedTab === 'upi' ? '#FFFFFF' : 'transparent',
                borderLeft: selectedTab === 'upi' ? '3px solid var(--terracotta)' : '3px solid transparent',
                fontWeight: selectedTab === 'upi' ? 600 : 500,
                color: selectedTab === 'upi' ? 'var(--terracotta)' : 'var(--text-primary)',
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span>⚡</span> UPI / QR
            </button>

            <button
              type="button"
              onClick={() => setSelectedTab('card')}
              style={{
                width: '100%',
                padding: '14px 18px',
                textAlign: 'left',
                border: 'none',
                background: selectedTab === 'card' ? '#FFFFFF' : 'transparent',
                borderLeft: selectedTab === 'card' ? '3px solid var(--terracotta)' : '3px solid transparent',
                fontWeight: selectedTab === 'card' ? 600 : 500,
                color: selectedTab === 'card' ? 'var(--terracotta)' : 'var(--text-primary)',
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span>💳</span> Cards
            </button>

            <button
              type="button"
              onClick={() => setSelectedTab('netbanking')}
              style={{
                width: '100%',
                padding: '14px 18px',
                textAlign: 'left',
                border: 'none',
                background: selectedTab === 'netbanking' ? '#FFFFFF' : 'transparent',
                borderLeft: selectedTab === 'netbanking' ? '3px solid var(--terracotta)' : '3px solid transparent',
                fontWeight: selectedTab === 'netbanking' ? 600 : 500,
                color: selectedTab === 'netbanking' ? 'var(--terracotta)' : 'var(--text-primary)',
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span>🏛️</span> Netbanking
            </button>

            <button
              type="button"
              onClick={() => setSelectedTab('cod')}
              style={{
                width: '100%',
                padding: '14px 18px',
                textAlign: 'left',
                border: 'none',
                background: selectedTab === 'cod' ? '#FFFFFF' : 'transparent',
                borderLeft: selectedTab === 'cod' ? '3px solid var(--terracotta)' : '3px solid transparent',
                fontWeight: selectedTab === 'cod' ? 600 : 500,
                color: selectedTab === 'cod' ? 'var(--terracotta)' : 'var(--text-primary)',
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span>💵</span> Cash On Delivery
            </button>
          </div>

          {/* Tab Content Panel */}
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* UPI Tab */}
            {selectedTab === 'upi' && (
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>
                  Fastest Checkout via UPI
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
                  {[
                    { id: 'gpay', label: 'Google Pay', icon: '🟢' },
                    { id: 'phonepe', label: 'PhonePe', icon: '🟣' },
                    { id: 'paytm', label: 'Paytm UPI', icon: '🔵' },
                    { id: 'qr', label: 'Scan QR Code', icon: '📷' },
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedUpiApp(app.id as typeof selectedUpiApp)}
                      style={{
                        padding: '12px',
                        border: selectedUpiApp === app.id ? '2px solid var(--terracotta)' : '1px solid var(--border-color)',
                        backgroundColor: selectedUpiApp === app.id ? 'var(--cream)' : '#FFFFFF',
                        borderRadius: 6,
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span>{app.icon}</span>
                      <span>{app.label}</span>
                    </button>
                  ))}
                </div>

                {selectedUpiApp === 'qr' ? (
                  <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'var(--cream)', borderRadius: 8, border: '1px dashed var(--border-dark)', marginBottom: 16 }}>
                    <div style={{ width: 100, height: 100, margin: '0 auto 8px', backgroundColor: '#FFFFFF', border: '1px solid #CCC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#666' }}>
                      [SRIRAAJ QR]
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Scan with any UPI app on phone</p>
                  </div>
                ) : (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      Or enter UPI ID / VPA
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. yourname@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid var(--border-color)',
                        borderRadius: 6,
                        fontSize: 13,
                        backgroundColor: 'var(--cream)',
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Cards Tab */}
            {selectedTab === 'card' && (
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>
                  Credit & Debit Cards (RuPay, Visa, MC)
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: 13, backgroundColor: 'var(--cream)' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: 13, backgroundColor: 'var(--cream)' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: 13, backgroundColor: 'var(--cream)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Netbanking Tab */}
            {selectedTab === 'netbanking' && (
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>
                  Popular Indian Banks
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank', 'Other Banks'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      style={{
                        padding: '12px 10px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: '#FFFFFF',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 500,
                        textAlign: 'center',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--terracotta)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* COD Tab */}
            {selectedTab === 'cod' && (
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                  Cash on Delivery
                </p>
                <div style={{ padding: '14px', backgroundColor: 'var(--cream)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Pay via cash or UPI to the courier upon delivery at your doorstep. Verified delivery with tamper-proof packaging.
                  </p>
                </div>
              </div>
            )}

            {/* Pay Button Action */}
            <div style={{ marginTop: 20 }}>
              <button
                type="button"
                onClick={handleSimulatedPayment}
                disabled={isProcessing}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: 'var(--terracotta)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 6,
                  fontFamily: 'var(--font-sans)',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: isProcessing ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  boxShadow: '0 4px 12px rgba(139, 58, 42, 0.25)',
                  transition: 'background-color 0.2s',
                }}
              >
                {isProcessing ? (
                  <>
                    <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #FFF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <span>Authorizing ₹{amount.toLocaleString('en-IN')}...</span>
                  </>
                ) : (
                  <>
                    <span>🔒</span>
                    <span>Pay ₹{amount.toLocaleString('en-IN')} with Razorpay</span>
                  </>
                )}
              </button>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                <span>Secured with 256-Bit Razorpay Shield</span>
                <span>•</span>
                <span>RBI Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
