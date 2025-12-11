import React, { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

const InertiaTextInput = ({
    name,
    value,
    onChange,
    placeholder = "",
    readOnly = false,
    label = "",
    type = "text",
    required = false,
    className = "",
    error = null,
    onKeyDown,
    isRp = false,
    min,
    max,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const formatRupiah = (value) => {
        const numberString = value?.toString()?.replace(/[^\d]/g, "") || "";
        const num = parseInt(numberString, 10);
        if (isNaN(num)) return "";
        return "Rp " + num.toLocaleString("id-ID");
    };

    return (
        <div className="w-full">
            {label && <label className="block text-base mb-1">{label}</label>}

            <div className="relative">
                <input
                    id={name}
                    readOnly={readOnly}
                    type={inputType}
                    placeholder={placeholder}
                    required={required}
                    onKeyDown={onKeyDown}
                    min={min}
                    max={max}
                    value={
                        isRp && value
                            ? formatRupiah(value.toString())
                            : value || ""
                    }
                    className={`
                        w-full border border-gray-300 h-10 rounded-lg px-4 py-2 
                        bg-white placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-[#57A7C6]
                        ${isPassword ? "pr-10" : ""}
                        ${readOnly ? "bg-gray-100 text-gray-500" : ""}
                        ${error ? "border-red-500 focus:ring-red-500" : ""}
                        ${className}
                    `}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (isRp) {
                            onChange(val.replace(/[^\d]/g, ""));
                        } else {
                            onChange(val);
                        }
                    }}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                        {showPassword ? (
                            <IconEyeOff size={18} />
                        ) : (
                            <IconEye size={18} />
                        )}
                    </button>
                )}
            </div>

            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
};

export default InertiaTextInput;
