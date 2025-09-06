import { storage } from './config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const storageService = {
  uploadFile: async (path: string, file: File) => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  },
};
