import { IconList } from "@tabler/icons-react";
import { IconWorld } from "@tabler/icons-react";
import { IconClipboardList } from "@tabler/icons-react";
import { IconLayoutDashboard } from "@tabler/icons-react";

export const menuAdmin = [
    {
        label: "Dasbor",
        icon: IconLayoutDashboard,
        href: "/admin/dashboard",
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
