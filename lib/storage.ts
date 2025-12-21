const isBrowser = () => typeof window !== 'undefined';

export function getStorageItem<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch (error) {
    console.error('Failed to read storage', error);
    return fallback;
  }
}

export function setStorageItem<T>(key: string, value: T) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to write storage', error);
  }
}

export function removeStorageItem(key: string) {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove storage', error);
  }
}
