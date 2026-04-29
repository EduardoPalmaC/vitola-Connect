'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Props {
  fotos: string[];
  alt: string;
}

export default function CataGallery({ fotos, alt }: Props) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (!fotos.length) return null;

  return (
    <>
      <div className="rounded-xl border border-border bg-surface p-5">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
          Galería
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {fotos.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setLightbox(url)}
              className="relative aspect-square rounded-lg overflow-hidden border border-border bg-white hover:border-secondary/60 transition-colors"
            >
              <Image
                src={url}
                alt={`${alt} — foto ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 45vw, 200px"
              />
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[80vh]">
              <Image
                src={lightbox}
                alt={alt}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute top-3 right-3 rounded-full bg-black/60 text-white w-8 h-8 flex items-center justify-center text-lg leading-none hover:bg-black/80 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
