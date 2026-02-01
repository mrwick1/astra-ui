'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { OverlayProps } from './Overlay.types';

const Overlay = ({ visible, onClose, className }: OverlayProps) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={twMerge('fixed inset-0 z-40 bg-black/60', className)}
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  );
};

Overlay.displayName = 'Overlay';

export default Overlay;
