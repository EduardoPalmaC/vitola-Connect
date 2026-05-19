'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogOverlay() {
  return (
    <DialogPrimitive.Overlay
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20, 12, 8, 0.55)',
        backdropFilter: 'blur(2px)',
        zIndex: 50,
      }}
    />
  );
}

interface DialogContentProps {
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function DialogContent({ children, onClose, className }: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,920px)] max-h-[90vh] overflow-y-hidden bg-[#F9F6F0] z-[51] outline-none border border-[#DDD5C5] shadow-[0_24px_60px_rgba(20,12,8,0.25)]${className ? ` ${className}` : ''}`}
      >
        {children}
        <DialogPrimitive.Close
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#9A8572',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s',
          }}
          aria-label="Cerrar"
        >
          <X size={16} strokeWidth={1.5} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
