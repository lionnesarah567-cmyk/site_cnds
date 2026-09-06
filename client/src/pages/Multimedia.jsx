import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Play, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api/client';

export const Multimedia = () => {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'rapports' ? 'rapports' : 'dialogue';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'rapports' || tabParam === 'dialogue') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    api.getMultimedia(activeTab === 'rapports' ? 'report' : 'video')
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setMediaList(data.items);
        }
      })
      .catch(() => {
        if (activeTab === 'dialogue') {
          setMediaList([
            {
              id: 1,
              title_fr: 'Émission Spéciale : Le Rôle du CNDS dans la Stabilité Professionnelle',
              title_rn: 'Ikiganiro Idasanzwe: Uruhare rwa CNDS mu Gukomeza Amahoro mu Kazi',
              description_fr: 'Table ronde réunissant employeurs et syndicats sur les mécanismes de conciliation préventive.',
              description_rn: 'Ibiganiro ku meza amwe bihuza abakoresha n\'abakozi ku masezerano n\'ubwumvikane mu kazi.',
              url: 'https://www.youtube.com',
              date_published: '2024-09-01',
            },
            {
              id: 2,
              title_fr: 'Séminaire Régional Francophone du Dialogue Social à Bujumbura',
              title_rn: 'Inama Mpuzamakungu y\'Ibiganiro mu Bakozi Bakoresha Igifaransa i Bujumbura',
              description_fr: 'Synthèse des travaux et allocutions des délégations tripartites francophones.',
              description_rn: 'Incamake y\'ibyakozwe n\'amajambo y\'intumwa z\'ibihugu bikoresha igifaransa.',
              url: 'https://www.youtube.com',
              date_published: '2024-07-20',
            },
            {
              id: 3,
              title_fr: 'Comprendre la Charte Nationale de Dialogue Social',
              title_rn: 'Gusobanukirwa Amasezerano Nshingiro y\'Ibiganiro mu Bakozi',
              description_fr: 'Capsule informative sur les droits et devoirs des acteurs sociaux.',
              description_rn: 'Inyigisho z\'ingenzi ku burenganzira n\'inshingano by\'abakozi n\'abakoresha.',
              url: 'https://www.youtube.com',
              date_published: '2024-05-12',
            },
          ]);
        } else {
          setMediaList([
            {
              id: 101,
              title_fr: 'Rapport Annuel d\'Activités du CNDS — 2023-2024',
              title_rn: 'Raporo y\'Umwaka y\'Ibikorwa bya CNDS — 2023-2024',
              description_fr: 'Bilan complet des médiations, sessions plénières et études réalisées.',
              description_rn: 'Incamake yuzuye y\'inama, ibikorwa by\'ubuhuza n\'inyigo zose zakozwe.',
              date_published: '2024-06-30',
              file_size: '4.8 MB',
            },
            {
              id: 102,
              title_fr: 'Rapport d\'Évaluation sur l\'État du Dialogue Social au Burundi',
              title_rn: 'Raporo yo Gusuzuma Uko Ibiganiro mu Kazi Byifashe mu Burundi',
              description_fr: 'Étude d\'impact menée avec l\'appui de l\'OIT et du PNUD.',
              description_rn: 'Inyigo yakozwe ifashijwe n\'amashirahamwe mpuzamakungu OIT na PNUD.',
              date_published: '2023-12-15',
              file_size: '3.2 MB',
            },
            {
              id: 103,
              title_fr: 'Guide Pratique de Prévention et Gestion des Conflits',
              title_rn: 'Igitabo Ngenderwako mu Kwirinda no Gukemura Impari mu Kazi',
              description_fr: 'Manuel méthodologique destiné aux Comités Provinciaux (CPDS).',
              description_rn: 'Igitabo c\'ubuhanga cagenewe inzego za CNDS mu ntara (CPDS).',
              date_published: '2023-08-20',
              file_size: '2.5 MB',
            },
          ]);
        }
      });
  }, [activeTab]);

  return (
    <div className="py-16 md:py-20 bg-cnds-white">
      <div className="wrap">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 mb-12 border-b border-cnds-line pb-4">
          <button
            onClick={() => handleTabChange('dialogue')}
            className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
              activeTab === 'dialogue'
                ? 'border-cnds-red text-cnds-red'
                : 'border-transparent text-cnds-ink-soft hover:text-cnds-ink'
            }`}
          >
            {t('multimedia.tabVideos')}
          </button>
          <button
            onClick={() => handleTabChange('rapports')}
            className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
              activeTab === 'rapports'
                ? 'border-cnds-red text-cnds-red'
                : 'border-transparent text-cnds-ink-soft hover:text-cnds-ink'
            }`}
          >
            {t('multimedia.tabReports')}
          </button>
        </div>

        {/* VIDEOS TAB */}
        {activeTab === 'dialogue' && (
          <div>
            <div className="section-head">
              <div className="kicker">{t('multimedia.videosKicker')}</div>
              <h2>{t('multimedia.videosTitle')}</h2>
              <p>{t('multimedia.videosSubtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {mediaList.map((item) => {
                const title = lang === 'rn' && item.title_rn ? item.title_rn : item.title_fr;
                const desc = lang === 'rn' && item.description_rn ? item.description_rn : item.description_fr;
                return (
                  <div key={item.id} className="border border-cnds-line rounded-[14px] p-6 bg-cnds-offwhite flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-full bg-cnds-red text-white flex items-center justify-center mb-4">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                      <div className="text-xs text-cnds-ink-soft mb-2">
                        {new Date(item.date_published).toLocaleDateString(lang === 'rn' ? 'rn-BI' : 'fr-FR', { month: 'long', year: 'numeric' })}
                      </div>
                      <h3 className="font-serif text-[17px] font-semibold text-cnds-ink mb-2 leading-snug">
                        {title}
                      </h3>
                      <p className="text-[13px] text-cnds-ink-soft leading-relaxed mb-6">
                        {desc}
                      </p>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-cnds-red hover:underline inline-flex items-center gap-1"
                    >
                      <span>{t('multimedia.watch')}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'rapports' && (
          <div>
            <div className="section-head">
              <div className="kicker" style={{ color: 'var(--gold)' }}>{t('multimedia.reportsKicker')}</div>
              <h2>{t('multimedia.reportsTitle')}</h2>
              <p>{t('multimedia.reportsSubtitle')}</p>
            </div>

            <div className="space-y-4">
              {mediaList.map((rep) => {
                const title = lang === 'rn' && rep.title_rn ? rep.title_rn : rep.title_fr;
                const desc = lang === 'rn' && rep.description_rn ? rep.description_rn : rep.description_fr;
                return (
                  <div key={rep.id} className="border border-cnds-line rounded-[14px] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-cnds-gold transition-colors">
                    <div className="space-y-1.5">
                      <div className="text-xs text-cnds-ink-soft">
                        {new Date(rep.date_published).toLocaleDateString(lang === 'rn' ? 'rn-BI' : 'fr-FR', { month: 'long', year: 'numeric' })}
                      </div>
                      <h3 className="font-serif text-[18px] font-semibold text-cnds-ink">
                        {title}
                      </h3>
                      <p className="text-[13.5px] text-cnds-ink-soft leading-relaxed max-w-2xl">
                        {desc}
                      </p>
                    </div>
                    <button
                      onClick={() => alert(lang === 'rn' ? `Gukuramo raporo : ${title}` : `Téléchargement officiel de : ${title}`)}
                      className="btn btn-secondary text-xs uppercase tracking-wider font-semibold shrink-0"
                    >
                      <Download className="w-3.5 h-3.5 text-cnds-gold" />
                      <span>{t('multimedia.download')}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
