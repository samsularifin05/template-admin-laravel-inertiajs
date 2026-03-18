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
    IconLogout,
    IconUserCircle,
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
    {
        label: "Komponen",
        icon: IconWorld,
        children: [
            {
                label: "Showcase Utama",
                icon: IconClipboardList,
                href: "/admin/examples/components",
            },
            {
                label: "Subscription Table",
                icon: IconList,
                href: "/admin/examples/subscriptions",
            },
        ],
    },
];

export default function Sidebar() {
    const { auth } = usePage().props;
    const { isOpen, toggleSidebar, setSidebarOpen } = useSidebarStore();
    const isMobile = useIsMobile();

    let menuData = isAdmin;

    // if (auth?.user) {
    //     if (auth?.user.user_type === "admin") {
    //         menuData = isAdmin;
    //     } else if (auth?.user.user_type === "jobseeker") {
    //         menuData = isJobseeker;
    //     }
    // } else {
    //     menuData = isAdmin;
    // }

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
                <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-content border-r border-stroke flex flex-col transition-transform duration-300 transform translate-x-0 shadow-premium">
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
        <aside className="w-64 h-screen flex flex-col bg-content border-r border-stroke transition-all duration-300">
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
        <div className="w-full">
            {/* Parent Menu Item */}
            {hasChildren ? (
                <button
                    onClick={handleClick}
                    style={{ paddingLeft: `${paddingLeftValue}px` }}
                    className={`w-full flex items-center justify-between gap-3 pr-3 py-2 rounded-xl text-sm transition-all duration-300 cursor-pointer ${
                        shouldHighlight
                            ? "bg-primary/5 text-primary font-semibold"
                            : "text-main hover:bg-page font-medium"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <Icon
                                size={18}
                                className={
                                    shouldHighlight
                                        ? "text-primary"
                                        : "text-muted opacity-70"
                                }
                            />
                        )}
                        <span className="tracking-tight">{item.label}</span>
                    </div>
                    <IconChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${
                            isExpanded ? "rotate-0" : "-rotate-90 opacity-40"
                        } ${shouldHighlight ? "text-primary opacity-100" : "text-muted"}`}
                    />
                </button>
            ) : (
                <Link
                    href={item.href}
                    onClick={handleClick}
                    style={{ paddingLeft: `${paddingLeftValue}px` }}
                    className={`flex items-center gap-3 pr-3 py-2 rounded-xl text-sm transition-all duration-300 cursor-pointer ${
                        isItemActive
                            ? "bg-primary text-white font-semibold shadow-premium shadow-primary/20"
                            : "text-main hover:bg-page font-medium"
                    }`}
                >
                    {Icon && (
                        <Icon
                            size={18}
                            className={
                                isItemActive
                                    ? "text-white"
                                    : "text-muted opacity-70"
                            }
                        />
                    )}
                    <span className="tracking-tight">{item.label}</span>
                </Link>
            )}

            {/* Submenu Items */}
            {hasChildren && (
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded
                            ? "max-h-125 opacity-100"
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
}) => {
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    return (
        <>
            {/* Header / Logo */}
            <div className="px-4 flex justify-between h-18 items-center border-b border-stroke shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden border border-stroke shrink-0">
                        <img
                            src={LogoImg}
                            alt="Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-main leading-tight tracking-tight">
                            Themes App
                        </div>
                        <div className="text-[10px] text-muted leading-tight">
                            Admin Panel
                        </div>
                    </div>
                </div>
                {isMobile && onClose && (
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-muted hover:text-main hover:bg-page transition-colors"
                    >
                        <IconX size={18} />
                    </button>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-3 pb-4 space-y-0.5 overflow-y-auto pt-2">
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
            <div className="px-4 py-3 border-t border-stroke">
                <div className="text-[10px] font-bold text-muted text-center tracking-widest uppercase opacity-40">
                    Themes App v1.0
                </div>
            </div>
        </>
    );
};
