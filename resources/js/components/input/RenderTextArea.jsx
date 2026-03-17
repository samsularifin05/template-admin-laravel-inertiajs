import React from "react";

/**
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 * @param {string} [props.placeholder='']
 * @param {boolean} [props.readOnly=false]
 * @param {string} [props.label='']
 * @param {boolean} [props.required=false]
 * @param {string} [props.className='']
 * @param {string | null} [props.error=null]
 */
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
            {label && (
                <label className="block text-base mb-1 text-main">
                    {label}
                </label>
            )}

            <textarea
                id={name}
                name={name}
                readOnly={readOnly}
                placeholder={placeholder}
                required={required}
                value={value || ""}
                className={`
                    w-full min-h-25 rounded-2xl border px-4 py-3
                    bg-card text-main border-stroke placeholder:text-muted
                    shadow-sm transition-colors
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                    ${readOnly ? "bg-page text-muted cursor-not-allowed" : ""}
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
