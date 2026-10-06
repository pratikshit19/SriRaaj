'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { useAuth, type Order } from '@/lib/AuthContext';
import { loadRazorpayScript } from '@/lib/razorpay';
import RazorpayCheckoutModal from '@/components/RazorpayCheckoutModal';

type CheckoutStep = 'contact' | 'shipping' | 'payment';
type PaymentMethod = 'razorpay' | 'cod';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, subtotal, clearCart } = useCart();
  const { user, isAuthenticated, addOrder } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('contact');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Razorpay Modal state
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [activeRzpOrderId, setActiveRzpOrderId] = useState('');

  const shipping = subtotal > 999 ? 0 : 60;
  const total = subtotal + shipping;

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  // Pre-fill from authenticated user
  useEffect(() => {
    if (user) {
      const parts = user.name.split(' ');
      const defAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setFormData((prev) => ({
        firstName: prev.firstName || parts[0] || '',
        lastName: prev.lastName || parts.slice(1).join(' ') || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || defAddr?.street || '',
        city: prev.city || defAddr?.city || '',
        state: prev.state || defAddr?.state || '',
        pincode: prev.pincode || defAddr?.pincode || '',
        country: 'India',
      }));
    }
  }, [user]);

  const steps: { id: CheckoutStep; label: string }[] = [
    { id: 'contact', label: 'Contact' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
  ];

  if (state.items.length === 0) {
    return (
      <div style={{ padding: '100px 0', textAlign: 'center', minHeight: '60vh', backgroundColor: 'var(--off-white)' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 30, color: 'var(--text-muted)', marginBottom: 20 }}>No items to checkout</p>
        <Link href="/shop" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  // Handle Razorpay Payment flow
  const handleInitiatePayment = async () => {
    setPaymentError('');
    setIsProcessing(true);

    try {
      // 1. Create order on server
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
          notes: {
            customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
            customer_email: formData.email,
            customer_phone: formData.phone,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create Razorpay payment order');
      }

      const orderData = await res.json();
      setActiveRzpOrderId(orderData.id);

      // Check if real key is configured and try loading Razorpay Checkout script
      const scriptReady = await loadRazorpayScript();
      const isRealKey = orderData.key && !orderData.key.includes('demo') && !orderData.isDemo;

      if (scriptReady && isRealKey && typeof (window as unknown as { Razorpay: unknown }).Razorpay === 'function') {
        // Open live Razorpay popup
        const RazorpayClass = (window as unknown as { Razorpay: new (opts: unknown) => { open: () => void } }).Razorpay;
        const rzp = new RazorpayClass({
          key: orderData.key,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'SRIRAAJ',
          description: `Order #${orderData.id.substring(0, 10)} · Pure Indian Goodness`,
          image: '/images/logo-sriraaj-dark.png',
          order_id: orderData.id,
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#8B3A2A',
          },
          handler: async (paymentResponse: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            await handlePaymentSuccess(paymentResponse, orderData.id);
          },
        });
        rzp.open();
        setIsProcessing(false);
      } else {
        // Open seamless interactive in-app Razorpay modal simulator
        setShowRazorpayModal(true);
        setIsProcessing(false);
      }
    } catch (err: unknown) {
      console.error('Payment initiation error:', err);
      setPaymentError('Could not connect to payment gateway. Please try again.');
      setIsProcessing(false);
    }
  };

  // Payment Verification & Order Finalization
  const handlePaymentSuccess = async (
    paymentResponse: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    },
    orderIdToUse?: string
  ) => {
    setIsProcessing(true);
    try {
      // 1. Verify payment on server
      await fetch('/api/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentResponse),
      });

      // 2. Build official SRIRAAJ Order record
      const generatedOrderId = `SR-${Math.floor(10000 + Math.random() * 90000)}`;
      const newOrder: Order = {
        id: generatedOrderId,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Processing',
        trackingNumber: `BLRD${Math.floor(100000 + Math.random() * 900000)}IN`,
        items: state.items.map((i) => ({
          id: `${i.product.id}-${i.size.value}`,
          name: i.product.name,
          size: i.size.label,
          price: i.size.price,
          quantity: i.quantity,
          image: i.product.images[0],
        })),
        subtotal,
        shipping,
        total,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} — ${formData.pincode}`,
      };

      // 3. Persist to customer account
      if (addOrder) {
        addOrder(newOrder);
      }

      // 4. Clear shopping cart
      clearCart();

      // 5. Route to order confirmation page
      router.push(`/order-success?orderId=${newOrder.id}&paymentId=${paymentResponse.razorpay_payment_id}&amount=${total}`);
    } catch (err) {
      console.error('Order recording error:', err);
      setPaymentError('Payment completed but order confirmation had an issue. Please contact care@sriraaj.in');
    } finally {
      setIsProcessing(false);
      setShowRazorpayModal(false);
    }
  };

  // Cash On Delivery handler
  const handleCodOrder = async () => {
    setIsProcessing(true);
    const generatedOrderId = `SR-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: generatedOrderId,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Processing',
      trackingNumber: `BLRD${Math.floor(100000 + Math.random() * 900000)}IN`,
      items: state.items.map((i) => ({
        id: `${i.product.id}-${i.size.value}`,
        name: i.product.name,
        size: i.size.label,
        price: i.size.price,
        quantity: i.quantity,
        image: i.product.images[0],
      })),
      subtotal,
      shipping,
      total,
      shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} — ${formData.pincode}`,
    };

    if (addOrder) addOrder(newOrder);
    clearCart();
    router.push(`/order-success?orderId=${newOrder.id}&paymentId=COD-VERIFIED&amount=${total}`);
  };

  return (
    <section style={{ padding: '48px 0 100px', backgroundColor: 'var(--off-white)', minHeight: '80vh' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 80, alignItems: 'flex-start' }} className="checkout-layout">

          {/* Left: Form */}
          <div>
            {/* Logo */}
            <Link href="/" style={{ display: 'inline-block', marginBottom: 32, textDecoration: 'none' }}>
              <Image
                src="/images/logo-sriraaj-dark.png"
                alt="SRIRAAJ — Pure Indian Goodness"
                width={160}
                height={60}
                style={{ height: '58px', width: 'auto', objectFit: 'contain' }}
              />
            </Link>

            {/* Auth Banner */}
            {isAuthenticated && user ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  backgroundColor: 'rgba(139, 58, 42, 0.06)',
                  border: '1px solid rgba(139, 58, 42, 0.25)',
                  borderRadius: 4,
                  marginBottom: 28,
                  fontSize: 13,
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Logged in as </span>
                  <strong style={{ color: 'var(--terracotta)' }}>{user.name}</strong> ({user.email})
                </div>
                <Link href="/account" style={{ color: 'var(--terracotta)', fontWeight: 600, fontSize: 12, textDecoration: 'none' }}>
                  Manage Account →
                </Link>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  backgroundColor: 'var(--cream)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 4,
                  marginBottom: 28,
                  fontSize: 13,
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>Already have a SRIRAAJ account?</span>
                <Link href="/account" style={{ color: 'var(--terracotta)', fontWeight: 600, fontSize: 12, textDecoration: 'none' }}>
                  Sign In →
                </Link>
              </div>
            )}

            {/* Step Progress */}
            <nav aria-label="Checkout steps" style={{ display: 'flex', gap: 0, marginBottom: 40, borderBottom: '1px solid var(--border-color)', paddingBottom: 0 }}>
              {steps.map((step, i) => (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0 0 14px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: currentStep === step.id ? 'var(--terracotta)' : 'var(--text-muted)',
                      borderBottom: currentStep === step.id ? '2px solid var(--terracotta)' : '2px solid transparent',
                      marginBottom: -1,
                      marginRight: 28,
                    }}
                    aria-current={currentStep === step.id ? 'step' : undefined}
                  >
                    {i + 1}. {step.label}
                  </button>
                </React.Fragment>
              ))}
            </nav>

            {/* Contact Step */}
            {currentStep === 'contact' && (
              <form onSubmit={(e) => { e.preventDefault(); setCurrentStep('shipping'); }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--text-primary)', marginBottom: 24 }}>Contact Information</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label htmlFor="checkout-firstname" style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="checkout-firstname"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)', fontSize: 14, color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <label htmlFor="checkout-lastname" style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="checkout-lastname"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)', fontSize: 14, color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="checkout-email" style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="checkout-email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)', fontSize: 14, color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="checkout-phone" style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
                      Phone (for Delivery SMS) *
                    </label>
                    <input
                      type="tel"
                      id="checkout-phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)', fontSize: 14, color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: 28, fontSize: 11, padding: '16px 48px' }}>
                  Continue to Shipping
                </button>
              </form>
            )}

            {/* Shipping Step */}
            {currentStep === 'shipping' && (
              <form onSubmit={(e) => { e.preventDefault(); setCurrentStep('payment'); }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--text-primary)', marginBottom: 24 }}>Shipping Address</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label htmlFor="checkout-address" style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
                      Address (House/Flat, Street) *
                    </label>
                    <input
                      type="text"
                      id="checkout-address"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)', fontSize: 14, color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label htmlFor="checkout-city" style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
                        City *
                      </label>
                      <input
                        type="text"
                        id="checkout-city"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)', fontSize: 14, color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <label htmlFor="checkout-state" style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
                        State *
                      </label>
                      <input
                        type="text"
                        id="checkout-state"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)', fontSize: 14, color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label htmlFor="checkout-pincode" style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        id="checkout-pincode"
                        required
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)', fontSize: 14, color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <label htmlFor="checkout-country" style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
                        Country *
                      </label>
                      <input
                        type="text"
                        id="checkout-country"
                        disabled
                        value="India"
                        style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--ivory-dark)', fontSize: 14, color: 'var(--text-muted)' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 32, marginBottom: 24 }}>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: 16 }}>
                    Delivery Method
                  </h3>
                  <div style={{ border: '1px solid var(--terracotta)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--cream)' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <input type="radio" name="delivery" defaultChecked id="standard-delivery" />
                      <label htmlFor="standard-delivery" style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>Standard Delivery (3–5 days across India)</label>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                  <button type="button" className="btn btn-secondary" style={{ fontSize: 10 }} onClick={() => setCurrentStep('contact')}>← Back</button>
                  <button type="submit" className="btn btn-primary" style={{ fontSize: 11, padding: '16px 48px' }}>Continue to Payment</button>
                </div>
              </form>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--text-primary)', marginBottom: 16 }}>
                  Select Payment Method
                </h2>

                {paymentError && (
                  <div style={{ padding: '12px 16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#DC2626', fontSize: 13, borderRadius: 4, marginBottom: 20 }}>
                    {paymentError}
                  </div>
                )}

                {/* Option 1: Razorpay (Recommended) */}
                <div
                  onClick={() => setPaymentMethod('razorpay')}
                  style={{
                    border: paymentMethod === 'razorpay' ? '2px solid var(--terracotta)' : '1px solid var(--border-color)',
                    backgroundColor: paymentMethod === 'razorpay' ? 'var(--cream)' : '#FFFFFF',
                    padding: '20px 24px',
                    borderRadius: 8,
                    marginBottom: 16,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <input
                        type="radio"
                        name="payment_method"
                        id="method-razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                      />
                      <label htmlFor="method-razorpay" style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
                        Razorpay Secure Gateway (Prepaid)
                      </label>
                    </div>
                    <span style={{ backgroundColor: 'var(--terracotta)', color: '#FFFFFF', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
                      Recommended
                    </span>
                  </div>

                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, marginLeft: 26, lineHeight: 1.5 }}>
                    Pay via UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, or Wallets with 256-bit bank grade encryption.
                  </p>

                  {/* Payment Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14, marginLeft: 26 }}>
                    {['UPI', 'Google Pay', 'PhonePe', 'Paytm', 'Visa', 'Mastercard', 'RuPay', 'Netbanking'].map((b) => (
                      <span
                        key={b}
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--border-color)',
                          padding: '3px 8px',
                          borderRadius: 3,
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Option 2: Cash On Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  style={{
                    border: paymentMethod === 'cod' ? '2px solid var(--terracotta)' : '1px solid var(--border-color)',
                    backgroundColor: paymentMethod === 'cod' ? 'var(--cream)' : '#FFFFFF',
                    padding: '20px 24px',
                    borderRadius: 8,
                    marginBottom: 28,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="payment_method"
                      id="method-cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <label htmlFor="method-cod" style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
                      Cash on Delivery (COD)
                    </label>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, marginLeft: 26, lineHeight: 1.5 }}>
                    Pay upon physical delivery. Exact change or delivery agent UPI QR code accepted at doorstep.
                  </p>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 16 }}>
                  <button type="button" className="btn btn-secondary" style={{ fontSize: 10 }} onClick={() => setCurrentStep('shipping')}>
                    ← Back to Shipping
                  </button>

                  {paymentMethod === 'razorpay' ? (
                    <button
                      type="button"
                      onClick={handleInitiatePayment}
                      disabled={isProcessing}
                      className="btn btn-primary"
                      style={{ fontSize: 11, padding: '16px 40px', gap: 8 }}
                    >
                      {isProcessing ? (
                        <>
                          <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #FFF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                          <span>Connecting to Razorpay...</span>
                        </>
                      ) : (
                        <>
                          <span>🔒</span>
                          <span>Pay ₹{total.toLocaleString('en-IN')} with Razorpay</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCodOrder}
                      disabled={isProcessing}
                      className="btn btn-primary"
                      style={{ fontSize: 11, padding: '16px 40px' }}
                    >
                      {isProcessing ? 'Confirming Order...' : `Place COD Order (₹${total.toLocaleString('en-IN')})`}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--ivory-dark)', padding: '32px', position: 'sticky', top: 100 }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--text-primary)', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
              Order Summary
            </h3>

            {state.items.map((item) => (
              <div key={`${item.product.id}-${item.size.value}`} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                <div style={{ position: 'relative', width: 64, height: 80, flexShrink: 0, border: '1px solid var(--border-color)', overflow: 'hidden', backgroundColor: 'var(--ivory)' }}>
                  <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: -8, right: -8, backgroundColor: 'var(--terracotta)', color: '#FAF8F3', fontSize: 9, fontWeight: 700, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.quantity}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>{item.product.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.size.label}</p>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600 }}>₹{(item.size.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            ))}

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Subtotal</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Shipping</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: 12, marginTop: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Total</span>
                <span style={{ fontWeight: 700, fontSize: 16 }}>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>🛡️</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Razorpay Verified Merchant · Authentic Pure Indian Food Guarantee
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Checkout Modal */}
      <RazorpayCheckoutModal
        isOpen={showRazorpayModal}
        onClose={() => setShowRazorpayModal(false)}
        orderId={activeRzpOrderId || 'SR-RZP-ORDER'}
        amount={total}
        customerName={`${formData.firstName} ${formData.lastName}`.trim()}
        customerEmail={formData.email}
        customerPhone={formData.phone}
        onSuccess={(response) => handlePaymentSuccess(response, activeRzpOrderId)}
      />
    </section>
  );
}
