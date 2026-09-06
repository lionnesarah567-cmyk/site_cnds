import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api/client';

export const NewsDetail = () => {
  const { slug } = useParams();
  const { lang, t } = useLanguage();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getNewsBySlug(slug)
      .then((data) => {
        if (data.news) {
          setArticle(data.news);
        }
      })
      .catch(() => {
        setArticle({
          id: 1,
          slug,
          title_fr: 'Vulgarisation de la Charte Nationale de Dialogue Social',
          title_rn: 'Kumenyekanisha Amasezerano Nshingiro y\'Ibiganiro mu Bakozi',
          title_en: 'Dissemination of the National Charter for Social Dialogue',
          content_fr: `
            <p>La Charte Nationale de Dialogue Social, signée à Gitega le 25 mai 2011 entre le Gouvernement du Burundi, l'Association des Employeurs du Burundi (AEB) et les organisations syndicales de travailleurs (COSYBU et CSB), demeure la pierre angulaire des relations professionnelles en République du Burundi.</p>
            <p>Cette charte nationale apporte une innovation institutionnelle de taille en préconisant la création d'un organe permanent, autonome et tripartite : le Comité National de Dialogue Social (CNDS).</p>
            <h3>Une vision partagée pour la paix sociale</h3>
            <p>Le dialogue social est un levier fondamental pour le développement économique et la cohésion nationale. En offrant un espace structuré de médiation, de négociation et de conciliation, le CNDS permet d'anticiper les tensions, de prévenir les grèves préjudiciables à la production et de garantir le respect des droits et devoirs de chaque partie.</p>
          `,
          content_rn: `
            <p>Amasezerano Nshingiro y'Ibiganiro mu Bakozi, yashyizweko umukono i Gitega kuwa 25 Rusama 2011 hagati ya Leta y'Uburundi, Ishirahamwe ry'Abakoresha (AEB) hamwe n'amasendika y'abakozi (COSYBU na CSB), ni inkingi ikomeye y'amahoro mu kazi mu gihugu cacu.</p>
            <p>Ayo masezerano yateguye ishingwa ry'urwego ruhoraho, rwigenga kandi rw'impande zitatu: Komite Nserukiragihugu y'Ibiganiro mu Bakozi (CNDS).</p>
            <h3>Intumbero isangiwe ku bw'amahoro arama mu kazi</h3>
            <p>Ibiganiro mu bakozi ni uburyo bukomeye bwo guteza imbere ubutunzi n'ubumwe bw'abenegihugu. Biciye mu bwumvikane no mu nama zihoraho, CNDS ituma habaho gutorera inyishu ibibazo kare, kwirinda imyigaragamvyo no kwubahiriza agateka ka buri wese mu kazi.</p>
          `,
          content_en: `
            <p>The National Charter for Social Dialogue, signed in Gitega on May 25, 2011, between the Government of Burundi, the Association of Employers of Burundi (AEB), and the trade union confederations (COSYBU and CSB), remains the cornerstone of professional relations in the Republic of Burundi.</p>
            <p>This national charter introduces a major institutional innovation by advocating for the creation of a permanent, autonomous, and tripartite body: the National Committee for Social Dialogue (CNDS).</p>
            <h3>A shared vision for social peace</h3>
            <p>Social dialogue is a fundamental pillar for economic development and national cohesion. By providing a structured space for mediation, negotiation, and conciliation, the CNDS enables early resolution of disputes, prevents harmful strikes, and guarantees respect for the rights and duties of all parties.</p>
          `,
          published_at: '2024-09-15',
        });
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-cnds-red border-t-transparent animate-spin mx-auto"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="wrap py-24 text-center">
        <h2 className="font-serif text-2xl font-semibold mb-4">{t('newsSection.notFound')}</h2>
        <Link to="/actualites" className="btn btn-outline">
          {t('newsSection.backToNews')}
        </Link>
      </div>
    );
  }

  const title = lang === 'en' && article.title_en ? article.title_en : (lang === 'rn' && article.title_rn ? article.title_rn : article.title_fr);
  const content = lang === 'en' && article.content_en ? article.content_en : (lang === 'rn' && article.content_rn ? article.content_rn : (article.content_fr || article.summary_fr));

  return (
    <article className="py-16 md:py-20 bg-cnds-white">
      <div className="wrap max-w-[800px]">
        
        {/* Back Link */}
        <Link to="/actualites" className="inline-flex items-center gap-1.5 text-xs font-semibold text-cnds-ink-soft hover:text-cnds-red mb-8 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('newsSection.backToNews')}</span>
        </Link>

        {/* Date */}
        <div className="text-[13px] text-cnds-ink-soft mb-3">
          {article.published_at ? new Date(article.published_at).toLocaleDateString(lang === 'en' ? 'en-US' : (lang === 'rn' ? 'rn-BI' : 'fr-FR'), { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-cnds-ink mb-8 leading-tight">
          {title}
        </h1>

        {/* Image if any */}
        {article.image_url && (
          <div className="aspect-[16/9] rounded-xl overflow-hidden mb-8 border border-cnds-line">
            <img src={article.image_url} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-stone text-cnds-ink text-[15.5px] leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <div className="border-t border-cnds-line mt-12 pt-8 flex justify-between items-center text-xs text-cnds-ink-soft">
          <span>{t('newsSection.executiveSecretariat')}</span>
          <Link to="/actualites" className="text-cnds-ink hover:text-cnds-red font-semibold">
            {t('newsSection.back')}
          </Link>
        </div>

      </div>
    </article>
  );
};
