import * as Icons from "@tabler/icons-react";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { IconSearch, IconInbox } from "@tabler/icons-react";

/**
 * @param {Object} props
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 * @param {Function} props.onClose
 */
const CATEGORIES = [
    { name: "All", keywords: [] },
    {
        name: "Food",
        keywords: [
            "food",
            "burger",
            "pizza",
            "meat",
            "cookie",
            "bowl",
            "chef",
            "salt",
            "pepper",
            "egg",
            "cheese",
            "lemon",
            "carrot",
            "apple",
            "banana",
            "strawberry",
            "cake",
            "candy",
            "ice-cream",
            "soup",
            "salad",
            "kitchen",
            "cutlery",
            "fork",
            "spoon",
            "knife",
            "bread",
            "table",
            "armchair",
            "fish",
            "meat",
            "bone",
            "egg",
            "mushroom",
            "leaf",
            "carrot",
            "corn",
            "clover",
        ],
    },
    {
        name: "Beverage",
        keywords: [
            "drink",
            "coffee",
            "glass",
            "bottle",
            "cup",
            "mug",
            "beer",
            "wine",
            "tea",
            "milk",
            "juice",
            "liquid",
            "ice",
            "lemonade",
            "cocktail",
            "shaker",
            "tea",
        ],
    },
    {
        name: "Goods",
        keywords: [
            "soap",
            "spray",
            "clean",
            "wash",
            "box",
            "package",
            "gift",
            "container",
            "perfume",
            "brush",
            "pill",
            "flask",
            "premium",
            "diamond",
            "crown",
            "sun",
            "moon",
        ],
    },
    {
        name: "Commerce",
        keywords: [
            "shop",
            "store",
            "cart",
            "basket",
            "bag",
            "shopping",
            "sale",
            "discount",
            "tag",
            "barcode",
            "qrcode",
            "cash",
            "credit",
            "card",
            "coin",
            "money",
            "wallet",
            "report",
            "receipt",
            "bill",
            "percentage",
        ],
    },
    {
        name: "Interface",
        keywords: [
            "home",
            "settings",
            "tools",
            "trash",
            "edit",
            "pencil",
            "plus",
            "minus",
            "check",
            "x",
            "search",
            "filter",
            "star",
            "heart",
            "bell",
            "alert",
            "clock",
            "calendar",
            "user",
            "users",
            "id",
            "profile",
            "logout",
            "login",
            "key",
            "lock",
            "shield",
            "chevron",
            "arrow",
        ],
    },
];

const IconPicker = ({ value, onChange, onClose }) => {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const [visibleCount, setVisibleCount] = useState(100);
    const scrollContainerRef = useRef(null);

    const filteredIcons = useMemo(() => {
        const allIconNames = Object.keys(Icons).filter(
            (name) =>
                name.startsWith("Icon") &&
                (typeof Icons[name] === "function" ||
                    typeof Icons[name] === "object"),
        );

        return allIconNames.filter((name) => {
            const lowName = name.toLowerCase();
            const matchesSearch = lowName.includes(search.toLowerCase());

            if (activeTab === "All") return matchesSearch;

            const category = CATEGORIES.find((c) => c.name === activeTab);
            if (!category) return matchesSearch;

            const matchesCategory = category.keywords.some((keyword) =>
                lowName.includes(keyword.toLowerCase()),
            );

            return matchesSearch && matchesCategory;
        });
    }, [search, activeTab]);

    useEffect(() => {
        setVisibleCount(100);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [activeTab, search]);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 100) {
            if (visibleCount < filteredIcons.length) {
                setVisibleCount((prev) => prev + 100);
            }
        }
    };

    const iconsToShow = filteredIcons.slice(0, visibleCount);

    return (
        <div
            className="flex w-full flex-col overflow-hidden rounded-2xl border border-stroke bg-card shadow-premium"
            style={{ height: 450 }}
        >
            <div className="z-10 border-b border-stroke bg-card p-3">
                <div className="relative mb-3">
                    <IconSearch
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Cari ikon (misal: burger, coffee, card...)"
                        className="w-full rounded-xl border border-stroke bg-page py-2 pl-10 pr-4 text-sm text-main placeholder:text-muted transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide no-scrollbar">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.name}
                            type="button"
                            onClick={() => setActiveTab(cat.name)}
                            className={`whitespace-nowrap rounded-xl border px-3 py-1.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 ${
                                activeTab === cat.name
                                    ? "border-primary bg-primary text-white shadow-premium shadow-primary/15"
                                    : "border-stroke bg-card text-main hover:border-primary/40 hover:bg-page"
                            }`}
                            aria-pressed={activeTab === cat.name}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="custom-scrollbar flex-1 overflow-y-auto p-3"
            >
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                    {iconsToShow.map((name) => {
                        const IconComponent = Icons[name];
                        const isActive = value === name;

                        return (
                            <button
                                key={name}
                                type="button"
                                onClick={() => {
                                    onChange(name);
                                    if (onClose) onClose();
                                }}
                                title={name}
                                className={`group flex flex-col items-center justify-center rounded-xl border p-2 transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 ${
                                    isActive
                                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                                        : "border-stroke bg-card text-muted hover:border-primary/30 hover:bg-page hover:text-primary"
                                }`}
                            >
                                <IconComponent size={24} />
                                <span className="mt-1.5 w-full truncate text-center text-[8px] transition-colors group-hover:text-primary">
                                    {name.replace("Icon", "")}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {filteredIcons.length === 0 && (
                    <div className="flex h-full flex-col items-center justify-center py-10 text-muted">
                        <IconInbox size={48} stroke={1} />
                        <p className="mt-2 text-sm font-medium">
                            Ikon tidak ditemukan
                        </p>
                    </div>
                )}

                {visibleCount < filteredIcons.length && (
                    <div className="py-4 text-center">
                        <p className="text-[10px] font-medium text-muted">
                            Scroll ke bawah untuk memuat lebih banyak (
                            {filteredIcons.length - visibleCount} sisa)
                        </p>
                    </div>
                )}
            </div>

            <div className="flex shrink-0 items-center justify-between border-t border-stroke bg-page px-3 py-2">
                <span className="text-[10px] font-medium text-muted">
                    {filteredIcons.length} Ikon ditemukan
                </span>
                {value && (
                    <div className="flex items-center gap-1.5 rounded-lg border border-stroke bg-card px-2 py-1">
                        <span className="text-[10px] text-muted">
                            Terpilih:
                        </span>
                        {(() => {
                            const SelectedIcon = Icons[value];
                            return SelectedIcon ? (
                                <SelectedIcon
                                    size={14}
                                    className="text-primary"
                                />
                            ) : null;
                        })()}
                        <span className="text-[10px] font-bold text-main">
                            {value.replace("Icon", "")}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IconPicker;
