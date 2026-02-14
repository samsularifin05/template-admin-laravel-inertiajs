import React from "react";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { usePage } from "@inertiajs/react";
import api from "../../services/api"; // Use configured API

/**
 * @param {Object} props
 * @param {string} [props.label]
 * @param {any} props.value
 * @param {(value: any) => void} props.onChange
 * @param {string} [props.placeholder='Select...']
 * @param {string | null} [props.error]
 * @param {string} [props.loadOptionsUrl] URL to fetch options from
 * @param {(item: any) => {label: string, value: any}} [props.mapOption] Function to map raw data to select options
 * @param {boolean} [props.isSearchable=true]
 * @param {boolean} [props.isClearable=false]
 */
const AsyncSelectInput = ({
    label,
    value,
    onChange,
    placeholder = "Select...",
    error,
    loadOptionsUrl, // Add this
    mapOption = (item) => ({ label: item.name, value: item.id }),
    isSearchable = true,
    isClearable = false,
}) => {
    const loadOptions = async (inputValue) => {
        try {
            const response = await api.get(loadOptionsUrl, {
                params: { search: inputValue },
            });

            // Handle Laravel Pagination (response.data.data) or simple array (response.data)
            const rawData = response.data.data || response.data;

            if (Array.isArray(rawData)) {
                return rawData.map(mapOption);
            }
            return [];
        } catch (error) {
            console.error("Error loading options:", error);
            return [];
        }
    };

    const { store } = usePage().props;
    const themeColor = store?.theme_color || "#ea580c";

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: error ? "#ef4444" : "#d1d5db", // red-500 or gray-300
            borderRadius: "0.5rem", // rounded-lg
            paddingTop: "2px",
            paddingBottom: "2px",
            backgroundColor: "#ffffff", // gray-50
            boxShadow: state.isFocused ? `0 0 0 2px ${themeColor}` : "none",
            "&:hover": {
                borderColor: "#d1d5db",
            },
        }),
        input: (provided) => ({
            ...provided,
            "input:focus": {
                boxShadow: "none",
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#9ca3af", // gray-400
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 9999,
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Add this
    };

    // Determine which mode to use
    const isAsyncMode = !!loadOptionsUrl;

    const commonProps = {
        onChange,
        value,
        placeholder,
        styles: customStyles,
        classNamePrefix: "react-select",
        isSearchable,
        isClearable,
        menuPortalTarget:
            typeof document !== "undefined" ? document.body : null, // Portal to body
        menuPosition: "fixed", // Required for portal
    };

    return (
        <div className="w-full">
            {label && <label className="block text-base mb-1">{label}</label>}
            {isAsyncMode ? (
                <AsyncSelect
                    {...commonProps}
                    cacheOptions
                    defaultOptions
                    loadOptions={loadOptions}
                />
            ) : (
                <Select {...commonProps} options={options} />
            )}
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
};

export default AsyncSelectInput;
