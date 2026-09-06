import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { NewsletterSection } from './NewsletterSection';

export const Footer = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <footer className="bg-cnds-white text-[13.5px] text-cnds-ink-soft">
      {!isAdmin && (
        <div className="wrap pt-12 pb-8">
          <NewsletterSection />
        </div>
      )}
      <div className="border-t border-cnds-line pt-12 pb-8">
        <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-8 pb-10 border-b border-cnds-line">
          
          {/* Col 1: Logo & Motto */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-auto aspect-[1/1.2] rounded-lg overflow-hidden bg-white border border-cnds-line p-0.5 shrink-0 shadow-xs">
                <img
                  src="/images/logo-cnds.jpg"
                  alt="Logo CNDS"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-serif font-semibold text-lg text-cnds-ink">CNDS Burundi</div>
                <div className="text-[11px] text-cnds-ink-soft">{t('hero.institutionName')}</div>
              </div>
            </div>
            <p className="font-serif italic text-[13.5px] text-cnds-ink-soft/90 max-w-sm">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Col 2: Navigation rapide */}
          <div>
            <div className="font-semibold text-cnds-ink text-[13px] uppercase tracking-wider mb-3">
              {t('footer.navigation')}
            </div>
            <ul className="space-y-2 list-none">
              <li><Link to="/" className="hover:text-cnds-red transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/institution" className="hover:text-cnds-red transition-colors">{t('nav.institution')}</Link></li>
              <li><Link to="/textes-juridiques" className="hover:text-cnds-red transition-colors">{t('nav.legalTexts')}</Link></li>
              <li><Link to="/actualites" className="hover:text-cnds-red transition-colors">{t('nav.news')}</Link></li>
            </ul>
          </div>

          {/* Col 3: Contact & Légal */}
          <div>
            <div className="font-semibold text-cnds-ink text-[13px] uppercase tracking-wider mb-3">
              {t('footer.headquarters')}
            </div>
            <p className="text-[13px] leading-relaxed mb-2">
              Kigobe, Avenue Murembwe n°28<br />
              Bujumbura, {t('hero.country')}
            </p>
            <p className="text-[13px]">
              {t('contactSection.phoneLabel')} : 22 278 929 / 22 211 016
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cnds-ink-soft">
          <span>© {new Date().getFullYear()} {t('footer.copyright')}</span>
          <div className="flex items-center gap-4">
            <span>{t('footer.country')}</span>
            <span>·</span>
            <Link to="/admin/login" className="hover:text-cnds-red transition-colors font-medium">
              {t('footer.adminPortal')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
);
};
