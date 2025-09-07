"use client";
import { useState, useCallback } from 'react';
import { storageService } from '../firebase/storage';

interface UseImageUploadOptions {
  basePath?: string; // e.g. products/{id}
  onUploaded?: (urls: string[]) => void;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const { basePath = 'uploads', onUploaded } = options;
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0); // reserved for future granular progress

  const uploadFiles = useCallback(async (files: FileList) => {
    setUploading(true);
    try {
      const uploads: Promise<string>[] = [];
      Array.from(files).forEach((file) => {
        const path = `${basePath}/${Date.now()}-${file.name}`;
        uploads.push(storageService.uploadFile(path, file));
      });
      const urls = await Promise.all(uploads);
      onUploaded?.(urls);
      return urls;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [basePath, onUploaded]);

  return { uploading, progress, uploadFiles };
}
