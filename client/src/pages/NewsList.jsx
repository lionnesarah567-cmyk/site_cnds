import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api/client';

export const NewsList = () => {
  const { lang, t } = useLanguage();
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.getNews({ limit: 50 })
      .then((data) => {
        if (data.news && data.news.length > 0) {
          setNews(data.news);
        }
      })
      .catch(() => {
        setNews([
          {
            id: 1,
            slug: 'vulgarisation-de-la-charte-nationale-de-dialogue-social',
            title_fr: 'Vulgarisation de la Charte Nationale de Dialogue Social',
            title_rn: 'Kumenyekanisha Amasezerano Nshingiro y\'Ibiganiro mu Bakozi',
            title_en: 'Dissemination of the National Charter for Social Dialogue',
            summary_fr: 'Campagne de sensibilisation auprès des comités provinciaux et communaux de dialogue social.',
            summary_rn: 'Kumenyekanisha amasezerano nshingiro mu nzego z\'intara n\'amakomine.',
            summary_en: 'Awareness campaign with provincial and municipal committees for social dialogue.',
            published_at: '2024-09-15',
          },
          {
            id: 2,
            slug: 'le-6eme-seminaire-regional-de-linternationale-francophone',
            title_fr: '6ème Séminaire régional de l\'Internationale Francophone de Dialogue Social',
            title_rn: 'Inama Nteguro Mpuzamakungu y\'Ibiganiro mu Bakozi Bakoresha Igifaransa',
            title_en: '6th Regional Seminar of the Francophone International for Social Dialogue',
            summary_fr: 'Le CNDS a pris part aux échanges régionaux sur les mécanismes de dialogue social.',
            summary_rn: 'CNDS yitavye ibiganiro byo mu karere ku bijanye n\'imibano myiza mu kazi.',
            summary_en: 'CNDS took part in regional discussions on social dialogue mechanisms.',
            published_at: '2024-09-08',
          },
          {
            id: 3,
            slug: 'renforcement-des-capacites-comites-provinciaux-gitega-karusi',
            title_fr: 'Atelier de renforcement des capacités des CPDS et CCDS',
            title_rn: 'Uruhande rw\'Inyigisho ku Bakorera mu Nzego z\'Intara n\'Amakomine',
            title_en: 'Capacity Building Workshop for CPDS and CCDS',
            summary_fr: 'Formation des membres des comités provinciaux et communaux de dialogue social.',
            summary_rn: 'Inyigisho zahawe abagize inzego za CNDS mu ntara n\'amakomine.',
            summary_en: 'Training of members of provincial and communal social dialogue committees.',
            published_at: '2024-08-28',
          },
          {
            id: 4,
            slug: 'lancement-officiel-universite-du-burundi-comite-dialogue',
            title_fr: 'Lancement officiel à l\'Université du Burundi du Comité de Dialogue Social',
            title_rn: 'Gushinga ku Mugaragaro Komite y\'Ibiganiro muri Kaminuza y\'Uburundi',
            title_en: 'Official Launch at the University of Burundi of the Social Dialogue Committee',
            summary_fr: 'Mise en place d\'un cadre de concertation tripartite au sein de l\'institution universitaire.',
            summary_rn: 'Gushyiraho urwego rw\'ibiganiro mu bakozi n\'abayobozi ba Kaminuza y\'Uburundi.',
            summary_en: 'Establishment of a tripartite consultation framework within the university.',
            published_at: '2024-07-14',
          },
          {
            id: 5,
            slug: 'assemblee-pleniere-ordinaire-du-cnds-bujumbura',
            title_fr: 'Assemblée Plénière Ordinaire du CNDS : Bilan et Perspectives',
            title_rn: 'Inama Rusangi ya CNDS: Ibyakozwe n\'Imigambi y\'Imbere',
            title_en: 'CNDS Ordinary Plenary Assembly: Review and Perspectives',
            summary_fr: 'Réunion des 27 membres titulaires sous la présidence de S.E. Sylvestre NTIBANTUNGANYA.',
            summary_rn: 'Inama y\'abanywanyi 27 bayobowe na Nyenicubahiro S.E. Sylvestre NTIBANTUNGANYA.',
            summary_en: 'Meeting of the 27 full members chaired by H.E. Sylvestre NTIBANTUNGANYA.',
            published_at: '2024-06-20',
          },
          {
            id: 6,
            slug: 'visite-de-travail-des-partenaires-sociaux-dans-les-provinces-du-nord',
            title_fr: 'Visite de terrain et sensibilisation dans les provinces du Nord',
            title_rn: 'Urugendo rw\'Akazi mu Ntara zo mu Buraruko bw\'Uburundi',
            title_en: 'Field Visit and Sensitization in the Northern Provinces',
            summary_fr: 'Délégation tripartite du CNDS en mission d\'écoute auprès des entreprises et syndicats à Ngozi.',
            summary_rn: 'Intumwa za CNDS ziri mu rugendo rw\'akazi mu mashirahamwe n\'amasendika i Ngozi.',
            summary_en: 'Tripartite CNDS delegation on a consultation mission to companies and trade unions in Ngozi.',
            published_at: '2024-05-18',
          },
        ]);
      });
  }, []);

  const filtered = news.filter((n) => {
    const title = lang === 'en' && n.title_en ? n.title_en : (lang === 'rn' && n.title_rn ? n.title_rn : n.title_fr);
    const summary = lang === 'en' && n.summary_en ? n.summary_en : (lang === 'rn' && n.summary_rn ? n.summary_rn : n.summary_fr);
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="py-16 md:py-20 bg-cnds-white">
      <div className="wrap">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <div className="kicker">{t('newsSection.kicker')}</div>
            <h2>{t('newsSection.allNewsTitle')}</h2>
            <p>{t('newsSection.allNewsSubtitle')}</p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cnds-ink-soft" />
            <input
              type="text"
              placeholder={t('newsSection.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-cnds-offwhite rounded-md border border-cnds-line text-xs sm:text-sm focus:border-cnds-ink focus:outline-none"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => {
            const title = lang === 'en' && item.title_en ? item.title_en : (lang === 'rn' && item.title_rn ? item.title_rn : item.title_fr);
            const summary = lang === 'en' && item.summary_en ? item.summary_en : (lang === 'rn' && item.summary_rn ? item.summary_rn : item.summary_fr);
            return (
              <article key={item.id} className="group">
                <Link to={`/actualites/${item.slug}`}>
                  <div className="aspect-[16/10] rounded-[10px] mb-4 bg-gradient-to-br from-[#F3F1EA] to-[#E9E6DC] overflow-hidden border border-cnds-line">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title_fr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-serif font-semibold text-cnds-gold/40 text-xl">
                        CNDS
                      </div>
                    )}
                  </div>
                  <div className="text-[12px] text-cnds-ink-soft mb-2">
                    {item.published_at ? new Date(item.published_at).toLocaleDateString(lang === 'en' ? 'en-US' : (lang === 'rn' ? 'rn-BI' : 'fr-FR'), { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  </div>
                  <h3 className="text-[16.5px] font-medium text-cnds-ink group-hover:text-cnds-red transition-colors mb-2 leading-snug">
                    {title}
                  </h3>
                  <p className="text-[13.5px] text-cnds-ink-soft leading-relaxed line-clamp-2">
                    {summary}
                  </p>
                </Link>
              </article>
            );
          })}
        </div>

      </div>
    </div>
  );
};
