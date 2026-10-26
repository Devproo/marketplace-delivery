import { createContext, useContext, useState, type ReactNode } from 'react';

export type CartItem = {
  id: string;
  storeName: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: string, storeName: string, change: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(item: Omit<CartItem, 'quantity'>) {
    setItems((current) => {
      const existing = current.find(
        (entry) => entry.id === item.id && entry.storeName === item.storeName,
      );

      if (existing) {
        return current.map((entry) =>
          entry.id === item.id && entry.storeName === item.storeName
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry,
        );
      }

      return [...current, { ...item, quantity: 1 }];
    });
  }

  function updateQuantity(id: string, storeName: string, change: number) {
    setItems((current) =>
      current
        .map((item) =>
          item.id === id && item.storeName === storeName
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, clearCart, itemCount, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}
