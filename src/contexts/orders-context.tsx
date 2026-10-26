import type { CartItem } from '@/contexts/cart-context';
import { createContext, useContext, useState, type ReactNode } from 'react';

export type Order = {
  id: string;
  items: CartItem[];
  address: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  status: 'Placed' | 'Preparing' | 'Delivered';
};

type OrdersContextType = {
  orders: Order[];
  placeOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  function placeOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) {
    const order: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Placed',
    };

    setOrders((current) => [order, ...current]);

    return order;
  }

  return (
    <OrdersContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error('useOrders must be used inside OrdersProvider');
  }

  return context;
}
