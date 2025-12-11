import React from "react";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import axios from "axios";

const AsyncSelectInput = ({
    label,
    value,
    onChange,
    placeholder = "Select...",
    error,
    loadOptionsUrl, // For async mode
    options, // For manual mode
    isSearchable = true,
}) => {
    const loadOptions = async (inputValue) => {
        try {
            const response = await axios.get(loadOptionsUrl, {
                params: { search: inputValue },
            });
            return response.data;
        } catch (error) {
            console.error("Error loading options:", error);
            return [];
        }
    };

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: error ? "#ef4444" : "#d1d5db", // red-500 or gray-300
            borderRadius: "0.5rem", // rounded-lg
            paddingTop: "2px",
            paddingBottom: "2px",
            backgroundColor: "#ffffff", // gray-50
            boxShadow: state.isFocused ? "0 0 0 2px #57A7C6" : "none",
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
    };

    // Determine which mode to use
    const isAsyncMode = !!loadOptionsUrl;

    return (
        <div className="w-full">
            {label && <label className="block text-base mb-1">{label}</label>}
            {isAsyncMode ? (
                <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={loadOptions}
                    onChange={onChange}
                    value={value}
                    placeholder={placeholder}
                    styles={customStyles}
                    classNamePrefix="react-select"
                    isSearchable={isSearchable}
                />
            ) : (
                <Select
                    options={options}
                    onChange={onChange}
                    value={value}
                    placeholder={placeholder}
                    styles={customStyles}
                    classNamePrefix="react-select"
                    isSearchable={isSearchable}
                />
            )}
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
};

export default AsyncSelectInput;
