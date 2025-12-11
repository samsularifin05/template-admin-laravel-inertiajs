import { create } from "zustand";

export const useSidebarStore = create((set) => ({
    isOpen: window.innerWidth <= 768 ? false : true, // Default open
    toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
    setSidebarOpen: (isOpen) => set({ isOpen }),
}));
