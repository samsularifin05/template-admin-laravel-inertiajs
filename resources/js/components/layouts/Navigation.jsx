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
            await post("/admin/logout");
        } catch (error) {
            toast.error("Logout gagal!");
        }
    };

    return (
        <header className="w-full bg-card border-b border-stroke flex h-18 items-center justify-between px-8 shadow-premium transition-colors duration-300">
            {/* Left Side: Toggle & Search */}
            <div className="flex items-center gap-4 flex-1 max-w-md">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg cursor-pointer hover:bg-page text-main focus:outline-none transition-colors"
                >
                    <IconMenu2 size={24} />
                </button>

                {/* Search Bar */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search here..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-page border border-stroke text-main rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    />
                    <IconSearch
                        size={18}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted opacity-50"
                    />
                </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <button className="relative p-2 hover:bg-page rounded-lg transition-colors">
                    <IconBell size={22} className="text-main" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-card"></span>
                </button>

                {/* Settings with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onMouseEnter={() => setShowDropdown(true)}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            showDropdown
                                ? "bg-page text-main"
                                : "hover:bg-page text-main"
                        }`}
                    >
                        <IconSettings size={22} />
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div
                            onMouseLeave={() => setShowDropdown(false)}
                            className="absolute right-0 mt-2 w-56 bg-card rounded-2xl shadow-premium-lg border border-stroke py-2 z-50 overflow-hidden animate-scale-up"
                        >
                            <Link
                                href="/profile"
                                className="flex items-center gap-3 px-4 py-3 text-sm text-main hover:bg-page transition-colors"
                                onClick={() => setShowDropdown(false)}
                            >
                                <IconUser size={18} className="text-muted" />
                                <span>Profile</span>
                            </Link>

                            <Link
                                href="/admin/settings"
                                className="flex items-center gap-3 px-4 py-3 text-sm text-main hover:bg-page transition-colors"
                                onClick={() => setShowDropdown(false)}
                            >
                                <IconSettings
                                    size={18}
                                    className="text-muted"
                                />
                                <span>Settings</span>
                            </Link>

                            <hr className="my-2 border-stroke" />

                            <button
                                type="button"
                                onClick={(e) => {
                                    handleLogout(e);
                                }}
                                className="w-full flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50/50 transition-colors text-left"
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
