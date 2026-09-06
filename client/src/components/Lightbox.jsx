import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Lightbox = ({ isOpen, currentImage, onClose, onPrev, onNext, hasPrev, hasNext }) => {
  const { lang } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrev, hasNext, onClose, onPrev, onNext]);

  if (!isOpen || !currentImage) return null;

  const title = lang === 'en' && currentImage.title_en ? currentImage.title_en : (lang === 'rn' && currentImage.title_rn ? currentImage.title_rn : currentImage.title_fr);
  const caption = lang === 'en' && currentImage.caption_en ? currentImage.caption_en : (lang === 'rn' && currentImage.caption_rn ? currentImage.caption_rn : currentImage.caption_fr);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-cnds-gold p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none"
        aria-label="Fermer la vue"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-cnds-gold p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none"
          aria-label="Image précédente"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-cnds-gold p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none"
          aria-label="Image suivante"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Image Container */}
      <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
        <img
          src={currentImage.image_url}
          alt={title || 'Photo CNDS'}
          className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-2xl border border-white/10"
        />
        {(title || caption) && (
          <div className="mt-4 text-center text-white max-w-xl">
            {title && (
              <h4 className="font-serif font-bold text-lg text-white mb-1">{title}</h4>
            )}
            {caption && (
              <p className="text-xs text-stone-300">{caption}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
