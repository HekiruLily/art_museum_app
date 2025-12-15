import React, { createContext, useState, useContext } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (artworkId) => {
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

  const isFavorite = (artworkId) => {
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
