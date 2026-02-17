import { create } from 'zustand';

const useQuickViewStore = create((set) => ({
    isOpen: false,
    selectedProduct: null,

    openModal: (product) => set({ isOpen: true, selectedProduct: product }),
    closeModal: () => set({ isOpen: false, selectedProduct: null }),
}));

export default useQuickViewStore;
