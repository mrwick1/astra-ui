'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { CollapseProps } from './Collapse.types';

const Collapse = ({ open, children, className }: CollapseProps) => {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className={className}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Collapse.displayName = 'Collapse';

export default Collapse;
