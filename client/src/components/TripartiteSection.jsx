import React from 'react';
import { Landmark, Briefcase, Users, Scale } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TripartiteSection = () => {
  const { t } = useLanguage();

  const cards = [
    {
      id: 'gov',
      title: t('tripartite.govTitle'),
      count: t('tripartite.govCount'),
      description: t('tripartite.govDesc'),
      icon: Landmark,
      accentColor: 'border-cnds-gold',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      iconColor: 'text-cnds-gold',
    },
    {
      id: 'emp',
      title: t('tripartite.empTitle'),
      count: t('tripartite.empCount'),
      description: t('tripartite.empDesc'),
      icon: Briefcase,
      accentColor: 'border-cnds-green',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconColor: 'text-cnds-green',
    },
    {
      id: 'tra',
      title: t('tripartite.traTitle'),
      count: t('tripartite.traCount'),
      description: t('tripartite.traDesc'),
      icon: Users,
      accentColor: 'border-cnds-red',
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
      iconColor: 'text-cnds-red',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-cnds-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cnds-offwhite border border-cnds-line text-cnds-ink-soft mb-3">
            <span className="w-2 h-2 rounded-full bg-cnds-gold"></span>
            {t('tripartite.badge')}
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-cnds-ink mb-4">
            {t('tripartite.title')}
          </h2>
          <p className="text-sm sm:text-base text-cnds-ink-soft leading-relaxed">
            {t('tripartite.subtitle')}
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`bg-cnds-white rounded-xl border border-cnds-line p-8 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden flex flex-col justify-between border-t-4 ${card.accentColor}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-lg bg-cnds-offwhite flex items-center justify-center border border-cnds-line">
                      <Icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${card.badgeColor}`}>
                      {card.count}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-cnds-ink mb-3">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-cnds-ink-soft leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-cnds-line flex items-center justify-between text-xs text-cnds-ink-soft">
                  <span>{t('tripartite.parityCollege')}</span>
                  <span className="font-semibold text-cnds-ink">{t('tripartite.oneThirdVotes')}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Independent Presidency banner */}
        <div className="mt-10 bg-cnds-offwhite rounded-xl border border-cnds-line p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cnds-white border border-cnds-gold/60 flex items-center justify-center shrink-0 shadow-sm">
              <Scale className="w-6 h-6 text-cnds-gold" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-cnds-ink">{t('tripartite.independentPresidency')}</h4>
              <p className="text-xs text-cnds-ink-soft">{t('tripartite.independent')}</p>
            </div>
          </div>
          <div className="shrink-0 text-xs font-bold uppercase tracking-wider text-cnds-gold bg-cnds-white px-4 py-2 rounded-lg border border-cnds-gold/30">
            {t('tripartite.totalMembers')}
          </div>
        </div>

      </div>
    </section>
  );
};
