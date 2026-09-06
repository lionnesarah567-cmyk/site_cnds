import React, { useState, useEffect } from 'react';
import { Download, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api/client';

export const LegalTexts = () => {
  const { lang, t } = useLanguage();
  const [texts, setTexts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.getLegalTexts()
      .then((data) => {
        if (data.texts && data.texts.length > 0) {
          setTexts(data.texts);
        }
      })
      .catch(() => {
        setTexts([
          {
            id: 1,
            decree_number: 'Charte 2011',
            title_fr: 'Charte Nationale de Dialogue Social du Burundi',
            title_rn: 'Amasezerano Nshingiro y\'Ibiganiro mu Bakozi mu Burundi',
            title_en: 'National Charter for Social Dialogue of Burundi',
            date_promulgated: '2011-05-25',
            summary_fr: 'Signée à Gitega par le Gouvernement, l\'Association des Employeurs du Burundi (AEB) et les confédérations syndicales (COSYBU et CSB).',
            summary_rn: 'Yashyizweko umukono i Gitega na Leta, Ishirahamwe ry\'Abakoresha (AEB) hamwe n\'amasendika y\'abakozi (COSYBU na CSB).',
            summary_en: 'Signed in Gitega by the Government, the Association of Employers of Burundi (AEB), and trade union confederations (COSYBU and CSB).',
            file_url: '#',
            file_size: '1.4 MB',
          },
          {
            id: 2,
            decree_number: 'Décret N° 100/132',
            title_fr: 'Décret N° 100/132 portant révision du Décret N° 100/47',
            title_rn: 'Itegeko N° 100/132 rihindura Itegeko N° 100/47 rishyiraho CNDS',
            title_en: 'Decree No. 100/132 revising Decree No. 100/47',
            date_promulgated: '2013-05-21',
            summary_fr: 'Texte fondateur révisé fixant la structure tripartite, l\'autonomie administrative et l\'autorité financière du CNDS.',
            summary_rn: 'Itegeko rikomeza ubwigenge, imiterere n\'ubushobozi bwa CNDS mu gihugu.',
            summary_en: 'Revised founding decree defining the tripartite structure, administrative autonomy, and financial authority of the CNDS.',
            file_url: '#',
            file_size: '2.1 MB',
          },
          {
            id: 3,
            decree_number: 'Décret N° 100/47',
            title_fr: 'Décret N° 100/47 portant création, composition et fonctionnement du CNDS',
            title_rn: 'Itegeko N° 100/47 rishyiraho, rigena abagize n\'imikorere ya CNDS',
            title_en: 'Decree No. 100/47 on creation, composition, and operation of the CNDS',
            date_promulgated: '2012-02-09',
            summary_fr: 'Création initiale du Comité National de Dialogue Social au Burundi.',
            summary_rn: 'Ishirwaho rya mbere rya Komite Nserukiragihugu y\'Ibiganiro mu Bakozi mu Burundi.',
            summary_en: 'Initial creation of the National Committee for Social Dialogue in Burundi.',
            file_url: '#',
            file_size: '1.8 MB',
          },
          {
            id: 4,
            decree_number: 'Décret N° 238',
            title_fr: 'Décret N° 238 portant nomination du Président du CNDS',
            title_rn: 'Itegeko N° 238 rigena Umukuru wa CNDS',
            title_en: 'Decree No. 238 appointing the President of the CNDS',
            date_promulgated: '2021-10-12',
            summary_fr: 'Nomination de S.E. NTIBANTUNGANYA Sylvestre en qualité de Président indépendant du CNDS.',
            summary_rn: 'Itegeko rigena Nyenicubahiro S.E. NTIBANTUNGANYA Sylvestre nk\'Umukuru wigenga wa CNDS.',
            summary_en: 'Appointment of H.E. NTIBANTUNGANYA Sylvestre as independent President of the CNDS.',
            file_url: '#',
            file_size: '850 KB',
          },
          {
            id: 5,
            decree_number: 'Décret N° 239',
            title_fr: 'Décret N° 239 portant nomination des membres du CNDS',
            title_rn: 'Itegeko N° 239 rigena abagize CNDS bose',
            title_en: 'Decree No. 239 appointing the members of the CNDS',
            date_promulgated: '2021-10-12',
            summary_fr: 'Nomination des 21 membres des trois collèges (Gouvernement, Employeurs, Travailleurs).',
            summary_rn: 'Itegeko rigena abanywanyi 21 b\'impande zitatu (Leta, Abakoresha, Abakozi).',
            summary_en: 'Appointment of the 21 members representing the three groups (Government, Employers, Workers).',
            file_url: '#',
            file_size: '1.2 MB',
          },
        ]);
      });
  }, []);

  const filtered = texts.filter((tItem) => {
    const title = lang === 'en' && tItem.title_en ? tItem.title_en : (lang === 'rn' && tItem.title_rn ? tItem.title_rn : tItem.title_fr);
    const summary = lang === 'en' && tItem.summary_en ? tItem.summary_en : (lang === 'rn' && tItem.summary_rn ? tItem.summary_rn : tItem.summary_fr);
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tItem.decree_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="py-16 md:py-20 bg-cnds-white">
      <div className="wrap">
        
        {/* Section Head */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <div className="kicker">{t('legal.kicker')}</div>
            <h2>{t('legal.title')}</h2>
            <p>{t('legal.subtitle')}</p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cnds-ink-soft" />
            <input
              type="text"
              placeholder={t('legal.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-cnds-offwhite rounded-md border border-cnds-line text-xs sm:text-sm focus:border-cnds-ink focus:outline-none"
            />
          </div>
        </div>

        {/* List of Legal Texts */}
        <div className="space-y-4">
          {filtered.map((item) => {
            const itemTitle = lang === 'en' && item.title_en ? item.title_en : (lang === 'rn' && item.title_rn ? item.title_rn : item.title_fr);
            const itemSummary = lang === 'en' && item.summary_en ? item.summary_en : (lang === 'rn' && item.summary_rn ? item.summary_rn : item.summary_fr);
            return (
              <div
                key={item.id}
                className="border border-cnds-line rounded-[14px] p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-cnds-ink transition-colors"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-semibold text-xs text-cnds-red">
                      {item.decree_number}
                    </span>
                    <span className="text-xs text-cnds-ink-soft">
                      {new Date(item.date_promulgated).toLocaleDateString(lang === 'en' ? 'en-US' : (lang === 'rn' ? 'rn-BI' : 'fr-FR'), { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-serif text-[18px] font-semibold text-cnds-ink leading-snug">
                    {itemTitle}
                  </h3>
                  <p className="text-[13.5px] text-cnds-ink-soft leading-relaxed">
                    {itemSummary}
                  </p>
                </div>

                <div className="shrink-0">
                  <a
                    href={item.file_url}
                    onClick={(e) => {
                      if (item.file_url === '#') {
                        e.preventDefault();
                        const msg = lang === 'en'
                          ? `Official document ${item.decree_number}: available from the CNDS Permanent Secretariat.`
                          : (lang === 'rn'
                            ? `Inyandiko y'amategeko ${item.decree_number} : ushobora kuyisaba mu bunyamabanga bwa CNDS.`
                            : `Document officiel ${item.decree_number} : disponible auprès du Secrétariat Permanent du CNDS.`);
                        alert(msg);
                      }
                    }}
                    className="btn btn-secondary text-xs uppercase tracking-wider font-semibold"
                  >
                    <Download className="w-3.5 h-3.5 text-cnds-green" />
                    <span>{t('legal.download')}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
