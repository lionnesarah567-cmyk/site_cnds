import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const NewsCard = ({ item }) => {
  const { lang, t } = useLanguage();

  const title = lang === 'en' && item.title_en ? item.title_en : (lang === 'rn' && item.title_rn ? item.title_rn : item.title_fr);
  const summary = lang === 'en' && item.summary_en ? item.summary_en : (lang === 'rn' && item.summary_rn ? item.summary_rn : item.summary_fr);
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const locale = lang === 'en' ? 'en-US' : (lang === 'rn' ? 'rn-BI' : 'fr-FR');
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <article className="bg-cnds-white rounded-xl border border-cnds-line overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* News Image or Fallback */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-cnds-offwhite border-b border-cnds-line">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cnds-offwhite to-stone-100 text-cnds-ink-soft">
              <span className="font-serif font-bold text-2xl text-cnds-gold/60">CNDS</span>
            </div>
          )}
          {item.category && (
            <span className="absolute top-3 left-3 bg-cnds-white/95 backdrop-blur-sm text-cnds-green border border-cnds-green/30 text-[11px] font-bold px-2.5 py-1 rounded shadow-sm">
              {item.category}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs text-cnds-ink-soft mb-2.5">
            <Calendar className="w-3.5 h-3.5 text-cnds-gold" />
            <span>{formatDate(item.published_at)}</span>
          </div>

          <h3 className="font-serif font-bold text-base sm:text-lg text-cnds-ink group-hover:text-cnds-red transition-colors line-clamp-2 mb-2.5 leading-snug">
            <Link to={`/actualites/${item.slug}`}>
              {title}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-cnds-ink-soft line-clamp-3 leading-relaxed">
            {summary}
          </p>
        </div>
      </div>

      {/* Footer Link */}
      <div className="p-5 sm:p-6 pt-0">
        <Link
          to={`/actualites/${item.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cnds-red hover:text-red-700 transition-colors"
        >
          <span>{t('newsSection.readMore')}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};
