import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { IconX } from "@tabler/icons-react";
import { useModalStore } from "@/store/modalStore";

const Modal = ({
    name,
    title,
    children,
    maxWidth = "2xl",
    position = "top-center",
}) => {
    const { isModalOpen, hideModal } = useModalStore();
    const isOpen = isModalOpen({ name });

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) {
                hideModal({ name });
            }
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.addEventListener("keydown", handleEscape);
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, name, hideModal]);

    if (!isOpen) return null;

    const maxWidthClass = {
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "2xl": "sm:max-w-2xl",
    }[maxWidth];

    const positionClass = {
        center: "items-center justify-center",
        "top-center": "items-start justify-center pt-20",
    }[position];

    return createPortal(
        <div
            className={`fixed inset-0 z-50 overflow-y-auto px-4 py-6 sm:px-0 flex ${positionClass}`}
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 transform transition-all"
                onClick={() => hideModal({ name })}
            >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal Content */}
            <div
                className={`mb-6 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full ${maxWidthClass} sm:mx-auto z-60`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        {title}
                    </h3>
                    <button
                        type="button"
                        className="text-gray-400 cursor-pointer hover:text-gray-500 focus:outline-none"
                        onClick={() => hideModal({ name })}
                    >
                        <IconX className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4">{children}</div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
