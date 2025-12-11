import React, { useState, useRef, useEffect } from "react";
import logoPutih from "../../../assets/images/logoWhite.png";
import {
    IconChevronDown,
    IconHome2,
    IconUser,
    IconMenu2,
    IconX,
} from "@tabler/icons-react";
import { Link, router, usePage } from "@inertiajs/react";
import { getItem, setItem } from "@/utils/localstroage";

const Navbar = (props) => {
    const { auth: response } = usePage().props;
    const path = window.location.pathname;

    const [aktif, setAktif] = useState(
        path === "/employer" ? "Employer" : "JobSeeker"
    );
    const [menuOpen, setMenuOpen] = useState(false);
    // Multi-language select
    const [selectedLangs, setSelectedLangs] = useState(["ID"]);
    const [showLang, setShowLang] = useState(false);
    const langOptions = [
        { code: "ID", label: "Indonesia", color: "#EF4444" },
        { code: "EN", label: "English", color: "#1A73E8" },
        { code: "JP", label: "日本語", color: "#F7DF1E" },
        { code: "KR", label: "한국어", color: "#06B6D4" },
        { code: "AR", label: "العربية", color: "#10B981" },
    ];
    const langDropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const isMenu = getItem("isMenu");
        if (isMenu) {
            setMenuOpen(true);
        }

        function handleClickOutside(event) {
            if (
                langDropdownRef.current &&
                !langDropdownRef.current.contains(event.target)
            ) {
                setShowLang(false);
            }
        }
        if (showLang)
            document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [showLang]);

    function toggleLang(code) {
        setSelectedLangs([code]);
        // setSelectedLangs((prev) =>
        //     prev.includes(code)
        //         ? prev.filter((c) => c !== code)
        //         : [...prev, code]
        // );
    }

    const goPage = (page) => {
        setAktif(page);
        if (page === "JobSeeker") {
            router.visit("/");
        } else {
            router.visit("/employer");
        }
    };

    return (
        <section id="navbar" className="w-full py-3 bg-white">
            <div className="container mx-auto px-2 flex items-center justify-between">
                {/* LEFT SIDE */}
                <div className="flex items-center gap-4">
                    {/* LOGO */}
                    <Link href="/">
                        <img
                            src={logoPutih}
                            className="lg:w-50 lg:h-25 h-18 w-[150px]"
                        />
                    </Link>
                    {/* JOB SEEKER / EMPLOYER */}
                    <div className="relative hidden xl:flex items-center bg-gray-200 rounded-full w-[260px] h-12 p-1">
                        <div
                            className="absolute top-1 left-1 w-[125px] h-10 rounded-full bg-primary transition-transform duration-300"
                            style={{
                                transform:
                                    aktif === "JobSeeker"
                                        ? "translateX(0)"
                                        : "translateX(130px)",
                            }}
                        />
                        <button
                            onClick={() => goPage("JobSeeker")}
                            className={`relative cursor-pointer z-10 flex items-center justify-center gap-2 w-[125px] h-10 transition-colors ${
                                aktif === "JobSeeker"
                                    ? "text-white"
                                    : "text-gray-600"
                            }`}
                        >
                            <IconUser size={18} />
                            <span>Job Seeker</span>
                        </button>
                        <button
                            onClick={() => goPage("Employer")}
                            className={`relative cursor-pointer z-10 flex items-center justify-center gap-2 w-[125px] h-10 transition-colors ${
                                aktif === "Employer"
                                    ? "text-white"
                                    : "text-gray-600"
                            }`}
                        >
                            <IconHome2 size={18} />
                            <span>Employer</span>
                        </button>
                    </div>
                </div>

                {/* RIGHT SIDE (DESKTOP) */}
                <div className="hidden xl:flex items-center gap-10">
                    <nav className="flex items-center gap-10 text-gray-800 text-[18px] font-medium">
                        <Link
                            href="/"
                            className="hover:text-primary cursor-pointer"
                        >
                            Beranda
                        </Link>
                        <Link href="/about-me" className="hover:text-primary">
                            Tentang Kami
                        </Link>
                        <Link href="/find-job" className="hover:text-primary">
                            Lowongan
                        </Link>
                    </nav>

                    {/* Multi Language Custom Select */}
                    <div className="relative" ref={langDropdownRef}>
                        <button
                            className="flex items-center gap-2 focus:outline-none px-2 py-1 rounded hover:bg-gray-100 min-w-[60px]"
                            onClick={() => setShowLang((v) => !v)}
                        >
                            {selectedLangs.length > 0 &&
                                (() => {
                                    const code = selectedLangs[0];
                                    const opt = langOptions.find(
                                        (l) => l.code === code
                                    );
                                    return (
                                        <span className="flex items-center gap-1 mr-1">
                                            <span className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center border border-gray-300">
                                                <span
                                                    className="w-full h-full block"
                                                    style={{
                                                        background: `linear-gradient(to bottom, ${opt.color} 50%, #fff 50%)`,
                                                    }}
                                                />
                                            </span>
                                            <span className="text-gray-800 text-[15px] font-medium">
                                                {code}
                                            </span>
                                        </span>
                                    );
                                })()}

                            <IconChevronDown
                                size={18}
                                className="text-gray-800"
                            />
                        </button>
                        {showLang && (
                            <div className="absolute right-0 mt-2 w-45 bg-white border rounded-xl shadow-lg z-20 p-2">
                                {langOptions.map((opt) => (
                                    <button
                                        key={opt.code}
                                        className={`flex items-center gap-2 w-full px-2 py-2 rounded hover:bg-gray-100 text-left ${
                                            selectedLangs.includes(opt.code)
                                                ? "bg-primary/10"
                                                : ""
                                        }`}
                                        onClick={() => toggleLang(opt.code)}
                                    >
                                        <span className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center border border-gray-300">
                                            <span
                                                className="w-full h-full block"
                                                style={{
                                                    background: `linear-gradient(to bottom, ${opt.color} 50%, #fff 50%)`,
                                                }}
                                            />
                                        </span>
                                        <span className="text-gray-800 text-[15px] font-medium">
                                            {opt.code}{" "}
                                            <span className="text-xs text-gray-400 ml-1">
                                                {opt.label}
                                            </span>
                                        </span>
                                        {selectedLangs.includes(opt.code) && (
                                            <span className="ml-auto text-primary font-bold">
                                                ✓
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link
                        href={
                            response?.user !== null
                                ? response?.user?.user_type === "admin"
                                    ? "/admin/dashboard"
                                    : "/jobseeker/dashboard"
                                : "/register"
                        }
                        className="bg-primary text-white px-6 py-2 rounded-xl text-[18px] font-semibold hover:opacity-90 transition"
                    >
                        {response?.user !== null
                            ? "Dashboard"
                            : "Daftar Sekarang"}
                    </Link>
                </div>

                {/* HAMBURGER (MOBILE) */}
                <button
                    className="xl:hidden text-gray-800 pr-5"
                    onClick={() => {
                        setMenuOpen(!menuOpen);
                        setItem("isMenu", !menuOpen);
                    }}
                >
                    {menuOpen ? <IconX size={28} /> : <IconMenu2 size={28} />}
                </button>
            </div>

            {/* MOBILE MENU */}
            {menuOpen && (
                <div className="xl:hidden bg-white px-6 pt-4 pb-6  space-y-5">
                    {/* Switch Mobile */}
                    <div className="relative flex items-center bg-gray-200 rounded-full w-full h-12 p-1 mx-auto">
                        <div
                            className="absolute top-1 left-1 w-1/2 h-10 rounded-full bg-primary transition-transform duration-300"
                            style={{
                                transform:
                                    aktif === "JobSeeker"
                                        ? "translateX(0)"
                                        : "translateX(100%)",
                            }}
                        />

                        <button
                            onClick={() => goPage("JobSeeker")}
                            className={`relative cursor-pointer z-10 flex items-center justify-center gap-2 w-1/2 h-10 ${
                                aktif === "JobSeeker"
                                    ? "text-white"
                                    : "text-gray-600"
                            }`}
                        >
                            <IconUser size={18} />
                            <span>Job Seeker</span>
                        </button>

                        <button
                            onClick={() => goPage("Employer")}
                            className={`relative cursor-pointer z-10 flex items-center justify-center gap-2 w-1/2 h-10 ${
                                aktif === "Employer"
                                    ? "text-white"
                                    : "text-gray-600"
                            }`}
                        >
                            <IconHome2 size={18} />
                            <span>Employer</span>
                        </button>
                    </div>

                    {/* Menu */}
                    <div className="flex flex-col gap-4 text-gray-800 text-[18px] font-medium mt-4">
                        <Link href="/" className="hover:text-primary text-left">
                            Beranda
                        </Link>
                        <Link
                            href="/about-me"
                            className="hover:text-primary text-left"
                        >
                            Tentang Kami
                        </Link>
                        <Link href="/find-job" className="hover:text-primary">
                            Lowongan
                        </Link>
                    </div>

                    {/* Multi Language Custom Select (Mobile) */}
                    <div className="relative" ref={langDropdownRef}>
                        <button
                            className="flex items-center gap-2 focus:outline-none px-2 py-1 rounded hover:bg-gray-100 min-w-[60px]"
                            onClick={() => setShowLang((v) => !v)}
                        >
                            {selectedLangs.length > 0 &&
                                (() => {
                                    const code = selectedLangs[0];
                                    const opt = langOptions.find(
                                        (l) => l.code === code
                                    );
                                    return (
                                        <span className="flex items-center gap-1 mr-1">
                                            <span className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center border border-gray-300">
                                                <span
                                                    className="w-full h-full block"
                                                    style={{
                                                        background: `linear-gradient(to bottom, ${opt.color} 50%, #fff 50%)`,
                                                    }}
                                                />
                                            </span>
                                            <span className="text-gray-800 text-[15px] font-medium">
                                                {code}
                                            </span>
                                        </span>
                                    );
                                })()}
                            {selectedLangs.length > 1 && (
                                <span className="ml-1 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                                    +{selectedLangs.length - 1}
                                </span>
                            )}
                            <IconChevronDown
                                size={18}
                                className="text-gray-800"
                            />
                        </button>
                        {showLang && (
                            <div className="absolute right-0 mt-2 w-45 bg-white border rounded-xl shadow-lg z-20 p-2">
                                {langOptions.map((opt) => (
                                    <button
                                        key={opt.code}
                                        className={`flex items-center gap-2 w-full px-2 py-2 rounded hover:bg-gray-100 text-left ${
                                            selectedLangs.includes(opt.code)
                                                ? "bg-primary/10"
                                                : ""
                                        }`}
                                        onClick={() => toggleLang(opt.code)}
                                    >
                                        <span className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center border border-gray-300">
                                            <span
                                                className="w-full h-full block"
                                                style={{
                                                    background: `linear-gradient(to bottom, ${opt.color} 50%, #fff 50%)`,
                                                }}
                                            />
                                        </span>
                                        <span className="text-gray-800 text-[15px] font-medium">
                                            {opt.code}{" "}
                                            <span className="text-xs text-gray-400 ml-1">
                                                {opt.label}
                                            </span>
                                        </span>
                                        {selectedLangs.includes(opt.code) && (
                                            <span className="ml-auto text-primary font-bold">
                                                ✓
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Button */}
                    <button
                        type="button"
                        onClick={() => {
                            router.visit(
                                response?.user !== null
                                    ? response.user.user_type === "admin"
                                        ? "/admin/dashboard"
                                        : "/jobseeker/dashboard"
                                    : "/register"
                            );
                        }}
                        className="w-full bg-primary text-white px-6 py-3 rounded-xl text-[18px] font-semibold hover:opacity-90 transition mt-2"
                    >
                        {response?.user !== null
                            ? "Dashboard"
                            : "Daftar Sekarang"}
                    </button>
                </div>
            )}
        </section>
    );
};

export default Navbar;
