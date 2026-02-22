'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            isHydrated: false,
            setHasHydrated: (state) => set({ isHydrated: state }),
            hydrate: () => {
                useCartStore.persist.rehydrate();
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

                    return { items: newItems };
                });
            },

            // Remove item from cart
            removeItem: (itemId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== itemId),
                }));
            },

            // Update item quantity
            updateQuantity: (itemId, quantity) => {
                if (quantity < 1) return;
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === itemId ? { ...item, quantity } : item
                    ),
                }));
            },

            // Clear cart
            clearCart: () => {
                set({ items: [] });
            },

            // Computed values (methods instead of getters to work best with persist)
            getTotalItems: () => {
                return get().items.reduce((sum, item) => sum + item.quantity, 0);
            },

            getTotalPrice: () => {
                return get().items.reduce(
                    (sum, item) => sum + item.product.price * item.quantity,
                    0
                );
            },
        }),
        {
            name: 'aureevo-cart', // unique name for localStorage key
            storage: createJSONStorage(() => localStorage),
            skipHydration: true, // Handle hydration carefully in Next.js
            onRehydrateStorage: () => (state) => {
                state.setHasHydrated(true);
            },
        }
    )
);

export default useCartStore;
