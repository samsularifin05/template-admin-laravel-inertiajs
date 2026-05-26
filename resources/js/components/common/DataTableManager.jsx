import React from 'react';
import { router } from '@inertiajs/react';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import Button from './Button';
import Tooltip from "./Tooltip";

/**
 * Reusable Data Table Component
 *
 * Props:
 * - columns: Array of column definitions [{key, label, render?, align, width}]
 * - rows: Array of row data
 * - pagination: {links, from, to, total}
 * - onEdit: callback function for edit button
 * - onDelete: callback function for delete button
 * - emptyIcon: Icon component to show when no data
 * - emptyMessage: Message to show when no data
 * - showActions: boolean (default: true) - show edit/delete buttons
 */
export default function DataTableManager({
    columns,
    rows,
    pagination,
    onEdit,
    onDelete,
    emptyIcon: EmptyIcon,
    emptyMessage = 'Belum ada data',
    showActions = true,
}) {
    const { links, from, to, total } = pagination || {};

    return (
        <div className="bg-card rounded-2xl border border-stroke shadow-premium overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-stroke bg-page">
                            <th className="text-left px-4 py-3 text-muted font-medium w-10">
                                #
                            </th>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-4 py-3 text-muted font-medium ${
                                        col.align === "right"
                                            ? "text-right"
                                            : col.align === "center"
                                              ? "text-center"
                                              : "text-left"
                                    } ${col.width ? `w-${col.width}` : ""}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                            {showActions && (
                                <th className="text-center px-4 py-3 text-muted font-medium">
                                    Aksi
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stroke">
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={
                                        columns.length + (showActions ? 2 : 1)
                                    }
                                    className="text-center py-12 text-muted"
                                >
                                    {EmptyIcon && (
                                        <EmptyIcon
                                            size={40}
                                            className="mx-auto mb-2 opacity-30"
                                        />
                                    )}
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            rows.map((item, idx) =>
                                !item ||
                                typeof item !== "object" ||
                                typeof item.id === "undefined" ? null : (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-page/50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-muted">
                                            {(from ?? 1) + idx}
                                        </td>
                                        {columns.map((col) => (
                                            <td
                                                key={col.key}
                                                className={`px-4 py-3 ${
                                                    col.align === "right"
                                                        ? "text-right"
                                                        : col.align === "center"
                                                          ? "text-center"
                                                          : "text-left"
                                                } ${col.className || ""}`}
                                            >
                                                {col.render
                                                    ? col.render(
                                                          item[col.key],
                                                          item,
                                                      )
                                                    : item[col.key]}
                                            </td>
                                        ))}
                                        {showActions && (
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Tooltip
                                                        content={
                                                            item.status ===
                                                            "draft"
                                                                ? "Edit Info"
                                                                : "Lihat Detail"
                                                        }
                                                        placement="top"
                                                    >
                                                        <Button
                                                            type="button"
                                                            variant="primary"
                                                            size="sm"
                                                            iconOnly
                                                            onClick={() =>
                                                                onEdit(item)
                                                            }
                                                            className="rounded-xl!"
                                                            icon={IconEdit}
                                                        />
                                                    </Tooltip>
                                                    {item.status ===
                                                        "draft" && (
                                                        <Tooltip
                                                            content="Hapus"
                                                            placement="top"
                                                        >
                                                            <Button
                                                                type="button"
                                                                variant="danger"
                                                                size="sm"
                                                                iconOnly
                                                                onClick={() =>
                                                                    onDelete(
                                                                        item,
                                                                    )
                                                                }
                                                                className="rounded-xl!"
                                                                icon={IconTrash}
                                                            />
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ),
                            )
                        )}
                    </tbody>
                </table>
            </div>
            {links && links.length > 3 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-stroke">
                    <p className="text-sm text-muted">
                        Menampilkan {from}–{to} dari {total} data
                    </p>
                    <div className="flex gap-1">
                        {links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() =>
                                    link.url &&
                                    router.get(
                                        link.url,
                                        {},
                                        { preserveState: true },
                                    )
                                }
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                    link.active
                                        ? "bg-primary text-white"
                                        : "hover:bg-page text-muted disabled:opacity-40"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
