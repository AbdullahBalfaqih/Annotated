'use client';

/**
 * ═══════════════════════════════════════════════════════
 * ANNOTATED AI - LOGIN PAGE
 * Real Supabase OAuth - Google & X (Twitter)
 * 
 * NO MOCK. NO SIMULATION. NO FAKE DATA.
 * 
 * Uses @supabase/supabase-js directly to trigger real OAuth.
 * Supabase redirects the user to Google or X's actual login page.
 * After login, Supabase returns a real session with a real JWT.
 * ═══════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Real Supabase credentials - PUBLIC (safe to expose in frontend)
const SUPABASE_URL = 'https://aaemqxlfzkkgchwhcisw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_171z2Negckh-UAFXHg91cA_YImBzFxn';

// Initialize real Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function LoginPage() {
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    if (err) {
      setErrorMessage(decodeURIComponent(err));
    }

    // If arrived from logout, aggressively clear all sessions and do not auto-redirect
    const isExplicitLogout = params.get('logout') === 'true';
    if (isExplicitLogout) {
      try {
        supabase.auth.signOut({ scope: 'global' }).catch(() => {});
        localStorage.removeItem('annotated_token');
        localStorage.removeItem('annotated_refresh_token');
        localStorage.removeItem('annotated_user');
        sessionStorage.clear();
      } catch (_) {}
      return;
    }

    // Only process callback if the URL actually has OAuth callback payload
    const hasCallbackData = window.location.search.includes('code=') || window.location.hash.includes('access_token=');
    if (!hasCallbackData) {
      return;
    }

    const getHomeTarget = () => {
      if (typeof window === 'undefined') return '/home';
      const isExtensionOrFile =
        window.location.protocol === 'chrome-extension:' ||
        window.location.protocol === 'file:' ||
        window.location.pathname.endsWith('.html');
      return isExtensionOrFile ? './home.html' : '/home';
    };

    // Handle Supabase auth callback
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (session?.access_token) {
        localStorage.setItem('annotated_token', session.access_token);
        localStorage.setItem('annotated_refresh_token', session.refresh_token || '');
        
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
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
        } else {
          localStorage.setItem('annotated_user', JSON.stringify(session.user));
        }

        window.location.href = getHomeTarget();
      }
    };

    handleAuthCallback();

    // Also listen for auth state changes (after OAuth redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        localStorage.setItem('annotated_token', session.access_token);
        localStorage.setItem('annotated_refresh_token', session.refresh_token || '');
        
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
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
        } else {
          localStorage.setItem('annotated_user', JSON.stringify(session.user));
        }

        window.location.href = getHomeTarget();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Real Google OAuth via Supabase
   * Opens actual Google account picker - NOT a mock page
   */
  const handleGoogleOAuth = async () => {
    try {
      setLoadingProvider('google');
      setErrorMessage(null);

      let callbackUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'http://localhost:3000/auth/callback';
      if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
        callbackUrl = 'http://localhost:3000/auth/callback';
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account consent'
          }
        }
      });

      if (error) {
        throw error;
      }

      // Supabase redirects the user to Google's real login page
      // data.url contains the real Google OAuth URL
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Google OAuth Error:', err);
      if (err.message?.includes('provider is not enabled')) {
        setErrorMessage('⚠️ مزود Google غير مفعل في Supabase! يرجى الذهاب إلى Supabase Dashboard -> Authentication -> Providers وتفعيل Google.');
      } else {
        setErrorMessage(err.message || 'فشل تسجيل الدخول بـ Google');
      }
      setLoadingProvider(null);
    }
  };

  /**
   * Real X (Twitter) OAuth via Supabase
   * Opens actual X login page - NOT a mock page
   */
  const handleXOAuth = async () => {
    try {
      setLoadingProvider('x');
      setErrorMessage(null);

      let callbackUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'http://localhost:3000/auth/callback';
      if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
        callbackUrl = 'http://localhost:3000/auth/callback';
      }

      let res = await supabase.auth.signInWithOAuth({
        provider: 'x', // Supabase OAuth 2.0 uses 'x'
        options: {
          redirectTo: callbackUrl
        }
      });

      if (res.error && res.error.message?.includes('provider is not enabled')) {
        // Fallback to legacy 'twitter'
        res = await supabase.auth.signInWithOAuth({
          provider: 'twitter',
          options: {
            redirectTo: callbackUrl
          }
        });
      }

      if (res.error) {
        throw res.error;
      }

      // Supabase redirects to X's real login page
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error('X OAuth Error:', err);
      if (err.message?.includes('provider is not enabled')) {
        setErrorMessage('⚠️ مزود X (Twitter) غير مفعل في Supabase! يرجى الذهاب إلى Supabase Dashboard -> Authentication -> Providers وتفعيل Twitter.');
      } else {
        setErrorMessage(err.message || 'فشل تسجيل الدخول بـ X');
      }
      setLoadingProvider(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-inter selection:bg-blue-600 selection:text-white relative flex flex-col justify-center items-center px-4 overflow-x-hidden">
      
      {/* Floating Pill Header */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 px-5 py-2.5 rounded-full bg-[rgba(242,242,242,0.85)] border border-[rgba(227,227,227,0.65)] backdrop-blur-md shadow-[0_10px_30px_-4px_rgba(0,0,0,0.05)] transition-all">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/e3a328e93f28b01a56da27aba3d82475ab815bbb?width=40" 
              alt="Annotated Icon" 
              className="w-5 h-5 object-contain"
            />
            <span className="text-[14px] font-normal text-black tracking-[-0.28px]">Annotation</span>
          </Link>
          
          <div className="w-[1.5px] h-4 bg-[rgba(227,227,227,0.8)] rounded-full" />
          
          <nav className="flex items-center gap-4 text-[14px] font-normal tracking-[-0.28px]">
            <Link href="/home" className="text-[#828282] hover:text-black transition-colors">Home</Link>
            <Link href="/#pricing" className="text-[#828282] hover:text-black transition-colors">Pricing</Link>
            <Link href="/#contact" className="text-[#828282] hover:text-black transition-colors">Contact</Link>
            <div className="w-[1.5px] h-4 bg-[rgba(227,227,227,0.8)] rounded-full" />
            <span className="text-[14px] font-medium text-[#2475FC]">Log in</span>
          </nav>
        </div>
      </header>

      {/* Login Card */}
      <div 
        className="w-full max-w-[500px] min-h-[458px] p-8 sm:p-10 rounded-[28px] bg-white flex flex-col justify-center items-center relative transition-all"
        style={{
          boxShadow: '0 4px 20px 0 rgba(19, 26, 234, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(229, 231, 235, 0.8)'
        }}
      >
        
        {/* App Icon */}
        <div className="w-[110px] h-[112px] flex-shrink-0 mb-3 overflow-hidden flex items-center justify-center">
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/c4d9fcad8f7ae9f805628d67568a10147d2d2a1d?width=220" 
            alt="Annotated App Icon" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Heading */}
        <div className="w-full max-w-[337px] text-center mb-6">
          <h1 className="font-geist text-[28px] sm:text-[32px] font-normal text-[#0A0A0A] leading-[1.3] sm:leading-[48px] tracking-[-0.8px]">
            Access to your account
          </h1>
          <p className="text-[13px] text-[#888] mt-1">
            Sign in with your real Google or X account
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="w-full max-w-[420px] mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] text-center font-medium">
            {errorMessage}
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="w-full max-w-[420px] space-y-3.5">
          
          {/* Continue with Google - Real OAuth */}
          <button
            id="btn-google-oauth"
            onClick={handleGoogleOAuth}
            disabled={loadingProvider !== null}
            className="w-full h-[50px] px-4 flex items-center justify-center rounded-[14px] border border-[#E5E5E5] bg-[#F5F5F5] hover:bg-[#EAEAEA] active:scale-[0.99] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition-all cursor-pointer disabled:opacity-60"
          >
            <div className="w-[200px] flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                {loadingProvider === 'google' ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#4285F4" strokeWidth="4"/>
                    <path className="opacity-75" fill="#4285F4" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path d="M15.04 8.16602C15.04 7.64602 14.9933 7.14602 14.9067 6.66602H8V9.50602H11.9467C11.7733 10.4193 11.2533 11.1927 10.4733 11.7127V13.5593H12.8533C14.24 12.2793 15.04 10.3993 15.04 8.16602Z" fill="#4285F4"/>
                    <path d="M7.99979 15.3337C9.97979 15.3337 11.6398 14.6804 12.8531 13.5604L10.4731 11.7137C9.81979 12.1537 8.98646 12.4204 7.99979 12.4204C6.09313 12.4204 4.47313 11.1337 3.89313 9.40039H1.45312V11.2937C2.65979 13.6871 5.13312 15.3337 7.99979 15.3337Z" fill="#34A853"/>
                    <path d="M3.89366 9.39289C3.74699 8.95289 3.66033 8.48622 3.66033 7.99956C3.66033 7.51289 3.74699 7.04622 3.89366 6.60622V4.71289H1.45366C0.953659 5.69956 0.666992 6.81289 0.666992 7.99956C0.666992 9.18622 0.953659 10.2996 1.45366 11.2862L3.35366 9.80622L3.89366 9.39289Z" fill="#FBBC05"/>
                    <path d="M7.99979 3.58602C9.07979 3.58602 10.0398 3.95935 10.8065 4.67935L12.9065 2.57935C11.6331 1.39268 9.97979 0.666016 7.99979 0.666016C5.13312 0.666016 2.65979 2.31268 1.45312 4.71268L3.89313 6.60602C4.47313 4.87268 6.09313 3.58602 7.99979 3.58602Z" fill="#EA4335"/>
                  </svg>
                )}
              </div>
              <span className="font-geist text-[14px] font-normal text-[#0A0A0A] leading-[20px] whitespace-nowrap">
                {loadingProvider === 'google' ? 'Connecting to Google...' : 'continue with Google'}
              </span>
            </div>
          </button>

          {/* Continue with X - Real OAuth */}
          <button
            id="btn-x-oauth"
            onClick={handleXOAuth}
            disabled={loadingProvider !== null}
            className="w-full h-[50px] px-4 flex items-center justify-center rounded-[14px] border border-[#E5E5E5] bg-[#F5F5F5] hover:bg-[#EAEAEA] active:scale-[0.99] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition-all cursor-pointer disabled:opacity-60"
          >
            <div className="w-[200px] flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                {loadingProvider === 'x' ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#000" strokeWidth="4"/>
                    <path className="opacity-75" fill="#000" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#0A0A0A">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                )}
              </div>
              <span className="font-geist text-[14px] font-normal text-[#0A0A0A] leading-[20px] whitespace-nowrap">
                {loadingProvider === 'x' ? 'Connecting to X...' : 'continue with X'}
              </span>
            </div>
          </button>

        </div>

      </div>

    </div>
  );
}
