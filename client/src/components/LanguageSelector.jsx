import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageSelector = ({ isMobile = false }) => {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    {
      code: 'rn',
      label: 'Ikirundi',
      short: 'RN',
      sublabel: 'Burundi',
      flag: '🇧🇮',
      flagColors: ['#1A7F3C', '#FFFFFF', '#CE1126'], // Vert, Blanc, Rouge (Drapeau du Burundi)
      activeBadge: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    },
    {
      code: 'fr',
      label: 'Français',
      short: 'FR',
      sublabel: 'Officiel',
      flag: '🇫🇷',
      flagColors: ['#002654', '#FFFFFF', '#CE1126'], // Bleu, Blanc, Rouge
      activeBadge: 'bg-blue-50 text-blue-800 border-blue-300',
    },
    {
      code: 'en',
      label: 'English',
      short: 'EN',
      sublabel: 'International',
      flag: '🇬🇧',
      flagColors: ['#012169', '#FFFFFF', '#C8102E'], // Bleu, Blanc, Rouge
      activeBadge: 'bg-rose-50 text-rose-800 border-rose-300',
    },
  ];

  const activeLang = languages.find((l) => l.code === lang) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    setLang(code);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <div className="w-full">
        <div className="text-[11px] font-bold uppercase tracking-wider text-cnds-ink-soft mb-2 flex items-center justify-between">
          <span>Langue / Ururimi / Language</span>
          <span className="flex items-center gap-1 text-[12px] font-semibold text-cnds-ink">
            <span>{activeLang.flag}</span>
            <span>{activeLang.label}</span>
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {languages.map((item) => {
            const isSelected = item.code === lang;
            return (
              <button
                key={item.code}
                onClick={() => handleSelect(item.code)}
                className={`relative flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? `${item.activeBadge} shadow-sm border-current`
                    : 'bg-cnds-offwhite text-cnds-ink border-cnds-line hover:bg-cnds-white'
                }`}
              >
                <span className="text-base leading-none">{item.flag}</span>
                <span>{item.short}</span>
                {/* Petit ruban aux couleurs du drapeau */}
                <span
                  className="absolute bottom-1 left-3 right-3 h-[2px] rounded-full overflow-hidden flex"
                  aria-hidden="true"
                >
                  {item.flagColors.map((col, idx) => (
                    <span key={idx} className="flex-1 h-full" style={{ backgroundColor: col }} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Bouton sélecteur principal */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cnds-line bg-cnds-white hover:bg-cnds-offwhite text-cnds-ink text-[13px] font-medium transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-cnds-gold/30"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {/* Drapeau et code */}
        <span className="text-base leading-none">{activeLang.flag}</span>
        <span className="font-semibold text-xs tracking-wider uppercase text-cnds-ink">
          {activeLang.short}
        </span>

        {/* Ruban miniature aux couleurs nationales du drapeau choisi */}
        <span className="w-4 h-2 rounded-[2px] overflow-hidden flex border border-black/10 shadow-2xs">
          {activeLang.flagColors.map((color, idx) => (
            <span key={idx} className="flex-1 h-full" style={{ backgroundColor: color }} />
          ))}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-cnds-ink-soft transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-cnds-red' : 'group-hover:text-cnds-ink'
          }`}
        />
      </button>

      {/* Petite liste déroulante */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl bg-white border border-cnds-line shadow-xl p-1.5 z-50 animate-rise">
          <div className="px-2.5 py-1.5 border-b border-cnds-line/70 mb-1">
            <span className="text-[10px] font-bold tracking-wider uppercase text-cnds-ink-soft">
              Choisir la langue
            </span>
          </div>

          <ul className="space-y-1">
            {languages.map((item) => {
              const isSelected = item.code === lang;
              return (
                <li key={item.code}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item.code)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-all ${
                      isSelected
                        ? `${item.activeBadge} font-bold`
                        : 'text-cnds-ink hover:bg-cnds-offwhite font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg leading-none">{item.flag}</span>
                      <div>
                        <div className="text-[13px] leading-tight flex items-center gap-1.5">
                          <span>{item.label}</span>
                          <span className="text-[10.5px] opacity-70 font-normal">({item.short})</span>
                        </div>
                        {/* Mini bandeau tricolore du drapeau */}
                        <div className="w-8 h-1 rounded-full overflow-hidden flex mt-1">
                          {item.flagColors.map((col, idx) => (
                            <span key={idx} className="flex-1 h-full" style={{ backgroundColor: col }} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-current shrink-0 ml-2" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
