import React, { useState, useRef, useEffect } from "react";
import { Link, router, useForm } from "@inertiajs/react";
import {
    IconBell,
    IconSettings,
    IconSearch,
    IconLogout,
    IconUser,
    IconMenu2,
} from "@tabler/icons-react";
import toast from "react-hot-toast";
import { useSidebarStore } from "@/store/sidebarStore";

export default function Navigation() {
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const { toggleSidebar } = useSidebarStore();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    const { post } = useForm();

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            await post("/auth/logout");
        } catch (error) {
            toast.error("Logout gagal!");
        }
    };

    return (
        <header className="w-full bg-white border-b border-gray-200 flex h-16 items-center justify-between px-6 shadow-sm">
            {/* Left Side: Toggle & Search */}
            <div className="flex items-center gap-4 flex-1 max-w-md">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg cursor-pointer hover:bg-gray-100 text-gray-600 focus:outline-none"
                >
                    <IconMenu2 size={24} />
                </button>

                {/* Search Bar */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Cari"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <IconSearch
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <IconBell size={22} className="text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Settings with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onMouseEnter={() => setShowDropdown(true)}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            showDropdown ? "bg-gray-100" : "hover:bg-gray-100"
                        }`}
                    >
                        <IconSettings size={22} className="text-gray-600" />
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div
                            onMouseLeave={() => setShowDropdown(false)}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-9999"
                        >
                            <Link
                                href="/profile"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setShowDropdown(false)}
                            >
                                <IconUser size={18} />
                                <span>Profile</span>
                            </Link>

                            <Link
                                href="/admin/settings"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setShowDropdown(false)}
                            >
                                <IconSettings size={18} />
                                <span>Settings</span>
                            </Link>

                            <hr className="my-2 border-gray-200" />

                            <button
                                type="button"
                                onClick={(e) => {
                                    handleLogout(e);
                                }}
                                className="w-full flex cursor-pointer items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                            >
                                <IconLogout size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
