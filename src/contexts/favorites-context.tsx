import { createContext, useContext, useState, type ReactNode } from 'react';

type FavoritesContextValue = {
  favoriteStores: string[];
  toggleFavorite: (storeName: string) => void;
  isFavorite: (storeName: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteStores, setFavoriteStores] = useState<string[]>([]);

  function toggleFavorite(storeName: string) {
    setFavoriteStores((current) =>
      current.includes(storeName)
        ? current.filter((name) => name !== storeName)
        : [...current, storeName],
    );
  }

  function isFavorite(storeName: string) {
    return favoriteStores.includes(storeName);
  }

  return (
    <FavoritesContext.Provider
      value={{ favoriteStores, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }

  return context;
}
