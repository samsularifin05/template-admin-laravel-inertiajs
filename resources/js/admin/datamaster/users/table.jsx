import DataTable from "@/components/common/DataTable";
import { IconTrash } from "@tabler/icons-react";
import { IconEdit } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import React from "react";
import { useModalGlobal } from "@/store/modalStore";
import { router } from "@inertiajs/react";

const TableUsers = ({ users = [] }) => {
    const { openModal: openCreateModal } = useModalGlobal("users-create");
    const { openModal: openEditModal } = useModalGlobal("users-edit");

    const handleDelete = (row) => {
        if (!window.confirm(`Hapus user ${row.original.username}?`)) {
            return;
        }

        router.delete(`/admin/users/${row.original.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <DataTable
            title="Daftar Pengguna"
            columns={[
                { header: "Username", accessorKey: "username" },
                { header: "Name", accessorKey: "name" },
                { header: "Email", accessorKey: "email" },
                {
                    header: "No HP",
                    accessorKey: "no_hp",
                    cell: ({ row }) => row.original.no_hp || "-",
                },
                { header: "Role", accessorKey: "role" },
            ]}
            data={users}
            emptyMessage="Data user belum ada"
            actions={{
                toolbar: [
                    {
                        key: "create",
                        icon: <IconPlus size={18} />,
                        label: "Tambah User",
                        variant: "primary",
                        onClick: () => openCreateModal(),
                    },
                ],
                row: [
                    {
                        key: "edit",
                        icon: <IconEdit size={18} />,
                        label: "Edit",
                        onClick: ({ row }) => openEditModal(row.original, true),
                    },
                    {
                        key: "delete",
                        icon: <IconTrash size={18} />,
                        label: "Hapus",
                        variant: "danger",
                        onClick: ({ row }) => handleDelete(row),
                    },
                ],
            }}
        />
    );
};

export default TableUsers;
