'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

const Word = ({ children, progress, range }) => {
  const color = useTransform(progress, range, ["#BBBBBB", "#000000"]);
  return (
    <motion.span style={{ color }}>
      {children}
    </motion.span>
  );
};

const TextReveal = ({ text, className }) => {
  const words = text.split(" ");
  const container = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 80%", "end 50%"]
  });

  return (
    <div ref={container} className={`flex flex-wrap gap-x-[0.25em] ${className || ''}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </div>
  );
};
import { createClient } from '@supabase/supabase-js';

// Real Supabase credentials
const SUPABASE_URL = 'https://aaemqxlfzkkgchwhcisw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_171z2Negckh-UAFXHg91cA_YImBzFxn';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function FigmaLandingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('annotated_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

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

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Google OAuth Error:', err);
      setErrorMessage(err.message || 'فشل تسجيل الدخول بـ Google');
      setLoadingProvider(null);
    }
  };

  const handleXOAuth = async () => {
    try {
      setLoadingProvider('x');
      setErrorMessage(null);

      let callbackUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'http://localhost:3000/auth/callback';
      if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
        callbackUrl = 'http://localhost:3000/auth/callback';
      }

      let res = await supabase.auth.signInWithOAuth({
        provider: 'x',
        options: {
          redirectTo: callbackUrl
        }
      });

      if (res.error && res.error.message?.includes('provider is not enabled')) {
        res = await supabase.auth.signInWithOAuth({
          provider: 'twitter',
          options: {
            redirectTo: callbackUrl
          }
        });
      }

      if (res.error) throw res.error;
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error('X OAuth Error:', err);
      setErrorMessage(err.message || 'فشل تسجيل الدخول بـ X');
      setLoadingProvider(null);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('annotated_token');
      localStorage.removeItem('annotated_user');
      localStorage.removeItem('annotated_refresh_token');
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.remove(['annotated_token', 'annotated_user']);
      }
      setIsLoggedIn(false);
      window.location.href = '/login';
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqData = [
    {
      q: 'What can I use Annotated AI for?',
      a: 'You can use it to capture ideas while browsing, generate engaging social media posts using AI, and automatically publish them to platforms like X, LinkedIn, and others.'
    },
    {
      q: 'How does the AI generation work?',
      a: 'Our AI understands the ideas you capture and helps you draft highly engaging, platform-specific content ready to be published to your audience in one click.'
    },
    {
      q: 'Which social media platforms are supported?',
      a: 'We currently support automated posting and drafting for X (Twitter), LinkedIn, and others, with support for even more platforms on the way!'
    },
    {
      q: 'Is my social media account secure?',
      a: 'Absolutely. We use official, secure OAuth integrations to connect your accounts. We never store your passwords or post without your explicit setup.'
    },
    {
      q: 'How do I get started?',
      a: 'Simply download the extension package for your OS, load it into Chrome via Developer Mode, and sign in to connect your social accounts!'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black font-inter selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      
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
            <a href="#download" className="text-[#828282] hover:text-black transition-colors">Extension</a>
            <a href="#contact" className="text-[#828282] hover:text-black transition-colors">Contact</a>
            <div className="w-[1.5px] h-4 bg-[rgba(227,227,227,0.8)] rounded-full" />
            {mounted && isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 font-medium transition-colors cursor-pointer"
              >
                Log out
              </button>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="text-black hover:text-[#2475FC] font-medium transition-colors cursor-pointer"
              >
                Log in
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 md:pt-36 pb-16 px-6 max-w-[1528px] mx-auto flex flex-col items-center text-center">
        
        {/* App Icon */}
        <div className="w-[110px] h-[110px] mb-8 overflow-hidden flex items-center justify-center">
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/1ef724e21585b4774712b454f051149e521108f5?width=220" 
            alt="App Icon" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Hero Title */}
        <h1 className="text-[44px] sm:text-[58px] md:text-[68px] font-normal text-black leading-[1.1] md:leading-[81.6px] tracking-[-2px] md:tracking-[-2.72px] max-w-[1472px]">
          Capture. Generate. Publish.
        </h1>

        {/* Hero Subtitle */}
        <div className="mt-4 max-w-[600px]">
          <TextReveal 
            text="Meet Annotated AI — the ultimate Chrome extension that turns your ideas into polished social media posts across all platforms."
            className="text-[18px] sm:text-[22px] font-normal leading-[1.3] md:leading-[28.6px] tracking-[-0.44px] justify-center text-center"
          />
        </div>

        {/* Hero CTA Button */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {mounted && isLoggedIn ? (
            <Link 
              href="/home"
              className="inline-flex items-center justify-center h-[36px] px-5 rounded-full bg-[#2475FC] hover:bg-blue-600 text-white text-[16px] font-normal leading-[19.2px] tracking-[-0.32px] transition-all shadow-sm cursor-pointer"
            >
              Go to Workspace
            </Link>
          ) : (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="inline-flex items-center justify-center h-[36px] px-5 rounded-full bg-[#2475FC] hover:bg-blue-600 text-white text-[16px] font-normal leading-[19.2px] tracking-[-0.32px] transition-all shadow-sm cursor-pointer"
            >
              Try now
            </button>
          )}
        </div>

        {/* Hero iPhone Mockup Image */}
        <div className="mt-12 w-full max-w-[1300px] flex justify-center">
          <img 
            src="/pic1.png" 
            alt="Two hands holding iPhone with app mockup" 
            className="w-full h-auto max-h-[850px] object-contain"
          />
        </div>
      </section>

      {/* AI Platforms / Integrations Section (Group 18) */}
      <section className="py-20 md:py-28 px-6 max-w-[1100px] mx-auto">
        <div className="flex flex-col gap-12">
          
          {/* Heading */}
          <div className="max-w-[700px]">
            <TextReveal 
              text="One extension for every way you share content. Idea capture, AI generation, and automatic publishing to your audience." 
              className="text-[34px] sm:text-[44px] md:text-[54px] font-normal leading-[1.1] md:leading-[59.4px] tracking-[-1.62px]"
            />
          </div>

          {/* Connected Track & Real Icons */}
          <div className="relative w-full flex items-center justify-between pt-4 overflow-visible">
            
            {/* Horizontal grey track line */}
            <div className="absolute top-1/2 left-0 right-10 h-[7px] -translate-y-1/2 bg-[#E3E3E3] rounded-full z-0 pointer-events-none" />
            
            {/* The 4 Real Platform Icons - Visually Unified Squircles */}
            <div className="relative z-10 flex items-center gap-4 sm:gap-6 bg-white pr-4">
              
              {/* 1. Real X Icon */}
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0 }} className="w-[64px] h-[64px] flex items-center justify-center flex-shrink-0 cursor-pointer">
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/3fa379eb2359ae0c38e089c8c8ca4345fffad47e?width=220" 
                  alt="X Icon" 
                  className="w-[62px] h-[62px] object-contain drop-shadow-sm"
                />
              </motion.div>

              {/* 2. Real YouTube Icon */}
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="w-[64px] h-[64px] flex items-center justify-center flex-shrink-0 cursor-pointer">
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/f9ac55019fa5ecf7538be7d497991516a1dcf298?width=360" 
                  alt="YouTube Icon" 
                  className="w-[88px] h-[88px] max-w-none object-contain drop-shadow-sm"
                />
              </motion.div>

              {/* 3. Real Podcasts Icon */}
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} className="w-[64px] h-[64px] flex items-center justify-center flex-shrink-0 cursor-pointer">
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/80149202d18855d0afdc3bf790d25cf31e1200a2?width=328" 
                  alt="Podcasts Icon" 
                  className="w-[80px] h-[80px] max-w-none object-contain drop-shadow-sm"
                />
              </motion.div>

              {/* 4. Real GitHub Icon */}
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} className="w-[64px] h-[64px] flex items-center justify-center flex-shrink-0 cursor-pointer">
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/3234749be656c40fae05a02bbf4fc30c9731f35c?width=240" 
                  alt="GitHub Icon" 
                  className="w-[66px] h-[66px] object-contain drop-shadow-sm"
                />
              </motion.div>

            </div>

            {/* Right End: Real Project App Icon */}
            <div className="relative z-10 flex-shrink-0 pl-3 bg-white">
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} className="w-[95px] h-[95px] sm:w-[105px] sm:h-[105px] flex items-center justify-center cursor-pointer">
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/6fd35253221d5dfef88a24a4ad7ff335b84dff63?width=375" 
                  alt="Annotated App Icon" 
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </motion.div>
            </div>

          </div>

        </div>
      </section>

      {/* Everything Done. At One Place (3-Phone Mockup Section) */}
      <section className="py-20 md:py-28 px-6 max-w-[1528px] mx-auto text-center">
        
        {/* Title & Subtitle */}
        <div className="max-w-[630px] mx-auto">
          <h2 className="text-[36px] sm:text-[46px] md:text-[54px] font-normal text-black leading-[1.1] md:leading-[59.4px] tracking-[-1.62px]">
            Everything done.<br />At one place
          </h2>
          <p className="mt-4 text-[18px] sm:text-[22px] font-normal text-[#666666] leading-[1.3] md:leading-[28.6px] tracking-[-0.44px] max-w-[500px] mx-auto">
            Bring your ideas, tasks, and AI conversations together in one focused workspace.
          </p>
        </div>

        {/* App UI Mockup (pic2) */}
        <div className="mt-14 max-w-[1200px] mx-auto flex justify-center overflow-hidden">
          <img 
            src="/pic2.png" 
            alt="App Interface Mockup" 
            className="w-full h-auto object-contain drop-shadow-2xl max-w-[900px]"
          />
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-20 md:py-28 px-6 max-w-[1528px] mx-auto text-center">
        
        {/* Section Header */}
        <div className="max-w-[630px] mx-auto mb-14">
          <div className="text-[#2475FC] text-[16px] font-normal leading-[19.2px] tracking-[-0.32px] mb-3">
            Extension
          </div>
          <h2 className="text-[36px] sm:text-[46px] md:text-[54px] font-normal text-black leading-[1.1] md:leading-[59.4px] tracking-[-1.62px]">
            Get the extension.
          </h2>
          <p className="mt-3 text-[18px] sm:text-[22px] font-normal text-[#666666] leading-[1.3] md:leading-[28.6px] tracking-[-0.44px] max-w-[500px] mx-auto">
            Download the complete package for your operating system and start highlighting the web.
          </p>
        </div>

        {/* Download Cards Box */}
        <div className="max-w-[1100px] mx-auto bg-[#FAFAFA] rounded-[38px] p-5 sm:p-6 flex flex-col md:flex-row items-stretch justify-center gap-5 text-left">
          
          {/* Card 1: Mac */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Icon */}
              <div className="w-[70px] h-[70px] mb-5">
                <img src="/mac-logo-removebg-preview.png" alt="macOS" className="w-full h-full object-contain" />
              </div>

              {/* Title & Description */}
              <div className="font-geist text-[40px] font-normal text-black leading-[44px] tracking-[-1.2px]">
                macOS
              </div>
              <p className="mt-2 text-[16px] font-geist font-normal text-[#666666] leading-[22.4px] tracking-[-0.32px]">
                Download the Annotated AI Chrome extension package for your Mac.
              </p>

              {/* Price-like typography */}
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-geist text-[40px] font-normal text-black leading-[44px] tracking-[-1.2px]">Free</span>
                <span className="font-geist text-[16px] font-normal text-[#666666] leading-[22.4px] tracking-[-0.32px]">/forever</span>
              </div>

              {/* Divider */}
              <div className="my-6 w-full h-[2px] bg-[#EDEDED]" />

              {/* Features List */}
              <div className="space-y-3 font-geist text-[16px] font-normal text-[#666666] leading-[22.4px] tracking-[-0.32px]">
                <div>1. Unzip the downloaded file</div>
                <div>2. Open Chrome Extensions</div>
                <div>3. Enable "Developer mode"</div>
                <div>4. Click "Load unpacked"</div>
              </div>
            </div>

            {/* Download button */}
            <div className="mt-8">
              <a href="/chrome-extension.zip" download className="inline-flex h-[36px] items-center justify-center px-5 rounded-full bg-[#EBEBEB] hover:bg-gray-300 text-[#333333] font-geist text-[16px] font-normal leading-[19.2px] tracking-[-0.32px] transition-colors">
                Download for Mac
              </a>
            </div>
          </div>

          {/* Card 2: Windows (White Card) */}
          <div className="flex-1 bg-white rounded-[35px] p-6 sm:p-8 flex flex-col justify-between shadow-sm border border-gray-100">
            <div>
              {/* Icon */}
              <div className="w-[60px] h-[60px] mb-5">
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="#00a4ef">
                  <path d="M0 3.449L9.75 2.1v8.96H0V3.45zm10.998-1.59L24 0v10.96H10.998V1.86zM0 11.96h9.75v8.96L0 19.57v-7.61zm10.998 0H24V24l-13.002-1.85v-10.19z"/>
                </svg>
              </div>

              {/* Title & Description */}
              <div className="font-geist text-[40px] font-normal text-black leading-[44px] tracking-[-1.2px]">
                Windows
              </div>
              <p className="mt-2 text-[16px] font-geist font-normal text-[#666666] leading-[22.4px] tracking-[-0.32px]">
                Download the Annotated AI Chrome extension package for Windows.
              </p>

              {/* Price-like typography */}
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-geist text-[40px] font-normal text-black leading-[44px] tracking-[-1.2px]">Free</span>
                <span className="font-geist text-[16px] font-normal text-[#666666] leading-[22.4px] tracking-[-0.32px]">/forever</span>
              </div>

              {/* Divider */}
              <div className="my-6 w-full h-[2px] bg-[#EDEDED]" />

              {/* Features List */}
              <div className="space-y-3 font-geist text-[16px] font-normal text-[#666666] leading-[22.4px] tracking-[-0.32px]">
                <div>1. Extract the downloaded ZIP</div>
                <div>2. Go to chrome://extensions</div>
                <div>3. Toggle "Developer mode" on</div>
                <div>4. Click "Load unpacked"</div>
              </div>
            </div>

            {/* Download button */}
            <div className="mt-8">
              <a href="/chrome-extension.zip" download className="inline-flex h-[36px] items-center justify-center px-5 rounded-full bg-[#2475FC] hover:bg-blue-600 text-white font-geist text-[16px] font-normal leading-[19.2px] tracking-[-0.32px] transition-colors">
                Download for Windows
              </a>
            </div>
          </div>

          {/* Card 3: Linux */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Icon */}
              <div className="w-[70px] h-[70px] mb-5">
                <img src="/linx.png" alt="Linux" className="w-full h-full object-contain" />
              </div>

              {/* Title & Description */}
              <div className="font-geist text-[40px] font-normal text-black leading-[44px] tracking-[-1.2px]">
                Linux
              </div>
              <p className="mt-2 text-[16px] font-geist font-normal text-[#666666] leading-[22.4px] tracking-[-0.32px]">
                Download the Annotated AI Chrome extension package for Linux.
              </p>

              {/* Price-like typography */}
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-geist text-[40px] font-normal text-black leading-[44px] tracking-[-1.2px]">Free</span>
                <span className="font-geist text-[16px] font-normal text-[#666666] leading-[22.4px] tracking-[-0.32px]">/forever</span>
              </div>

              {/* Divider */}
              <div className="my-6 w-full h-[2px] bg-[#EDEDED]" />

              {/* Features List */}
              <div className="space-y-3 font-geist text-[16px] font-normal text-[#666666] leading-[22.4px] tracking-[-0.32px]">
                <div>1. Extract the downloaded ZIP</div>
                <div>2. Go to chrome://extensions</div>
                <div>3. Toggle "Developer mode" on</div>
                <div>4. Click "Load unpacked"</div>
              </div>
            </div>

            {/* Download button */}
            <div className="mt-8">
              <a href="/chrome-extension.zip" download className="inline-flex h-[36px] items-center justify-center px-5 rounded-full bg-[#EBEBEB] hover:bg-gray-300 text-[#333333] font-geist text-[16px] font-normal leading-[19.2px] tracking-[-0.32px] transition-colors">
                Download for Linux
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-28 px-6 max-w-[1528px] mx-auto text-center">
        
        {/* Section Header */}
        <div className="max-w-[630px] mx-auto mb-14">
          <div className="text-[#2475FC] text-[16px] font-normal leading-[19.2px] tracking-[-0.32px] mb-3">
            Testimonials
          </div>
          <h2 className="text-[36px] sm:text-[46px] md:text-[54px] font-normal text-black leading-[1.1] md:leading-[59.4px] tracking-[-1.62px]">
            From our users
          </h2>
          <p className="mt-3 text-[18px] sm:text-[22px] font-normal text-[#666666] leading-[1.3] md:leading-[28.6px] tracking-[-0.44px] max-w-[500px] mx-auto">
            See how creators and founders are automating their social presence with Annotated AI.
          </p>
        </div>

        {/* Testimonials Grid (2 Columns) */}
        <div className="max-w-[800px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-4">
            
            {/* Testimonial 1 */}
            <div className="rounded-[38px] bg-[#FAFAFA] p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-[22px] font-normal text-black leading-[28.6px] tracking-[-0.44px]">
                  Seamless Code Annotations
                </h3>
                <p className="mt-3 text-[16px] font-normal text-[#666666] leading-[22.4px] tracking-[-0.32px]">
                  Annotated AI completely changed how we review code. The macOS-style code snippets feature makes sharing context with the team effortless and beautiful.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[rgba(209,209,209,0.25)] flex items-center gap-3">
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/df7fb203b57719908bc6f56f5d66477864cd94b4?width=64" 
                  alt="Ethan Cole" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-[16px] font-normal text-black leading-[22.4px] tracking-[-0.32px]">
                  Ethan Cole
                </span>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-[38px] bg-[#FAFAFA] p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-[22px] font-normal text-black leading-[28.6px] tracking-[-0.44px]">
                  Perfect for podcast clipping
                </h3>
                <p className="mt-3 text-[16px] font-normal text-[#666666] leading-[22.4px] tracking-[-0.32px]">
                  I used to struggle with extracting audio clips. Now, the extension auto-detects the timestamps perfectly and lets me trim audio in seconds without leaving the browser!
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[rgba(209,209,209,0.25)] flex items-center gap-3">
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/5976c39836f664b4a97ace407ad0666eb3c600ee?width=64" 
                  alt="Claire Morgan" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-[16px] font-normal text-black leading-[22.4px] tracking-[-0.32px]">
                  Claire Morgan
                </span>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-[38px] bg-[#FAFAFA] p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-[22px] font-normal text-black leading-[28.6px] tracking-[-0.44px]">
                  A game-changer for workflow
                </h3>
                <p className="mt-3 text-[16px] font-normal text-[#666666] leading-[22.4px] tracking-[-0.32px]">
                  What impressed me most was how deeply the extension integrates with my daily tasks. Highlighting text and getting instant translations or quotes inside the annotation panel is brilliant.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[rgba(209,209,209,0.25)] flex items-center gap-3">
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/a2662512aa82c1ab34f6ddc4694f4161920c6f60?width=64" 
                  alt="Leo Bennett" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-[16px] font-normal text-black leading-[22.4px] tracking-[-0.32px]">
                  Leo Bennett
                </span>
              </div>
            </div>

          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            
            {/* Testimonial 4 */}
            <div className="rounded-[38px] bg-[#FAFAFA] p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-[22px] font-normal text-black leading-[28.6px] tracking-[-0.44px]">
                  Clean and distraction-free
                </h3>
                <p className="mt-3 text-[16px] font-normal text-[#666666] leading-[22.4px] tracking-[-0.32px]">
                  Nothing feels over-designed. The side panel UI is beautiful, fast, and stays completely out of the way until I actually need to capture an idea.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[rgba(209,209,209,0.25)] flex items-center gap-3">
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/5d1ce1faae61397bc95177c95e92368b89af98f8?width=64" 
                  alt="Emily Parker" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-[16px] font-normal text-black leading-[22.4px] tracking-[-0.32px]">
                  Emily Parker
                </span>
              </div>
            </div>

            {/* Testimonial 5 */}
            <div className="rounded-[38px] bg-[#FAFAFA] p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-[22px] font-normal text-black leading-[28.6px] tracking-[-0.44px]">
                  Automated social presence
                </h3>
                <p className="mt-3 text-[16px] font-normal text-[#666666] leading-[22.4px] tracking-[-0.32px]">
                  It’s like having an AI assistant that actually understands my context. I can annotate YouTube videos, capture screenshots, and draft posts instantly from any tab.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[rgba(209,209,209,0.25)] flex items-center gap-3">
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/1c34598bdb15b80d42b4ce1801702a7387af526f?width=64" 
                  alt="Jonas Reed" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-[16px] font-normal text-black leading-[22.4px] tracking-[-0.32px]">
                  Jonas Reed
                </span>
              </div>
            </div>

            {/* Testimonial 6 */}
            <div className="rounded-[38px] bg-[#FAFAFA] p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-[22px] font-normal text-black leading-[28.6px] tracking-[-0.44px]">
                  A supercharged workflow
                </h3>
                <p className="mt-3 text-[16px] font-normal text-[#666666] leading-[22.4px] tracking-[-0.32px]">
                  The handwriting-to-code feature and the real-time translation makes studying and researching 10x faster. We can now capture ideas without ever breaking our flow.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[rgba(209,209,209,0.25)] flex items-center gap-3">
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/48033458d4a2f77c916505684906142fb817b2ba?width=64" 
                  alt="Sophie Turner" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-[16px] font-normal text-black leading-[22.4px] tracking-[-0.32px]">
                  Sophie Turner
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 px-6 max-w-[1528px] mx-auto text-center">
        
        {/* Section Header */}
        <div className="max-w-[630px] mx-auto mb-14">
          <div className="text-[#2475FC] text-[16px] font-normal leading-[19.2px] tracking-[-0.32px] mb-3">
            FAQ's
          </div>
          <h2 className="text-[36px] sm:text-[46px] md:text-[54px] font-normal text-black leading-[1.1] md:leading-[59.4px] tracking-[-1.62px]">
            Frequently Asked
          </h2>
          <p className="mt-3 text-[18px] sm:text-[22px] font-normal text-[#666666] leading-[1.3] md:leading-[28.6px] tracking-[-0.44px] max-w-[500px] mx-auto">
            Everything you need to know about capturing ideas and auto-publishing with Annotated AI.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-[600px] mx-auto flex flex-col gap-2.5 text-left">
          {faqData.map((item, idx) => (
            <div 
              key={idx}
              className="rounded-[18px] bg-[#FAFAFA] overflow-hidden transition-all"
            >
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 flex items-center justify-between gap-4 text-left"
              >
                <span className="text-[16px] font-normal text-black leading-[19.2px] tracking-[-0.32px]">
                  {item.q}
                </span>
                <div className="w-[14px] h-[14px] flex items-center justify-center flex-shrink-0">
                  <span className={`text-[18px] font-light leading-none transition-transform duration-200 ${openFaq === idx ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </div>
              </button>
              
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-[15px] font-normal text-[#666666] leading-[22px] tracking-[-0.2px]">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Download Soon Section */}
      <section id="download" className="py-20 md:py-28 px-6 max-w-[1528px] mx-auto text-center flex flex-col items-center">
        
        {/* App Store Icon */}
        <div className="w-[120px] h-[120px] mb-8 overflow-hidden flex items-center justify-center">
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/b8fc8101f2974aad0aa1446c18a9b9d7f6e36505?width=240" 
            alt="App Store App Icon" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="text-[36px] sm:text-[46px] md:text-[54px] font-normal text-black leading-[1.1] md:leading-[59.4px] tracking-[-1.62px]">
          Download Soon
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-[18px] sm:text-[22px] font-normal text-[#666666] leading-[1.3] md:leading-[28.6px] tracking-[-0.44px] max-w-[500px]">
          Install your Annotated app right now from app store and Playstore.
        </p>

        {/* Download Button */}
        <div className="mt-6">
          <button className="h-[36px] px-6 rounded-full bg-[#2475FC] hover:bg-blue-600 text-white text-[16px] font-normal leading-[19.2px] tracking-[-0.32px] transition-all shadow-sm">
            Download
          </button>
        </div>

        {/* Hand holding iPhone mockup */}
        <div className="mt-14 w-full max-w-[994px] mx-auto flex justify-center">
          <img 
            src="/hand-app-mockup.jpg" 
            alt="Hand holding Annotated AI app" 
            className="w-full h-auto object-contain"
          />
        </div>
      </section>

      {/* Giant "Annotate" Typography Watermark */}
      <section className="relative w-full overflow-hidden flex justify-center py-6 select-none pointer-events-none">
        <div className="text-[120px] sm:text-[200px] md:text-[280px] lg:text-[350px] font-normal text-[#0E0E0E] leading-none tracking-[-4px] md:tracking-[-11.81px] lowercase whitespace-nowrap opacity-95">
          annotate
        </div>
      </section>

      {/* Footer Section */}
      <footer id="contact" className="py-14 px-6 max-w-[1100px] mx-auto border-t border-[#EDEDED]">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          
          {/* Logo & Description */}
          <div className="max-w-[250px]">
            <div className="flex items-center gap-2 mb-2">
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/e3a328e93f28b01a56da27aba3d82475ab815bbb?width=40" 
                alt="Annotated" 
                className="w-5 h-5 object-contain"
              />
              <span className="text-[14px] font-normal text-black tracking-[-0.28px]">Annotated</span>
            </div>
            <p className="text-[14px] font-normal text-[#666666] leading-[16.8px] tracking-[-0.28px]">
              Your personal AI extension for capturing ideas and auto-publishing to your social accounts.
            </p>
          </div>

          {/* Links Columns */}
          <div className="flex items-start gap-16 text-[14px] font-normal tracking-[-0.28px]">
            
            {/* Pages Column */}
            <div className="flex flex-col gap-2.5">
              <span className="text-black font-medium">Pages</span>
              <a href="./home.html" className="text-[#2475FC] hover:underline">Home</a>
              <a href="#download" className="text-[#666666] hover:text-black">Extension</a>
              <a href="#contact" className="text-[#666666] hover:text-black">Contact</a>
            </div>

            {/* Legal Column */}
            <div className="flex flex-col gap-2.5">
              <span className="text-black font-medium">Legal</span>
              <a href="#" className="text-[#666666] hover:text-black">Privacy Policy</a>
              <a href="#" className="text-[#666666] hover:text-black">Terms & Conditions</a>
              <a href="#" className="text-[#666666] hover:text-black">Acceptable Use</a>
            </div>

          </div>

        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-[#F0F0F0] text-[16px] font-normal text-[#666666] leading-[22.4px] tracking-[-0.32px]">
          ©️ 2026 Annotated AI. All Rights Reserved.
        </div>
      </footer>

      {/* Login Popup Modal */}
      {showLoginModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLoginModal(false);
          }}
        >
          <div 
            className="w-full max-w-[480px] p-8 sm:p-10 rounded-[28px] bg-white flex flex-col justify-center items-center relative transition-all shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-[#E5E7EB]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              title="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* App Icon */}
            <div className="w-[105px] h-[105px] flex-shrink-0 mb-3 overflow-hidden flex items-center justify-center">
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/c4d9fcad8f7ae9f805628d67568a10147d2d2a1d?width=220" 
                alt="Annotated App Icon" 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Heading */}
            <div className="w-full max-w-[337px] text-center mb-6">
              <h2 className="font-geist text-[28px] sm:text-[32px] font-normal text-[#0A0A0A] leading-[1.3] sm:leading-[44px] tracking-[-0.8px]">
                Access to your account
              </h2>
              <p className="text-[13px] text-[#888] mt-1">
                Sign in with your real Google or X account
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="w-full max-w-[400px] mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] text-center font-medium">
                {errorMessage}
              </div>
            )}

            {/* OAuth Buttons */}
            <div className="w-full max-w-[400px] space-y-3.5">
              
              {/* Continue with Google */}
              <button
                id="modal-btn-google-oauth"
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

              {/* Continue with X */}
              <button
                id="modal-btn-x-oauth"
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
      )}

    </div>
  );
}
