import React, { useState, useEffect } from 'react';
import { Lightbox } from '../components/Lightbox';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api/client';

export const Gallery = () => {
  const { lang, t } = useLanguage();
  const [photos, setPhotos] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    api.getGallery()
      .then((data) => {
        if (data.photos && data.photos.length > 0) {
          setPhotos(data.photos);
        }
      })
      .catch(() => {
        setPhotos([
          {
            id: 1,
            title_fr: 'Signature de la Charte à Gitega',
            title_rn: 'Guterako umukono ku masezerano nshingiro i Gitega',
            caption_fr: 'Les trois collèges lors de la signature en mai 2011.',
            caption_rn: 'Impande zitatu ziri mu gikorwa co gutera umukono ku masezerano muri Rusama 2011.',
            image_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80',
            date_taken: '2011-05-25'
          },
          {
            id: 2,
            title_fr: 'Session Plénière Ordinaire',
            title_rn: 'Inama Rusangi ya CNDS',
            caption_fr: 'Travaux des 27 membres de l\'Assemblée plénière.',
            caption_rn: 'Ibikorwa by\'abanywanyi 27 b\'Inama Rusangi.',
            image_url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1000&q=80',
            date_taken: '2024-06-20'
          },
          {
            id: 3,
            title_fr: 'Atelier de Médiation avec les CPDS',
            title_rn: 'Inyigisho z\'Ubuhuza n\'Inzego za CNDS mu Ntara',
            caption_fr: 'Formation des délégués provinciaux à Gitega.',
            caption_rn: 'Inyigisho zahawe intumwa za CNDS mu ntara i Gitega.',
            image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
            date_taken: '2024-08-28'
          },
          {
            id: 4,
            title_fr: 'Séminaire Francophone Régional',
            title_rn: 'Inama Mpuzamakungu y\'Abakoresha Igifaransa',
            caption_fr: 'Délégations tripartites africaines réunies.',
            caption_rn: 'Intumwa z\'ibihugu bitandukanye bya Afrika ziteraniye i Bujumbura.',
            image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80',
            date_taken: '2024-09-08'
          },
          {
            id: 5,
            title_fr: 'Visite d\'Entreprise & Écoute Sociale',
            title_rn: 'Urugendo mu Mashirahamwe no Kwumviriza Abakozi',
            caption_fr: 'Rencontre avec le patronat et les délégués syndicaux.',
            caption_rn: 'Inama n\'abakoresha hamwe n\'abaserukira amasendika y\'abakozi.',
            image_url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1000&q=80',
            date_taken: '2024-05-18'
          },
          {
            id: 6,
            title_fr: 'Réunion des Commissions Techniques',
            title_rn: 'Inama y\'Utugwi tw\'Inyigo z\'Ubuhinga',
            caption_fr: 'Examen des textes de protection sociale.',
            caption_rn: 'Gusuzuma amategeko ajanye no gukingira agateka k\'abakozi.',
            image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
            date_taken: '2024-04-10'
          },
        ]);
      });
  }, []);

  return (
    <div className="py-16 md:py-20 bg-cnds-white">
      <div className="wrap">
        <div className="section-head">
          <div className="kicker">{t('gallery.kicker')}</div>
          <h2>{t('gallery.title')}</h2>
          <p>{t('gallery.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => {
            const title = lang === 'rn' && photo.title_rn ? photo.title_rn : photo.title_fr;
            return (
              <div
                key={photo.id}
                onClick={() => setLightboxIndex(index)}
                className="cursor-pointer group rounded-[12px] overflow-hidden border border-cnds-line bg-cnds-offwhite hover:border-cnds-gold transition-colors"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={photo.image_url}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 bg-cnds-white">
                  <div className="text-[11.5px] text-cnds-ink-soft mb-1">
                    {photo.date_taken ? new Date(photo.date_taken).toLocaleDateString(lang === 'rn' ? 'rn-BI' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  </div>
                  <h3 className="font-serif text-[15px] font-semibold text-cnds-ink group-hover:text-cnds-red transition-colors line-clamp-1">
                    {title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        <Lightbox
          isOpen={lightboxIndex !== null}
          currentImage={lightboxIndex !== null ? photos[lightboxIndex] : null}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((p) => Math.max(0, p - 1))}
          onNext={() => setLightboxIndex((p) => Math.min(photos.length - 1, p + 1))}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < photos.length - 1}
        />
      </div>
    </div>
  );
};
