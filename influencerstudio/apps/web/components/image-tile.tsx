"use client";
import Image from 'next/image';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui';

export function ImageTile({
  src,
  alt,
  prompt,
}: {
  src: string;
  alt: string;
  prompt?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Card className="cursor-pointer overflow-hidden" onClick={() => setOpen(true)}>
        <CardContent className="p-0">
          <div className="relative h-48 w-full">
            <Image src={src} alt={alt} fill className="object-cover" />
          </div>
        </CardContent>
      </Card>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-background shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[70vh] w-full bg-black">
              <Image src={src} alt={alt} fill className="object-contain" />
            </div>
            {prompt ? (
              <div className="border-t p-4 text-sm text-muted-foreground">
                {prompt}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

