import { create } from "zustand";

function getKey(name) {
    return name;
}

export const useModalStore = create((set, get) => ({
    // Awal kosong, supaya bisa multi modal berdasarkan nama
    modals: {},

    showModal: ({ name, data = null, isEdit = false }) =>
        set((state) => ({
            modals: {
                ...state.modals,
                [getKey(name)]: {
                    open: true,
                    data,
                    isEdit,
                },
            },
        })),

    hideModal: ({ name }) =>
        set((state) => {
            const newModals = { ...state.modals };
            delete newModals[getKey(name)];
            return { modals: newModals };
        }),

    isModalOpen: ({ name }) => {
        return !!get().modals[getKey(name)]?.open;
    },

    getModalData: ({ name }) => {
        return get().modals[getKey(name)] || null;
    },

    isEditMode: ({ name }) => {
        return !!get().modals[getKey(name)]?.isEdit;
    },

    hideAll: () => set({ modals: {} }),
}));
