import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const OffersViewer = ({ onBack }) => {
  const offers = useMemo(
    () => [
      { id: 'offer-1', src: '/logo.png', alt: 'Offer 1' },
      { id: 'offer-2', src: '/vite.svg', alt: 'Offer 2' },
      { id: 'offer-3', src: '/background.jpg', alt: 'Offer 3' },
      { id: 'offer-4', src: '/logo.png', alt: 'Offer 4' },
      { id: 'offer-5', src: '/vite.svg', alt: 'Offer 5' },
      { id: 'offer-6', src: '/background.jpg', alt: 'Offer 6' },
    ],
    []
  );

  const [broken, setBroken] = useState(() => new Set());
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  const selectedOffer = useMemo(() => {
    if (!selectedOfferId) return null;
    return offers.find((o) => o.id === selectedOfferId) ?? null;
  }, [offers, selectedOfferId]);

  useEffect(() => {
    if (!selectedOfferId) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedOfferId(null);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedOfferId]);

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

      <div className="flex-1 w-full h-full overflow-y-auto p-6">
        <div className="w-full max-w-md mx-auto grid grid-cols-2 gap-4">
          {offers.map((offer, index) => {
            const isBroken = broken.has(offer.id);

            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 * index }}
                className="rounded-2xl overflow-hidden border border-brand-light/20 bg-white/5"
              >
                {isBroken ? (
                  <div className="w-full aspect-square bg-white/5" />
                ) : (
                  <img
                    src={offer.src}
                    alt={offer.alt}
                    loading="lazy"
                    className="w-full aspect-square object-cover"
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedOfferId(offer.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setSelectedOfferId(offer.id);
                    }}
                    onError={() =>
                      setBroken((prev) => {
                        const next = new Set(prev);
                        next.add(offer.id);
                        return next;
                      })
                    }
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedOffer && !broken.has(selectedOffer.id) && (
          <motion.div
            key="offer-fullscreen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-brand-dark/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setSelectedOfferId(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden border border-brand-light/20 bg-white/5"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedOffer.src}
                alt={selectedOffer.alt}
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OffersViewer;
