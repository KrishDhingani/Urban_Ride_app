import { createMMKV } from 'react-native-mmkv';

// --- Correct v4-safe type patch ---
type MMKVStore = {
  set: (key: string, value: string | number | boolean) => void;
  getString: (key: string) => string | undefined;
  getBoolean: (key: string) => boolean | undefined;
  getNumber: (key: string) => number | undefined;
  delete: (key: string) => void;
  clearAll: () => void;
};

const createStore = (config: any) =>
  (createMMKV as any)(config) as MMKVStore;

// --- Instances ---
export const tokenStorage = createStore({
  id: 'token-storage',
  encryptionKey: 'your-encryption-key-here',
});

export const storage = createStore({
  id: 'my-app-storage',
  encryptionKey: 'your-encryption-key-here',
});

// --- Async-like wrapper for easy usage ---
export const mmkvStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },

  getItem: (key: string) => {
    return storage.getString(key) ?? null;
  },

  removeItem: (key: string) => {
    storage.delete(key);
  },
};
