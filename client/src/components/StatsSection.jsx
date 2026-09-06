import React from 'react';
import { Users2, Layers, MapPinned, FileSpreadsheet } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const StatsSection = () => {
  const { t } = useLanguage();

  const stats = [
    {
      id: 'members',
      value: '22',
      label: t('stats.members'),
      subtext: t('stats.membersSub'),
      icon: Users2,
      color: 'text-cnds-gold',
    },
    {
      id: 'colleges',
      value: '3',
      label: t('stats.colleges'),
      subtext: t('stats.collegesSub'),
      icon: Layers,
      color: 'text-cnds-green',
    },
    {
      id: 'provinces',
      value: '18',
      label: t('stats.provinces'),
      subtext: t('stats.provincesSub'),
      icon: MapPinned,
      color: 'text-cnds-red',
    },
    {
      id: 'sessions',
      value: '4+',
      label: t('stats.sessions'),
      subtext: t('stats.sessionsSub'),
      icon: FileSpreadsheet,
      color: 'text-cnds-ink',
    },
  ];

  return (
    <section className="py-14 bg-cnds-offwhite border-y border-cnds-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="bg-cnds-white rounded-xl border border-cnds-line p-6 text-center shadow-sm hover:border-cnds-gold/50 transition-colors"
              >
                <div className="inline-flex p-3 rounded-full bg-cnds-offwhite mb-3 border border-cnds-line">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="font-serif font-bold text-3xl sm:text-4xl text-cnds-ink mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-cnds-ink mb-1">
                  {stat.label}
                </div>
                <div className="text-[11px] text-cnds-ink-soft hidden sm:block">
                  {stat.subtext}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
