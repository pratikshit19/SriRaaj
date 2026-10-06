'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/AuthContext';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import PhoneOtpLogin from '@/components/PhoneOtpLogin';

export default function AccountPage() {
  const { user, isAuthenticated, login, register, logout, updateProfile, addAddress } = useAuth();
  
  // Auth Form State
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');

  // Edit Profile State
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Add Address State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [newIsDefault, setNewIsDefault] = useState(false);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    const res = await login(loginEmail, loginPassword);
    setIsSubmitting(false);
    if (!res.success) {
      setAuthError(res.error || 'Failed to sign in');
    }
  };

  // Demo Login
  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    await login('pratikshit@sriraaj.in');
    setIsSubmitting(false);
  };

  // Handle Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    const res = await register(regName, regEmail, regPhone, regPassword);
    setIsSubmitting(false);
    if (!res.success) {
      setAuthError(res.error || 'Failed to create account');
    }
  };

  // Handle Profile Update
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: editName, phone: editPhone });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  // Handle Add Address
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPincode) return;
    addAddress({
      label: newLabel,
      name: user?.name || 'Customer',
      phone: user?.phone || '',
      street: newStreet,
      city: newCity,
      state: newState || 'India',
      pincode: newPincode,
      isDefault: newIsDefault,
    });
    setShowAddressModal(false);
    setNewStreet('');
    setNewCity('');
    setNewState('');
    setNewPincode('');
  };

  // ── Unauthenticated: Sign In / Register View ──────────────────────────────
  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: 'var(--off-white)', minHeight: '80vh', padding: '120px 20px 100px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span className="section-label">SRIRAAJ Account</span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, color: 'var(--text-primary)', marginBottom: 8 }}>
              {authTab === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)' }}>
              {authTab === 'login'
                ? 'Sign in to view orders, saved addresses, and express checkout.'
                : 'Join SRIRAAJ for single-source purity and track your food journey.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, marginBottom: 28, border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)' }}>
            <button
              type="button"
              onClick={() => { setAuthTab('login'); setAuthError(''); }}
              style={{
                padding: '12px 16px',
                border: 'none',
                backgroundColor: authTab === 'login' ? 'var(--terracotta)' : 'transparent',
                color: authTab === 'login' ? '#FFF' : 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthTab('register'); setAuthError(''); }}
              style={{
                padding: '12px 16px',
                border: 'none',
                backgroundColor: authTab === 'register' ? 'var(--terracotta)' : 'transparent',
                color: authTab === 'register' ? '#FFF' : 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Create Account
            </button>
          </div>

          {/* Form Card */}
          <div style={{ backgroundColor: '#FFF', border: '1px solid var(--border-color)', padding: '36px 32px', boxShadow: '0 8px 30px rgba(42, 20, 8, 0.04)' }}>
            {authError && (
              <div style={{ padding: '12px 16px', backgroundColor: '#FDF2E9', border: '1px solid var(--terracotta-muted)', color: 'var(--terracotta)', fontSize: 13, marginBottom: 20 }}>
                {authError}
              </div>
            )}

            {/* Google 1-Click Sign-In (Configured with NEXT_PUBLIC_GOOGLE_CLIENT_ID) */}
            <div style={{ marginBottom: 18 }}>
              <GoogleSignInButton onSuccess={() => setAuthError('')} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0', gap: 12 }}>
              <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-color)' }} />
              <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                OR CONTINUE WITH
              </span>
              <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-color)' }} />
            </div>

            {/* Switch between Email and Phone OTP */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <button
                type="button"
                onClick={() => setShowPhoneOtp(false)}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  backgroundColor: !showPhoneOtp ? 'var(--cream)' : 'transparent',
                  border: !showPhoneOtp ? '1px solid var(--terracotta)' : '1px solid var(--border-color)',
                  color: !showPhoneOtp ? 'var(--terracotta)' : 'var(--text-primary)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: 4,
                  transition: 'all 0.15s',
                }}
              >
                ✉️ Email Login
              </button>
              <button
                type="button"
                onClick={() => setShowPhoneOtp(true)}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  backgroundColor: showPhoneOtp ? 'var(--cream)' : 'transparent',
                  border: showPhoneOtp ? '1px solid var(--terracotta)' : '1px solid var(--border-color)',
                  color: showPhoneOtp ? 'var(--terracotta)' : 'var(--text-primary)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: 4,
                  transition: 'all 0.15s',
                }}
              >
                📱 Mobile OTP (MSG91)
              </button>
            </div>

            {showPhoneOtp ? (
              <PhoneOtpLogin onSuccess={() => setAuthError('')} />
            ) : authTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label htmlFor="login-email" style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: 8 }}>
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. pratikshit@sriraaj.in"
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)', fontSize: 14, color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label htmlFor="login-password" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                      Password
                    </label>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Optional in demo</span>
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)', fontSize: 14, color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '16px', marginTop: 8 }}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In to Account'}
                </button>

                <div style={{ textAlign: 'center', margin: '8px 0', borderTop: '1px solid var(--border-color)', paddingTop: 18 }}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Want to test with sample orders &amp; addresses?</p>
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'var(--cream)',
                      border: '1px solid var(--terracotta)',
                      color: 'var(--terracotta)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    ⚡ Instant Demo Sign-In (Pratikshit Sharma)
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label htmlFor="reg-name" style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: 8 }}>
                    Full Name
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Pratikshit Sharma"
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)', fontSize: 14, color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label htmlFor="reg-email" style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: 8 }}>
                    Email Address
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. pratikshit@sriraaj.in"
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)', fontSize: 14, color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label htmlFor="reg-phone" style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: 8 }}>
                    Phone Number
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)', fontSize: 14, color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label htmlFor="reg-password" style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: 8 }}>
                    Password
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a password"
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)', fontSize: 14, color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '16px', marginTop: 8 }}
                >
                  {isSubmitting ? 'Creating account...' : 'Create SRIRAAJ Account'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Authenticated: Customer Dashboard ──────────────────────────────────────
  return (
    <div style={{ backgroundColor: 'var(--off-white)', minHeight: '85vh', paddingBottom: 100 }}>
      {/* Profile Banner */}
      <section style={{ backgroundColor: 'var(--brown-dark)', color: '#FAF8F3', padding: '124px 0 48px', borderBottom: '1px solid var(--brown-mid)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--terracotta)' }}
                />
              ) : (
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    backgroundColor: 'var(--terracotta)',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-serif)',
                    fontSize: 24,
                    fontWeight: 600,
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--terracotta-muted)', display: 'block', marginBottom: 4 }}>
                  Member Account
                </span>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 300, lineHeight: 1.1, color: '#FAF8F3' }}>
                  Namaste, {user.name}
                </h1>
                <p style={{ fontSize: 13, color: 'rgba(245, 239, 224, 0.75)', marginTop: 4 }}>
                  {user.email} · {user.phone}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--border-color)',
                color: 'var(--ivory)',
                padding: '10px 22px',
                fontFamily: 'var(--font-sans)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--terracotta-muted)'; e.currentTarget.style.color = 'var(--terracotta-muted)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--ivory)'; }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Dashboard Body */}
      <div className="container" style={{ marginTop: 40 }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-color)', marginBottom: 36 }}>
          {[
            { id: 'orders', label: `Order History (${user.orders.length})` },
            { id: 'addresses', label: `Saved Addresses (${user.addresses.length})` },
            { id: 'profile', label: 'Profile Details' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: 'none',
                border: 'none',
                padding: '14px 24px',
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: activeTab === tab.id ? 600 : 500,
                color: activeTab === tab.id ? 'var(--terracotta)' : 'var(--text-muted)',
                borderBottom: activeTab === tab.id ? '2.5px solid var(--terracotta)' : '2.5px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div>
            {user.orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--cream)', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--text-primary)', marginBottom: 8 }}>
                  No orders placed yet
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
                  Explore our handcrafted A2 Ghee and cold-pressed traditional oils.
                </p>
                <Link href="/shop" className="btn btn-primary">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {user.orders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      backgroundColor: '#FFF',
                      border: '1px solid var(--border-color)',
                      padding: '28px',
                      boxShadow: '0 4px 16px rgba(42, 20, 8, 0.03)',
                    }}
                  >
                    {/* Order Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid var(--border-color)', paddingBottom: 18, marginBottom: 20 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>
                            {order.id}
                          </span>
                          <span
                            style={{
                              padding: '4px 10px',
                              fontSize: 11,
                              fontWeight: 600,
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                              backgroundColor: order.status === 'Delivered' ? '#E8F5E9' : '#FFF3E0',
                              color: order.status === 'Delivered' ? '#2E7D32' : '#E65100',
                            }}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                          Placed on {order.date} · Tracking: <strong style={{ color: 'var(--text-primary)' }}>{order.trackingNumber}</strong>
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, color: 'var(--text-primary)' }}>
                          ₹{order.total.toLocaleString('en-IN')}
                        </span>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {order.shipping === 0 ? 'Free Shipping' : `Shipping: ₹${order.shipping}`}
                        </p>
                      </div>
                    </div>

                    {/* Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {order.items.map((item) => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ position: 'relative', width: 56, height: 56, border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)', overflow: 'hidden', flexShrink: 0 }}>
                              <Image src={item.image} alt={item.name} fill sizes="56px" style={{ objectFit: 'cover' }} />
                            </div>
                            <div>
                              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 17, color: 'var(--text-primary)', marginBottom: 2 }}>
                                {item.name}
                              </h4>
                              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                Size: {item.size} · Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div style={{ borderTop: '1px solid var(--border-color)', marginTop: 20, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                      <span>Delivering to: {order.shippingAddress}</span>
                      <Link href="/shop" style={{ color: 'var(--terracotta)', textDecoration: 'none', fontWeight: 600 }}>
                        Reorder Products →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Manage shipping destinations for swift checkout.</p>
              <button
                type="button"
                onClick={() => setShowAddressModal(true)}
                className="btn btn-secondary"
                style={{ fontSize: 11, padding: '10px 18px' }}
              >
                + Add New Address
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {user.addresses.map((addr) => (
                <div
                  key={addr.id}
                  style={{
                    backgroundColor: '#FFF',
                    border: addr.isDefault ? '2px solid var(--terracotta)' : '1px solid var(--border-color)',
                    padding: '24px',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', backgroundColor: 'var(--cream-dark)', color: 'var(--text-primary)' }}>
                        Default
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--text-primary)', marginBottom: 6 }}>
                    {addr.name}
                  </h4>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {addr.street}<br />
                    {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-primary)', marginTop: 10 }}>
                    Phone: {addr.phone}
                  </p>
                </div>
              ))}
            </div>

            {/* Address Modal */}
            {showAddressModal && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 200,
                  backgroundColor: 'rgba(42, 20, 8, 0.6)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 20,
                }}
              >
                <div style={{ backgroundColor: '#FFF', width: '100%', maxWidth: 480, border: '1px solid var(--border-color)', padding: 32 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--text-primary)' }}>
                      Add New Address
                    </h3>
                    <button type="button" onClick={() => setShowAddressModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
                  </div>
                  <form onSubmit={handleAddressSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Label</label>
                      <input
                        type="text"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        placeholder="Home / Office"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Street Address</label>
                      <input
                        type="text"
                        required
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        placeholder="Flat, building, street"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>City</label>
                        <input
                          type="text"
                          required
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          placeholder="City"
                          style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>State</label>
                        <input
                          type="text"
                          value={newState}
                          onChange={(e) => setNewState(e.target.value)}
                          placeholder="State"
                          style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>PIN Code</label>
                      <input
                        type="text"
                        required
                        value={newPincode}
                        onChange={(e) => setNewPincode(e.target.value)}
                        placeholder="6-digit PIN code"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)' }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '6px 0' }}>
                      <input
                        type="checkbox"
                        id="is-default"
                        checked={newIsDefault}
                        onChange={(e) => setNewIsDefault(e.target.checked)}
                      />
                      <label htmlFor="is-default" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Set as default shipping address</label>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Address</button>
                      <button type="button" onClick={() => setShowAddressModal(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Profile Details */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: 520, backgroundColor: '#FFF', border: '1px solid var(--border-color)', padding: 36 }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--text-primary)', marginBottom: 20 }}>
              Edit Account Details
            </h3>

            {profileSaved && (
              <div style={{ padding: '12px 16px', backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: 13, marginBottom: 20 }}>
                ✓ Profile details updated successfully.
              </div>
            )}

            <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', backgroundColor: '#F0ECE1', color: 'var(--text-muted)' }}
                />
                <span style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4, display: 'block' }}>Email address cannot be changed</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--cream)' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '14px', justifyContent: 'center', marginTop: 10 }}>
                Save Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
