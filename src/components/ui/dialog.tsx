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
}

export function DialogContent({ children, onClose }: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(90vw, 920px)',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#F9F6F0',
          zIndex: 51,
          outline: 'none',
          border: '1px solid #DDD5C5',
          boxShadow: '0 24px 60px rgba(20,12,8,0.25)',
        }}
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
