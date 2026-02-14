import React, { useState } from "react";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import AdvancedDataTable from "@/components/common/AdvancedDataTable";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { createColumnHelper } from "@tanstack/react-table";
import { IconEye, IconEdit, IconTrash } from "@tabler/icons-react";
import { IconSearch } from "@tabler/icons-react";
import { IconDotsVertical } from "@tabler/icons-react";
import clsx from "clsx";

// Data exactly matching the screenshot
const initialSubscriptions = [
    {
        subscription_id: 1,
        user_name: "Hilliard Touret",
        user_image: null,
        service_name: "Squarespace",
        license_type: "Standard",
        purchase_date: "2025-02-06",
        renewal_date: "2026-06-06",
        amount: "$988.88",
    },
    {
        subscription_id: 2,
        user_name: "Katalin Readshall",
        user_image:
            "https://xsgames.co/randomusers/assets/avatars/female/12.jpg",
        service_name: "Wix",
        license_type: "Standard",
        purchase_date: "2025-04-16",
        renewal_date: "2026-09-16",
        amount: "$951.83",
    },
    {
        subscription_id: 3,
        user_name: "Tonye Perryn",
        user_image: "https://xsgames.co/randomusers/assets/avatars/male/22.jpg",
        service_name: "Fitbit",
        license_type: "Premium",
        purchase_date: "2025-03-13",
        renewal_date: "2026-02-13",
        amount: "$320.72",
    },
    {
        subscription_id: 4,
        user_name: "Ulrick Hendrikse",
        user_image: "https://xsgames.co/randomusers/assets/avatars/male/34.jpg",
        service_name: "Audible",
        license_type: "Creative",
        purchase_date: "2025-03-27",
        renewal_date: "2026-12-27",
        amount: "$467.97",
    },
    {
        subscription_id: 5,
        user_name: "Twila Philps",
        user_image: null,
        service_name: "Headspace",
        license_type: "Standard",
        purchase_date: "2025-04-12",
        renewal_date: "2026-11-12",
        amount: "$736.05",
    },
    {
        subscription_id: 6,
        user_name: "Raul Colam",
        user_image: null,
        service_name: "Kindle Unlimited",
        license_type: "Premium",
        purchase_date: "2025-04-15",
        renewal_date: "2026-04-15",
        amount: "$15.81",
    },
    {
        subscription_id: 7,
        user_name: "Bjorn Osgar",
        user_image: null,
        service_name: "Squarespace",
        license_type: "Standard",
        purchase_date: "2025-04-23",
        renewal_date: "2026-04-23",
        amount: "$619.86",
    },
];

const columnHelper = createColumnHelper();

export default function SubscriptionTableExample() {
    const [data, setData] = useState(initialSubscriptions);

    const handleDelete = (id) => {
        setData((prev) => prev.filter((item) => item.subscription_id !== id));
    };

    const handleBulkDelete = (selectedRows) => {
        const idsToDelete = selectedRows.map((r) => r.original.subscription_id);
        setData((prev) =>
            prev.filter((item) => !idsToDelete.includes(item.subscription_id)),
        );
    };

    const columns = [
        columnHelper.accessor("user_name", {
            header: "Client",
            cell: (info) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        name={info.getValue()}
                        size="md"
                        src={info.row.original.user_image}
                        className="rounded-xl" // Rounded square as in screenshot
                    />
                    <span className="font-black text-slate-700 text-sm tracking-tight">
                        {info.getValue()}
                    </span>
                </div>
            ),
        }),
        columnHelper.accessor("service_name", {
            header: "Service",
            cell: (info) => (
                <span className="text-slate-500 font-medium text-[13px] tracking-tight">
                    {info.getValue()}
                </span>
            ),
        }),
        columnHelper.accessor("license_type", {
            header: "License",
            cell: (info) => {
                const val = info.getValue();
                const colors = {
                    Standard: "bg-[#3182ce] text-white",
                    Premium: "bg-[#f05228] text-white",
                    Creative: "bg-[#d53f8c] text-white",
                };
                return (
                    <div
                        className={clsx(
                            "inline-flex items-center px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] shadow-sm",
                            colors[val] || "bg-slate-500 text-white",
                        )}
                    >
                        {val}
                    </div>
                );
            },
        }),
        columnHelper.accessor("amount", {
            header: "Amount",
            cell: (info) => (
                <span className="font-black text-slate-800 text-sm tracking-tight">
                    {info.getValue()}
                </span>
            ),
        }),
        columnHelper.accessor("purchase_date", {
            header: "Purchase Date",
            cell: (info) => {
                const date = new Date(info.getValue());
                const options = {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                };
                return (
                    <span className="text-slate-500 font-medium text-[13px] tracking-tight">
                        {date.toLocaleDateString("en-GB", options)}
                    </span>
                );
            },
        }),
        columnHelper.accessor("renewal_date", {
            id: "validity",
            header: "Validity",
            cell: (info) => {
                const val =
                    info.row.original.license_type === "Premium" ? 20 : 65; // Simulated for visual matching
                const color =
                    info.row.original.license_type === "Premium"
                        ? "warning"
                        : "primary";

                return (
                    <div className="flex items-center gap-3 w-32">
                        <div className="w-full h-2 bg-blue-50 rounded-full overflow-hidden border border-blue-100 flex-1">
                            <div
                                className={clsx(
                                    "h-full rounded-full transition-all duration-500",
                                    color === "warning"
                                        ? "bg-orange-400"
                                        : "bg-blue-500",
                                )}
                                style={{ width: `${val}%` }}
                            />
                        </div>
                    </div>
                );
            },
        }),
    ];

    return (
        <ProtectedLayout title="Subscription Table">
            <div className="space-y-10 pb-20 pt-10">
                <div className="flex items-center justify-between px-2">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter">
                        Subscription Table
                    </h1>
                </div>

                <div className="px-4">
                    <AdvancedDataTable
                        columns={columns}
                        data={data}
                        onBulkDelete={handleBulkDelete}
                    />
                </div>
            </div>
        </ProtectedLayout>
    );
}
