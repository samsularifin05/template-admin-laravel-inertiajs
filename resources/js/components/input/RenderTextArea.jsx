import React from "react";

const RenderTextArea = ({
    name,
    value,
    onChange,
    placeholder = "",
    readOnly = false,
    label = "",
    required = false,
    className = "",
    error = null,
}) => {
    return (
        <div className="w-full">
            {label && <label className="block text-base mb-1">{label}</label>}

            <textarea
                id={name}
                name={name}
                readOnly={readOnly}
                placeholder={placeholder}
                required={required}
                value={value || ""}
                className={`
                    w-full min-h-[100px] border border-gray-300 rounded-lg px-4 py-2
                    bg-white placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-[#57A7C6]
                    ${readOnly ? "bg-gray-100 text-gray-500" : ""}
                    ${error ? "border-red-500 focus:ring-red-500" : ""}
                    ${className}
                `}
                onChange={(e) => onChange(e.target.value)}
            />

            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
};

export default RenderTextArea;
