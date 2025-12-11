import React from "react";
import {
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandTwitter,
    IconMail,
    IconMapPin,
    IconPhone,
} from "@tabler/icons-react";
import logo from "../../../assets/images/logo-transaparant.png";
import { Link } from "@inertiajs/react";

// Asumsi Anda memiliki logo perusahaan
// import logo from "../../../assets/images/joboffer_logo.png";

export default function FooterSection() {
    // Data dummy untuk navigasi
    const companyLinks = [
        { name: "Tentang Kami", href: "/about-me" },
        { name: "Syarat & Ketentuan", href: "/terms-conditions" },
    ];

    const serviceLinks = [
        { name: "Penempatan", href: "#" },
        { name: "Persiapan Dokumen", href: "#" },
        { name: "Pendampingan Karir", href: "#" },
    ];

    return (
        <footer className="bg-primary text-white relative">
            <div className="max-w-6xl mx-auto px-4 pt-12 pb-6 md:pt-16 md:pb-8">
                {/* --- Top Section: Columns --- */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-white/30 pb-10 md:pb-12">
                    {/* Kolom 1: Logo & Deskripsi (Span 2 di mobile) */}
                    <div className="col-span-2 md:col-span-1 gap-4 flex flex-col">
                        {/* Logo Placeholder */}
                        <Link href="/">
                            <img
                                src={logo}
                                alt="Joboffer Indonesia"
                                className="lg:w-102 w-50"
                                style={{
                                    backgroundSize: "cover",
                                }}
                            />
                        </Link>
                        <p className="text-sm leading-relaxed mb-6 max-w-[250px]">
                            Dari Indonesia untuk dunia — bersama kita bisa
                            melangkah lebih jauh.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="hover:text-primary-light transition"
                            >
                                <IconBrandFacebook size={20} />
                            </a>
                            <a
                                href="#"
                                className="hover:text-primary-light transition"
                            >
                                <IconBrandTwitter size={20} />
                            </a>
                            <a
                                href="#"
                                className="hover:text-primary-light transition"
                            >
                                <IconBrandLinkedin size={20} />
                            </a>
                            <a
                                href="#"
                                className="hover:text-primary-light transition"
                            >
                                <IconBrandInstagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Kolom 2: Perusahaan */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Perusahaan</h4>
                        <ul className="space-y-2 text-sm">
                            {companyLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="hover:underline hover:text-white/80 transition"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kolom 3: Layanan */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Layanan</h4>
                        <ul className="space-y-2 text-sm">
                            {serviceLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="hover:underline hover:text-white/80 transition"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kolom 4: Kontak Kami */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Kontak Kami</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <IconPhone size={18} className="shrink-0" />
                                <span>(406) 555-0120</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <IconMail
                                    size={18}
                                    className="shrink-0 mt-0.6"
                                />
                                <span>admin@joboffer.id</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <IconMapPin
                                    size={18}
                                    className="shrink-0 mt-0.6"
                                />
                                <span>
                                    Talavera Suites Office, <br />
                                    Jl. TB Simatupang No. Kav. 22-23, lantai 18
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Kolom 5: Maps Location (Span 2 di mobile) */}
                    <div className="col-span-2 md:col-span-1">
                        <h4 className="text-lg font-bold mb-4">
                            Maps Location
                        </h4>
                        {/* Placeholder Peta */}
                        <div className="bg-gray-200 h-36 w-full rounded overflow-hidden">
                            <iframe
                                title="maps"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2794.927232747081!2d-73.5772396844406!3d45.49721597910109!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91a5d1b1b1b1b%3A0x1b1b1b1b1b1b1b1b!2sDowntown%20Montreal!5e0!3m2!1sen!2sca!4v1660000000000!5m2!1sen!2sca"
                                width="220"
                                height="120"
                                style={{ border: 0, borderRadius: "8px" }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>

                {/* --- Bottom Section: Copyright --- */}
                <div className="text-center pt-6 lg:pb-24 pb-10 text-sm text-white/80">
                    <p>
                        © {new Date().getFullYear()} Joboffer. Seluruh hak cipta
                        dilindungi dan dimiliki oleh PT Joboffer
                    </p>
                </div>
            </div>

            <svg
                className="absolute bottom-0 left-0 w-full animate-wave-slow"
                viewBox="0 0 1440 280"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient
                        id="waveGradient"
                        x1="0"
                        x2="1"
                        y1="0"
                        y2="1"
                    >
                        <stop offset="0%" stopColor="#00b0d2"></stop>
                        <stop offset="100%" stopColor="#4DD0E1"></stop>
                    </linearGradient>
                </defs>
                <path
                    fill="url(#waveGradient)"
                    fillOpacity="1"
                    d="M0,224L48,213.3C96,203,192,181,288,176C384,171,480,181,576,192C672,203,768,213,864,197.3C960,181,1056,139,1152,133.3C1248,128,1344,160,1392,176L1440,192V320H0Z"
                ></path>
                <path
                    fill="#4DD0E1"
                    fillOpacity="0.5"
                    d="M0,256L60,234.7C120,213,240,171,360,165.3C480,160,600,192,720,197.3C840,203,960,181,1080,176C1200,171,1320,181,1380,186.7L1440,192V320H0Z"
                ></path>
            </svg>
        </footer>
    );
}
