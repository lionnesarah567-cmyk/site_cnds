import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api/client';

export const Home = () => {
  const { t, lang } = useLanguage();
  const [recentNews, setRecentNews] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website_hp: '',
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch News
    api.getNews({ limit: 3 })
      .then((data) => {
        if (data.news && data.news.length > 0) {
          setRecentNews(data.news);
        }
      })
      .catch(() => {
        // Default official news fallback
        setRecentNews([
          {
            id: 1,
            slug: 'vulgarisation-de-la-charte-nationale-de-dialogue-social',
            title_fr: 'Vulgarisation de la Charte Nationale de Dialogue Social',
            title_rn: 'Kumenyekanisha Amasezerano Nshingiro y\'Ibiganiro mu Bakozi',
            summary_fr: 'Campagne de sensibilisation auprès des comités provinciaux et communaux de dialogue social.',
            summary_rn: 'Kumenyekanisha amasezerano nshingiro mu nzego z\'intara n\'amakomine.',
            published_at: '2024-09-15',
          },
          {
            id: 2,
            slug: 'le-6eme-seminaire-regional-de-linternationale-francophone',
            title_fr: '6ème Séminaire régional de l\'Internationale Francophone de Dialogue Social',
            title_rn: 'Inama Nteguro Mpuzamakungu y\'Ibiganiro mu Bakozi Bakoresha Igifaransa',
            summary_fr: 'Le CNDS a pris part aux échanges régionaux sur les mécanismes de dialogue social.',
            summary_rn: 'CNDS yitavye ibiganiro byo mu karere ku bijanye n\'imibano myiza mu kazi.',
            published_at: '2024-09-08',
          },
          {
            id: 3,
            slug: 'renforcement-des-capacites-comites-provinciaux-gitega-karusi',
            title_fr: 'Atelier de renforcement des capacités des CPDS et CCDS',
            title_rn: 'Uruhande rw\'Inyigisho ku Bakorera mu Nzego z\'Intara n\'Amakomine',
            summary_fr: 'Formation des membres des comités provinciaux et communaux de dialogue social.',
            summary_rn: 'Inyigisho zahawe abagize inzego za CNDS mu ntara n\'amakomine.',
            published_at: '2024-08-28',
          },
        ]);
      });

    // Fetch Board
    api.getBoardMembers()
      .then((data) => {
        if (data.members && data.members.length > 0) {
          setBoardMembers(data.members);
        }
      })
      .catch(() => {
        setBoardMembers([
          { id: 1, initials: 'SN', full_name: 'NTIBANTUNGANYA Sylvestre', role_title_fr: 'Président du CNDS', role_title_rn: 'Umukuru wa CNDS', photo_url: '/images/bureau/sylvestre_ntibantunganya.jpg' },
          { id: 2, initials: 'CN', full_name: 'Céléstin NSAVYIMANA', role_title_fr: 'Vice-président — Travailleurs', role_title_rn: 'Icyegera c\'Umukuru — Abakozi', photo_url: '/images/bureau/celestin_nsavyimana.jpg' },
          { id: 3, initials: 'TK', full_name: 'Théodore KAMWENUBUSA', role_title_fr: 'Vice-président — Employeurs', role_title_rn: 'Icyegera c\'Umukuru — Abakoresha', photo_url: '/images/bureau/theodore_kamwenubusa.jpg' },
          { id: 4, initials: 'EN', full_name: 'Emmanuel Ngomirakiza', role_title_fr: 'Représentant du gouvernement', role_title_rn: 'Uwaserukiye Leta', photo_url: '/images/bureau/emmanuel_ngomirakiza.jpg' },
          { id: 5, initials: 'MA', full_name: 'MBONABUCA Athanase', role_title_fr: 'Secrétaire Exécutif Permanent', role_title_rn: 'Umunyamabanga Nshingwabikorwa', photo_url: '/images/bureau/athanase_mbonabuca.jpg' },
        ]);
      });
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    if (formData.website_hp) {
      setTimeout(() => {
        setIsSubmitting(false);
        setFormStatus({ type: 'success', message: t('contactSection.success') });
      }, 400);
      return;
    }

    try {
      const res = await api.sendContact(formData);
      if (res.success) {
        setFormStatus({ type: 'success', message: t('contactSection.success') });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '', website_hp: '' });
      } else {
        setFormStatus({ type: 'error', message: res.message || t('contactSection.error') });
      }
    } catch (err) {
      setFormStatus({ type: 'error', message: err.message || t('contactSection.error') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-14 sm:pt-16 sm:pb-20 md:pt-24 md:pb-24 bg-cnds-white" id="accueil">
        {/* Subtle background Burundi star pattern */}
        <svg className="absolute -top-36 -right-44 w-[640px] h-[640px] opacity-[0.04] pointer-events-none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <polygon points="100,10 118,70 182,70 130,108 150,170 100,132 50,170 70,108 18,70 82,70" fill="#CE1126"/>
        </svg>

        <div className="wrap grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center">
          
          {/* Left Text */}
          <div>
            <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
              <span className="w-7 h-[2px] bg-cnds-red inline-block"></span>
              <span className="text-[12.5px] sm:text-[13px] font-medium text-cnds-ink-soft">
                {t('hero.institutionName')}
              </span>
            </div>

            <h1 className="font-serif text-[26px] sm:text-3xl md:text-4xl lg:text-[44px] font-semibold text-cnds-ink leading-[1.18] sm:leading-[1.14] mb-4 sm:mb-5 max-w-[560px]">
              {t('hero.title')}
            </h1>

            <p className="text-[15px] sm:text-[16.5px] text-cnds-ink-soft leading-relaxed max-w-[480px] mb-6 sm:mb-8 font-normal">
              {t('hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a href="#apropos" className="btn btn-primary text-center">
                {t('hero.ctaDiscover')}
              </a>
              <a href="#actualites" className="btn btn-outline text-center">
                {t('hero.ctaNews')}
              </a>
            </div>
          </div>

          {/* Right Hero Figure */}
          <div className="relative rounded-2xl overflow-hidden bg-white border border-cnds-line p-6 sm:p-8 flex flex-col items-center justify-center gap-4 text-center shadow-xs">
            <div className="w-48 sm:w-60 max-w-full aspect-[3/4] flex items-center justify-center overflow-hidden">
              <img
                src="/images/logo-cnds.jpg"
                alt="Logo Officiel CNDS"
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>
            <div className="font-serif italic text-[14px] sm:text-[15px] text-cnds-ink-soft max-w-[320px] leading-relaxed border-t border-cnds-line pt-3">
              {t('hero.slogan')}
            </div>
          </div>

        </div>
      </section>

      {/* 2. TRIPARTITE SECTION (PILLARS) */}
      <section className="py-20 bg-cnds-offwhite border-y border-cnds-line" id="institution">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">{t('tripartite.kicker')}</div>
            <h2>{t('tripartite.title')}</h2>
            <p>{t('tripartite.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-cnds-white border border-cnds-line rounded-[14px] p-7 sm:p-8 hover:shadow-xs transition-shadow">
              <span className="text-[12.5px] text-cnds-ink-soft mb-3 block">{t('tripartite.govCount')}</span>
              <div className="font-serif text-[20px] font-semibold text-cnds-ink mb-2.5">
                {t('tripartite.govTitle')}
              </div>
              <p className="text-[14px] text-cnds-ink-soft leading-relaxed">
                {t('tripartite.govDesc')}
              </p>
            </div>

            <div className="bg-cnds-white border border-cnds-line rounded-[14px] p-7 sm:p-8 hover:shadow-xs transition-shadow">
              <span className="text-[12.5px] text-cnds-ink-soft mb-3 block">{t('tripartite.empCount')}</span>
              <div className="font-serif text-[20px] font-semibold text-cnds-red mb-2.5">
                {t('tripartite.empTitle')}
              </div>
              <p className="text-[14px] text-cnds-ink-soft leading-relaxed">
                {t('tripartite.empDesc')}
              </p>
            </div>

            <div className="bg-cnds-white border border-cnds-line rounded-[14px] p-7 sm:p-8 hover:shadow-xs transition-shadow">
              <span className="text-[12.5px] text-cnds-ink-soft mb-3 block">{t('tripartite.traCount')}</span>
              <div className="font-serif text-[20px] font-semibold text-cnds-green mb-2.5">
                {t('tripartite.traTitle')}
              </div>
              <p className="text-[14px] text-cnds-ink-soft leading-relaxed">
                {t('tripartite.traDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. À PROPOS & HISTORIQUE */}
      <section className="py-20 md:py-24 bg-cnds-white" id="apropos">
        <div className="wrap grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-14 items-start">
          
          {/* Left Description */}
          <div>
            <div className="section-head" style={{ marginBottom: '24px' }}>
              <div className="kicker">{t('about.kicker')}</div>
              <h2>{t('about.title')}</h2>
            </div>
            <p className="text-[15px] text-cnds-ink-soft mb-4 leading-relaxed">
              {t('about.p1')}
            </p>
            <p className="text-[15px] text-cnds-ink-soft leading-relaxed">
              {t('about.p2')}
            </p>
          </div>

          {/* Right Timeline */}
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
      </section>

      {/* 4. BUREAU (ORGANE) */}
      <section className="py-20 md:py-24 bg-cnds-offwhite border-t border-cnds-line" id="bureau">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">{t('bureau.kicker')}</div>
            <h2>{t('bureau.title')}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {boardMembers.map((member) => (
              <div
                key={member.id}
                className="bg-cnds-white border border-cnds-line rounded-[14px] p-4 sm:p-5 text-left hover:border-cnds-gold/70 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-full aspect-[4/5] rounded-[10px] overflow-hidden mb-4 border border-cnds-line bg-[#EFECE6] relative shadow-xs">
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
                      <div className="w-full h-full flex items-center justify-center font-serif text-2xl font-bold text-cnds-ink-soft/40">
                        {member.initials || (member.full_name ? member.full_name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'CNDS')}
                      </div>
                    )}
                  </div>
                  <h3 className="text-[15.5px] font-semibold text-cnds-ink mb-1 font-sans leading-snug group-hover:text-cnds-red transition-colors">
                    {member.full_name}
                  </h3>
                </div>
                <p className="text-[12.5px] text-cnds-ink-soft font-medium mt-1">
                  {lang === 'rn' && member.role_title_rn ? member.role_title_rn : member.role_title_fr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ACTUALITÉS */}
      <section className="py-20 md:py-24 bg-cnds-white" id="actualites">
        <div className="wrap">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-11 gap-4">
            <div className="section-head" style={{ marginBottom: 0 }}>
              <div className="kicker">{t('newsSection.kicker')}</div>
              <h2>{t('newsSection.title')}</h2>
            </div>
            <Link to="/actualites" className="text-[14px] font-semibold text-cnds-ink border-b-[1.5px] border-cnds-ink pb-0.5 hover:text-cnds-red hover:border-cnds-red transition-colors shrink-0">
              {t('newsSection.allNews')}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {recentNews.map((item) => (
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
                    {item.published_at ? new Date(item.published_at).toLocaleDateString(lang === 'rn' ? 'rn-BI' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  </div>
                  <h3 className="text-[16.5px] font-medium text-cnds-ink group-hover:text-cnds-red transition-colors mb-2 leading-snug">
                    {lang === 'rn' && item.title_rn ? item.title_rn : item.title_fr}
                  </h3>
                  <p className="text-[13.5px] text-cnds-ink-soft leading-relaxed line-clamp-2">
                    {lang === 'rn' && item.summary_rn ? item.summary_rn : item.summary_fr}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONTACT SECTION */}
      <section className="py-20 md:py-24 bg-cnds-ink text-cnds-white" id="contact">
        <div className="wrap grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Text & Form */}
          <div>
            <h2 className="text-cnds-white font-serif text-[28px] font-semibold mb-4">
              {t('contactSection.title')}
            </h2>
            <p className="text-[#C9C7C0] text-[14.5px] mb-6 leading-relaxed">
              {t('contactSection.subtitle')}
            </p>

            {formStatus.message && (
              <div className={`p-3 rounded-lg text-xs mb-4 flex items-center gap-2 ${formStatus.type === 'success' ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-700' : 'bg-rose-900/60 text-rose-200 border border-rose-700'}`}>
                {formStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{formStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <input type="text" name="website_hp" value={formData.website_hp} onChange={(e) => setFormData({...formData, website_hp: e.target.value})} className="hidden" tabIndex="-1" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder={t('contactSection.formName')}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded bg-[#242424] border border-[#3A3A3A] text-xs text-white placeholder-stone-400 focus:border-cnds-gold focus:outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder={t('contactSection.formEmail')}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded bg-[#242424] border border-[#3A3A3A] text-xs text-white placeholder-stone-400 focus:border-cnds-gold focus:outline-none"
                />
              </div>

              <input
                type="text"
                required
                placeholder={t('contactSection.formSubject')}
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded bg-[#242424] border border-[#3A3A3A] text-xs text-white placeholder-stone-400 focus:border-cnds-gold focus:outline-none"
              />

              <textarea
                required
                rows={4}
                placeholder={t('contactSection.formMessage')}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded bg-[#242424] border border-[#3A3A3A] text-xs text-white placeholder-stone-400 focus:border-cnds-gold focus:outline-none resize-none"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary text-xs uppercase tracking-wider font-bold w-full sm:w-auto"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? t('contactSection.sending') : t('contactSection.send')}</span>
              </button>
            </form>
          </div>

          {/* Right Contact Info Blocks */}
          <div className="lg:pl-6">
            <div className="border-t border-[#333333] pt-5 mt-2">
              <h4 className="text-[12.5px] text-[#8C8A84] mb-1.5 font-medium">
                {t('contactSection.addressLabel')}
              </h4>
              <p className="text-[#C9C7C0] text-[14.5px] leading-relaxed">
                {t('contactSection.address')}
              </p>
            </div>

            <div className="border-t border-[#333333] pt-5 mt-5">
              <h4 className="text-[12.5px] text-[#8C8A84] mb-1.5 font-medium">
                {t('contactSection.phoneLabel')}
              </h4>
              <p className="text-[#C9C7C0] text-[14.5px]">
                {t('contactSection.phones')}
              </p>
            </div>

            <div className="border-t border-[#333333] pt-5 mt-5">
              <h4 className="text-[12.5px] text-[#8C8A84] mb-1.5 font-medium">
                {t('contactSection.emailLabel')}
              </h4>
              <p className="text-[#C9C7C0] text-[14.5px]">
                {t('contactSection.emails')}
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
