import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: number[];
  toggleFavorite: (artworkId: number) => void;
  isFavorite: (artworkId: number) => boolean;
  getFavoritesCount: () => number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (artworkId: number) => {
    setFavorites((prev) => {
      if (prev.includes(artworkId)) {
        console.log(`💔 Removed from favorites: ${artworkId}`);
        return prev.filter((id) => id !== artworkId);
      } else {
        console.log(`❤️ Added to favorites: ${artworkId}`);
        return [...prev, artworkId];
      }
    });
  };

  const isFavorite = (artworkId: number) => {
    return favorites.includes(artworkId);
  };

  const getFavoritesCount = () => {
    return favorites.length;
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, getFavoritesCount }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
