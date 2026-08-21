import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import React from "react";
import TableUsers from "./table";
import ModalGlobal from "@/components/common/GlobalModal";
import FormUsers from "./form";
import { usePage } from "@inertiajs/react";
import { useModalGlobal } from "@/store/modalStore";

const Users = () => {
    const { users, filters = {} } = usePage().props;
    const { isEdit } = useModalGlobal("users-form");

    return (
        <ProtectedLayout title={"Data Users"}>
            <TableUsers users={users} filters={filters} />

            <ModalGlobal name="users-form" title={isEdit ? "Edit Pengguna" : "Tambah Pengguna"}>
                <FormUsers modalName="users-form" />
            </ModalGlobal>
        </ProtectedLayout>
    );
};

export default Users;
