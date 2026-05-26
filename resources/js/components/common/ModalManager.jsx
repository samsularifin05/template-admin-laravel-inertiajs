import React from "react";
import { useModalStore } from "../../store/modalStore";
import Modal from "./Modal";

/**
 * @typedef {Object} ModalConfig
 * @property {boolean} open
 * @property {Object} [data]
 * @property {boolean} [isEdit]
 */

/**
 * @typedef {Object} ModalStore
 * @property {Object.<string, ModalConfig>} modals
 * @property {(payload: {name: string}) => void} hideModal
 */

const ModalManager = () => {
    // We only need to know WHICH modals are open. The store supports multiple.
    // For simplicity, we iterate over keys or check specific known keys.
    const { modals, hideModal } = useModalStore();

    // Helper to render a modal if open
    const renderModal = (name, Component, title, props = {}) => {
        const modal = modals[name];
        if (!modal?.open) return null;

        const handleClose = () => hideModal({ name });

        // Extract onSuccess from data if present to keep it separate or pass it down
        const { onSuccess, ...otherData } = modal.data || {};

        return (
            <Modal title={title} onClose={handleClose} {...props}>
                <Component
                    data={otherData} // Pass clean data
                    isEdit={modal.isEdit}
                    onClose={handleClose}
                    onSuccess={() => {
                        if (onSuccess) onSuccess();
                        handleClose();
                    }}
                />
            </Modal>
        );
    };

    return (
        <>

        </>
    );
};

export default ModalManager;
