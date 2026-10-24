'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, Clock, Bell, Eye, EyeOff, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ComingSoonOverlayProps {
  locale: string;
}

export function ComingSoonOverlay({ locale }: ComingSoonOverlayProps) {
  const isArabic = locale === 'ar';
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Default countdown values for instant SSR display
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    // Target date: 14 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update background blur on preview toggle
  useEffect(() => {
    const siteContent = document.getElementById('site-content');
    if (!siteContent) return;

    if (isPreviewMode) {
      siteContent.classList.remove('filter', 'blur-md', 'blur-sm', 'pointer-events-none', 'select-none');
    } else {
      siteContent.classList.add('filter', 'blur-md', 'pointer-events-none', 'select-none');
    }
  }, [isPreviewMode]);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error(isArabic ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address');
      return;
    }
    setIsSubscribed(true);
    toast.success(
      isArabic
        ? 'شكراً لك! سنقوم بإشعارك فور إطلاق متجر البركة.'
        : "Thank you! We'll notify you as soon as El Baraka launches."
    );
  };

  // Floating button when in preview mode so user/developer can restore the Coming Soon screen
  if (isPreviewMode) {
    return (
      <div className="fixed bottom-6 right-6 z-[99999]">
        <button
          onClick={() => setIsPreviewMode(false)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full shadow-2xl transition-all duration-300 font-semibold text-sm group hover:scale-105 border border-amber-300/40 cursor-pointer"
          title={isArabic ? 'إعادة تفعيل شاشة قريباً' : 'Enable Coming Soon blur'}
        >
          <EyeOff className="w-4 h-4 transition-transform group-hover:rotate-12" />
          <span>{isArabic ? 'تفعيل وضع قريباً (البركة)' : 'Show Coming Soon Blur'}</span>
        </button>
      </div>
    );
  }

  return (
    <div
      id="coming-soon-modal"
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-4 sm:p-6 md:p-8"
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(10, 15, 29, 0.82)',
      }}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Modal / Card */}
      <div className="relative w-full max-w-2xl bg-white/[0.08] backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_25px_70px_rgba(0,0,0,0.6)] text-center text-white overflow-hidden my-auto">
        {/* Subtle top edge gradient highlight */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 opacity-90" />

   

        {/* Brand Icon & Badge */}
        <div className="relative mx-auto mb-6 h-36 w-36 overflow-hidden rounded-2xl bg-white shadow-xl ring-4 ring-teal-300/10 sm:h-44 sm:w-44">
          <Image
            src="/el-baraka-logo.jpg"
            width={1597}
            height={524}
            alt={isArabic ? 'البركة — El Baraka' : 'El Baraka — البركة'}
            priority
            sizes="(max-width: 640px) 439px, 537px"
            className="absolute left-0 top-0 h-full w-auto max-w-none"
          />
        </div>

        {/* Tag Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-400/30 text-teal-200 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isArabic ? 'قريباً إن شاء الله' : 'Coming Very Soon'}</span>
        </div>

        {/* Brand Name Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl leading-relaxed font-black tracking-tight mb-2">
          <span className="bg-gradient-to-r from-teal-100 via-cyan-300 to-emerald-100 bg-clip-text text-transparent drop-shadow-md">
            {isArabic ? 'نظافة لبيتك، وعناية بجمالك' : 'A cleaner home. A little more self-care.'}
          </span>
        </h1>

        {/* Coming Soon Sub-headline */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white/95 mb-4 tracking-wide">
          {isArabic ? 'Coming Soon | قريباً' : 'Coming Soon'}
        </h2>

        {/* Descriptive Text */}
        <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-lg mx-auto mb-8 leading-relaxed font-light">
          {isArabic
            ? 'البركة بيجهّز لك كل اللي تحتاجيه من منظفات، ومستحضرات تجميل، ومنتجات عناية شخصية في مكان واحد. استنّينا قريباً وخلي العناية بيكي وببيتك أسهل!'
            : 'El Baraka is bringing household cleaners, cosmetics, and personal care essentials together in one place. Coming soon, to make caring for yourself and your home easier.'}
        </p>

       

       
      </div>
    </div>
  );
}
