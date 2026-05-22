import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "plastinki_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function add(record, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.record_id === record.id);
      if (existing) {
        return prev.map((i) =>
          i.record_id === record.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          record_id: record.id,
          title: record.title,
          artist: record.artist,
          price: record.price,
          image_url: record.image_url,
          quantity,
        },
      ];
    });
  }

  function remove(recordId) {
    setItems((prev) => prev.filter((i) => i.record_id !== recordId));
  }

  function setQuantity(recordId, quantity) {
    if (quantity <= 0) return remove(recordId);
    setItems((prev) =>
      prev.map((i) => (i.record_id === recordId ? { ...i, quantity } : i))
    );
  }

  function clear() {
    setItems([]);
  }

  const total = items.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, setQuantity, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
