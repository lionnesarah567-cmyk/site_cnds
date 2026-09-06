import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Send, BellRing } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api/client';

export const NewsletterSection = ({ className = '' }) => {
  const { lang, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'already' | 'error'
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    setFeedbackMsg('');

    try {
      const res = await api.subscribeNewsletter(email.trim(), lang);
      if (res.success) {
        if (res.alreadySubscribed) {
          setStatus('already');
          setFeedbackMsg(t('newsletter.already'));
        } else {
          setStatus('success');
          setFeedbackMsg(t('newsletter.success'));
          setEmail('');
        }
      } else {
        setStatus('error');
        setFeedbackMsg(res.message || t('newsletter.error'));
      }
    } catch (err) {
      setStatus('error');
      setFeedbackMsg(err.message || t('newsletter.error'));
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-cnds-ink via-[#1A1A1A] to-[#121212] text-white border border-[#2B2B2B] shadow-xl p-8 sm:p-10 md:p-12 ${className}`}>
      {/* Decorative background accents */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cnds-red/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cnds-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-cnds-gold text-xs font-semibold uppercase tracking-wider mb-4">
          <BellRing className="w-3.5 h-3.5 text-cnds-gold" />
          <span>{t('newsletter.badge')}</span>
        </div>

        {/* Title & Subtitle */}
        <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3">
          {t('newsletter.title')}
        </h3>
        <p className="text-[#B3B0A6] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
          {t('newsletter.subtitle')}
        </p>

        {/* Subscription Form */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletter.placeholder')}
                disabled={status === 'loading'}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-stone-400 text-sm focus:outline-none focus:border-cnds-gold focus:ring-1 focus:ring-cnds-gold transition-colors disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cnds-red hover:bg-cnds-red/90 active:scale-[0.99] text-white font-medium text-sm transition-all shadow-md shadow-cnds-red/20 disabled:opacity-50 cursor-pointer"
            >
              {status === 'loading' ? (
                <span>{t('newsletter.subscribing')}</span>
              ) : (
                <>
                  <span>{t('newsletter.button')}</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Feedback messages */}
          {status === 'success' && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs text-left animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {status === 'already' && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs text-left animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-200 text-xs text-left animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Privacy Note */}
          <p className="text-stone-400 text-xs mt-4">
            {t('newsletter.privacy')}
          </p>
        </form>
      </div>
    </div>
  );
};
