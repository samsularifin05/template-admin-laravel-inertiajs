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
                <aside className="fixed inset-y-0 left-0 z-50 w-80 bg-content border-r border-stroke flex flex-col transition-transform duration-300 transform translate-x-0 shadow-premium">
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
        <aside className="w-80 h-screen flex flex-col bg-content border-r border-stroke transition-all duration-300">
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
                    className={`w-full flex items-center justify-between gap-3 pr-4 py-3.5 rounded-2xl text-sm transition-all duration-300 cursor-pointer ${
                        shouldHighlight
                            ? "bg-primary/5 text-primary font-black shadow-premium-sm"
                            : "text-main hover:bg-page font-medium"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <Icon
                                size={20}
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
                            isExpanded
                                ? "rotate-0 shadow-lg"
                                : "-rotate-90 opacity-40"
                        } ${shouldHighlight ? "text-primary opacity-100" : "text-muted"}`}
                    />
                </button>
            ) : (
                <Link
                    href={item.href}
                    onClick={handleClick}
                    style={{ paddingLeft: `${paddingLeftValue}px` }}
                    className={`flex items-center gap-3 pr-4 py-3.5 rounded-2xl text-sm transition-all duration-300 cursor-pointer ${
                        isItemActive
                            ? "bg-primary text-white font-black shadow-premium shadow-primary/20 scale-[1.02]"
                            : "text-main hover:bg-page font-medium"
                    }`}
                >
                    {Icon && (
                        <Icon
                            size={20}
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
        <div className="p-6 pb-2 flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
                <img
                    src={LogoImg}
                    alt="Logo"
                    className="h-10 w-auto object-contain"
                />
                <div className="bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10">
                    <div className="text-[10px] font-black text-primary tracking-widest whitespace-nowrap uppercase">
                        {auth?.user?.user_type === "admin" ? "ADMIN" : "USER"}{" "}
                        PANEL
                    </div>
                </div>
            </div>
        </div>

        {/* User Profile Card */}
        <div className="p-4 px-6 md:p-6 md:px-6">
            <div className="bg-card rounded-2xl p-4 shadow-premium border border-stroke transition-all duration-300 hover:shadow-premium-lg">
                <div className="flex items-center gap-3">
                    <img
                        src={
                            auth?.user?.profile_photo
                                ? `/storage/${auth?.user?.profile_photo}`
                                : DefaultFoto
                        }
                        alt="User"
                        className="w-12 h-12 rounded-xl object-cover border border-stroke"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="font-black text-main text-sm truncate">
                            {auth?.user?.username || "Cara Goyette"}
                        </div>
                        <div className="text-[11px] text-muted font-medium truncate">
                            {auth?.user?.email || "cara.goyette@example.com"}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 md:px-6 pb-6 space-y-2 overflow-y-auto mt-2">
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
        <div className="p-6 border-t border-stroke">
            <div className="text-[10px] font-black text-muted text-center tracking-widest uppercase opacity-50">
                Themes App v1.0
            </div>
        </div>
    </>
);
