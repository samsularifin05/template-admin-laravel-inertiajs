import * as Icons from "@tabler/icons-react";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { IconSearch, IconX, IconInbox } from "@tabler/icons-react";

// Semantic categories for a food/POS app
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
            "potato",
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

    // Filter and group icons
    const filteredIcons = useMemo(() => {
        const allIconNames = Object.keys(Icons).filter(
            (name) =>
                name.startsWith("Icon") &&
                (typeof Icons[name] === "function" ||
                    typeof Icons[name] === "object"),
        );

        const matches = allIconNames.filter((name) => {
            const lowName = name.toLowerCase();
            const matchesSearch = lowName.includes(search.toLowerCase());

            if (activeTab === "All") return matchesSearch;

            const category = CATEGORIES.find((c) => c.name === activeTab);
            if (!category) return matchesSearch;

            const matchesCategory = category.keywords.some((k) =>
                lowName.includes(k.toLowerCase()),
            );
            return matchesSearch && matchesCategory;
        });

        return matches;
    }, [search, activeTab]);

    // Reset visible count when tab or search changes
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
        <div className="flex flex-col h-[450px] w-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {/* Header with Search */}
            <div className="p-3 bg-white border-b border-gray-50 z-10">
                <div className="relative mb-3">
                    <IconSearch
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Cari ikon (misal: burger, coffee, card...)"
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-theme-500 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                    />
                </div>

                {/* Category Tabs */}
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide no-scrollbar">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.name}
                            type="button"
                            onClick={() => setActiveTab(cat.name)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                                activeTab === cat.name
                                    ? "bg-theme-500 text-white border-theme-500 shadow-sm"
                                    : "bg-white text-gray-500 border-gray-100 hover:border-theme-200"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Area */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-3 custom-scrollbar"
            >
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
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
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all hover:scale-105 active:scale-95 group ${
                                    isActive
                                        ? "bg-theme-50 border-theme-500 text-theme-600 shadow-sm"
                                        : "bg-white border-gray-50 text-gray-400 hover:border-theme-200 hover:text-theme-500"
                                }`}
                            >
                                <IconComponent size={24} />
                                <span className="text-[8px] mt-1.5 truncate w-full text-center group-hover:text-theme-600 transition-colors">
                                    {name.replace("Icon", "")}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {filteredIcons.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full py-10 text-gray-300">
                        <IconInbox size={48} stroke={1} />
                        <p className="text-sm font-medium mt-2">
                            Ikon tidak ditemukan
                        </p>
                    </div>
                )}

                {visibleCount < filteredIcons.length && (
                    <div className="py-4 text-center">
                        <p className="text-[10px] text-gray-400 font-medium">
                            Scroll ke bawah untuk memuat lebih banyak (
                            {filteredIcons.length - visibleCount} sisa)
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-3 py-2 border-t border-gray-100 flex justify-between items-center shrink-0">
                <span className="text-[10px] text-gray-500 font-medium">
                    {filteredIcons.length} Ikon ditemukan
                </span>
                {value && (
                    <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-gray-200">
                        <span className="text-[10px] text-gray-400">
                            Terpilih:
                        </span>
                        {(() => {
                            const SelIcon = Icons[value];
                            return SelIcon ? (
                                <SelIcon size={14} className="text-theme-500" />
                            ) : null;
                        })()}
                        <span className="text-[10px] font-bold text-gray-700">
                            {value.replace("Icon", "")}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IconPicker;
