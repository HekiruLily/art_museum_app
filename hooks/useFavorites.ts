import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavouriteItem } from '@/models/favourite/favourite';

const STORAGE_KEY = 'mus:favourites:v1';

export function useFavorites() {
  const [items, setItems] = useState<FavouriteItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch (e) {
        console.warn('Failed to load favorites', e);
      }
    })();
  }, []);

  const persist = useCallback(async (next: FavouriteItem[]) => {
    setItems(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to save favorites', e);
    }
  }, []);

  const add = useCallback(async (item: FavouriteItem) => {
    setItems((prev) => {
      if (prev.find((p) => p.id === item.id)) return prev;
      const next = [...prev, item];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch((e) =>
        console.warn('Failed to save favorites', e)
      );
      return next;
    });
  }, []);

  const remove = useCallback(async (id: string) => {
    setItems((prev) => {
      const next = prev.filter((p) => p.id !== id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch((e) =>
        console.warn('Failed to save favorites', e)
      );
      return next;
    });
  }, []);

  const toggle = useCallback(async (item: FavouriteItem) => {
    const exists = items.find((p) => p.id === item.id);
    if (exists) await remove(item.id);
    else await add(item);
  }, [items, add, remove]);

  const toggleById = useCallback(async (id: string, fullItem?: FavouriteItem) => {
    const exists = items.find((p) => p.id === id);
    if (exists) await remove(id);
    else if (fullItem) await add(fullItem);
  }, [items, add, remove]);

  return { items, add, remove, toggle, toggleById, persist } as const;
}

export default useFavorites;
