import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { api } from '../api/client';
import { useLanguage } from '../context/LanguageContext';

export const Partners = () => {
  const { lang, t } = useLanguage();
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    api.getPartners()
      .then((data) => {
        if (data.partners && data.partners.length > 0) {
          setPartners(data.partners);
        }
      })
      .catch(() => {
        setPartners([
          { 
            id: 1, 
            name: 'Banque Mondiale', 
            category_fr: 'Partenaire Multilatéral',
            category_rn: 'Abafatanyabikorwa Mpuzamakungu',
            category_en: 'Multilateral Partner',
            description_fr: 'Appui aux réformes de gouvernance économique et aux institutions de dialogue social.', 
            description_rn: 'Gushigikira ivugururwa mu micungire y\'ubutunzi n\'inzego z\'ibiganiro mu kazi.',
            description_en: 'Support for economic governance reforms and social dialogue institutions.',
            website_url: 'https://www.worldbank.org' 
          },
          { 
            id: 2, 
            name: 'PNUD Burundi', 
            category_fr: 'Nations Unies', 
            category_rn: 'Ishirahamwe Mpuzamakungu ONU',
            category_en: 'United Nations',
            description_fr: 'Programme des Nations Unies pour le Développement : soutien à la cohésion et à la paix sociale.', 
            description_rn: 'Umugambi w\'Ishirahamwe Mpuzamakungu ONU ku bw\'Iterambere: gushigikira amahoro n\'ubumwe mu gihugu.',
            description_en: 'United Nations Development Programme: supporting cohesion and social peace.',
            website_url: 'https://www.undp.org/burundi' 
          },
          { 
            id: 3, 
            name: 'OIT (Organisation Internationale du Travail)', 
            category_fr: 'Nations Unies', 
            category_rn: 'Ishirahamwe Mpuzamakungu ry\'Akazi',
            category_en: 'United Nations',
            description_fr: 'Promotion du tripartisme, du travail décent et renforcement des capacités institutionnelles.', 
            description_rn: 'Guteza imbere imikoranire y\'impande zitatu, akazi gateye iteka no gukomeza inzego.',
            description_en: 'Promotion of tripartism, decent work, and institutional capacity building.',
            website_url: 'https://www.ilo.org' 
          },
          { 
            id: 4, 
            name: 'COSYBU', 
            category_fr: 'Syndicats — Travailleurs', 
            category_rn: 'Amashirahamwe y\'Abakozi',
            category_en: 'Trade Unions — Workers',
            description_fr: 'Confédération des Syndicats du Burundi représentant les travailleurs burundais au CNDS.', 
            description_rn: 'Ishirahamwe rikuru ry\'amasendika y\'abakozi mu Burundi rihagarariye abakozi muri CNDS.',
            description_en: 'Burundi Trade Union Confederation representing Burundian workers at CNDS.',
            website_url: '#' 
          },
          { 
            id: 5, 
            name: 'ANEB / AEB', 
            category_fr: 'Patronat — Employeurs', 
            category_rn: 'Ishirahamwe ry\'Abakoresha',
            category_en: 'Employers — Private Sector',
            description_fr: 'Association des Employeurs du Burundi représentant les chefs d\'entreprises au conseil.', 
            description_rn: 'Ishirahamwe ry\'abakoresha mu Burundi rihagarariye abakoresha n\'abanyamahoteli mu nama.',
            description_en: 'Association of Employers of Burundi representing enterprise leadership at the council.',
            website_url: '#' 
          },
          { 
            id: 6, 
            name: 'VNG International', 
            category_fr: 'Coopération Décentralisée', 
            category_rn: 'Ubufatanye bw\'Inzego zo Hasi',
            category_en: 'Decentralized Cooperation',
            description_fr: 'Appui à la gouvernance locale et aux comités de dialogue social provinciaux.', 
            description_rn: 'Gushigikira intwaro ibereye n\'utugwi tw\'ibiganiro mu kazi mu ntara.',
            description_en: 'Support for local governance and provincial social dialogue committees.',
            website_url: 'https://www.vng-international.nl' 
          },
        ]);
      });
  }, []);

  return (
    <div className="py-16 md:py-20 bg-cnds-white">
      <div className="wrap">
        <div className="section-head">
          <div className="kicker">{t('partners.kicker')}</div>
          <h2>{t('partners.title')}</h2>
          <p>{t('partners.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partners.map((p) => (
            <div key={p.id} className="border border-cnds-line rounded-[14px] p-7 bg-cnds-white flex flex-col justify-between hover:border-cnds-gold transition-colors">
              <div>
                <span className="text-[12px] font-semibold text-cnds-green uppercase tracking-wider block mb-2">
                  {lang === 'en' && p.category_en ? p.category_en : (lang === 'rn' && p.category_rn ? p.category_rn : (p.category_fr || p.category))}
                </span>
                <h3 className="font-serif text-[19px] font-semibold text-cnds-ink mb-3">
                  {p.name}
                </h3>
                <p className="text-[13.5px] text-cnds-ink-soft leading-relaxed mb-6">
                  {lang === 'en' && p.description_en ? p.description_en : (lang === 'rn' && p.description_rn ? p.description_rn : p.description_fr)}
                </p>
              </div>

              {p.website_url && p.website_url !== '#' && (
                <a
                  href={p.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-cnds-ink hover:text-cnds-red inline-flex items-center gap-1 transition-colors"
                >
                  <span>{t('partners.visit')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
