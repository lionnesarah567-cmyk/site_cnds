import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../api/client';
import { useLanguage } from '../context/LanguageContext';

export const Contact = () => {
  const { lang, t } = useLanguage();
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

  const handleSubmit = async (e) => {
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
    <div className="py-20 md:py-24 bg-cnds-ink text-cnds-white min-h-[75vh]">
      <div className="wrap grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
        
        {/* Left: Heading and Form */}
        <div>
          <h1 className="text-cnds-white font-serif text-3xl sm:text-4xl font-semibold mb-3">
            {t('contactSection.title')}
          </h1>
          <p className="text-[#C9C7C0] text-[15px] mb-8 leading-relaxed">
            {t('contactSection.subtitle')}
          </p>

          {formStatus.message && (
            <div className={`p-3.5 rounded-lg text-xs mb-6 flex items-center gap-2 ${formStatus.type === 'success' ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-700' : 'bg-rose-900/60 text-rose-200 border border-rose-700'}`}>
              {formStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{formStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="website_hp" value={formData.website_hp} onChange={(e) => setFormData({...formData, website_hp: e.target.value})} className="hidden" tabIndex="-1" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-[#8C8A84] uppercase tracking-wider mb-1">
                  {t('contactSection.formNameLabel')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'en' ? 'e.g. John Doe' : (lang === 'rn' ? 'Ukarorero: Sylvestre Nizigiyimana' : 'Ex: Sylvestre Nizigiyimana')}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded bg-[#242424] border border-[#3A3A3A] text-xs text-white placeholder-stone-400 focus:border-cnds-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#8C8A84] uppercase tracking-wider mb-1">
                  {t('contactSection.formEmailLabel')}
                </label>
                <input
                  type="email"
                  required
                  placeholder="nom@domaine.bi"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded bg-[#242424] border border-[#3A3A3A] text-xs text-white placeholder-stone-400 focus:border-cnds-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-[#8C8A84] uppercase tracking-wider mb-1">
                  {t('contactSection.formPhoneLabel')}
                </label>
                <input
                  type="tel"
                  placeholder="+257 79 000 000"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded bg-[#242424] border border-[#3A3A3A] text-xs text-white placeholder-stone-400 focus:border-cnds-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#8C8A84] uppercase tracking-wider mb-1">
                  {t('contactSection.formSubjectLabel')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'en' ? 'Meeting request or conciliation inquiry' : (lang === 'rn' ? 'Gusaba kubonana canke ibiganiro' : "Demande d'audience ou conciliation")}
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded bg-[#242424] border border-[#3A3A3A] text-xs text-white placeholder-stone-400 focus:border-cnds-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-[#8C8A84] uppercase tracking-wider mb-1">
                {t('contactSection.formMessageLabel')}
              </label>
              <textarea
                required
                rows={5}
                placeholder={lang === 'en' ? 'Write your official request or inquiry here...' : (lang === 'rn' ? 'Andika hano ubutumwa bwawe bwa CNDS...' : 'Rédigez ici votre requête officielle...')}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded bg-[#242424] border border-[#3A3A3A] text-xs text-white placeholder-stone-400 focus:border-cnds-gold focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary text-xs uppercase tracking-wider font-bold w-full sm:w-auto"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? t('contactSection.sending') : t('contactSection.sendMessage')}</span>
            </button>
          </form>
        </div>

        {/* Right: Contact details */}
        <div className="lg:pl-8 space-y-6">
          <div className="border-t border-[#333333] pt-6">
            <h4 className="text-[13px] text-[#8C8A84] mb-2 font-medium">
              {t('contactSection.addressLabel')}
            </h4>
            <p className="text-[#C9C7C0] text-[15px] leading-relaxed">
              {lang === 'en' ? 'Kigobe, Avenue Murembwe No. 28' : (lang === 'rn' ? 'Kigobe, Ibaruwa rya Murembwe No 28' : 'Kigobe, Avenue Murembwe n°28')}<br />
              {lang === 'en' ? 'Bujumbura, Burundi' : (lang === 'rn' ? 'Bujumbura, Uburundi' : 'Bujumbura, Burundi')}
            </p>
          </div>

          <div className="border-t border-[#333333] pt-6">
            <h4 className="text-[13px] text-[#8C8A84] mb-2 font-medium">
              {t('contactSection.phoneLabel')}
            </h4>
            <p className="text-[#C9C7C0] text-[15px]">
              22 278 929 · 22 211 016 · 22 221 017
            </p>
          </div>

          <div className="border-t border-[#333333] pt-6">
            <h4 className="text-[13px] text-[#8C8A84] mb-2 font-medium">
              {t('contactSection.emailLabel')}
            </h4>
            <p className="text-[#C9C7C0] text-[15px]">
              contact@cndsburundi.bi<br />
              infocndsburundi2011@gmail.com<br />
              secretariat@cndsburundi.bi
            </p>
          </div>

          <div className="border-t border-[#333333] pt-6 text-xs text-[#8C8A84] leading-relaxed">
            {t('contactSection.confidentialityNotice')}
          </div>
        </div>

      </div>
    </div>
  );
};
