import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const OffersViewer = ({ onBack }) => {
  const STORY_DURATION_MS = 5000;

  const offers = useMemo(
    () => [
      { id: 'offer-1', src: '/Richeese - Christmas.png', alt: 'Offer 1' },
      { id: 'offer-2', src: '/Richeese - Hunger Killer.png', alt: 'Offer 2' },
      { id: 'offer-3', src: '/Richeese - Open Wings.png', alt: 'Offer 3' },
    ],
    []
  );

  const [broken, setBroken] = useState(() => new Set());
  const [currentIndex, setCurrentIndex] = useState(0);

  const availableOffers = useMemo(
    () => offers.filter((o) => !broken.has(o.id)),
    [offers, broken]
  );

  const currentOffer = availableOffers[currentIndex] ?? null;

  const goNext = () => {
    if (availableOffers.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % availableOffers.length);
  };

  const goPrev = () => {
    if (availableOffers.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + availableOffers.length) % availableOffers.length);
  };

  useEffect(() => {
    if (availableOffers.length === 0) return;
    if (!currentOffer) return;

    const timer = window.setTimeout(() => {
      goNext();
    }, STORY_DURATION_MS);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, availableOffers.length, currentOffer?.id]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onBack();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableOffers.length]);

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-brand-dark/95 backdrop-blur-xl overflow-hidden flex flex-col"
    >
      <button
        onClick={onBack}
        className="absolute top-4 left-4 p-3 rounded-full bg-brand-dark/50 hover:bg-brand-dark/70 backdrop-blur-md border border-brand-light/20 text-brand-light transition-all z-20 shadow-lg"
        aria-label="Back"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="flex-1 w-full h-full relative">
        {/* Story progress */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-6 pointer-events-none">
          <div className="flex gap-2">
            {availableOffers.map((offer, i) => {
              const isPast = i < currentIndex;
              const isCurrent = i === currentIndex;

              return (
                <div
                  key={offer.id}
                  className="h-1.5 flex-1 rounded-full bg-white/20 overflow-hidden"
                >
                  {isPast && <div className="h-full w-full bg-white" />}
                  {isCurrent && (
                    <motion.div
                      key={offer.id}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: STORY_DURATION_MS / 1000, ease: 'linear' }}
                      className="h-full bg-white"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tap zones */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous offer"
          className="absolute inset-y-0 left-0 w-1/2 z-10"
        />
        <button
          type="button"
          onClick={goNext}
          aria-label="Next offer"
          className="absolute inset-y-0 right-0 w-1/2 z-10"
        />

        {/* Story content */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          {currentOffer ? (
            <motion.div
              key={currentOffer.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden border border-brand-light/20 bg-white/5"
            >
              <img
                src={currentOffer.src}
                alt={currentOffer.alt}
                className="w-full h-full object-contain"
                onError={() =>
                  setBroken((prev) => {
                    const next = new Set(prev);
                    next.add(currentOffer.id);
                    return next;
                  })
                }
              />
            </motion.div>
          ) : (
            <div className="w-full h-full max-w-4xl max-h-[90vh] rounded-2xl border border-brand-light/20 bg-white/5" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OffersViewer;
