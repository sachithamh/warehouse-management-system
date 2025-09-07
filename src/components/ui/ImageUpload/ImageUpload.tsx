"use client";
import React, { useRef } from 'react';

export interface ImageUploadProps {
  images: string[];
  uploading?: boolean;
  onSelect: (files: FileList) => void;
  onRemove?: (url: string) => void;
  max?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ images, uploading, onSelect, onRemove, max = 5 }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const canAddMore = images.length < max;
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3">
        {images.map((url) => (
          <div key={url} className="group relative h-20 w-20 overflow-hidden rounded border border-neutral-200 bg-neutral-50">
            <img src={url} alt="Product" className="h-full w-full object-cover" />
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="absolute right-1 top-1 hidden rounded bg-black/60 px-1 text-[10px] text-white group-hover:block"
              >✕</button>
            )}
          </div>
        ))}
        {canAddMore && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-20 w-20 items-center justify-center rounded border border-dashed border-neutral-300 text-xs text-neutral-500 hover:border-neutral-500 hover:text-neutral-700"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : '+ Add'}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files) onSelect(e.target.files); e.target.value=''; }}
      />
    </div>
  );
};

export default ImageUpload;
