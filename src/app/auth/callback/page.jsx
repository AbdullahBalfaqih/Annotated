'use client';

/**
 * ═══════════════════════════════════════════════════════
 * AUTH CALLBACK PAGE
 * Supabase redirects here after real Google / X OAuth
 * 
 * Handles PKCE flow: exchanges the auth code for a real session
 * then stores the token and redirects to home
 * ═══════════════════════════════════════════════════════
 */

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://aaemqxlfzkkgchwhcisw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_171z2Negckh-UAFXHg91cA_YImBzFxn';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function AuthCallbackPage() {
  const [status, setStatus] = useState('Completing authentication...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase automatically handles the code exchange when initialized
        // It reads the ?code= from URL and exchanges it for a session
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data?.session) {
          // Successfully authenticated - save tokens
          const { session } = data;
          localStorage.setItem('annotated_token', session.access_token);
          localStorage.setItem('annotated_refresh_token', session.refresh_token || '');

          try {
            const meRes = await fetch('http://localhost:5000/api/auth/me', {
              headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            const meData = await meRes.json();
            if (meData?.success && meData.user) {
              localStorage.setItem('annotated_user', JSON.stringify(meData.user));
            } else {
              localStorage.setItem('annotated_user', JSON.stringify(session.user));
            }
          } catch (_) {
            localStorage.setItem('annotated_user', JSON.stringify(session.user));
          }

          const provider = session.user?.app_metadata?.provider || 'oauth';
          setStatus(`✅ Authenticated via ${provider}. Redirecting...`);

          const homeTarget = (typeof window !== 'undefined' && window.location.hostname === 'localhost' && !window.location.pathname.endsWith('.html')) ? '/home' : './home.html';

          setTimeout(() => {
            window.location.href = homeTarget;
          }, 800);
        } else {
          // Session might be in URL hash - Supabase handles this automatically
          // Listen for the auth state change
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              if (event === 'SIGNED_IN' && session) {
                localStorage.setItem('annotated_token', session.access_token);
                localStorage.setItem('annotated_refresh_token', session.refresh_token || '');

                try {
                  const meRes = await fetch('http://localhost:5000/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                  });
                  const meData = await meRes.json();
                  if (meData?.success && meData.user) {
                    localStorage.setItem('annotated_user', JSON.stringify(meData.user));
                  } else {
                    localStorage.setItem('annotated_user', JSON.stringify(session.user));
                  }
                } catch (_) {
                  localStorage.setItem('annotated_user', JSON.stringify(session.user));
                }

                setStatus('✅ Authentication complete! Redirecting...');
                const homeTarget = (typeof window !== 'undefined' && window.location.hostname === 'localhost' && !window.location.pathname.endsWith('.html')) ? '/home' : './home.html';
                setTimeout(() => {
                  window.location.href = homeTarget;
                }, 800);
              }
            }
          );

          // Cleanup after 30 seconds timeout
          setTimeout(() => {
            subscription.unsubscribe();
            if (!localStorage.getItem('annotated_token')) {
              setError('Authentication timed out. Please try again.');
            }
          }, 30000);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed');
      }
    };

    handleCallback();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        padding: '40px 32px',
        borderRadius: '20px',
        border: '1px solid rgba(229, 231, 235, 0.8)',
        boxShadow: '0 4px 20px rgba(19, 26, 234, 0.08)'
      }}>
        {error ? (
          <>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>❌</div>
            <h2 style={{ color: '#dc2626', marginBottom: '12px', fontSize: '18px' }}>
              Authentication Failed
            </h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>{error}</p>
            <a
              href="/login"
              style={{
                display: 'inline-block',
                padding: '10px 24px',
                background: '#2475FC',
                color: '#fff',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Try Again
            </a>
          </>
        ) : (
          <>
            {/* Clean Spinner */}
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #f0f0f0',
              borderTop: '3px solid #2475FC',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '20px auto'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </>
        )}
      </div>
    </div>
  );
}
