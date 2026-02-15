'use client';
import { forwardRef, Ref, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { useFocusTrap } from '@hooks/use-focus-trap.hook';
import Overlay from '@components/_internal/Overlay/Overlay';
import { modalStyles } from '@theme/styles/Modal.styles';
import {
  ModalProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalComponent,
} from './Modal.types';

const ModalRoot = (props: ModalProps) => {
  const { open, onClose, children, className, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy } = props;

  const trapRef = useFocusTrap(open);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <>
      <Overlay visible={open} onClose={onClose} />
      <AnimatePresence>
        {open && (
          <motion.div
            ref={trapRef}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={twMerge(modalStyles.base(), className)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
};
ModalRoot.displayName = 'Modal';

const ModalHeader = forwardRef((props: ModalHeaderProps, ref?: Ref<HTMLDivElement>) => {
  const { children, className, ...rest } = props;
  return (
    <div ref={ref} className={twMerge(modalStyles.header(), className)} {...rest}>
      {children}
    </div>
  );
});
ModalHeader.displayName = 'Modal.Header';

const ModalBody = forwardRef((props: ModalBodyProps, ref?: Ref<HTMLDivElement>) => {
  const { children, className, ...rest } = props;
  return (
    <div ref={ref} className={twMerge(modalStyles.body(), className)} {...rest}>
      {children}
    </div>
  );
});
ModalBody.displayName = 'Modal.Body';

const ModalFooter = forwardRef((props: ModalFooterProps, ref?: Ref<HTMLDivElement>) => {
  const { children, className, ...rest } = props;
  return (
    <div ref={ref} className={twMerge(modalStyles.footer(), className)} {...rest}>
      {children}
    </div>
  );
});
ModalFooter.displayName = 'Modal.Footer';

const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
}) as ModalComponent;

export default Modal;
