import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Navigation from "./Navigation";
import { useIsMobile } from "@/utils/isMobile";
import { Toaster } from "react-hot-toast";

export default function ProtectedLayout({ children, title = "Halaman Admin" }) {
    useEffect(() => {
        document.title = title;
    }, [title]);

    const isMobile = useIsMobile();
    return (
        <>
            <div className="flex h-screen overflow-hidden bg-gray-100">
                {/* Fixed Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <div className={"flex-1 flex flex-col overflow-hidden"}>
                    <Navigation />
                    <main
                        className={`flex-1 overflow-y-auto ${
                            isMobile ? "p-4" : "p-6"
                        } bg-gray-50`}
                    >
                        {children}
                    </main>
                </div>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
}
