import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-cnds-line">
      <div className="wrap flex items-center justify-between h-20">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-12 w-auto max-w-[50px] aspect-[1/1.2] rounded-lg overflow-hidden bg-white border border-cnds-line flex items-center justify-center p-0.5 shrink-0 group-hover:border-cnds-gold transition-colors shadow-xs">
            <img
              src="/images/logo-cnds.jpg"
              alt="Logo CNDS"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-semibold text-lg tracking-wide text-cnds-ink leading-tight">
              CNDS
            </span>
            <span className="text-[11px] text-cnds-ink-soft hidden sm:inline">
              {t('hero.country')}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-7 list-none">
            <li>
              <Link
                to="/"
                className={`text-[14px] font-medium py-2 transition-colors ${
                  isActive('/') ? 'text-cnds-red font-semibold' : 'text-cnds-ink hover:text-cnds-red'
                }`}
              >
                {t('nav.home')}
              </Link>
            </li>

            {/* Submenu L'Institution */}
            <li className="relative group py-2">
              <Link
                to="/institution"
                className={`text-[14px] font-medium inline-flex items-center gap-1 transition-colors ${
                  isActive('/institution') ? 'text-cnds-red font-semibold' : 'text-cnds-ink hover:text-cnds-red'
                }`}
              >
                <span>{t('nav.institution')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-cnds-ink-soft group-hover:text-cnds-red transition-transform group-hover:rotate-180" />
              </Link>
              <ul className="hidden group-hover:block absolute top-full left-0 bg-cnds-white border border-cnds-line rounded-lg p-2 min-w-[210px] shadow-xl z-50">
                <li>
                  <Link
                    to="/institution#apropos"
                    className="block px-3 py-2 rounded-md text-[13.5px] text-cnds-ink hover:bg-cnds-offwhite hover:text-cnds-red transition-colors"
                  >
                    {t('nav.whoWeAre')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/institution#bureau"
                    className="block px-3 py-2 rounded-md text-[13.5px] text-cnds-ink hover:bg-cnds-offwhite hover:text-cnds-red transition-colors"
                  >
                    {t('nav.organ')}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link
                to="/textes-juridiques"
                className={`text-[14px] font-medium py-2 transition-colors ${
                  isActive('/textes-juridiques') ? 'text-cnds-red font-semibold' : 'text-cnds-ink hover:text-cnds-red'
                }`}
              >
                {t('nav.legalTexts')}
              </Link>
            </li>

            {/* Submenu Multimédia */}
            <li className="relative group py-2">
              <Link
                to="/multimedia"
                className={`text-[14px] font-medium inline-flex items-center gap-1 transition-colors ${
                  isActive('/multimedia') ? 'text-cnds-red font-semibold' : 'text-cnds-ink hover:text-cnds-red'
                }`}
              >
                <span>{t('nav.multimedia')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-cnds-ink-soft group-hover:text-cnds-red transition-transform group-hover:rotate-180" />
              </Link>
              <ul className="hidden group-hover:block absolute top-full left-0 bg-cnds-white border border-cnds-line rounded-lg p-2 min-w-[210px] shadow-xl z-50">
                <li>
                  <Link
                    to="/multimedia?tab=dialogue"
                    className="block px-3 py-2 rounded-md text-[13.5px] text-cnds-ink hover:bg-cnds-offwhite hover:text-cnds-red transition-colors"
                  >
                    {t('nav.dialogue')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/multimedia?tab=rapports"
                    className="block px-3 py-2 rounded-md text-[13.5px] text-cnds-ink hover:bg-cnds-offwhite hover:text-cnds-red transition-colors"
                  >
                    {t('nav.reports')}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link
                to="/actualites"
                className={`text-[14px] font-medium py-2 transition-colors ${
                  isActive('/actualites') ? 'text-cnds-red font-semibold' : 'text-cnds-ink hover:text-cnds-red'
                }`}
              >
                {t('nav.news')}
              </Link>
            </li>

            <li>
              <Link
                to="/galerie"
                className={`text-[14px] font-medium py-2 transition-colors ${
                  isActive('/galerie') ? 'text-cnds-red font-semibold' : 'text-cnds-ink hover:text-cnds-red'
                }`}
              >
                {t('nav.gallery')}
              </Link>
            </li>

            <li>
              <Link
                to="/partenaires"
                className={`text-[14px] font-medium py-2 transition-colors ${
                  isActive('/partenaires') ? 'text-cnds-red font-semibold' : 'text-cnds-ink hover:text-cnds-red'
                }`}
              >
                {t('nav.partners')}
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className={`text-[14px] font-medium py-2 transition-colors ${
                  isActive('/contact') ? 'text-cnds-red font-semibold' : 'text-cnds-ink hover:text-cnds-red'
                }`}
              >
                {t('nav.contact')}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right Section: Language Selector Dropdown */}
        <div className="flex items-center gap-3">
          <LanguageSelector />

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-cnds-ink hover:bg-cnds-offwhite rounded-md"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cnds-white border-b border-cnds-line px-6 py-4 space-y-3">
          {/* Mobile language switch with flag colors */}
          <div className="pb-3 border-b border-cnds-line">
            <LanguageSelector isMobile={true} />
          </div>

          <Link to="/" className="block text-sm font-medium py-2 text-cnds-ink hover:text-cnds-red">
            {t('nav.home')}
          </Link>
          <div className="pl-3 border-l-2 border-cnds-line space-y-2">
            <Link to="/institution" className="block text-sm font-medium text-cnds-ink">
              {t('nav.institution')}
            </Link>
            <Link to="/institution#apropos" className="block text-xs text-cnds-ink-soft hover:text-cnds-red">
              — {t('nav.whoWeAre')}
            </Link>
            <Link to="/institution#bureau" className="block text-xs text-cnds-ink-soft hover:text-cnds-red">
              — {t('nav.organ')}
            </Link>
          </div>
          <Link to="/textes-juridiques" className="block text-sm font-medium py-2 text-cnds-ink hover:text-cnds-red">
            {t('nav.legalTexts')}
          </Link>
          <div className="pl-3 border-l-2 border-cnds-line space-y-2">
            <Link to="/multimedia" className="block text-sm font-medium text-cnds-ink">
              {t('nav.multimedia')}
            </Link>
            <Link to="/multimedia?tab=dialogue" className="block text-xs text-cnds-ink-soft hover:text-cnds-red">
              — {t('nav.dialogue')}
            </Link>
            <Link to="/multimedia?tab=rapports" className="block text-xs text-cnds-ink-soft hover:text-cnds-red">
              — {t('nav.reports')}
            </Link>
          </div>
          <Link to="/actualites" className="block text-sm font-medium py-2 text-cnds-ink hover:text-cnds-red">
            {t('nav.news')}
          </Link>
          <Link to="/galerie" className="block text-sm font-medium py-2 text-cnds-ink hover:text-cnds-red">
            {t('nav.gallery')}
          </Link>
          <Link to="/partenaires" className="block text-sm font-medium py-2 text-cnds-ink hover:text-cnds-red">
            {t('nav.partners')}
          </Link>
          <Link to="/contact" className="block text-sm font-medium py-2 text-cnds-ink hover:text-cnds-red">
            {t('nav.contact')}
          </Link>
        </div>
      )}
    </header>
  );
};
