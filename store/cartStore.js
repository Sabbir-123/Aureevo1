'use client';

import { create } from 'zustand';

// Helper to safely access localStorage
const getStorageItem = (key) => {
    if (typeof window === 'undefined') return null;
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch {
        return null;
    }
};

const setStorageItem = (key, value) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Storage full or unavailable
    }
};

const useCartStore = create((set, get) => ({
    items: [],
    isHydrated: false,

    // Hydrate from localStorage
    hydrate: () => {
        const stored = getStorageItem('aureevo-cart');
        if (stored) {
            set({ items: stored, isHydrated: true });
        } else {
            set({ isHydrated: true });
        }
    },

    // Add item to cart
    addItem: (product, size, color, quantity = 1) => {
        set((state) => {
            const existingIndex = state.items.findIndex(
                (item) =>
                    item.product.id === product.id &&
                    item.size === size &&
                    (item.color?.name === color?.name || (!item.color && !color))
            );

            let newItems;
            if (existingIndex > -1) {
                newItems = [...state.items];
                newItems[existingIndex] = {
                    ...newItems[existingIndex],
                    quantity: newItems[existingIndex].quantity + quantity,
                };
            } else {
                newItems = [
                    ...state.items,
                    {
                        id: `${product.id}-${size}-${color?.name || 'default'}-${Date.now()}`,
                        product,
                        size,
                        color,
                        quantity,
                    },
                ];
            }

            setStorageItem('aureevo-cart', newItems);
            return { items: newItems };
        });
    },

    // Remove item from cart
    removeItem: (itemId) => {
        set((state) => {
            const newItems = state.items.filter((item) => item.id !== itemId);
            setStorageItem('aureevo-cart', newItems);
            return { items: newItems };
        });
    },

    // Update item quantity
    updateQuantity: (itemId, quantity) => {
        if (quantity < 1) return;
        set((state) => {
            const newItems = state.items.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
            );
            setStorageItem('aureevo-cart', newItems);
            return { items: newItems };
        });
    },

    // Clear cart
    clearCart: () => {
        setStorageItem('aureevo-cart', []);
        set({ items: [] });
    },

    // Computed values
    get totalItems() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
    },

    get totalPrice() {
        return get().items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );
    },

    getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
    },

    getTotalPrice: () => {
        return get().items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );
    },
}));

export default useCartStore;
