import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    IconLayoutDashboard,
    IconBriefcase,
    IconUsers,
    IconFileText,
    IconX,
    IconUser,
    IconChevronDown,
    IconSettings,
    IconClipboardList,
    IconList,
    IconUserPlus,
    IconShield,
    IconMail,
    IconBell,
    IconWorld,
    IconLock,
    IconKey,
} from "@tabler/icons-react";
import LogoImg from "../../assets/images/logo.jpg";
import AvatarImg from "../../assets/images/Avatar.png";
import DefaultFoto from "../../assets/images/defaultfoto.jpg";
import { useSidebarStore } from "@/store/sidebarStore";
import { useIsMobile } from "@/utils/isMobile";

const isAdmin = [
    {
        label: "Dasbor",
        icon: IconLayoutDashboard,
        href: "/admin/dashboard",
    },
    {
        label: "Posting Pekerjaan",
        icon: IconBriefcase,
        href: "/admin/jobs",
    },
    {
        label: "Pengguna",
        icon: IconUser,
        href: "/admin/pengguna",
        children: [
            {
                label: "Daftar Pengguna",
                icon: IconList,
                href: "/admin/pengguna/list",
            },
            {
                label: "Tambah Pengguna",
                icon: IconUserPlus,
                href: "/admin/pengguna/create",
            },
            {
                label: "Role & Permission",
                icon: IconShield,
                href: "/admin/pengguna/roles",
            },
        ],
    },
    {
        label: "Pelamar",
        icon: IconUsers,
        href: "/admin/pelamar",
    },
    {
        label: "Testimoni",
        icon: IconFileText,
        href: "/admin/testimonials",
    },
    {
        label: "Pengaturan",
        icon: IconSettings,
        children: [
            {
                label: "Umum",
                icon: IconWorld,
                href: "/admin/settings/general",
            },
            {
                label: "Email",
                icon: IconMail,
                href: "/admin/settings/email",
            },
            {
                label: "Notifikasi",
                icon: IconBell,
                href: "/admin/settings/notifications",
            },
            {
                label: "Keamanan",
                icon: IconLock,
                children: [
                    {
                        label: "Password Policy",
                        icon: IconKey,
                        href: "/admin/settings/security/password",
                    },
                    {
                        label: "Two Factor Auth",
                        icon: IconShield,
                        href: "/admin/settings/security/2fa",
                    },
                    {
                        label: "Session Management",
                        icon: IconUser,
                        href: "/admin/settings/security/sessions",
                    },
                ],
            },
        ],
    },
];
const isJobseeker = [
    {
        label: "Dasbor",
        icon: IconLayoutDashboard,
        href: "/jobseeker/dashboard",
    },
    {
        label: "Lamaran Saya",
        icon: IconClipboardList,
        children: [
            {
                label: "Semua Lamaran",
                icon: IconList,
                href: "/jobseeker/applications",
            },
            {
                label: "Sedang Diproses",
                icon: IconBell,
                href: "/jobseeker/applications/pending",
            },
            {
                label: "Diterima",
                icon: IconShield,
                href: "/jobseeker/applications/accepted",
            },
        ],
    },
];

export default function Sidebar() {
    const { auth } = usePage().props;
    const { isOpen, toggleSidebar, setSidebarOpen } = useSidebarStore();
    const isMobile = useIsMobile();

    let menuData = [];

    if (auth?.user) {
        if (auth?.user.user_type === "admin") {
            menuData = isAdmin;
        } else if (auth?.user.user_type === "jobseeker") {
            menuData = isJobseeker;
        }
    } else {
        menuData = isAdmin;
    }

    const url = window.location.pathname;

    const isActive = (href) => {
        if (href === "/admin") {
            return url === href;
        }
        return url?.startsWith(href);
    };

    const handleMenuClick = () => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    // Mobile Overlay
    if (isMobile && isOpen) {
        return (
            <>
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
                <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-gray-50 border-r border-gray-200 flex flex-col transition-transform duration-300 transform translate-x-0">
                    <SidebarContent
                        auth={auth}
                        menuData={menuData}
                        isActive={isActive}
                        onMenuClick={handleMenuClick}
                        onClose={() => setSidebarOpen(false)}
                        isMobile={true}
                    />
                </aside>
            </>
        );
    }

    // Mobile Closed
    if (isMobile && !isOpen) {
        return null;
    }

    // Desktop Closed
    if (!isMobile && !isOpen) {
        return null; // Or render a mini sidebar if desired
    }

    // Desktop Open
    return (
        <aside className="w-72 h-screen flex flex-col bg-gray-50 border-r border-gray-200 transition-all duration-300">
            <SidebarContent
                auth={auth}
                menuData={menuData}
                isActive={isActive}
                onMenuClick={handleMenuClick}
                isMobile={false}
            />
        </aside>
    );
}

// MenuItem Component with Multi-Level Support
const MenuItem = ({ item, isActive, onMenuClick, level = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;

    // Check if current item or any of its children is active
    const isItemActive = item.href ? isActive(item.href) : false;
    const hasActiveChild =
        hasChildren &&
        item.children.some((child) => child.href && isActive(child.href));
    const shouldHighlight = isItemActive || hasActiveChild;

    // Auto-expand if has active child
    React.useEffect(() => {
        if (hasActiveChild) {
            setIsExpanded(true);
        }
    }, [hasActiveChild]);

    const handleClick = (e) => {
        if (hasChildren) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
        } else if (item.href) {
            onMenuClick();
        }
    };

    // Calculate padding for nested levels
    const paddingLeftValue = level === 0 ? 16 : 16 + level * 24;

    return (
        <div>
            {/* Parent Menu Item */}
            {hasChildren ? (
                <button
                    onClick={handleClick}
                    style={{ paddingLeft: `${paddingLeftValue}px` }}
                    className={`w-full flex items-center justify-between gap-3 pr-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                        shouldHighlight
                            ? "bg-blue-50 text-primary shadow-sm"
                            : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <Icon
                                size={20}
                                className={
                                    shouldHighlight
                                        ? "text-primary"
                                        : "text-gray-500"
                                }
                            />
                        )}
                        <span>{item.label}</span>
                    </div>
                    <IconChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                        } ${
                            shouldHighlight ? "text-primary" : "text-gray-400"
                        }`}
                    />
                </button>
            ) : (
                <Link
                    href={item.href}
                    onClick={handleClick}
                    style={{ paddingLeft: `${paddingLeftValue}px` }}
                    className={`flex items-center gap-3 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                        isItemActive
                            ? "bg-blue-50 text-primary font-medium shadow-sm"
                            : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    {Icon && (
                        <Icon
                            size={20}
                            className={
                                isItemActive ? "text-primary" : "text-gray-500"
                            }
                        />
                    )}
                    <span>{item.label}</span>
                </Link>
            )}

            {/* Submenu Items */}
            {hasChildren && (
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded
                            ? "max-h-[500px] opacity-100"
                            : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="mt-1 space-y-0.5 py-1">
                        {item.children.map((child, index) => (
                            <MenuItem
                                key={index}
                                item={child}
                                isActive={isActive}
                                onMenuClick={onMenuClick}
                                level={level + 1}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const SidebarContent = ({
    auth,
    menuData,
    isActive,
    onMenuClick,
    onClose,
    isMobile,
}) => (
    <>
        {/* Header / Logo */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <img
                    src={LogoImg}
                    alt="Join Joboffer Indonesia"
                    className="h-12 w-auto object-contain"
                />
                <div className="bg-blue-50 px-4 py-2 rounded-full">
                    <div className="text-sm font-bold text-primary whitespace-nowrap">
                        {auth?.user?.user_type === "admin" ? "ADMIN" : "USER"}{" "}
                        PANEL
                    </div>
                </div>
            </div>
        </div>

        {/* User Profile Card */}
        <div className="p-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                    <img
                        src={
                            auth?.user?.profile_photo
                                ? `/storage/${auth?.user?.profile_photo}`
                                : DefaultFoto
                        }
                        alt="User Avatar"
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 text-sm truncate">
                            {auth?.user?.username || "Cara Goyette"}
                        </div>
                        <div className="text-xs text-gray-500">
                            {auth?.user?.email || "cara.goyette@example.com"}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto">
            {menuData.map((menu, index) => (
                <MenuItem
                    key={index}
                    item={menu}
                    isActive={isActive}
                    onMenuClick={onMenuClick}
                    level={0}
                />
            ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-400 text-center">
                Join Joboffer v1.0
            </div>
        </div>
    </>
);
