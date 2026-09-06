import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api/client';

export const Institution = () => {
  const { lang, t } = useLanguage();
  const location = useLocation();
  const [boardMembers, setBoardMembers] = useState([]);
  const [activeTab, setActiveTab] = useState('qui-sommes-nous');

  useEffect(() => {
    if (location.hash === '#bureau' || location.hash === '#organe') {
      setActiveTab('bureau');
    } else {
      setActiveTab('qui-sommes-nous');
    }
  }, [location.hash]);

  useEffect(() => {
    api.getBoardMembers()
      .then((data) => {
        if (data.members && data.members.length > 0) {
          setBoardMembers(data.members);
        }
      })
      .catch(() => {
        setBoardMembers([
          {
            id: 1,
            initials: 'SN',
            full_name: 'NTIBANTUNGANYA Sylvestre',
            role_title_fr: 'Président du CNDS',
            role_title_rn: 'Umukuru wa CNDS',
            role_title_en: 'President of CNDS',
            photo_url: '/images/bureau/sylvestre_ntibantunganya.jpg',
            bio_fr: 'Ancien Président de la République du Burundi, nommé par Décret N° 238 du 12 octobre 2021 pour présider et animer les travaux du Conseil.',
            bio_rn: 'Yahoze arongoye Republika y\'Uburundi, yagenwe n\'Itegeko N° 238 ryo kuwa 12 Gitugutu 2021 ngo ayobore inama zose za CNDS mu bwigenge busesuye.',
            bio_en: 'Former President of the Republic of Burundi, appointed by Decree No. 238 of October 12, 2021, to chair and lead the Council in full independence.'
          },
          {
            id: 2,
            initials: 'CN',
            full_name: 'Céléstin NSAVYIMANA',
            role_title_fr: 'Vice-président — Travailleurs',
            role_title_rn: 'Icyegera c\'Umukuru — Abakozi',
            role_title_en: 'Vice President — Workers',
            photo_url: '/images/bureau/celestin_nsavyimana.jpg',
            bio_fr: 'Représentant du collège des syndicats et confédérations des travailleurs burundais.',
            bio_rn: 'Uwaserukiye uruhande rw\'amasendika n\'abakozi mu gukingira agateka n\'iterambere ry\'abakozi.',
            bio_en: 'Representative of the trade unions and workers’ federations college of Burundi.'
          },
          {
            id: 3,
            initials: 'TK',
            full_name: 'Théodore KAMWENUBUSA',
            role_title_fr: 'Vice-président — Employeurs',
            role_title_rn: 'Icyegera c\'Umukuru — Abakoresha',
            role_title_en: 'Vice President — Employers',
            photo_url: '/images/bureau/theodore_kamwenubusa.jpg',
            bio_fr: 'Représentant de l\'Association des Employeurs du Burundi (AEB/ANEB).',
            bio_rn: 'Uwaserukiye ishirahamwe ry\'abakoresha mu Burundi (AEB/ANEB) ku bw\'ubutunzi n\'iterambere ry\'akazi.',
            bio_en: 'Representative of the Association of Employers of Burundi (AEB/ANEB).'
          },
          {
            id: 4,
            initials: 'EN',
            full_name: 'Emmanuel Ngomirakiza',
            role_title_fr: 'Représentant du gouvernement',
            role_title_rn: 'Uwaserukiye Leta',
            role_title_en: 'Government Representative',
            photo_url: '/images/bureau/emmanuel_ngomirakiza.jpg',
            bio_fr: 'Représentant des ministères en charge du travail, de la fonction publique et des finances.',
            bio_rn: 'Uwaserukiye Leta n\'Ubushikiranganji bujejwe akazi, ubutunzi hamwe n\'abakozi ba Leta.',
            bio_en: 'Representative of the ministries in charge of labor, civil service, and finance.'
          },
          {
            id: 5,
            initials: 'MA',
            full_name: 'MBONABUCA Athanase',
            role_title_fr: 'Secrétaire Exécutif Permanent',
            role_title_rn: 'Umunyamabanga Nshingwabikorwa',
            role_title_en: 'Permanent Executive Secretary',
            photo_url: '/images/bureau/athanase_mbonabuca.jpg',
            bio_fr: 'Direction des services administratifs, techniques et opérationnels du CNDS.',
            bio_rn: 'Ayobora ibiro bijejwe ubutegetsi, ubuhinga hamwe n\'ibikorwa bya buri munsi bya CNDS.',
            bio_en: 'Directing the administrative, technical, and day-to-day operational services of the CNDS.'
          },
        ]);
      });
  }, []);

  return (
    <div className="py-16 md:py-20 bg-cnds-white">
      <div className="wrap">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 mb-12 border-b border-cnds-line pb-4">
          <button
            onClick={() => setActiveTab('qui-sommes-nous')}
            className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
              activeTab === 'qui-sommes-nous'
                ? 'border-cnds-red text-cnds-red'
                : 'border-transparent text-cnds-ink-soft hover:text-cnds-ink'
            }`}
          >
            {t('nav.whoWeAre')}
          </button>
          <button
            onClick={() => setActiveTab('bureau')}
            className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
              activeTab === 'bureau'
                ? 'border-cnds-red text-cnds-red'
                : 'border-transparent text-cnds-ink-soft hover:text-cnds-ink'
            }`}
          >
            {t('nav.organ')}
          </button>
        </div>

        {/* TAB 1: QUI SOMMES NOUS & HISTORIQUE */}
        {activeTab === 'qui-sommes-nous' && (
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-14 items-start animate-rise">
            <div>
              <div className="section-head" style={{ marginBottom: '24px' }}>
                <div className="kicker">{t('about.kicker')}</div>
                <h2>{t('about.title')}</h2>
              </div>
              <p className="text-[15px] text-cnds-ink-soft mb-4 leading-relaxed">
                {t('about.p1')}
              </p>
              <p className="text-[15px] text-cnds-ink-soft mb-6 leading-relaxed">
                {t('about.p2')}
              </p>

              <div className="bg-cnds-offwhite border border-cnds-line rounded-[14px] p-6 space-y-3">
                <span className="text-[12.5px] font-semibold text-cnds-green uppercase tracking-wider block">
                  {t('about.visionBadge')}
                </span>
                <p className="font-serif italic text-[15px] text-cnds-ink leading-relaxed">
                  {t('about.visionText')}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <div className="section-head" style={{ marginBottom: '24px' }}>
                <div className="kicker" style={{ color: 'var(--gold)' }}>{t('timeline.kicker')}</div>
                <h2>{t('timeline.title')}</h2>
              </div>

              <div className="border-l-2 border-cnds-line pl-6 space-y-6">
                <div className="timeline-item">
                  <div className="font-serif font-semibold text-cnds-red text-[15px] mb-1">
                    {t('timeline.date1Title')}
                  </div>
                  <p className="text-[13.5px] text-cnds-ink-soft leading-relaxed">
                    {t('timeline.date1Desc')}
                  </p>
                </div>

                <div className="timeline-item">
                  <div className="font-serif font-semibold text-cnds-red text-[15px] mb-1">
                    {t('timeline.date2Title')}
                  </div>
                  <p className="text-[13.5px] text-cnds-ink-soft leading-relaxed">
                    {t('timeline.date2Desc')}
                  </p>
                </div>

                <div className="timeline-item">
                  <div className="font-serif font-semibold text-cnds-red text-[15px] mb-1">
                    {t('timeline.date3Title')}
                  </div>
                  <p className="text-[13.5px] text-cnds-ink-soft leading-relaxed">
                    {t('timeline.date3Desc')}
                  </p>
                </div>

                <div className="timeline-item">
                  <div className="font-serif font-semibold text-cnds-red text-[15px] mb-1">
                    {t('timeline.date4Title')}
                  </div>
                  <p className="text-[13.5px] text-cnds-ink-soft leading-relaxed">
                    {t('timeline.date4Desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORGANE & BUREAU */}
        {activeTab === 'bureau' && (
          <div className="space-y-14 animate-rise">
            <div>
              <div className="section-head" style={{ marginBottom: '32px' }}>
                <div className="kicker">{t('bureau.kicker')}</div>
                <h2>{t('bureau.title')}</h2>
                <p>{t('bureau.subtitle')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {boardMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-cnds-white border border-cnds-line rounded-[16px] p-5 sm:p-6 text-left hover:border-cnds-gold/70 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-full aspect-[4/5] rounded-[12px] overflow-hidden mb-5 border border-cnds-line bg-[#EFECE6] relative shadow-xs">
                        {member.photo_url ? (
                          <img
                            src={member.photo_url}
                            alt={member.full_name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-serif text-3xl font-bold text-cnds-ink-soft/40">
                            {member.initials || (member.full_name ? member.full_name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'CNDS')}
                          </div>
                        )}
                      </div>
                      <h3 className="text-[17px] font-semibold text-cnds-ink mb-1 font-sans leading-snug group-hover:text-cnds-red transition-colors">
                        {member.full_name}
                      </h3>
                      <div className="text-[13.5px] font-semibold text-cnds-red mb-3">
                        {lang === 'en' && member.role_title_en ? member.role_title_en : (lang === 'rn' && member.role_title_rn ? member.role_title_rn : member.role_title_fr)}
                      </div>
                    </div>
                    <p className="text-[13.5px] text-cnds-ink-soft leading-relaxed mt-2 border-t border-cnds-line/60 pt-3">
                      {lang === 'en' && member.bio_en ? member.bio_en : (lang === 'rn' && member.bio_rn ? member.bio_rn : member.bio_fr)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 Organes Summary */}
            <div className="border-t border-cnds-line pt-12">
              <div className="section-head" style={{ marginBottom: '28px' }}>
                <div className="kicker" style={{ color: 'var(--ink)' }}>{t('bureau.organsKicker')}</div>
                <h2>{t('bureau.organsTitle')}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="border border-cnds-line rounded-[12px] p-5">
                  <h4 className="font-serif font-semibold text-[16px] mb-2 text-cnds-ink">{t('bureau.organ1')}</h4>
                  <p className="text-[13px] text-cnds-ink-soft leading-relaxed">{t('bureau.organ1Desc')}</p>
                </div>
                <div className="border border-cnds-line rounded-[12px] p-5">
                  <h4 className="font-serif font-semibold text-[16px] mb-2 text-cnds-ink">{t('bureau.organ2')}</h4>
                  <p className="text-[13px] text-cnds-ink-soft leading-relaxed">{t('bureau.organ2Desc')}</p>
                </div>
                <div className="border border-cnds-line rounded-[12px] p-5">
                  <h4 className="font-serif font-semibold text-[16px] mb-2 text-cnds-ink">{t('bureau.organ3')}</h4>
                  <p className="text-[13px] text-cnds-ink-soft leading-relaxed">{t('bureau.organ3Desc')}</p>
                </div>
                <div className="border border-cnds-line rounded-[12px] p-5">
                  <h4 className="font-serif font-semibold text-[16px] mb-2 text-cnds-ink">{t('bureau.organ4')}</h4>
                  <p className="text-[13px] text-cnds-ink-soft leading-relaxed">{t('bureau.organ4Desc')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
