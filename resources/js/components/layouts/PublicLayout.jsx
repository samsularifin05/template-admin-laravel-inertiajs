import React, { useEffect } from "react";
import { Head } from "@inertiajs/react";
import Navbar from "./shared/navbar";
import FooterSection from "./shared/footer";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

const PublicLayout = ({
    children,
    title = "Halaman Publik",
    blank = false,
}) => {
    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <React.Fragment>
            <Head title={title} />
            {blank ? (
                children
            ) : (
                <div className="bg-white">
                    <Navbar />
                    {children}
                    <FooterSection />
                </div>
            )}

            <Toaster position="top-right" reverseOrder={false} />
        </React.Fragment>
    );
};

export default PublicLayout;
