import React, { useState } from "react";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import Button from "@/components/common/Button";
import TextInput from "@/components/input/RenderTextInput";
import RenderTextArea from "@/components/input/RenderTextArea";
import ImageUpload from "@/components/input/ImageUpload";
import AsyncSelectInput from "@/components/input/AsyncSelectInput";
import ToggleCheckbox from "@/components/input/ToggleCheckbox";
import Modal from "@/components/common/Modal";
import DataTable from "@/components/common/DataTable";
import IconPicker from "@/components/common/IconPicker";
import * as Icons from "@tabler/icons-react";
import { IconLayoutDashboard, IconClick, IconPlus } from "@tabler/icons-react";
import { AnimatePresence } from "framer-motion";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";
import AdvancedDataTable from "@/components/common/AdvancedDataTable";

export default function ComponentShowcase() {
    const [textRp, setRp] = useState("");
    const [text, setText] = useState("");
    const [textArea, setTextArea] = useState("");
    const [image, setImage] = useState("");
    const [statusOption, setStatusOption] = useState(null);
    const [userOption, setUserOption] = useState(null);
    const [isPublished, setIsPublished] = useState(true);
    const [sendNotification, setSendNotification] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState("IconClick");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isScrollModalOpen, setIsScrollModalOpen] = useState(false);
    const [isInnerScrollOpen, setIsInnerScrollOpen] = useState(false);

    const statusOptions = [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
        { value: "archived", label: "Archived" },
    ];

    const columns = [
        { header: "Name", accessor: "name" },
        { header: "Email", accessor: "email" },
        { header: "Role", accessor: "role" },
    ];

    const data = [
        { name: "John Doe", email: "john@example.com", role: "Admin" },
        { name: "Jane Smith", email: "jane@example.com", role: "Manager" },
        { name: "Bob Johnson", email: "bob@example.com", role: "User" },
    ];

    const SelectedIconComponent = Icons[selectedIcon] || IconClick;

    return (
        <ProtectedLayout title="Component Showcase">
            <div className="space-y-10 pb-20">
                {/* Theme Section */}
                <section className="bg-card p-8 rounded-3xl shadow-premium border border-stroke transition-colors">
                    <h2 className="text-xl font-black mb-8 text-main border-b border-stroke pb-4 flex items-center gap-3">
                        Appearance: Theme Switcher
                    </h2>
                    <ThemeSwitcher />
                </section>

                {/* Button Section */}
                <section className="bg-card p-8 rounded-3xl shadow-premium border border-stroke transition-colors">
                    <h2 className="text-xl font-black mb-8 text-main border-b border-stroke pb-4 flex items-center gap-3">
                        Common: Button
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-3 font-medium">
                                Variants
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="primary">Primary</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="danger">Danger</Button>
                                <Button variant="success">Success</Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="ghost">Ghost</Button>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-3 font-medium">
                                Sizes
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                                <Button size="xs">Extra Small</Button>
                                <Button size="sm">Small</Button>
                                <Button size="md">Medium</Button>
                                <Button size="lg">Large</Button>
                                <Button size="xl">Extra Large</Button>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-3 font-medium">
                                States & Icons
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Button loading>Loading State</Button>
                                <Button disabled>Disabled Button</Button>
                                <Button icon={IconPlus}>With Icon Left</Button>
                                <Button icon={IconClick} iconPosition="right">
                                    With Icon Right
                                </Button>
                                <Button fullWidth>Full Width Button</Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Input Section */}
                <section className="bg-card p-8 rounded-3xl shadow-premium border border-stroke transition-colors">
                    <h2 className="text-xl font-black mb-8 text-main border-b border-stroke pb-4 flex items-center gap-3">
                        Inputs
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-5">
                            <TextInput
                                label="Text Input"
                                placeholder="Enter something..."
                                value={text}
                                onChange={setText}
                            />

                            <TextInput
                                label="Currency Input (isRp)"
                                value={textRp}
                                onChange={setRp}
                                placeholder="Currency format..."
                                isRp
                            />

                            <RenderTextArea
                                label="Text Area"
                                placeholder="Large text field..."
                                value={textArea}
                                onChange={setTextArea}
                            />
                        </div>

                        <div className="space-y-5">
                            <ImageUpload
                                label="Image Upload"
                                value={image}
                                onChange={setImage}
                                multiple
                            />

                            <AsyncSelectInput
                                label="AsyncSelectInput (Static Options)"
                                placeholder="Pilih status..."
                                value={statusOption}
                                onChange={setStatusOption}
                                options={statusOptions}
                                isClearable
                            />
                            <p className="-mt-3 text-xs text-gray-500">
                                Selected: {statusOption?.label || "-"}
                            </p>

                            <AsyncSelectInput
                                label="AsyncSelectInput (Async Search)"
                                placeholder="Cari user demo..."
                                value={userOption}
                                onChange={setUserOption}
                                loadOptionsUrl="/admin/examples/async-options"
                                mapOption={(item) => ({
                                    label: `${item.name} (${item.role})`,
                                    value: item.id,
                                })}
                                isClearable
                            />
                            <p className="-mt-3 text-xs text-gray-500">
                                Selected: {userOption?.label || "-"}
                            </p>

                            <div className="space-y-4 rounded-2xl border border-stroke p-4">
                                <ToggleCheckbox
                                    name="is_published"
                                    label="ToggleCheckbox: Published"
                                    description="Aktifkan untuk menampilkan konten ke user."
                                    checked={isPublished}
                                    onChange={setIsPublished}
                                />

                                <ToggleCheckbox
                                    name="send_notification"
                                    label="ToggleCheckbox: Send Notification"
                                    description="Kirim notifikasi setelah data berhasil disimpan."
                                    checked={sendNotification}
                                    onChange={setSendNotification}
                                />

                                <p className="text-xs text-gray-500">
                                    Published: {isPublished ? "Yes" : "No"} |
                                    Notification:{" "}
                                    {sendNotification ? "Yes" : "No"}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Icon Picker & Modal */}
                <section className="bg-card p-8 rounded-3xl shadow-premium border border-stroke transition-colors">
                    <h2 className="text-xl font-black mb-8 text-main border-b border-stroke pb-4 flex items-center gap-3">
                        Icon Picker & Modal
                    </h2>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-4 rounded-2xl border border-stroke bg-page p-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
                                    <SelectedIconComponent size={34} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-main">
                                        {selectedIcon}
                                    </p>
                                    <p className="text-xs text-muted">
                                        Selected Icon Name
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                variant="outline"
                            >
                                Open Modal & Pick Icon
                            </Button>
                        </div>

                        <div className="flex-1 space-y-4">
                            <p className="text-sm text-gray-500 mb-2 font-medium">
                                Modal Behaviors
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    onClick={() => setIsScrollModalOpen(true)}
                                    variant="secondary"
                                >
                                    Bootstrap Style (Long Content)
                                </Button>
                                <Button
                                    onClick={() => setIsInnerScrollOpen(true)}
                                    variant="outline"
                                >
                                    Inner Scrollable
                                </Button>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isModalOpen && (
                            <Modal
                                title="Pick an Icon"
                                onClose={() => setIsModalOpen(false)}
                                width="max-w-2xl"
                            >
                                <IconPicker
                                    value={selectedIcon}
                                    onChange={setSelectedIcon}
                                    onClose={() => setIsModalOpen(false)}
                                />
                            </Modal>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {isScrollModalOpen && (
                            <Modal
                                title="Bootstrap Style Long Modal"
                                onClose={() => setIsScrollModalOpen(false)}
                                width="max-w-lg"
                            >
                                <div className="space-y-4">
                                    <p className="font-bold text-theme-600 bg-theme-50 p-4 rounded-xl border border-theme-100">
                                        Ini adalah simulasi "Scrolling long
                                        content" bawaan Bootstrap. Seluruh modal
                                        akan ikut bergeser saat di-scroll,
                                        memberikan pengalaman seperti halaman
                                        web biasa.
                                    </p>
                                    {[...Array(15)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                                        >
                                            <h4 className="font-bold text-gray-700">
                                                Konten Seksi #{i + 1}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                Detail informasi yang mengisi
                                                ruang modal agar terlihat
                                                panjang.
                                            </p>
                                        </div>
                                    ))}
                                    <div className="pt-4 flex justify-end gap-3">
                                        <Button
                                            variant="secondary"
                                            onClick={() =>
                                                setIsScrollModalOpen(false)
                                            }
                                        >
                                            Tutup
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={() =>
                                                setIsScrollModalOpen(false)
                                            }
                                        >
                                            Simpan Perubahan
                                        </Button>
                                    </div>
                                </div>
                            </Modal>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {isInnerScrollOpen && (
                            <Modal
                                title="Inner Scrollable Modal"
                                onClose={() => setIsInnerScrollOpen(false)}
                                width="max-w-lg"
                                scrollable={true}
                                animation="slide-down"
                            >
                                <div className="space-y-4">
                                    <p className="font-bold text-blue-600 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                        Menggunakan prop `scrollable={"{true}"}`
                                        dan `animation="slide-left"`. Sangat
                                        mudah digunakan!
                                    </p>
                                    {[...Array(15)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                                        >
                                            <h4 className="font-bold text-gray-700">
                                                Data List #{i + 1}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                Konten ini dapat di-scroll
                                                secara internal.
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </Modal>
                        )}
                    </AnimatePresence>
                </section>

                {/* Data Table Section */}
                <section className="bg-card p-8 rounded-3xl shadow-premium border border-stroke transition-colors">
                    <h2 className="text-xl font-black mb-8 text-main border-b border-stroke pb-4 flex items-center gap-3">
                        Advanced: AdvancedDataTable (TanStack)
                    </h2>

                    <AdvancedDataTable
                        columns={[
                            { header: "Name", accessorKey: "name" },
                            { header: "Email", accessorKey: "email" },
                            { header: "Role", accessorKey: "role" },
                        ]}
                        data={data}
                    />
                </section>
            </div>
        </ProtectedLayout>
    );
}
