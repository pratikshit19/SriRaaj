'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with';
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function GoogleSignInButton({ onSuccess, text = 'signin_with' }: GoogleSignInButtonProps) {
  const { loginWithGoogle } = useAuth();
  const btnContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;

    // Callback when Google OAuth credential returns
    const handleCredentialResponse = (response: { credential?: string }) => {
      if (response.credential) {
        const payload = parseJwt(response.credential);
        if (payload) {
          loginWithGoogle({
            name: payload.name || payload.given_name || 'Google User',
            email: payload.email,
            avatar: payload.picture,
            googleId: payload.sub,
          });
          onSuccess?.();
        }
      }
    };

    const initGoogle = () => {
      const google = (window as unknown as { google?: { accounts: { id: { initialize: (opts: unknown) => void; renderButton: (el: HTMLElement, opts: unknown) => void } } } }).google;
      if (google && btnContainerRef.current) {
        try {
          google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
          });

          google.accounts.id.renderButton(btnContainerRef.current, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            shape: 'rectangular',
            text,
            logo_alignment: 'left',
            width: 380,
          });
          setIsLoaded(true);
        } catch (e) {
          console.warn('Google Identity button render error:', e);
        }
      }
    };

    if ((window as unknown as { google?: unknown }).google) {
      initGoogle();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    }
  }, [clientId, text, loginWithGoogle, onSuccess]);

  // Demo Fallback for 1-click Google Sign-In in local dev
  const handleSimulatedGoogleLogin = () => {
    loginWithGoogle({
      name: 'Pratikshit Sharma (Google)',
      email: 'pratikshit.google@sriraaj.in',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    });
    onSuccess?.();
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div ref={btnContainerRef} style={{ width: '100%', minHeight: 44, display: isLoaded ? 'block' : 'none' }} />

      {!isLoaded && (
        <button
          type="button"
          onClick={handleSimulatedGoogleLogin}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '12px 16px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-color)',
            borderRadius: 6,
            color: 'var(--text-primary)',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--cream)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>
      )}
    </div>
  );
}
