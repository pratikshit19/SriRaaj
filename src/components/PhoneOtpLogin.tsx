'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';

interface PhoneOtpLoginProps {
  onSuccess?: () => void;
}

export default function PhoneOtpLogin({ onSuccess }: PhoneOtpLoginProps) {
  const { loginWithPhone } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');

    const cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleaned }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStep('otp');
        setTimer(30);
        if (data.devOtp) {
          setInfo(`Test mode: Enter ${data.devOtp} to verify instantly`);
          setOtp(data.devOtp);
        } else {
          setInfo('OTP sent via SMS/WhatsApp through MSG91');
        }
      } else {
        setError(data.error || 'Failed to send OTP. Please try again.');
      }
    } catch {
      setError('Network error while requesting OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      setError('Please enter the OTP received on your phone');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        loginWithPhone(phone, name);
        onSuccess?.();
      } else {
        setError(data.error || 'Invalid OTP code. Please try again.');
      }
    } catch {
      setError('Verification request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '24px 20px', marginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 18 }}>📱</span>
        <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
          Instant Mobile OTP Sign In
        </h3>
      </div>

      {error && (
        <div style={{ padding: '8px 12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#DC2626', fontSize: 12, borderRadius: 4, marginBottom: 12 }}>
          {error}
        </div>
      )}

      {info && (
        <div style={{ padding: '8px 12px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#2563EB', fontSize: 12, borderRadius: 4, marginBottom: 12 }}>
          {info}
        </div>
      )}

      {step === 'phone' ? (
        <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label htmlFor="otp-name" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
              Your Name (Optional)
            </label>
            <input
              type="text"
              id="otp-name"
              placeholder="e.g. Pratikshit"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: 4, backgroundColor: '#FFFFFF', fontSize: 13 }}
            />
          </div>

          <div>
            <label htmlFor="otp-phone" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
              10-Digit Mobile Number *
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ padding: '10px 12px', backgroundColor: 'var(--ivory-dark)', border: '1px solid var(--border-color)', borderRadius: 4, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                +91
              </span>
              <input
                type="tel"
                id="otp-phone"
                required
                maxLength={10}
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: 4, backgroundColor: '#FFFFFF', fontSize: 13 }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 12, marginTop: 4 }}
          >
            {loading ? 'Sending OTP...' : 'Send Login OTP via SMS'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <label htmlFor="otp-code" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                Enter Verification Code sent to +91 {phone}
              </label>
              <button
                type="button"
                onClick={() => setStep('phone')}
                style={{ background: 'none', border: 'none', color: 'var(--terracotta)', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Change Number
              </button>
            </div>
            <input
              type="text"
              id="otp-code"
              required
              maxLength={6}
              placeholder="Enter 4 or 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-color)', borderRadius: 4, backgroundColor: '#FFFFFF', fontSize: 16, letterSpacing: '0.2em', textAlign: 'center', fontWeight: 700 }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 12 }}
          >
            {loading ? 'Verifying...' : 'Verify & Enter Account'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 4 }}>
            {timer > 0 ? (
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Resend OTP in {timer}s</span>
            ) : (
              <button
                type="button"
                onClick={handleSendOtp}
                style={{ background: 'none', border: 'none', color: 'var(--terracotta)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
              >
                Resend OTP via MSG91
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
