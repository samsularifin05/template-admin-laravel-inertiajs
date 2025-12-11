import React, { useState, useEffect } from "react";
import { IconUpload, IconX, IconPhoto } from "@tabler/icons-react";
import axios from "axios";

const ImageUpload = ({
    label,
    value,
    onChange,
    error,
    preview = true,
    currentPath = "",
}) => {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(value || "");

    // Update preview when value prop changes
    useEffect(() => {
        setPreviewUrl(value || "");
    }, [value]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("File harus berupa gambar");
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert("Ukuran file maksimal 2MB");
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("image", file);

            // Send old path to delete old file
            if (currentPath) {
                formData.append("old_path", currentPath);
            }

            // Use axios which is already configured with CSRF token in Laravel
            const response = await axios.post(
                "/admin/api/upload-image",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setPreviewUrl(response.data.url);
            onChange(response.data.path); // Store the path in the database
        } catch (error) {
            console.error("Upload error:", error);
            alert(
                "Gagal mengupload gambar: " +
                    (error.response?.data?.message || error.message)
            );
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreviewUrl("");
        onChange("");
    };

    return (
        <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">{label}</label>

            {/* Upload Button */}
            <label
                className={`
                    flex items-center justify-center gap-2 px-4 py-3
                    border-2 border-dashed border-gray-300 rounded-lg 
                    cursor-pointer hover:border-blue-500 hover:bg-blue-50 
                    transition-colors
                    ${uploading ? "opacity-50 cursor-not-allowed" : ""}
                `}
            >
                <IconUpload className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                    {uploading
                        ? "Mengupload..."
                        : "Pilih Gambar atau Drag & Drop"}
                </span>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                />
            </label>
            <p className="text-xs text-gray-500 -mt-2">
                Format: JPG, PNG, GIF. Maksimal 2MB
            </p>

            {/* Preview - Below Upload Button */}
            {preview && previewUrl && (
                <div className="relative inline-block">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full max-w-xs h-48 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg transition-colors"
                    >
                        <IconX className="h-4 w-4" />
                    </button>
                </div>
            )}

            {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
    );
};

export default ImageUpload;
